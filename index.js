const firebaseConfig = {
  apiKey: "your API KEY",
  authDomain: "chat-application-efe65.firebaseapp.com",
  projectId: "chat-application-efe65",
  storageBucket: "chat-application-efe65.firebasestorage.app",
  messagingSenderId: "738349017748",
  appId: "1:738349017748:web:58c5a593ba281ad6afa281",
  measurementId: "G-X902P0D5NC",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore reference
const db = firebase.firestore();

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");

// Send message to Firestore
sendButton.addEventListener("click", async () => {
  const message = messageInput.value;
  if (message.trim()) {
    try {
      await db.collection("messages").add({
        text: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      messageInput.value = "";
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to send message. Please try again.");
    }
  } else {
    alert("Message cannot be empty!");
  }
});

// Listen for new messages
db.collection("messages")
  .orderBy("timestamp")
  .onSnapshot((querySnapshot) => {
    chatMessages.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const messageData = doc.data();
      const messageElement = document.createElement("div");
      const timestamp = messageData.timestamp
        ? messageData.timestamp.toDate().toLocaleString()
        : "Just now";

      messageElement.innerHTML = `
                <p><strong>${messageData.text}</strong></p>
                <small>${timestamp}</small>
            `;
      chatMessages.appendChild(messageElement);
    });
  });
