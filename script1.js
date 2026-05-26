document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');
    const clearBtn = document.getElementById('clear-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const voiceStatus = document.getElementById('voice-status-indicator');
    const totalCountEl = document.getElementById('total-count');

    let totalMessagesSent = 0;

    // AI Contextual Smart Responses Rule Engine 
    const aiBotResponses = {
        greeting: [
            "Hello! I am your Aether Assistant. I'm listening to your voice input right now.",
            "Greetings! Voice channel is stable and fully operational. How can I help you build today?"
        ],
        project: [
            "Aether-OS integration looks completely optimized. Let me know if you need to test the logic interfaces.",
            "Excellent framework choice. We can modularize these components further whenever you want."
        ],
        fallback: [
            "I processed your transmission clearly. Let's process that item or add more code elements.",
            "Understood perfectly. The audio buffer translation is streaming directly into our dashboard logs."
        ]
    };

    // Speech Recognition Configuration (Web Speech API)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isRecording = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        // Fired when audio captures completely
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            appendMessage(`🎙️ [Voice Input Detected]: "${transcript}"`, 'sent');
            processFormSubmission(transcript);
        };

        recognition.onstart = () => {
            isRecording = true;
            voiceBtn.classList.add('recording');
            voiceStatus.className = 'voice-status-visible';
        };

        recognition.onend = () => {
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceStatus.className = 'voice-status-hidden';
        };

        recognition.onerror = (err) => {
            console.error("Speech Recognition Engine Error: ", err.error);
            appendMessage("⚠️ System failed to decode audio stream clearly.", "system");
        };

        // Bind Microphone Button Click
        voiceBtn.addEventListener('click', () => {
            if (isRecording) {
                recognition.stop();
            } else {
                messageInput.value = '';
                recognition.start();
            }
        });
    } else {
        // Fallback flag if client browser lacks Web Speech modules (e.g., legacy browsers)
        voiceBtn.addEventListener('click', () => {
            alert("Web Speech API is not supported in this browser. Try using Google Chrome or Microsoft Edge!");
        });
    }

    // Process Form Input Submissions
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if (!text) return;

        appendMessage(text, 'sent');
        processFormSubmission(text);
    });

    function processFormSubmission(text) {
        messageInput.value = '';
        totalMessagesSent++;
        totalCountEl.textContent = totalMessagesSent;

        // Trigger simulated AI response workflow
        setTimeout(() => {
            const cleanText = text.toLowerCase();
            let replies = aiBotResponses.fallback;

            if (cleanText.includes('hello') || cleanText.includes('hi') || cleanText.includes('hey')) {
                replies = aiBotResponses.greeting;
            } else if (cleanText.includes('project') || cleanText.includes('code') || cleanText.includes('os')) {
                replies = aiBotResponses.project;
            }

            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            appendMessage(`🤖 [Aether AI]: ${randomReply}`, 'received');
        }, 1000);
    }

    // Clear Screen Control Click Handler
    clearBtn.addEventListener('click', () => {
        chatMessages.innerHTML = `
            <div class="message system">
                <p><strong>System:</strong> Stream logs cleared successfully.</p>
            </div>
        `;
    });

    // Helper layout renderer
    function appendMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        
        const now = new Date();
        const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <p>${escapeHTML(text)}</p>
            <span class="timestamp">${timestampStr}</span>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHTML(str) {
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
});
