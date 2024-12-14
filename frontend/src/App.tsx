import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState<string>("");
  useEffect(() => {
    fetchStreamingData();
  }, []);

  async function fetchStreamingData() {
    const response = await fetch("http://localhost:8000/chats/stream"); // 스트리밍 URL
    if (!response.ok) return;
    const reader = response.body!.getReader();
    const decoder = new TextDecoder("utf-8"); // 바이트 데이터를 텍스트로 변환

    while (true) {
      const { done, value } = await reader.read();
      if (done) break; // 스트림이 끝나면 종료
      const chunk = decoder.decode(value);
      setData((prevData) => prevData + chunk);
    }
  }
  return (
    <>
      <div>{data}</div>
    </>
  );
}

export default App;
