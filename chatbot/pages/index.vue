
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
      <button @click="toggleVisibility">Toggle Component</button>
    </div>
    <div class="info-form-wrapper" v-if="isVisible">
      <InfoForm :receiveUser="userData" />
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
      isVisible: true,
    };
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

.svg-icon-container img {
  height: 200px;
  width: 300px;
}

.info-form-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
</style>