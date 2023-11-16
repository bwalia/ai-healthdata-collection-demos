<template>
    <div>
        <img src="~/assets/images/user.svg" id="avatarImg" width="500">
        <input type="hidden" id="status" value="0">
    </div>
    <div class="hints"></div>
    <div class="microphone">
        <Icon name="system-uicons:microphone" id="microphone" />
        <!-- system-uicons:microphone -->
    </div>
</template>

<script>
export default {
    props: {
        receivedResponse: String,
    },
    watch: {
        receivedResponse(newValue, oldValue) {
            if (newValue) {
                this.stopSpeaking();            }
        },
    },
    data() {
        return {
            botResponse: ''
        }
    },
    mounted() {
        this.listenAudio();
    },
    methods: {
        speechResult(speech) {
            this.$emit('speech-result', speech);
            setTimeout(() => {
                this.startSpeaking();
            }, 1500);
        },
        stopSpeaking() {
            document.getElementById("status").value = 0;
            var element = document.getElementById('avatarImg');
            element.src = "_nuxt/assets/images/user.svg";
        },

        startSpeaking() {
            document.getElementById("status").value = 1;
            this.avatarSpeaking();
        },

        avatarSpeaking() {
            var statusVal = document.getElementById('status').value;
            //console.log(statusVal)
            if (statusVal == 1) {
                var element = document.getElementById('avatarImg');
                var imgAr = ['3.svg', '4.svg', '5.svg', '6.svg', '7.svg', '8.svg'];
                var num = Math.floor(Math.random() * imgAr.length);
                element.src = "_nuxt/assets/images/speaking/" + imgAr[num];

                setTimeout(this.avatarSpeaking, 500);
                return true;
            }
        },
        listenAudio() {
            var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
            var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
            var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

            var colors = ['aqua', 'azure', 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];

            var recognition = new SpeechRecognition();
            if (SpeechGrammarList) {
                // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
                // This code is provided as a demonstration of possible capability. You may choose not to use it.
                var speechRecognitionList = new SpeechGrammarList();
                var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
                speechRecognitionList.addFromString(grammar, 1);
                recognition.grammars = speechRecognitionList;
            }
            recognition.continuous = false;
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            var diagnostic = document.querySelector('.output');
            var bg = document.querySelector('html');
            var hints = document.querySelector('.hints');

            var colorHTML = '';
            // colors.forEach(function (v, i, a) {
            //     console.log(v, i);
            //     colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
            // });
            hints.innerHTML = 'Tap/click then say anything';

            document.getElementById("microphone").onclick = function () {
                recognition.start();
                console.log('Ready to receive a color command.');
            }

            recognition.onresult = (event) => {
                // The Speroperty returns a SpeechRecognitionResultList object
                // The SpeechRecognitionResultList objecechRecognitionEvent results pt contains SpeechRecognitionResult objects.
                // It has a getter so it can be accessed like an array
                // The first [0] returns the SpeechRecognitionResult at the last position.
                // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
                // These also have getters so they can be accessed like arrays.
                // The second [0] returns the SpeechRecognitionAlternative at position 0.
                // We then return the transcript property of the SpeechRecognitionAlternative object
                var color = event.results[0][0].transcript;
                this.speechResult(color);
                diagnostic.textContent = 'Result received: ' + color + '.';
                bg.style.backgroundColor = color;
                console.log('Confidence: ' + event.results[0][0].confidence);
            }

            recognition.onspeechend = function () {
                recognition.stop();
            }

            recognition.onnomatch = function (event) {
                diagnostic.textContent = "I didn't recognise that color.";
            }

            recognition.onerror = function (event) {
                diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
            }
        }
    }
}
</script>

<style>
.microphone {
    display: flex;
    justify-content: center;
    font-size: 65px;
    margin-top: 10px;
}

.hints {
    text-align: center;
    margin-top: 10px;
}
</style>