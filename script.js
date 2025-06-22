const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Show loading message
  appendMessage('bot', 'Gemini is thinking...');

  // Send message to backend API
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userMessage })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Remove the loading message
    chatBox.removeChild(chatBox.lastChild);
    // Display the actual response from Gemini
    appendMessage('bot', data.reply);
  })
  .catch(error => {
    // Remove the loading message
    chatBox.removeChild(chatBox.lastChild);
    // Display error message
    appendMessage('bot', 'Sorry, I encountered an error. Please try again.');
    console.error('Error:', error);
  });
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.innerHTML = text; // Use innerHTML instead of textContent to render HTML tags
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
