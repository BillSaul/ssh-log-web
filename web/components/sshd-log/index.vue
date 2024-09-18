<template>
  <el-card class="card">
    <template #header>
      <div class="card-header">
        <span>SSH 登录日志</span>
      </div>
    </template>
    <div class="card-body">
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item label="登录状态">
          <el-select
            v-model="formData.status"
            clearable
            placeholder="全部"
            @change="searchChange"
          >
            <el-option label="成功" :value="true" />
            <el-option label="失败" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="日志范围">
          <el-date-picker
            v-model="formData.dateRange"
            type="datetimerange"
            unlink-panels
            start-placeholder="起始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="searchChange"
            :default-time="[
              new Date(2000, 1, 1, 0, 0, 0),
              new Date(2000, 1, 1, 23, 59, 59),
            ]"
          />
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="id" show-overflow-tooltip />
        <el-table-column prop="ip" label="登录ip" show-overflow-tooltip />
        <el-table-column
          prop="address"
          label="登录地区"
          show-overflow-tooltip
        />
        <el-table-column prop="port" label="源端口" show-overflow-tooltip />
        <el-table-column prop="method" label="登录方式" show-overflow-tooltip />
        <el-table-column prop="user" label="登录用户" show-overflow-tooltip />
        <el-table-column label="登录状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status">成功</el-tag>
            <el-tag type="danger" v-else>失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="登录时间" show-overflow-tooltip />
        <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next"
        :total="total"
        v-model:current-page="formData.pageNum"
        @current-change="getSSHData"
      >
        <template #total>总计</template>
      </el-pagination>
    </div>
  </el-card>
</template>

<script setup>
import { getSSHLogs } from "@/api/ssh";
import dayjs from "dayjs";
import { ref } from "vue";

const tableData = ref([]); // 表格数据
const total = ref(0); // 表格数据总数
const loading = ref(false); // 加载状态
// 查询表单数据
const formData = ref({
  pageNum: 1,
  pageSize: 10,
  status: undefined,
  dateRange: [
    dayjs().startOf("day").subtract(6, "day").format("YYYY-MM-DD HH:mm:ss"),
    dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
  ],
});
// 时间快捷选择
const shortcuts = [
  {
    text: "近一周",
    value: () => {
      return [
        dayjs().startOf("day").subtract(6, "day").format("YYYY-MM-DD HH:mm:ss"),
        dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      ];
    },
  },
  {
    text: "近30天",
    value: () => {
      return [
        dayjs()
          .startOf("day")
          .subtract(29, "day")
          .format("YYYY-MM-DD HH:mm:ss"),
        dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      ];
    },
  },
];

// 获取SSH登录日志
const getSSHData = async (pageNum = 1) => {
  formData.value.pageNum = pageNum;
  loading.value = true;
  const { data } = await getSSHLogs(formData.value);
  loading.value = false;
  if (data.code === 200) {
    tableData.value = data.data.list;
    total.value = data.data.total;
  }
};
getSSHData();

// 查询条件变化
const searchChange = () => {
  getSSHData(1);
};
</script>

<style scoped>
.card {
  width: 100%;
  box-sizing: border-box;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-body > *:not(:first-child) {
  margin-top: 16px;
}

.pagination {
  margin-left: auto;
}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
