<!-- 新增、修改角色 -->
<template>
  <el-dialog v-model="state.visible" :title="title" @close="cancel">
    <el-form
      ref="form"
      :model="state.form"
      :rules="state.rules"
      label-width="180px"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="state.form.name" placeholder="请填写角色名称" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="state.form.remarks" placeholder="请填写备注" />
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
    name: "",
    remarks: "",
  },
  rules: {
    name: [
      {
        required: true,
        message: "请填写角色名称",
        trigger: "blur",
      },
    ],
  },
});
const emit = defineEmits(["confirm", "cancel"]);

const form = ref(null);

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
    name: state.form.name,
    remarks: state.form.remarks,
  };
  api.addRole(data).then((res) => {
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
    name: state.form.name,
    remarks: state.form.remarks,
    id: props.data.id,
  };

  api.updateRole(data).then((res) => {
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
        state.form.name = props.data.name;
        state.form.remarks = props.data.remarks;
      } else {
        state.form.name = "";
        state.form.remarks = "";
      }
    }
  }
);
</script>
<style scoped lang="less"></style>
