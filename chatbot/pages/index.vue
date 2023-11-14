
import SvgAvatar from '../components/SvgAvatar.vue';
<template>
  <div class="main-wrapper">
    <div class="bot-chat-wrapper">
      <div class="svg-icon-container">
        <SvgAvatar @speech-result="receiveData" />
      </div>
      <div>
        <Chat :receivedValue="speech" @user-data="recieveUserData" />
      </div>
    </div>
    <div class="info-form-wrapper">
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
    };
  },
  methods: {
    receiveData(data) {
      this.speech = data;
    },
    recieveUserData(data) {
      this.userData = data;
    }
  },
}
</script>

<style>
.main-wrapper {
  /* display: flex; */
}

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