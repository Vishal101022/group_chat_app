const token = localStorage.getItem("token");

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

document.getElementById("send-button").addEventListener("click", sendMessage);