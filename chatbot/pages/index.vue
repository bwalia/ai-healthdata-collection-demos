
import SvgAvatar from '../components/SvgAvatar.vue';
<template>
  <div class="main-wrapper">
    <div>
      <SvgAvatar @speech-result="receiveData" />
    </div>
    <div>
      <Chat :receivedValue="speech" />
    </div>
    <div>
      <InfoForm />
    </div>
  </div>
</template>
  
<script>

export default {
    data() {
        return {
            speech: '',
        };
    },
    methods: {
        receiveData(data) {
            this.speech = data;
        },
    },
}
</script>

<style>
.main-wrapper {
  display: flex;
}
</style>