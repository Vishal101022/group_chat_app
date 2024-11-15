const token = localStorage.getItem("token");
const socket = io("http://localhost:3000");

// Initialize the chat app
window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("send-button").addEventListener("click", sendMessage);
  document.getElementById("logout-button").addEventListener("click", logout);
  //await fetchMessages();
});

async function sendMessage() {
  const input = document.getElementById("message-input");
  const message = input.value.trim();

  if (message !== "") {
    try {
      // Send the message to the server using Axios
      //   await axios.post(
      //     "http://localhost:3000/api/message",
      //     { message },
      //     { headers: { Authorization: `Bearer ${token}` } }
      //   );
      socket.emit("messageSent", { message });
      input.value = "";
    } catch (error) {
      console.error(error);
    }
  }
}

// async function fetchMessages() {
//   try {
//     // Fetch existing messages from the server
//     const response = await axios.get("http://localhost:3000/api/messages", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     displayMessages(response.data.messages); // Display all existing messages
//   } catch (error) {
//     console.error(error);
//   }
// }
socket.on("messageReceived", (data) => {
  displayMessage(data);
});

function displayMessages(messages) {
  const chatArea = document.getElementById("chat-area");
  chatArea.innerHTML = "";
  messages.forEach(displayMessage); // Use displayMessage to show each message
}

// Display a single message in the chat area
function displayMessage(message) {
  const chatArea = document.getElementById("chat-area");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  console.log(message);
  messageElement.textContent = `${message.message}`;
  chatArea.appendChild(messageElement);
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/public/login/login.html";
}
