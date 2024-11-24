import { useEffect, useState } from 'react'
import './App.css'
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [name, setName] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  function connectToChatServer() {
    console.log('connectToChatServer');
    const _socket = io('http://localhost:3000', {
      autoConnect: false,
      query: {
        "username" : name,
      }
    });
    _socket.connect();
    setSocket(_socket);
  }

  function disConnectToChatServer() {
    console.log('connectToChatServer');
    socket?.disconnect();
    setIsConnected(false);
  }


  function onConnected() {
    console.log('프론트 - on connected server');
    setIsConnected(true);
  }

  // 데이터 넘기기
  function sendMessageToChatServer() {
    console.log(`user input: ${userInput}`);
    socket?.emit("new message", {message: userInput, username: name}, (response) => {
      console.log(response);
    })
  }

  function onMessageReceived(msg) {
    console.log(msg);
    setMessages(prev => [...prev, msg]);
  }

  useEffect(() => {
    console.log('useEffect on!')
    socket?.on('connect', onConnected);
    socket?.on('new message', onMessageReceived);

    return () => {
      console.log('useEffect clean up function called!');
      socket?.off('connect', onConnected);
      socket?.off('new message', onMessageReceived);
    }
  }, [socket]);

  useEffect(() => {
    console.log('스크롤 올리기');
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth"})
  },[])

  const messageList = messages.map((msg, index) => (
    <li key={index}>
      {msg.username} : {msg.message}
    </li>
  ));

  return (
    <div className='root'>
      <div className='navbar'>
        <h1>유저: {name}</h1>
        <h3>현재 접속 상태: {isConnected ? "접속 중" : "미접속" }</h3>
        <div className='card'>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
          <button onClick={connectToChatServer}>접속</button>
          <button onClick={disConnectToChatServer}>접속종료</button>
        </div>
      </div>

      <ul className='chatList'>
        {
          messageList
        }
      </ul>
      
    {/* 사용자가 작성하는 메시지 */}
      <div className='messageInput'>
        <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} />
        <button onClick={sendMessageToChatServer}>보내기</button>
      </div>

      {/* 대화 나오는 창 */}
      
    </div>
  )
}

export default App