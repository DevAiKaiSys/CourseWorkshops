<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { useRuntimeConfig } from "#app";

definePageMeta({
  layout: "admin",
});

const name = ref("");
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const level = ref("");
const config = useRuntimeConfig();

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await $fetch(`${config.public.apiBase}/api/users/info`, {
      headers,
    });

    name.value = response.name;
    username.value = response.username;
    level.value = response.level;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error.message || "Failed to fetch user data.",
    });
  }
};

// generate function save user profile
const save = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const headers = { Authorization: `Bearer ${token}` };

    if (password.value !== confirmPassword.value) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "รหัสผ่านไม่ตรงกัน",
        showConfirmButton: true,
      });
    }

    const payload = {
      name: name.value,
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      level: level.value,
    };

    const response = await $fetch(`${config.public.apiBase}/api/users/update`, {
      method: "PUT",
      headers,
      body: payload,
    });

    Swal.fire({
      icon: "success",
      title: "บันทึกข้อมูล",
      text: "บันทึกข้อมูลสำเร็จ",
      timer: 1000,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error.message || "Failed to update user data.",
    });
  }
};
</script>

<template>
  <div class="title">
    <h1>ข้อมูลส่วนตัว</h1>
  </div>
  <div class="p-4">
    <div>
      <div>
        <div class="form-group">
          <div>ชื่อ</div>
          <input type="text" class="form-control" v-model="name" id="name" />

          <div for="username" class="mt-3">Username</div>
          <input
            type="text"
            class="form-control"
            v-model="username"
            id="username"
          />

          <div class="mt-3">
            รหัสผ่าน
            <span class="text-red">(ถ้าต้องการเปลี่ยน ให้กรอกข้อมูล)</span>
          </div>
          <input
            type="password"
            class="form-control"
            v-model="password"
            id="password"
          />

          <div class="mt-3">
            ยืนยันรหัสผ่าน
            <span class="text-red">(ถ้าต้องการเปลี่ยน ให้กรอกข้อมูล)</span>
          </div>
          <input
            type="password"
            class="form-control"
            v-model="confirmPassword"
            id="confirmPassword"
          />

          <div class="mt-3">สิทธิ์การเข้าสู่ระบบ</div>
          <input
            type="radio"
            v-model="level"
            value="admin"
            id="admin"
            class="me-1"
          />
          <label for="admin" class="form-check-label">Admin</label>
          <input
            type="radio"
            v-model="level"
            value="user"
            id="user"
            class="ms-3 me-1"
          />
          <label for="user" class="form-check-label">User</label>

          <div class="mt-3">
            <button class="btn" @click="save">
              <i class="fa fa-check mr-1"></i>บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
