import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [data, setData] = useState<string>("");

  async function fetchStreamingData() {
    const response = await fetch("http://localhost:8000/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });

    if (!response.ok) {
      console.error("Failed to fetch streaming data");
      return;
    }
    const reader = response.body!.getReader();
    const decoder = new TextDecoder("utf-8"); // 바이트 데이터를 텍스트로 변환
    let accumulatedData = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break; // 스트림이 끝나면 종료
      const chunk = decoder.decode(value);
      accumulatedData += chunk;
      setData(accumulatedData);
    }
    setMessages((prev) => [...prev, accumulatedData]);
    setData("");
  }

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, input]);
      await fetchStreamingData();
      setInput("");
    }
    console.groupCollapsed("handleSend");
    console.log(messages);
    console.groupEnd();
  };

  return (
    <div>
      <h1>Chat UI</h1>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
        {data !== "" && <div>{data}</div>}
      </div>
    </div>
  );
}

export default App;
