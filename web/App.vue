<template>
  <el-config-provider :locale="locale">
    <SshdLog />
  </el-config-provider>
</template>

<script setup>
import { ref } from "vue";
import SshdLog from "./components/sshd-log/index.vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const locale = ref(zhCn);
</script>

<style scoped></style>
