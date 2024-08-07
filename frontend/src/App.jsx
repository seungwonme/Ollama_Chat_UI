import { useState, useEffect } from "react";
import EventSourcePolyfill from "event-source-polyfill";
import "./App.css";

function App() {
    const [navId, setNavId] = useState("open");
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        fetch("/api/chats/")
            .then((response) => response.json())
            .then((data) => setChats(data));
    }, []);

    const toggleNavId = () => {
        setNavId(navId === "open" ? "closed" : "open");
    };

    useEffect(() => {
        const mainHeaderLeft = document.querySelector("div#main_header div");
        if (navId === "open") {
            mainHeaderLeft.id = "main_header_left_closed";
        } else {
            mainHeaderLeft.id = "main_header_left";
        }
    }, [navId]);

    const loadMessages = (chatId) => {
        setCurrentChatId(chatId);
        fetch(`/api/chats/${chatId}/messages/`)
            .then((response) => response.json())
            .then((data) => setMessages(data));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isStreaming) return;

        const newMessage = { content: prompt, is_user: true };
        setMessages([...messages, newMessage]);

        setPrompt("");
        setIsStreaming(true);

        const eventSource = new EventSourcePolyfill("/api/generate/", {
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": document.querySelector(
                    "[name=csrfmiddlewaretoken]"
                ).value,
            },
            body: JSON.stringify({
                prompt,
                model: "gemma2",
                chat_id: currentChatId,
            }),
            method: "POST",
        });

        eventSource.onmessage = (e) => {
            const newBotMessage = { content: e.data, is_user: false };
            setMessages((prevMessages) => [...prevMessages, newBotMessage]);
        };

        eventSource.onerror = () => {
            eventSource.close();
            setIsStreaming(false);
        };

        eventSource.onopen = () => {
            setIsStreaming(false);
        };
    };

    return (
        <div id="App">
            <nav id={navId}>
                <div id="nav_header">
                    <button
                        className="nav_toggle"
                        onClick={toggleNavId}
                    ></button>
                    <button className="new_chat"></button>
                </div>
                <ul>
                    {chats.map((chat) => (
                        <li key={chat.id} onClick={() => loadMessages(chat.id)}>
                            {chat.name}
                        </li>
                    ))}
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                    <li>채팅방입니다.</li>
                </ul>
            </nav>
            <main>
                <div>
                    <div id="main_header">
                        <div id="main_header_left">
                            <button
                                className="nav_toggle"
                                onClick={toggleNavId}
                            ></button>
                            <button className="new_chat"></button>
                        </div>
                        <button id="set_model">llama3.1</button>
                    </div>
                    <ul className="chats">
                        {messages.map((message, index) => (
                            <li
                                key={index}
                                className={message.is_user ? "user" : "bot"}
                            >
                                {message.is_user ? "User" : "Assistant"}:{" "}
                                {message.content}
                            </li>
                        ))}
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                        <li className="user">안녕하세요</li>
                        <li className="bot">안녕하세요~!</li>
                    </ul>
                </div>
                <div id="empty_block"></div>
                <div id="chat_input">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Send a message"
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default App;
