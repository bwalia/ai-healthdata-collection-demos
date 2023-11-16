<template>
    <div class="chatbot-container">
        <div id="chat-header" class="chat-header">
            <div class="chat-top-heading">
                <h2>24/7 Healthdata Collection Agent</h2>
                <h5>AI Powered speaks in your Natural Language</h5>
            </div>
            <div class="clear-btn-wrapper">
                <button class="btn btn-clc" id="clearCoversation" @click="clearConversation" type="button">Clear
                    Conversation
                </button>
            </div>
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
        staticResponse(inputVal) {
            return {
                "askName": "Before we proceed to next, May I know your Name? 😊",
                "thankName": `Nice name. Is this your Full name?`,
                "phone_no": "Thanks for confirming Full Name, can you confirm you mobile/phone number?",
                "full_name": "Then can you please say your Full name?",
                "address": "May I know where do you live?",
                "since": "Since how long you are edaling with Diabetes? 📩",
                "checkUps": "Have you done regular, weakly, or monthly checkups? 💻",
                "hb1c": "What is your last HB1C score? 🤔",
                "type": "Do you have Type 1 or Type 2 Diabetes?",
                "insulin": "Are you taking insulin or still managing with pills?. 🚫",
                "out": "I'm sorry, I'm not programmed to handle offensive or inappropriate language. Please refrain from using such language in our conversation",
                "end": "Is there anything specific you'd like to ask or talk about? I'm here to help with any questions or concerns you may have. 💬",
            };
        },
        async showPreviousChat() {
            const previousChat = await this.previousChat();
            const conversationWrapper = document.getElementById('conversation');
            if (previousChat)
                for (const cnvKey in previousChat.data) {
                    if (Object.hasOwnProperty.call(previousChat.data, cnvKey)) {
                        const element = previousChat.data[cnvKey];
                        if (typeof element === "object") {
                            const dateTime = new Date(element.timestmp / 1000);
                            const time = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" })
                            let message = document.createElement('div');
                            message.classList.add('chatbot-message');
                            if (element.response === "person") {
                                message.classList.add('user-message');
                            }
                            message.innerHTML = `<p class="chatbot-text" sentTime="${time}">${element.message}</p>`;
                            conversationWrapper.appendChild(message);
                        }
                    }
                }
        },
        generateResponse(input) {
            const previousMessage = localStorage.getItem("botResponse");
            const fullNameCHeck = ["yes", "yeah", "yeh", "yep"];
            const greeting = ["hi", "hello", "hey"];
            const nameValidation = ["name", "my name", "full name", "you can call me"];
            const inputValue = input.includes("is") ? input.split("is ") : [];
            console.log({ input, previousMessage, isname: fullNameCHeck.some(value => input.includes(value)) });
            const responses = this.staticResponse(inputValue[1]);
            const isGreeted = greeting.some(value => input.includes(value));
            const isValidName = nameValidation.some(value => input.includes(value));
            if (isGreeted && !previousMessage) {
                return responses.askName;
            } else if (isValidName && previousMessage === responses.askName) {
                return responses.thankName;
            } else if (previousMessage === responses.thankName) {
                if (fullNameCHeck.some(value => input.includes(value)))
                    return responses.phone_no
                else
                    return responses.full_name;
            } else if (previousMessage === responses.full_name) {
                return responses.phone_no;
            } else if (previousMessage === responses.phone_no) {
                return responses.address
            } else if (previousMessage === responses.address) {
                return responses.end;
            }
            else {
                return responses.out;
            }
        },

        async uploadUserDetail(body) {
            const userId = localStorage.getItem("userId") || "";
            if (userId) {
                body['id'] = userId;
            }
            const insertData = await $fetch(`http://localhost:2000/user-details`, {
                method: "post",
                body: body
            }).catch((error) => error.data);

            if (insertData.acknowledged && !insertData?.matchedCount) {
                localStorage.setItem("userId", insertData.insertedId);
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
            const previousMessage = localStorage.getItem("botResponse");
            const parseValue = input.includes("is") ? input.split("is ") : [];
            const parseAdValue = input.includes("in") ? input.split("in ") : [];
            const responses = this.staticResponse(parseValue[1]);
            // Generate chatbot response
            const response = this.generateResponse(input);
            this.$emit("bot-response", response);
            localStorage.setItem('botResponse', response);
            const previousChat = await this.previousChat();

            const name = previousMessage === responses.askName && parseValue[1];
            const phoneNo = previousMessage === responses.phone_no && parseValue[1];
            const address = previousMessage === responses.address && parseAdValue[1];
            const userData = name ? { name } : phoneNo ? { phoneNo } : address ? { address } : "";
            this.$emit("user-data", userData);
            this.uploadUserDetail(userData)

            console.log({ previousChat });

            let customerResponse = {};
            if (!previousChat || !previousChat?._id) {
                customerResponse[0] = {
                    "timestmp": + currentDate,
                    "response": "person",
                    "message": input,
                    "meta_data": {
                        "name": name,
                        "phone_no": phoneNo,
                        "address": address
                    }
                }
                customerResponse[1] = {
                    "timestmp": + currentDate,
                    "response": "chatbot",
                    "message": response
                }
            } else {
                customerResponse = { ...previousChat.data }
                const resLength = this.objectLength(previousChat.data);
                customerResponse[resLength] = {
                    "timestmp": + currentDate,
                    "response": "person",
                    "message": input,
                    "meta_data": {
                        "name": name,
                        "phone_no": phoneNo,
                        "address": address
                    }
                }
                customerResponse[resLength + 1] = {
                    "timestmp": + currentDate,
                    "response": "chatbot",
                    "message": response
                }
                if (localStorage.getItem("conversationId")) {
                    customerResponse['id'] = localStorage.getItem("conversationId") || "";
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
        async clearConversation() {
            const data = await $fetch(
                `http://localhost:2000/clear-conversation`
            ).catch((error) => error.data);
            if (data.status === "OK") {
                localStorage.removeItem("conversationId");
                localStorage.removeItem("botResponse");
                localStorage.removeItem("userId");
                window.location.reload();
            }
        }
    }
}

</script>

<style>
.chatbot-container {
    /* width: 400px; */
    margin: 0 auto;
    background-color: #f5f5f5;
    border: 1px solid #cccccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn {
    position: relative;
    display: inline-block;
    cursor: pointer;
    outline: none;
    border: 0;
    vertical-align: middle;
    text-decoration: none;
}

/*Button One*/
.btn-clc {
  padding:20px 30px;
  outline: none;
  background-color: #285d50;
  border: none;
  border-radius:5px;
  box-shadow: 0 9px #485252;
  color: #ffffff;
}

.btn-clc:hover{
  background-color: #476052;
}

.btn-clc:active {
  background-color: #476052;
  box-shadow: 0 5px #485252;
  transform: translateY(4px);
}

.clear-btn-wrapper {
    margin: auto 0;
}

#chatbot {
    background-color: #f5f5f5;
    border: 1px solid #eef1f5;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

.chat-header {
    background-color: darkslategrey;
    color: #ffffff;
    padding: 20px;
    font-size: 1em;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
}

.message-container {
    background: #ffffff;
    width: 100%;
    display: flex;
    align-items: center;
}


#conversation {
    height: 155px;
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
    margin-top: 10px;
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