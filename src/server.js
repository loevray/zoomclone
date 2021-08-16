import http from "http";
import socketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = socketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anonymus";
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    });
    socket.on("nickname", (nickname) => socket["nickname"] = nickname);
    socket.on("enter_room", (roomName, done)=> {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcomeMessage", socket.nickname);
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    setTimeout(() => console.log(socket.nickname), 10000);
});





/*
const wss = new WebSocket.Server({ server });
const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "anonymous"
    console.log("Connected to broswer😜");
    socket.on("close", () => console.log("Disconnected from the broswer"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
}); */

const handleListen = () => console.log(`listening on http://localhost:3000`);
httpServer.listen(3001, handleListen);