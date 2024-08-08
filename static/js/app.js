const navToggle = document.querySelectorAll(".nav_toggle");
const newChatButtons = document.querySelectorAll(".new_chat");
const chatList = document.getElementById("chat_list");
const chatMessages = document.getElementById("chat_messages");
const promptInput = document.getElementById("prompt");
const form = document.querySelector("#chat_input form");
let csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

let navState = "open";
let chats = [];
let messages = [];
let currentChatId = null;

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
    const chatId = event.target.id;
    loadMessages(chatId);
});

newChatButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Handle new chat creation
    });
});

/* ~sidebar */

function loadMessages(chatId) {
    currentChatId = chatId;
    fetch(`/api/chats/${chatId}/messages/`)
        .then((response) => response.json())
        .then((data) => {
            messages = data;
            renderMessages();
        });
}

/* chat input form */

form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    const prompt = promptInput.value;
    const newMessage = { content: prompt, is_user: true };

    messages.push(newMessage);
    renderMessages();

    promptInput.value = "";
    isStreaming = true;

    // 미리 새로운 bot message li를 추가
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
                    return;
                }

                const chunk = decoder.decode(value);
                messages[botMessageIndex].content += chunk; // 기존 메시지에 스트림 내용을 추가
                updateBotMessage(botMessageIndex); // 업데이트된 메시지만 갱신

                return reader.read().then(processText);
            });
        })
        .catch((error) => {
            console.error("Error:", error);
            isStreaming = false;
        });
}

function updateBotMessage(index) {
    const chatMessages = document.getElementById("chat_messages");
    const li = chatMessages.children[index];
    li.className = "bot markdown-body";
    li.innerHTML = marked.parse(messages[index].content);
}

function renderMessages() {
    chatMessages.innerHTML = "";
    messages.forEach((message, index) => {
        const li = document.createElement("li");
        li.className = message.is_user ? "user markdown-body" : "bot markdown-body";
        li.innerHTML = marked.parse(message.content);
        chatMessages.appendChild(li);
    });
}
