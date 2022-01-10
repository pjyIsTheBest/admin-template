<!-- 分配权限 -->
<template>
  <el-form label-width="120px" size="small">
    <el-form-item label="角色名称：">
      <el-input :value="state.roleInfo.name" disabled />
    </el-form-item>
    <el-form-item label="分配菜单权限：">
      <el-tree
        ref="tree"
        style="margin-top: 8px"
        :data="state.tree"
        show-checkbox
        node-key="id"
        :check-strictly="true"
        :default-expand-all="true"
        @check-change="checkChange"
      ></el-tree>
    </el-form-item>
    <el-form-item>
      <el-button @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { reactive, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import api from "./api";

const route = useRoute();
const router = useRouter();
const tree = ref(null);
const state = reactive({
  roleInfo: { name: "" },
  tree: [],
});
const initTree = (arr, parentId) => {
  return arr
    .filter((i) => i.parentId == parentId)
    .sort((a, b) => a.order - b.order)
    .map((i) => {
      return {
        label: i.title,
        id: i.id,
        extData: i,
        children: initTree(arr, i.id),
      };
    });
};
//查询所有菜单
api.getAllMenus().then(async (res) => {
  if (res.code == 200) {
    let d = initTree(res.data, 0);
    state.tree.push(...d);
    await nextTick();
    getRoleInfo();
  } else {
    ElMessage.error(res.msg);
  }
});
//查询角色信息
const getRoleInfo = () => {
  api.getRoleById(route.query.id).then((res) => {
    if (res.code == 200) {
      state.roleInfo = { ...res.data };
      if (res.data.menuIds) {
        let menuIds = res.data.menuIds.split(",").map((i) => Number(i));
        //勾选当前角色所绑定的菜单
        tree.value.setCheckedKeys(menuIds);
      }
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//节点选择事件
const checkChange = (data, checked) => {
  if (checked) {
    //选中则父节点必须选中
    tree.value.setChecked(data.extData.parentId, true, false);
  } else {
    //取消则子节点必须取消
    data.children.forEach((element) => {
      tree.value.setChecked(element.id, false, true);
    });
  }
};
//提交
const submit = () => {
  let checkedKeys = tree.value.getCheckedKeys();
  api.updateMenuIds(route.query.id, checkedKeys.join()).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.msg);
      router.push({ name: "roleList" });
    } else {
      ElMessage.error(res.msg);
    }
  });
};
</script>
<style scoped lang="less"></style>
