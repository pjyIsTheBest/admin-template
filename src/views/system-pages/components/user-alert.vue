<!-- 新增、修改用户 -->
<template>
  <el-dialog v-model="state.visible" :title="title" @close="cancel">
    <el-form
      ref="form"
      :model="state.form"
      :rules="state.rules"
      label-width="180px"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="state.form.account" placeholder="请填写账号" />
      </el-form-item>
      <template v-if="props.show == 'add'">
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="state.form.password"
            placeholder="请填写密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            type="password"
            v-model="state.form.confirmPwd"
            placeholder="请确认密码"
          />
        </el-form-item>
      </template>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="state.form.name" placeholder="请填写姓名" />
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="state.form.phone" placeholder="请填写联系方式" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="state.form.role" placeholder="请选择角色">
          <el-option
            v-for="i in state.roleOptions"
            :label="i.name"
            :value="i.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          v-model="state.form.remarks"
          placeholder="请填写备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import api from "../api";
const props = defineProps({
  show: {
    type: [Boolean, String],
    default: false,
    required: true,
    validator: (value) => ["add", "edit", false].includes(value),
  },
  data: {
    type: Object,
    required: false,
    default: {},
  },
});
const state = reactive({
  visible: false,
  form: {
    account: "",
    password: "",
    confirmPwd: "",
    name: "",
    phone: "",
    role: null,
    remarks: "",
  },
  rules: {
    account: [
      {
        required: true,
        message: "请填写账号",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "请填写密码",
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
        message: "请确认密码",
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) => {
          if (value != state.form.password) {
            callback(new Error("两次密码不一致"));
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ],
    name: [
      {
        required: true,
        message: "请填写姓名",
        trigger: "blur",
      },
    ],
    phone: [
      {
        required: true,
        message: "请填写联系方式",
        trigger: "blur",
      },
    ],
    role: [
      {
        required: true,
        message: "请选择角色",
        trigger: "change",
      },
    ],
  },
  roleOptions: [],
});
const emit = defineEmits(["confirm", "cancel"]);

const form = ref(null);

api.getRoleOptions().then((res) => {
  if (res.code == 200) {
    state.roleOptions.push(...res.data);
    emit("confirm");
  } else {
    ElMessage.error(res.msg);
  }
});

let title = computed(() => {
  if (props.show == "add") {
    return "新增";
  }
  if (props.show == "edit") {
    return "修改";
  }
  return "";
});
//取消
const cancel = () => {
  state.visible = false;
  emit("cancel");
};
//确认
const confirm = () => {
  form.value.validate((valid) => {
    if (valid) {
      if (props.show == "add") {
        add();
      }
      if (props.show == "edit") {
        edit();
      }
      // emit("confirm", state.form);
    } else {
      return false;
    }
  });
};
//新增
const add = () => {
  let data = {
    account: state.form.account,
    password: state.form.password,
    phone: state.form.phone,
    role: state.form.role,
    name: state.form.name,
    remarks: state.form.remarks,
  };
  api.addUser(data).then((res) => {
    if (res.code == 200) {
      state.visible = false;
      ElMessage.success("新增成功！");
      emit("confirm");
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//修改
const edit = () => {
  let data = {
    account: state.form.account,
    phone: state.form.phone,
    role: state.form.role,
    name: state.form.name,
    remarks: state.form.remarks,
    id: props.data.id,
  };

  api.updateUser(data).then((res) => {
    if (res.code == 200) {
      state.visible = false;
      ElMessage.success("修改成功！");
      emit("confirm");
    } else {
      ElMessage.error(res.msg);
    }
  });
};
watch(
  () => props.show,
  (val) => {
    if (val) {
      state.visible = val != false;
      if (val == "edit") {
        state.form.account = props.data.account;
        state.form.name = props.data.name;
        state.form.phone = props.data.phone;
        state.form.role = props.data.role;
        state.form.remarks = props.data.remarks;
      } else {
        state.form.account = "";
        state.form.password = "";
        state.form.confirmPwd = "";
        state.form.name = "";
        state.form.phone = "";
        state.form.role = null;
        state.form.remarks = "";
      }
    }
  }
);
</script>
<style scoped lang="less"></style>
