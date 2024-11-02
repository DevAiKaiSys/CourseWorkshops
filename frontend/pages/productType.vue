<script setup>
import Swal from "sweetalert2";

definePageMeta({
  layout: "admin",
});

const showModal = ref(false);
const name = ref("");
const remark = ref("");
const id = ref("");
const config = useRuntimeConfig();
const productTypes = ref([]);

const closeModal = () => {
  showModal.value = false;
};

onMounted(async () => {
  await fetchData();
});

const fetchData = async () => {
  console.log("fetchData");
  try {
    const res = await $fetch(`${config.public.apiBase}/api/productTypes/list`);

    if (res) {
      productTypes.value = res;
    }
  } catch (error) {
    console.error("Error fetching product types:", error);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถโหลดข้อมูลประเภทสินค้าได้.",
    });
  }
};

const save = async () => {
  try {
    const payload = {
      name: name.value,
      remark: remark.value,
    };

    let response;

    if (id.value === "") {
      // Create
      response = await $fetch(
        `${config.public.apiBase}/api/productTypes/create`,
        {
          method: "POST",
          body: payload,
        }
      );
    } else {
      // Update
      response = await $fetch(
        `${config.public.apiBase}/api/productTypes/update/${id.value}`,
        {
          method: "PUT",
          body: { ...payload, id: id.value },
        }
      );
    }

    // Handle success response
    console.log(response);
    fetchData();
    closeModal();

    // Optionally, reset the input fields
    id.value = "";
    name.value = "";
    remark.value = "";

    // Add any additional success handling (like refreshing a list)
  } catch (error) {
    console.error("Error creating product type:", error);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถเพิ่มประเภทสินค้าได้. กรุณาลองอีกครั้ง.",
    });
  }
};

const update = (productType) => {
  id.value = productType.id;
  name.value = productType.name;
  remark.value = productType.remark;
  showModal.value = true;
};

const remove = async (id) => {
  try {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "ยืนยันการลบ",
      text: "คุณแน่ใจว่าต้องการลบประเภทสินค้านี้?",
      showCancelButton: true,
      showConfirmButton: true,
    });

    if (isConfirmed) {
      // Call the delete API
      await $fetch(`${config.public.apiBase}/api/productTypes/remove/${id}`, {
        method: "DELETE",
      });

      // Refresh the data after successful deletion
      fetchData();
    }
  } catch (error) {
    console.error("Error deleting product type:", error);

    // Show error message
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถลบประเภทสินค้าได้. กรุณาลองอีกครั้ง.",
    });
  }
};
</script>

<template>
  <div class="title">ประเภทสินค้า</div>
  <div class="p-4">
    <button class="btn btn-primary" @click="showModal = true">
      <i class="fa fa-plus"></i>เพิ่มประเภทสินค้า
    </button>
  </div>

  <table class="table table-bordered mt-3">
    <thead>
      <tr>
        <th>ชื่อ</th>
        <th>หมายเหตุ</th>
        <th width="110px"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(productType, index) in productTypes" :key="productType.id">
        <td>{{ productType.name }}</td>
        <td>{{ productType.remark }}</td>
        <td class="text-center">
          <button class="btn btn-primary me-1" @click="update(productType)">
            <i class="fa fa-pencil"></i>
          </button>
          <button class="btn btn-danger" @click="remove(productType.id)">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <Modal v-if="showModal" title="เพิ่มประเภทสินค้า" @close="closeModal">
    <div>ชื่อ</div>
    <input type="text" class="form-control" v-model="name" />

    <div class="mt-3">หมายเหตุ</div>
    <input type="text" class="form-control" v-model="remark" />

    <button class="btn btn-primary mt-3" @click="save">
      <i class="fa fa-check me-2"></i>บันทึก
    </button>
  </Modal>
</template>
