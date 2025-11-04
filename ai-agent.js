document.addEventListener('DOMContentLoaded', () => {
    const chatIcon = document.getElementById('chat-icon');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    chatIcon.addEventListener('click', () => {
        chatWindow.style.display = 'flex';
    });

    closeChat.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    sendChat.addEventListener('click', () => {
        sendMessage();
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage !== '') {
            appendMessage(userMessage, 'user');
            chatInput.value = '';

            try {
                const response = await fetch('http://127.0.0.1:5000/ai-recommend', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: userMessage }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                appendMessage(data.response, 'bot');
            } catch (error) {
                console.error('Error connecting to AI backend:', error);
                appendMessage('Sorry, I am having trouble connecting to the AI assistant. Please try again later.', 'bot');
            }
        }
    }

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});