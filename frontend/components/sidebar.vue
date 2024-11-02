<script setup>
import Swal from "sweetalert2";

const actoveMenu = ref("");
const name = ref("");
const level = ref("");
const config = useRuntimeConfig();

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigateTo("/");
    return;
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };
    const response = await $fetch(`${config.public.apiBase}/api/users/info`, {
      headers,
    });

    if (response) {
      name.value = response.name;
      level.value = response.level;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error fetching user data",
    });
  }
};

const toggleMenu = (menu) => {
  actoveMenu.value = menu;
};

const signOut = async () => {
  const button = await Swal.fire({
    title: "ยืนยันการออกจากระบบ",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
  });

  if (button.isConfirmed) {
    localStorage.removeItem("token");
    localStorage.removeItem("nuxt_erp_user_id");

    navigateTo("/");
  }
};
</script>

<template>
  <div>
    <div class="sidebar-title">NuxtERP V.2024</div>
    <div class="sidebar-avatar">
      <div class="text-center">
        <i
          class="fa fa-user text-2xl text-gray-800 py-3 w-[40px] h-[40px] rounded-lg bg-gray-200"
        ></i>
      </div>
      <div class="text-center text-md mt-3 text-gray-100">
        {{ name }} : {{ level }}
      </div>
      <div class="text-center mt-3 flex justify-center gap-2">
        <button class="btn btn-danger text-xs" @click="signOut">
          <i class="fa fa-sign-out mr-1"></i>Sign Out
        </button>
        <button
          class="btn btn-primary text-xs"
          @click="navigateTo('/userProfile')"
        >
          <i class="fa fa-user mr-1"></i>Profile
        </button>
      </div>
    </div>
    <div class="sidebar-menu">
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'home' }"
        to="/home"
        @click="toggleMenu('home')"
      >
        <i class="fa fa-home"></i>
        Dashboard
      </NuxtLink>
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'production' }"
        to="/production"
        @click="toggleMenu('production')"
      >
        <i class="fa fa-copy"></i>
        บันทึกการผลิต
      </NuxtLink>
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'productType' }"
        to="/productType"
        @click="toggleMenu('productType')"
      >
        <i class="fa fa-file-alt"></i>
        ประเภทสินค้า
      </NuxtLink>
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'product' }"
        to="/product"
        @click="toggleMenu('product')"
      >
        <i class="fa fa-box"></i>
        สินค้า
      </NuxtLink>
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'material' }"
        to="/material"
        @click="toggleMenu('material')"
      >
        <i class="fa fa-cogs"></i>
        วัสดุ, ส่วนผสม
      </NuxtLink>
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'packaging' }"
        to="/packaging"
        @click="toggleMenu('packaging')"
      >
        <i class="fa fa-box"></i>
        บรรจุภัณฑ์
      </NuxtLink>
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'formula' }"
        to="/formula"
        @click="toggleMenu('formula')"
      >
        <i class="fa fa-receipt"></i>
        สูตรสินค้า
      </NuxtLink>
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'productionPlan' }"
        to="/productionPlan"
        @click="toggleMenu('productionPlan')"
      >
        <i class="fa fa-calendar"></i>
        แผนการผลิต
      </NuxtLink>
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'report' }"
        to="/report"
        @click="toggleMenu('report')"
      >
        <i class="fa fa-chart-bar"></i>
        รายงานการผลิต
      </NuxtLink>
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'costAccounting' }"
        to="/costAccounting"
        @click="toggleMenu('costAccounting')"
      >
        <i class="fa fa-dollar-sign"></i>
        บัญชีต้นทุน
      </NuxtLink>
      <NuxtLink
        class="nav-link"
        :class="{ active: activeMenu === 'users' }"
        to="/users"
        @click="toggleMenu('users')"
      >
        <i class="fa fa-users"></i>
        ผู้ใช้งาน
      </NuxtLink>
    </div>
  </div>
</template>
