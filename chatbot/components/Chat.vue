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
                <div class="chatbot-message">
                    <p class="chatbot-text">For the time being I can only answer the Diabetes related queries.</p>
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
    data() { },
    mounted() {
        this.showPreviousChat();
    },
    methods: {
        isEmpty(obj) {
            return Object.entries(obj).length === 0;
        },
        objectLength(obj) {
            return Object.entries(obj).length;
        },
        async previousChat() {
            const conversationId = localStorage.getItem("conversationId") || "";
            const data = await $fetch(
                `http://localhost:2000/display?cId=${conversationId}`
            ).catch((error) => error.data);
            return data;
        },
        async showPreviousChat() {
            const previousChat = await this.previousChat();
            const conversationWrapper = document.getElementById('conversation');
            for (const cnvKey in previousChat.data) {
                if (Object.hasOwnProperty.call(previousChat.data, cnvKey)) {
                    const element = previousChat.data[cnvKey];
                    if (typeof element === "object") {
                        const dateTime = new Date(element.timestmp / 1000);
                        const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })
                        let message = document.createElement('div');
                        message.classList.add('chatbot-message', 'user-message');
                        message.innerHTML = `<p class="chatbot-text" sentTime="${time}">${element.message}</p>`;
                        conversationWrapper.appendChild(message);
                    }
                }
            }
            // previousChat.forEach(conversation => {
            // });
        },
        generateResponse(input) {
            const greeting = ["hi", "hello", "hey"]
            const responses = {
                "askName": "Before we proceed to next, May I know your Name? 😊",
                "thankName": `Nice name ${input}. Now let's come to point.`,
                "since": "Since how long you are edaling with Diabetes? 📩",
                "checkUps": "Have you done regular, weakly, or monthly checkups? 💻",
                "hb1c": "What is your last HB1C score? 🤔",
                "type": "Do you have Type 1 or Type 2 Diabetes?",
                "insulin": "Are you taking insulin or still managing with pills?. 🚫",
                "out": "I'm sorry, I'm not programmed to handle offensive or inappropriate language. Please refrain from using such language in our conversation",
                "end": "Is there anything specific you'd like to ask or talk about? I'm here to help with any questions or concerns you may have. 💬",
            };
            const isGreeted = greeting.some(value => input.includes(value));
            const isValidName = (name) => /^[A-Za-z\s\-']+$/u.test(name);
            if (isGreeted) {
                return responses.askName;
            } else if (isValidName) {
                return responses.thankName;
            }
            else {
                return responses.out;
            }
        },
        async handleSubmit() {
            const conversation = document.getElementById('conversation');
            const formEl = document.forms.inputForm;
            const formData = new FormData(formEl);
            const currentDate = new Date();
            const input = formData.get("messageField");
            const currentTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
            formEl.reset();
            // Add user input to conversation
            let message = document.createElement('div');
            message.classList.add('chatbot-message', 'user-message');
            message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p>`;
            conversation.appendChild(message);
            // Generate chatbot response
            const response = this.generateResponse(input);
            const previousChat = await this.previousChat();
            console.log({ prev: previousChat._id });
            let customerResponse = {};
            if (!previousChat._id) {
                console.log("if");
                customerResponse[0] = {
                    "timestmp": + currentDate,
                    "response": "person",
                    "message": input
                }
                customerResponse[1] = {
                    "timestmp": + currentDate,
                    "response": "chatbot",
                    "message": response
                }
                if (localStorage.getItem("conversationId")) {
                    customerResponse['id'] = localStorage.getItem("conversationId") || "";
                }
            } else {
                console.log("else");
                customerResponse = {...previousChat.data}
                const resLength = this.objectLength(previousChat.data);
                customerResponse[resLength - 2] = {
                    "timestmp": + currentDate,
                    "response": "person",
                    "message": input
                }
                customerResponse[resLength - 1] = {
                    "timestmp": + currentDate,
                    "response": "chatbot",
                    "message": response
                }
            }
            console.log({ customerResponse });

            // Add chatbot response to conversation
            message = document.createElement('div');
            message.classList.add('chatbot-message', 'chatbot');
            message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
            conversation.appendChild(message);
            message.scrollIntoView({ behavior: "smooth" });

            const insertData = await $fetch('http://localhost:2000/insert', {
                method: "post",
                body: customerResponse
            }).catch((error) => error.data);
            console.log({ insertData });
            if (insertData.acknowledged && !insertData?.matchedCount) {
                localStorage.setItem("conversationId", insertData.insertedId);
            }
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