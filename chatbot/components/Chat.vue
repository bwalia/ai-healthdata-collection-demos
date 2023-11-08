<template>
    <div class="chatbot-container">
        <div id="header">
            <h2>24/7 Healthdata Collection Agent</h2>
            <h5>AI Powered speaks in your Natural Language</h5>
        </div>
        <div id="chatbot">
            <div id="conversation">
                <div class="chatbot-message">
                    <p class="chatbot-text">Hi! 👋 it's great to see you!</p>
                </div>
            </div>
            <form id="inputForm" @submit.prevent="handleSubmit">
                <div class="message-container">
                    <input id="messageField" name="messageField" type="text" placeholder="Type your message here"
                        :value="receivedValue">
                    <button id="submit-button" type="submit">
                        <img class="send-icon" src="send-message.png" alt="">
                    </button>
                </div>

            </form>
        </div>

    </div>
</template>

<script>
export default {
    props: {
        receivedValue: String,
    },
    watch: {
        receivedValue(newValue, oldValue) {
            if (newValue !== oldValue) {
                setTimeout(() => {
                    document.getElementById("submit-button").click();
                }, 2000);
            }
        },
    },
    data() {
        return {
            searchQuery: '',
            searchResults: [],
        };
    },
    mounted() {
        this.previousChat();
    },
    methods: {
        async previousChat () {
            // const { data } = await useFetch('http://localhost:2000/display');
            const users = await $fetch('http://localhost:2000/display').catch((error) => error.data)
            console.log({users});
        },
        generateResponse(input) {
            // Add chatbot logic here
            const responses = [
                "Hello, how can I help you today? 😊",
                "I'm sorry, I didn't understand your question. Could you please rephrase it? 😕",
                "I'm here to assist you with any questions or concerns you may have. 📩",
                "I'm sorry, I'm not able to browse the internet or access external information. Is there anything else I can help with? 💻",
                "What would you like to know? 🤔",
                "I'm sorry, I'm not programmed to handle offensive or inappropriate language. Please refrain from using such language in our conversation. 🚫",
                "I'm here to assist you with any questions or problems you may have. How can I help you today? 🚀",
                "Is there anything specific you'd like to talk about? 💬",
                "I'm happy to help with any questions or concerns you may have. Just let me know how I can assist you. 😊",
                "I'm here to assist you with any questions or problems you may have. What can I help you with today? 🤗",
                "Is there anything specific you'd like to ask or talk about? I'm here to help with any questions or concerns you may have. 💬",
                "I'm here to assist you with any questions or problems you may have. How can I help you today? 💡",
            ];

            // Return a random response
            return responses[Math.floor(Math.random() * responses.length)];
        },
        handleSubmit() {
            const conversation = document.getElementById('conversation');
            const formEl = document.forms.inputForm;
            const formData = new FormData(formEl);

            const input = formData.get("messageField");
            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
            formEl.reset();
            // Add user input to conversation
            let message = document.createElement('div');
            message.classList.add('chatbot-message', 'user-message');
            message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p>`;
            conversation.appendChild(message);

            // Generate chatbot response
            const response = this.generateResponse(input);

            // Add chatbot response to conversation
            message = document.createElement('div');
            message.classList.add('chatbot-message', 'chatbot');
            message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
            conversation.appendChild(message);
            message.scrollIntoView({ behavior: "smooth" });
        },
    }
}

</script>

<style>
.chatbot-container {
    width: 500px;
    margin: 0 auto;
    background-color: #f5f5f5;
    border: 1px solid #cccccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#chatbot {
    background-color: #f5f5f5;
    border: 1px solid #eef1f5;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

#header {
    background-color: darkslategrey;
    color: #ffffff;
    padding: 20px;
    font-size: 1em;
    font-weight: bold;
}

.message-container {
    background: #ffffff;
    width: 100%;
    display: flex;
    align-items: center;
}


#conversation {
    height: 400px;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

@keyframes message-fade-in {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chatbot-message {
    display: flex;
    align-items: flex-start;
    position: relative;
    font-size: 16px;
    line-height: 20px;
    border-radius: 20px;
    word-wrap: break-word;
    white-space: pre-wrap;
    max-width: 100%;
    padding: 0 15px;
}

.user-message {
    justify-content: flex-end;
}


.chatbot-text {
    background-color: white;
    color: #333333;
    font-size: 1.1em;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#inputForm {
    display: flex;
    align-items: center;
    border-top: 1px solid #eef1f5;
}

#messageField {
    flex: 1;
    height: 60px;
    border: 1px solid #eef1f5;
    border-radius: 4px;
    padding: 0 10px;
    font-size: 14px;
    transition: border-color 0.3s;
    background: #ffffff;
    color: #333333;
    border: none;
}

.send-icon {
    margin-right: 10px;
    cursor: pointer;
}

#messageField:focus {
    border-color: #333333;
    outline: none;
}

#submit-button {
    background-color: transparent;
    border: none;
}

p[sentTime]:hover::after {
    content: attr(sentTime);
    position: absolute;
    top: -3px;
    font-size: 14px;
    color: gray;
}

.chatbot p[sentTime]:hover::after {
    left: 15px;
}

.user-message p[sentTime]:hover::after {
    right: 15px;
}

/* width */
::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>