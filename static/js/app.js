const navToggle = document.querySelectorAll(".nav_toggle");
const newChatButtons = document.querySelectorAll(".new_chat");
const chatList = document.getElementById("chat_list");
const chatMessages = document.getElementById("messages");
const form = document.querySelector("#message_input form");
const textarea = document.querySelector("#message_input textarea");
let csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

let navState = "open";
let chats = [];
let messages = [];
let currentChatId = null;
let isStreaming = false;

/* sidebar toggle */

navToggle.forEach((button) => {
    button.addEventListener("click", toggleNav);
});

function toggleNav() {
    const nav = document.querySelector("nav");
    const mainHeaderLeft = document.getElementById("main_header_left");

    if (navState === "open") {
        nav.className = "closed";
        navState = "closed";
        mainHeaderLeft.className = "open";
    } else {
        nav.className = "open";
        navState = "open";
        mainHeaderLeft.className = "closed";
    }
}

// Fetch chat list
fetch("/api/chats/")
    .then((response) => response.json())
    .then((data) => {
        chats = data;
        renderChatList();
    });

function renderChatList() {
    chatList.innerHTML = "";
    chats.forEach((chat) => {
        const li = document.createElement("li");
        li.textContent = chat.subject;
        li.id = chat.id;
        li.className = "chat";
        chatList.appendChild(li);
    });
}

chatList.addEventListener("click", (event) => {
    if (chats.length === 0) {
        return;
    }
    const chatId = event.target.id;
    loadMessages(chatId);
});

newChatButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const chatSubject = prompt("Enter chat subject:").trim();

        if (chatSubject) {
            fetch("/api/chats/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({ subject: chatSubject }),
            })
                .then((response) => response.json())
                .then((data) => {
                    chats.push(data); // 채팅방 목록에 새 채팅방 추가
                    renderChatList(); // 목록 다시 렌더링
                    loadMessages(data.id); // 새 채팅방의 메시지를 로드
                })
                .catch((error) => {
                    console.error("Error creating new chat:", error);
                });
        }
    });
});

/* ~sidebar */

/* main */

function loadMessages(chatId) {
    currentChatId = chatId;
    fetch(`/api/chats/${chatId}/messages/`)
        .then((response) => response.json())
        .then((data) => {
            messages = data;
            renderMessages();
        });
}

function renderMessages() {
    chatMessages.innerHTML = "";
    messages.forEach((message) => {
        const wrapper = document.createElement("div");
        const div = document.createElement("div");
        if (message.is_user) {
            wrapper.className = "user_wrapper";
            div.className = "user markdown-body";
        } else {
            wrapper.className = "bot_wrapper";
            div.className = "bot markdown-body";
        }
        div.innerHTML = marked.parse(message.content);
        wrapper.appendChild(div);
        chatMessages.appendChild(wrapper);
    });
}

textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        setTimeout(() => form.dispatchEvent(new Event("submit")), 0);
    }
});

form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    const prompt = textarea.value;
    if (prompt.trim() === "" || isStreaming) {
        console.log("Empty prompt or already streaming");
        return;
    }

    const newMessage = { content: prompt, is_user: true };

    messages.push(newMessage);
    textarea.value = "";
    isStreaming = true;

    const newBotMessage = { content: "", is_user: false };
    messages.push(newBotMessage);
    renderMessages();

    const botMessageIndex = messages.length - 1; // 가장 마지막 메시지의 인덱스

    fetch("/api/generate/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
            prompt: prompt,
            model: "gemma2",
            chat_id: currentChatId,
        }),
    })
        .then((response) => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            return reader.read().then(function processText({ done, value }) {
                if (done) {
                    isStreaming = false;
                    return;
                }

                const chunk = decoder.decode(value);
                messages[botMessageIndex].content += chunk; // 기존 메시지에 스트림 내용을 추가
                const botMessage = chatMessages.children[botMessageIndex].querySelector("div");
                botMessage.innerHTML = marked.parse(
                    messages[botMessageIndex].content
                );

                return reader.read().then(processText);
            });
        })
        .catch((error) => {
            console.error("Error:", error);
            isStreaming = false;
        });
}

/* ~main */
