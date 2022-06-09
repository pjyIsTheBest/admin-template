<!-- 角色列表 -->
<template>
  <el-form :inline="true" :model="state.searchForm" size="small">
   <div style="display:inline-block" v-btnAuth="`role-find`">
    <el-form-item label="名称">
      <el-input
        v-model="state.searchForm.name"
        placeholder="请输入角色名称"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
   </div>
    <el-form-item>
      <el-button @click="add" v-btnAuth="`role-add`">添加角色</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="state.tableData" style="width: 100%" border>
    <el-table-column label="序号" width="60">
      <template #default="scope">
        <div>{{ scope.$index + 1 }}</div>
      </template>
    </el-table-column>
    <el-table-column label="角色名称" prop="name" />
    <el-table-column label="创建时间" prop="createdAt">
      <template #default="scope">
        {{ moment(scope.row.createdAt).format("YYYY-MM-DD") }}
      </template>
    </el-table-column>
    <el-table-column label="是否可用">
      <template #default="scope">
        <el-switch
          v-model="scope.row.status"
          :active-value="'01'"
          :inactive-value="'02'"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :inline-prompt="true"
          active-text="是"
          inactive-text="否"
          @change="(val) => changeStatus(val, scope.row.id)"
        />
      </template>
    </el-table-column>
    <el-table-column label="备注" prop="remarks" />
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button type="text" size="small" v-btnAuth="`role-menu2role`">
          <span style="color: #909399" @click="menu2role(scope.row)"
            >分配权限</span
          >
        </el-button>
        <el-button type="text" size="small" @click="edit(scope.row)" v-btnAuth="`role-update`">
          <span style="color: #e6a23c">修改</span>
        </el-button>
        <el-button
          type="text"
          size="small"
          v-if="scope.row.id != 1"
           v-btnAuth="`role-delete`"
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
  <RoleAlert
    :show="state.showAlert"
    :data="state.roleDetails"
    @cancel="
      () => {
        state.showAlert = false;
      }
    "
    @confirm="confirm"
  />
</template>
<script setup>
import { reactive, onMounted, h } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import moment from "moment";
import api from "./api";
import RoleAlert from "./components/role-alert.vue";
const state = reactive({
  showAlert: false,
  roleDetails: {},
  searchForm: {
    name: "",
  },
  tableData: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 1,
  },
});

const router = useRouter();

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
    .getRoleList({
      name: state.searchForm.name,
      pageIndex: state.pagination.currentPage,
      pageSize: state.pagination.pageSize,
    })
    .then((res) => {
      if (res.code == 200) {
        state.tableData.push(...res.data);
        state.pagination.total = res.total;
      } else {
        ElMessage.error(res.msg);
      }
    });
};
onMounted(() => {
  getData();
});
//添加
const add = () => {
  state.roleDetails = {};
  state.showAlert = "add";
};
//修改
const edit = (data) => {
  state.roleDetails = data;
  state.showAlert = "edit";
};
//确认
const confirm = () => {
  state.showAlert = false;
  getData();
};
//删除
const del = (data) => {
  ElMessageBox.confirm("删除后将不可恢复", "确认删除该角色吗", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      api.delRole(data.id).then((res) => {
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
//禁用、解禁
const changeStatus = (val, id) => {
  api.updateRoleStatus(val, id).then((res) => {
    if (res.code == 200) {
      getData();
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//分配权限
const menu2role = (data) => {
  router.push({ name: "menu2role", query: { id: data.id } });
};
</script>
<style scoped lang="less"></style>
