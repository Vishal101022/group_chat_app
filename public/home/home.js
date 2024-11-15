const token = localStorage.getItem("token");

// initialize the chat app
window.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("send-button").addEventListener("click", sendMessage);
    document.getElementById("logout-button").addEventListener("click", logout);
    await fetchMessages();
})
async function sendMessage() {
    const input = document.getElementById("message-input");
    const message = input.value.trim();

    if (message !== "") {
        try {
            await axios.post(
              "http://localhost:3000/api/message",
              { message },
              { headers: { Authorization: `${token}` } }
            );
            input.value = "";
        } catch (error) {
            console.error(error);
        }
    }
}
async function fetchMessages() {
    try {
        const response = await axios.get("http://localhost:3000/api/messages", { headers: { Authorization: `${token}` } });
        displayMessages(response.data.messages);
    } catch (error) {
        console.error(error);
    }
}

function displayMessages(messages) {
    const chatArea = document.getElementById("chat-area");
    chatArea.innerHTML = "";
    messages.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = `${message.User.name}: ${message.message}`;
        chatArea.appendChild(messageElement);
    });
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/public/login/login.html";
}



