<template>
  <div class="contact-form">
    <h2>Information Form</h2>
    <form>
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" v-model="fullName" required>
      </div>
      <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="text" id="phone" name="phone" v-model="phoneNo" required>
      </div>
      <div class="form-group">
        <label for="message">Address:</label>
        <textarea id="Address" name="Address" v-model="address" required></textarea>
      </div>
      <!-- <div class="form-group">
        <button type="submit">Send Message</button>
      </div> -->
    </form>
  </div>
</template>

<script>
export default {
  props: {
    receiveUser: Object,
  },
  data() {
    return {
      fullName: this.receiveUser.name,
      phoneNo: "",
      address: ""
    }
  },
  mounted() {
    this.userData();
  },
  methods: {
    async userData() {
      const userId = localStorage.getItem("userId") || "";
      if (userId) {
        const data = await $fetch(
          `http://localhost:2000/user-data?uId=${userId}`
        ).catch((error) => error.data);
        if (data) {
          this.fullName = data.name;
          this.phoneNo = data.phoneNo;
          this.address = data.address;
        }
      }
    },
  }
}

</script>

<style>
.contact-form {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  padding: 20px;
  box-sizing: border-box;
}

.contact-form h2 {
  text-align: center;
  color: #333333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #cccccc;
  border-radius: 4px;
}

.form-group textarea {
  resize: vertical;
  height: 100px;
}

.form-group button {
  background-color: #4caf50;
  color: #ffffff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.form-group button:hover {
  background-color: #45a049;
}
</style>