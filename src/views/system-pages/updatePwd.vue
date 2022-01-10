<!-- 修改密码 -->
<template>
  <el-row>
    <el-col :span="12">
      <el-form
        size="small"
        label-width="120px"
        ref="updateForm"
        :model="state.form"
        :rules="state.rules"
      >
        <el-form-item label="原密码" prop="oldPwd">
          <el-input
            type="password"
            v-model="state.form.oldPwd"
            placeholder="请输入原密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input
            type="password"
            v-model="state.form.newPwd"
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd">
          <el-input
            type="password"
            v-model="state.form.confirmPwd"
            placeholder="请再次输入新密码"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="submit">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script setup>
import { reactive, ref } from "vue";
import api from "./api";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
const store = useStore();
const updateForm = ref(null);
const state = reactive({
  form: {
    oldPwd: "",
    newPwd: "",
    confirmPwd: "",
  },
  rules: {
    oldPwd: [
      {
        required: true,
        message: "请输入原密码",
        trigger: "blur",
      },
      {
        min: 6,
        max: 20,
        message: "请填写6-20位密码",
        trigger: "blur",
      },
    ],
    newPwd: [
      {
        required: true,
        message: "请输入新密码",
        trigger: "blur",
      },
      {
        min: 6,
        max: 20,
        message: "请填写6-20位密码",
        trigger: "blur",
      },
    ],
    confirmPwd: [
      {
        required: true,
        message: "请再次输入新密码",
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) => {
          if (value != state.form.newPwd) {
            callback(new Error("两次密码不一致"));
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ],
  },
});
const submit = () => {
  updateForm.value.validate((valid) => {
    if (valid) {
      api
        .changePwd({ newPwd: state.form.newPwd, oldPwd: state.form.oldPwd })
        .then((res) => {
          if (res.code == 200) {
            ElMessage.success("修改密码成功，请重新登录");
            store.commit("menu/logOut");
          } else {
            ElMessage.error(res.msg);
          }
        });
    } else {
      return false;
    }
  });
};
</script>
<style scoped lang="less"></style>
