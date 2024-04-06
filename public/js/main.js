// public/js/main.js

document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById('start-recording');
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false; // Only capture a single result
        recognition.interimResults = false; // We're only interested in the final result

        recognition.onstart = function() {
            console.log('Voice recognition started. Speak into the microphone.');
        };

        recognition.onerror = function(event) {
            console.error('Voice recognition error detected:', event.error);
        };

        recognition.onend = function() {
            console.log('Voice recognition ended.');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log('Captured voice input:', transcript);
            sendTextToBackend(transcript);
        };

        startButton.addEventListener('click', function() {
            recognition.start();
        });
    } else {
        startButton.setAttribute('disabled', 'disabled');
        startButton.textContent = 'Browser not supported';
        console.error('This browser does not support web speech API');
    }
});

function sendTextToBackend(text) {
    fetch('/submit-story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error sending text to backend:', error);
    });
}