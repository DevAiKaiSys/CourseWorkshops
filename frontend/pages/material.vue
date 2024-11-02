<script setup>
import Swal from "sweetalert2";

definePageMeta({
  layout: "admin",
});

const showModal = ref(false);
const materials = ref([]);
const id = ref("");
const name = ref("");
const unit = ref("");
const price = ref(0);
const remark = ref("");
const config = useRuntimeConfig();

onMounted(async () => {
  await fetchData();
});

const closeModal = () => {
  showModal.value = false;

  id.value = "";
  name.value = "";
  unit.value = "";
  price.value = 0;
  remark.value = "";
};

const fetchData = async () => {
  try {
    const res = await $fetch(`${config.public.apiBase}/api/materials/list`);

    if (res) {
      materials.value = res;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถโหลดข้อมูลวัสดุ, ส่วนผสมได้.",
    });
  }
};

const save = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found.");

    const headers = { Authorization: `Bearer ${token}` };
    const payload = {
      name: name.value,
      unit: unit.value,
      price: price.value,
      remark: remark.value,
    };

    let response;
    if (id.value) {
      response = await $fetch(
        `${config.public.apiBase}/api/materials/update/${id.value}`,
        {
          method: "PUT",
          headers,
          body: payload,
        }
      );
    } else {
      response = await $fetch(`${config.public.apiBase}/api/materials/create`, {
        method: "POST",
        headers,
        body: payload,
      });
    }

    if (response) {
      closeModal();
      await fetchData();
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถบันทึกข้อมูลวัสดุ, ส่วนผสมได้.",
    });
  }
};

const remove = async (id) => {
  try {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "ยืนยันการลบ",
      text: "คุณแน่ใจว่าต้องการลบวัสดุ, ส่วนผสมนี้?",
      showCancelButton: true,
      showConfirmButton: true,
    });

    if (isConfirmed) {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const headers = { Authorization: `Bearer ${token}` };
      const response = await $fetch(
        `${config.public.apiBase}/api/materials/remove/${id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      await fetchData();
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถลบข้อมูลวัสดุ, ส่วนผสมได้.",
    });
  }
};
</script>

<template>
  <div class="title">วัสดุ, ส่วนผสม</div>
  <div class="p-4">
    <button class="btn mr-1" @click="showModal = true">
      <i class="fa fa-plus mr-1"></i>เพิ่มวัสดุ, ส่วนผสม
    </button>
    <button class="btn mr-1">
      <i class="fa fa-arrow-alt-circle-down mr-1"></i>รับเข้าสต๊อก
    </button>
    <button class="btn mr-1">
      <i class="fa fa-history mr-1"></i>ประวัติการรับเข้าสต๊อก
    </button>
  </div>

  <table class="table mt-3" spacing="1">
    <thead>
      <tr>
        <th width="200px" class="text-left">ชื่อ</th>
        <th width="200px" class="text-left">หมายเหตุ</th>
        <th width="100px" class="text-right">คงเหลือ</th>
        <th width="100px" class="text-left">หน่วย</th>
        <th width="100px" class="text-right">ราคา</th>
        <th width="150px" class="text-left">วันที่วันเข้าล่าสุด</th>
        <th width="110px"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(material, index) in materials" :key="material.id">
        <td>{{ material.name }}</td>
        <td>{{ material.remark }}</td>
        <td class="text-right">{{ material.balance }}</td>
        <td>{{ material.unit }}</td>
        <td class="text-right">{{ material.price.toLocaleString("th-TH") }}</td>
        <td>18/10/2024 15:00</td>
        <td class="text-center">
          <button class="btn btn-primary me-1" @click="update(material)">
            <i class="fa fa-pencil"></i>
          </button>
          <button class="btn btn-danger" @click="remove(material.id)">
            <i class="fa fa-times"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <Modal v-if="showModal" title="เพิ่มวัสดุ, ส่วนผสม" @close="closeModal">
    <div>ชื่อ</div>
    <input type="text" v-model="name" class="form-control" />

    <div class="mt-3">หน่วยเรียก</div>
    <input type="text" v-model="unit" class="form-control" />

    <div class="mt-3">ราคา</div>
    <input type="number" v-model="price" class="form-control" />

    <div class="mt-3">หมายเหตุ</div>
    <input type="text" v-model="remark" class="form-control" />

    <button class="btn btn-primary mt-3" @click="save">
      <i class="fa fa-save mr-1"></i>บันทึก
    </button>
  </Modal>
</template>
