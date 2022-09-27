<template>
  <el-card class="login-card">
    <template #header>
      <div class="card-header">
        <span>登录</span>
      </div>
    </template>
    <el-form
      ref="loginForm"
      :model="state.form"
      :rules="state.rules"
      label-width="120px"
    >
      <el-form-item label="账号" prop="account">
        <el-input
          v-model="state.form.account"
          placeholder="请输入登录账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="state.form.password"
          placeholder="请输入密码"
          @keyup.enter="onSubmit"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox
          v-model="state.form.remember"
          label="记住密码"
        ></el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <a class="beian" target="_blank" href="https://beian.miit.gov.cn/"
    >苏ICP备2022026147号</a
  >
  <SlideValidate
    :show="state.showSlideValidate"
    @success="validateSuccess"
    @close="closeSlideValidate"
  />
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import SlideValidate from "../../components/slideValidate.vue";
import api from "./api/index";
const loginForm = ref(null);
const router = useRouter();
const store = useStore(); //
const state = reactive({
  showSlideValidate: false,
  form: {
    account: "test",
    password: "1111qqqq",
    remember: true,
  },
  rules: {
    account: [
      {
        required: true,
        message: "请输入登录账号",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "请输入密码",
        trigger: "blur",
      },
    ],
  },
});
const onSubmit = () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      state.showSlideValidate = true;
    } else {
      return false;
    }
  });
};
//滑动验证成功
const validateSuccess = () => {
  state.showSlideValidate = false;
  login();
};
//关闭验证
const closeSlideValidate = () => {
  state.showSlideValidate = false;
};
const login = () => {
  api.login(state.form).then((res) => {
    if (res.code == 200) {
      store.commit("user/saveUserInfo", res.data);
      ElMessage.success(res.msg);
    } else {
      ElMessage.error(res.msg);
    }
  });
};
</script>

<style scoped lang="less">
.login-card {
  width: 560px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.beian {
  display: block;
  width: 100%;
  line-height: 40px;
  color: rgba(0, 0, 0, 0.8);
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 10px;
}
</style>
