const messageList = document.querySelector("ul")
const nickNameForm = document.querySelector("#nickNameForm");
const messageForm = document.querySelector("#sendMessageForm");
const socket = new WebSocket(`ws://${window.location.host}`);

function textObjToString(type, payload) {
    const msg = { type, payload }
    return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("Connected to server😜");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnected to server😜");
});


//메세지 보내기
function handleMessageSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(textObjToString("new_message", input.value));
    input.value = "";
}

//닉네임 바꾸기
function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickNameForm.querySelector("input");
    socket.send(textObjToString("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleMessageSubmit);
nickNameForm.addEventListener("submit", handleNickSubmit);