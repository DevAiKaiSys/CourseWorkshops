<script setup>
import { ref, watch } from 'vue';

defineProps({
  msg: {
    type: String,
    required: true
  }
})

const kobdemy = "Peter Nohng"

const test = (x) => {
  return x + 1
}

const kobdemy2 = ref("This is Kobdemy")
kobdemy2.value = "This is new Value"
console.log(kobdemy2)

const count = ref(0)
const increase = () => count.value++

const decrease = () => {
  if (count.value > 0) count.value--
}

const phone_number = ref(null)
const errorMessage = ref('');

const isPhoneNumber = (number) => {
  const phonePattern = /^0\d{9}$/; // Matches phone numbers like 0897564215 10 digit
  return phonePattern.test(number)
}

const isPhoneNumber2 = (number) => {
  const phonePattern = /^(08|09|06)\d{8}$/; // Updated pattern
  return phonePattern.test(number)
}

watch(phone_number, (newVal) => {
  if (newVal.length > 10) {
    phone_number.value = newVal.slice(0, 10)
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h2>{{ kobdemy }} {{ test(1) }}</h2>
    <h2>{{ kobdemy2 }}</h2>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>

    <h3>{{ count }}</h3>
    <button @click="decrease">Decrease -</button> &nbsp;
    <button @click="increase">Increase +</button>

    <div style="text-align: center;">
      <h3 style="font-size: 1.3em; margin-bottom: 5px;">กรุณาใส่เบอร์โทรศัพท์</h3>
      <input v-model="phone_number" style="font-size: 1.1em;margin-bottom: 5px;" /> <br />
      <!-- <span>{{ phone_number }}</span> -->
      <button>ยืนยันเบอร์โทรศัพท์</button> <br />
      <!-- {{ isPhoneNumber(phone_number) }} -->
      <span v-if="!isPhoneNumber2(phone_number) && phone_number"
        style="color: red;">กรุณาใส่เบอร์โทรศัพท์ให้ถูกต้อง</span>
    </div>
  </div>
</template>

<style scoped>
input {
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
}

input:focus {
  background: orange;
  outline: none;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
