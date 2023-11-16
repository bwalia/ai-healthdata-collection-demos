
import SvgAvatar from '../components/SvgAvatar.vue';
<template>
  <div class="main-wrapper">
    <!-- <div class="bot-chat-wrapper"> -->
    <div>
      <Chat :receivedValue="speech" @user-data="recieveUserData" @bot-response="receiveResponse" />
    </div>
    <div class="svg-icon-container">
      <SvgAvatar @speech-result="receiveData" :receivedResponse="botResponse" />
    </div>
    <!-- </div> -->
    <div class="toggleBtn">
      <button @click="toggleVisibility" class="btn btn-toggle">
        <span>
          {{ isVisible ? "Hide" : "Show" }} Backend Form
        </span>
      </button>
    </div>
    <div class="info-form-wrapper" v-if="isVisible">
      <InfoForm :receiveUser="userData" />
    </div>
    <div class="word-wrapper" v-else>
      <div class="word" id="words"></div>
    </div>
  </div>
</template>
  
<script>

export default {
  data() {
    return {
      speech: '',
      userData: '',
      botResponse: '',
      isVisible: false,
    };
  },
  mounted() {
    !this.isVisible && this.showText();
  },
  methods: {
    receiveData(data) {
      this.speech = data;
    },
    recieveUserData(data) {
      this.userData = data;
    },
    receiveResponse(data) {
      this.botResponse = data;
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },

    showText() {
      let words = ['You can say anything', 'Say Hi/Hello/Hey', 'or you can say My name is James Bond.'],
        part,
        i = 0,
        offset = 0,
        len = words.length,
        forwards = true,
        skip_count = 0,
        skip_delay = 15,
        speed = 70;
      if (!this.isVisible) {
        setInterval(function () {
          if (forwards) {
            if (offset >= words[i].length) {
              ++skip_count;
              if (skip_count == skip_delay) {
                forwards = false;
                skip_count = 0;
              }
            }
          }
          else {
            if (offset == 0) {
              forwards = true;
              i++;
              offset = 0;
              if (i >= len) {
                i = 0;
              }
            }
          }
          part = words[i].substr(0, offset);
          if (skip_count == 0) {
            if (forwards) {
              offset++;
            }
            else {
              offset--;
            }
          }
          const wordEle = document.getElementById("words");
          if (typeof(wordEle) != 'undefined' && wordEle != null) {
            wordEle.innerHTML = part;
          }
        }, speed);
      }
    }
  },
}
</script>

<style>
/*.main-wrapper {
  display: flex;
}*/

.bot-chat-wrapper {
  display: flex;
  justify-content: space-evenly;
}

.svg-icon-container {
  float: right;
  margin-top: 20px;
}

.svg-icon-container img {
  height: 200px;
  width: 300px;
}

.info-form-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.toggleBtn {
  margin-top: 20px;
  text-align: center;
}

.btn-toggle {
  border-radius: 4px;
  background-color: #f7951e;
  border: none;
  padding: 20px;
  width: 200px;
  transition: all 0.5s;
  color: #fff;
}


.btn-toggle span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.btn-toggle span:after {
  content: '»';
  position: absolute;
  opacity: 0;
  top: 0;
  right: -20px;
  transition: 0.5s;
}

.btn-toggle:hover span {
  padding-right: 25px;
}

.btn-toggle:hover span:after {
  opacity: 1;
  right: 0;
}
.word-wrapper {
  text-align: center;
  margin-top: 30px;
}
.word {
  margin: auto;
  color: white;
  font: 700 normal 2.5em 'tahoma';
  text-shadow: 5px 2px #222324, 2px 4px #222324, 3px 5px #222324;
}
</style>