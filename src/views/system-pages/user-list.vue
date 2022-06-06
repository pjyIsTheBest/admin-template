<!-- 用户列表 -->
<template>
  <el-form :inline="true" :model="state.searchForm" size="small">
    <el-form-item label="账号">
      <el-input
        v-model="state.searchForm.account"
        placeholder="请输入账号"
      ></el-input>
    </el-form-item>
    <el-form-item label="用户名称">
      <el-input
        v-model="state.searchForm.name"
        placeholder="请输入用户名称"
      ></el-input>
    </el-form-item>
    <el-form-item label="联系方式">
      <el-input
        v-model="state.searchForm.phone"
        placeholder="请输入联系方式"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="add">添加用户</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="state.tableData" style="width: 100%" border>
    <el-table-column label="序号" width="60">
      <template #default="scope">
        <div>{{ scope.$index + 1 }}</div>
      </template>
    </el-table-column>
    <el-table-column label="账号" prop="account" />
    <el-table-column label="姓名" prop="name" />
    <el-table-column label="联系方式" prop="phone" />
    <el-table-column label="创建时间" prop="createdAt">
      <template #default="scope">
        {{ moment(scope.row.createdAt).format("YYYY-MM-DD") }}
      </template>
    </el-table-column>
    <el-table-column label="角色">
      <template #default="scope">
        <el-tag style="margin: 0 5px" size="small">{{
          scope.row.roleName
        }}</el-tag>
       
      </template>
    </el-table-column>
    <el-table-column label="是否可用">
      <template #default="scope">
        <span
          :style="{
            color: new Object({
              '01': '#67C23A',
              '02': '#F56C6C',
              '03': '#909399',
            })[scope.row.status],
          }"
        >
          {{
            new Object({ "01": "正常", "02": "锁定", "03": "禁用" })[
              scope.row.status
            ]
          }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="备注" prop="remarks" />
    <el-table-column fixed="right" label="操作" width="180">
      <template #default="scope">
        <el-button
          type="text"
          size="small"
          v-if="scope.row.status == '01'"
          @click="updateStatus(scope.row.id, '03')"
          >禁用</el-button
        >
        <el-button
          type="text"
          size="small"
          v-if="scope.row.status == '02'"
          @click="updateStatus(scope.row.id, '01')"
          >解锁</el-button
        >
        <el-button
          type="text"
          size="small"
          v-if="scope.row.status == '01'"
          @click="updateStatus(scope.row.id, '02')"
          >锁定</el-button
        >
        <el-button
          type="text"
          size="small"
          v-if="scope.row.status == '03'"
          @click="updateStatus(scope.row.id, '01')"
          >启用</el-button
        >
        <el-button type="text" size="small">
          <span style="color: #e6a23c" @click="edit(scope.row)">修改</span>
        </el-button>
        <el-button
          type="text"
          size="small"
          v-if="scope.row.id != 1"
          @click="del(scope.row)"
        >
          <span style="color: #f56c6c">删除</span>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    style="margin-top: 10px; text-align: right"
    background
    layout="prev, pager, next"
    :current-page="state.pagination.currentPage"
    :page-size="state.pagination.pageSize"
    :total="state.pagination.total"
    @current-change="currentChange"
  ></el-pagination>
  <UserAlert
    :show="state.showUserAlert"
    :data="state.userDetails"
    @cancel="
      () => {
        state.showUserAlert = false;
      }
    "
    @confirm="confirm"
  />
</template>
<script setup>
import { reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import api from "./api";
import UserAlert from "./components/user-alert.vue";
import moment from "moment";
const state = reactive({
  showUserAlert: false,
  userDetails: {},
  searchForm: {
    account: "",
    name: "",
    phone: "",
  },
  tableData: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 1,
  },
});
const onSubmit = () => {
  state.pagination.currentPage = 1;
  getData();
};
const currentChange = (page) => {
  state.pagination.currentPage = page;
  getData();
};
const getData = () => {
  state.tableData.length = 0;
  api
    .getUserList({
      name: state.searchForm.name,
      account: state.searchForm.account,
      phone: state.searchForm.phone,
      pageIndex: state.pagination.currentPage,
      pageSize: state.pagination.pageSize,
    })
    .then((res) => {
      if (res.code == 200) {
        state.tableData.push(...res.data);
        state.pagination.total = res.pages.total;
      } else {
        ElMessage.error(res.msg);
      }
    });
};
//新增
const add = () => {
  state.userDetails = {};
  state.showUserAlert = "add";
};
//修改
const edit = (row) => {
  state.userDetails = row;
  state.showUserAlert = "edit";
};
//弹窗确认
const confirm = () => {
  state.showUserAlert = false;
  getData();
};
//删除
const del = (data) => {
  ElMessageBox.confirm("删除后将不可恢复", "确认删除该用户吗", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      api.delUser(data.id).then((res) => {
        if (res.code == 200) {
          getData();
          ElMessage.success("删除成功！");
        } else {
          ElMessage.error(res.msg);
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};
//解锁、锁定、禁用
const updateStatus = (id, status) => {
  api.updateUserStatus(id, status).then((res) => {
    if (res.code == 200) {
      getData();
      ElMessage.success("操作成功！");
    } else {
      ElMessage.error(res.msg);
    }
  });
};

</script>
<style scoped lang="less"></style>
