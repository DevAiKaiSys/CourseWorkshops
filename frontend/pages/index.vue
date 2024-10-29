<template>
  <div
    class="min-h-screen flex item-center justify-center bg-gradient-to-t from-blue-900 to-blue-100"
  >
    <div class="w-ful max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
      <h2 class="text-3xl font-bold text-gray-900 text-center">
        Sign In to Nuxt ERP
      </h2>

      <form action="" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <div>Username</div>
            <input
              type="text"
              class="form-control"
              placeholder="Email address"
              id="email-address"
              name="email"
              v-model="username"
            />
          </div>
          <div class="pt-5">
            <div>Password</div>
            <input
              type="password"
              class="form-control"
              placeholder="Password"
              id="password"
              name="password"
              v-model="password"
            />
          </div>
        </div>
        <div class="flex justify-between">
          <div class="flex">
            <input
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              id="remember-me"
              name="remember-me"
            />
            <label for="" class="ml-2 block text-sm text-gray-900"
              >Remember me</label
            >
          </div>

          <div class="text-sm">
            <a href="" class="font-medium text-indigo-600 hover:text-indigo-500"
              >Forgot your password?</a
            >
          </div>
        </div>

        <div>
          <button class="btn-full" type="submit">Sign In</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";

const username = ref("");
const password = ref("");
const config = useRuntimeConfig();
// console.log("Runtime config:", config);
// console.log("API base URL:", config.public.apiBase);
// if (import.meta.server) {
//   console.log("API secret:", config.apiSecret);
// }

const handleSubmit = async () => {
  try {
    if (!username.value || !password.value) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Username and password are required",
      });
    } else {
      const res = await $fetch(`${config.public.apiBase}/api/users/signIn`, {
        method: "POST",
        body: {
          username: username.value,
          password: password.value,
        },
      });

      console.log(res);
    }
  } catch (error) {}
};
</script>
