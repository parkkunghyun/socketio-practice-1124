import { Server } from "socket.io";
import express from "express";
import * as http from "http";
import ViteExpress from "vite-express";

const app = express();
const server = http.createServer(app);

// Socket.IO 서버 설정
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Vite 서버 URL
        methods: ["GET", "POST"]
    }
});

// WebSocket 연결 이벤트 핸들러
io.on('connection', (client) => {
    const connectedClientUsername = client.handshake.query.username;
    console.log(`사용자가 들어왔습니다! ${connectedClientUsername}`);

    client.broadcast.emit("new message", { username: "관리자", message: `${connectedClientUsername}님이 방에 들어왔습니다! ` });

    client.on("new message", (msg) => {
        console.log(`${connectedClientUsername}님의 message: ${msg.message}`)
        io.emit("new message", { username: msg.username, message: msg.message});
    });

    // 클라이언트가 연결 종료 시
    client.on("disconnect", () => {
        console.log(`사용자가 나갔습니다: ${connectedClientUsername}`);
       io.emit("new message", { username: "관리자", message: `${connectedClientUsername}님이 방에서 나갔습니다! ` });
    });
});

// Express 서버 시작
server.listen(3000, () => {
    console.log('서버가 3000번 포트에서 실행 중입니다');
});

// API 라우트
app.get("/api", (_, res) => {
    res.send("Hello from api!");
});

// Vite 서버와 Express 통합
ViteExpress.bind(app, server);
