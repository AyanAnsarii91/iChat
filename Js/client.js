const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

var audio = new Audio("tune.mp3");


const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", position);
    messageElement.innerText = message;
    messageContainer.appendChild(messageElement);

    // Get current time in HH:MM AM/PM format
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";

    // Add timestamp to the right side inside the message box
    const time = document.createElement("div");
    time.classList.add("time"); // No need to add 'position' again
    time.innerText = `${hours}:${minutes} ${ampm}`;
    messageElement.appendChild(time);

    if (position === "left") {
        audio.play();
    }
};

document.addEventListener("click", e => {
    // Check if the clicked element is inside the dark mode div
    if (e.target.closest(".darkMode")) {
        document.body.classList.toggle("dark-theme"); // Toggle the class
    }
})

// Add Emoji Picker to the website

const emojiPicker = document.getElementById("emojiPicker");
const emojiContainer = document.getElementById("emojiContainer");

// Create an emoji Website




// Prompt user for name and emit it to the server
const name = prompt("Enter your name to join");
socket.emit("new-user-join", name);

// Listen for new user joining
socket.on("user-joined", name => {
    append(`${name} joined the chat`, "left");
});

// Fix: Listen for message receiving
socket.on("receive", data => {
    append(`${data.name}: ${data.message}`, "left");
});

// Handle form submission and send message
form.addEventListener("submit", e => {
    e.preventDefault();
    const message = messageInput.value.trim();

    if (message) {
        append(`You: ${message} `, "right")
        socket.emit("send", message);
        messageInput.value = "";
    }
});


// Handle user leaving
socket.on("left", name => {
    append(`${name} left the chat`, "right");
});

