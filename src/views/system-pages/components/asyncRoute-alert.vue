<!-- 新增、修改菜单 -->
<template>
  <el-dialog v-model="state.visible" :title="title" @close="cancel">
    <el-form
      ref="form"
      :model="state.form"
      :rules="state.rules"
      label-width="180px"
    >
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="state.form.type"
          placeholder="请选择类型"
          style="width: 100%"
        >
          <el-option label="菜单标题（存在下级菜单页）" :value="0"></el-option>
          <el-option label="菜单页（无下级菜单）" :value="1"></el-option>
          <el-option label="外部链接" :value="2"></el-option>
          <el-option label="按钮" :value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标题" prop="title">
        <el-input v-model="state.form.title" placeholder="菜单标题"></el-input>
      </el-form-item>
      <el-form-item
        label="地址"
        prop="path"
        v-if="state.form.type == 2 || state.form.type == 1"
      >
        <el-input
          v-model="state.form.path"
          placeholder="显示在浏览器地址栏的url,以'/'开头,外部链接以'http'开头"
        >
          <template #prepend v-if="state.form.type == 1">{{
            state.origin
          }}</template>
        </el-input>
      </el-form-item>
      <template v-if="state.form.type == 1">
        <el-form-item label="路由名称" prop="name">
          <el-input
            v-model="state.form.name"
            placeholder="请保持唯一性，否则会覆盖其他路由从而导致路由失效"
          ></el-input>
        </el-form-item>

        <el-form-item label="vue文件位置" prop="component">
          <el-input
            v-model="state.form.component"
            placeholder="相对src/views下的路径，如'system-page/demo.vue'"
          >
            <template #prepend>src/views/</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否显示在菜单栏" prop="menu">
          <el-radio-group v-model="state.form.menu">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否为layout子路由" prop="layout">
          <el-radio-group v-model="state.form.layout">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否校验登录token" prop="validate">
          <el-radio-group v-model="state.form.validate">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <el-form-item label="唯一key" prop="name" v-if="state.form.type == 3">
        <el-input
          v-model="state.form.name"
          placeholder="请确保key值的唯一性"
        ></el-input>
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
import { ref, reactive, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import api from "../api";
const isURL = (str_url) => {
  // 验证url
  let strRegex =
    "^((https|http|ftp|rtsp|mms)?://)" +
    "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + // ftp的user@
    "(([0-9]{1,3}\.){3}[0-9]{1,3}" + // IP形式的URL- 199.194.52.184
    "|" + // 允许IP和DOMAIN（域名）
    "([0-9a-z_!~*'()-]+\.)*" + // 域名- www.
    "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." + // 二级域名
    "[a-z]{2,6})" + // first level domain- .com or .museum
    "(:[0-9]{1,4})?" + // 端口- :80
    "((/?)|" + // a slash isn't required if there is no file name
    "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  let re = new RegExp(strRegex);
  return re.test(str_url);
};
const router = useRouter();
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
  allMenuData: {
    type: Array,
    default: [],
  },
});
const state = reactive({
  origin: location.origin,
  visible: false,
  form: {
    type: 1,
    title: "",
    name: "",
    path: "",
    component: "",
    menu: 1,
    layout: 1,
    validate: 1,
  },
  rules: {
    type: [
      {
        required: true,
        message: "请选择类型",
        trigger: "change",
      },
    ],
    title: [
      {
        required: true,
        message: "请输入标题",
        trigger: "blur",
      },
    ],
    name: [
      {
        required: true,
        message: "请输入路由名称并确保唯一性",
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) => {
          if (
            value != props.data.name &&
            (router.hasRoute(value) ||
              props.allMenuData
                .filter((i) => i.type == 1)
                .map((i) => i.name)
                .includes(value))
          ) {
            callback(new Error("路由名称已存在！"));
          }
          callback();
        },
        trigger: "blur",
      },
    ],
    path: [
      {
        required: true,
        message: "请输入url地址",
        trigger: "blur",
      },
      {
        validator: (rule, value, callback) => {
          if (state.form.type == 2) {
            if (!value) {
              callback("请输入url地址");
            }
            if (!isURL(value)) {
              callback("请输入以'http'开头的合法url");
            }
          } else {
            if (!value) {
              callback("请输入url地址");
            }
            if (value.substr(0, 1) != "/") {
              callback("请输入以'/'开头的url");
            }
          }
          callback();
        },
        trigger: "blur",
      },
    ],
    component: [
      {
        required: true,
        message: "请输入vue文件相对src的路径",
        trigger: "blur",
      },
    ],
    menu: [
      {
        required: true,
        message: "请选择是否显示在菜单栏",
        trigger: "change",
      },
    ],
    layout: [
      {
        required: true,
        message: "请选择是否为layout子路由",
        trigger: "change",
      },
    ],
    validate: [
      {
        required: true,
        message: "请选择是否校验登录token",
        trigger: "change",
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
watch(
  () => props.show,
  (val) => {
    if (val) {
      state.visible = props.show != false;
      if (val == "edit") {
        state.form = {
          type: props.data.type,
          title: props.data.title || "",
          name: props.data.name || "",
          path: props.data.path,
          component: props.data.component || "",
          menu: props.data.menu,
          layout: props.data.layout,
          validate: props.data.validate,
        };
      }
    } else {
      state.form = {
        type: 1,
        title: "",
        name: "",
        path: "",
        component: "",
        menu: 1,
        layout: 1,
        validate: 1,
      };
    }
  }
);
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
//取消
const cancel = () => {
  state.visible = false;
  emit("cancel");
};
//新增
const add = () => {
  let data = {
    type: state.form.type,
    name: state.form.name || null,
    title: state.form.title,
    path: state.form.path,
    component: state.form.component,
    parentId: props.data.id,
    menu: state.form.menu,
    layout: state.form.layout,
    validate: state.form.validate,
  };
  api.addMenu(data).then((res) => {
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
    type: state.form.type,
    name: state.form.name || null,
    title: state.form.title,
    path: state.form.path,
    component: state.form.component,
    id: props.data.id,
    menu: state.form.menu,
    layout: state.form.layout,
    validate: state.form.validate,
  };
  api.updateMenu(data).then((res) => {
    if (res.code == 200) {
      state.visible = false;
      ElMessage.success("修改成功！");
      emit("confirm");
    } else {
      ElMessage.error(res.msg);
    }
  });
};
</script>
<style scoped lang="less"></style>
