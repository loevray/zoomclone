const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const firstScreen = document.getElementById("firstScreen");
const nav = document.getElementById("nav");
const nameForm = firstScreen.querySelector("#name");
const callNickChangeBtn = document.getElementById("callNickChangeBtn");
const nickChangeBtn = document.getElementById("nickChangeBtn");

room.hidden = true;
welcome.hidden = true;

let roomName;

//화면에 매세지 li로 출력
function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

//메세지 제출시
function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

//닉네임 제출시
function firstNicknameSubmit(event) {
    event.preventDefault();
    const input = firstScreen.querySelector("#name input");
    socket.emit("nickname", input.value);
    input.value = "";
    firstScreen.hidden = true;
    welcome.hidden = false;
}

function anytimeNicknameSubmit(event) {
    event.preventDefault();
    const input = nav.querySelector("#name2 input");
    socket.emit("nickname", input.value);
    input.value = "";
}

//닉네임 변경

function ChangeNickBtnToggle() {
    const form = document.querySelector("#nav form");
    form.classList.toggle("hidden");
}

callNickChangeBtn.addEventListener("click", ChangeNickBtnToggle);
nickChangeBtn.addEventListener("click", anytimeNicknameSubmit);

//방 진입시
function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const roomTitle = room.querySelector("h3");
    roomTitle.innerText = `Room: ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
    callNickChangeBtn.classList.remove("hidden");
}

//방 이름 제출시
function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

nameForm.addEventListener("submit", firstNicknameSubmit);
form.addEventListener("submit", handleRoomSubmit);

//유저 들어왔을때 출력메세지
socket.on("welcomeMessage", (user, newCount) => {
    const roomTitle = room.querySelector("h3");
    roomTitle.innerText = `Room: ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
});

//유저 나갔을때 출력메세지
socket.on("bye", (user, newCount) => {
    const roomTitle = room.querySelector("h3");
    roomTitle.innerText = `Room: ${roomName} (${newCount})`;
    addMessage(`${user} left T.T`);
});

//새로운 메시지 서버에 보냄
socket.on("new_message", addMessage);

//방 목록 표기
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0) {
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});



