<!-- 异步路由配置 -->
<template>
  <div>
    <el-tree
      ref="tree"
      :load="loadNode"
      :props="state.props"
      lazy
      draggable
      :allow-drop="allowDrop"
      @node-click="handleNodeClick"
      @node-drag-end="dropCallback"
      :expand-on-click-node="false"
      node-key="id"
      :default-expanded-keys="[0]"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              title="新增子节点"
              @click="addNode(node, data)"
              v-if="!data.isLeaf"
              ><el-icon class="el-icon--right" color="#409EFF"><Plus /></el-icon
            ></el-button>
            <el-button
              v-if="data.id != 0"
              type="text"
              title="修改当前节点"
              @click="editNode(node, data)"
              ><el-icon class="el-icon--right" color="#E6A23C"><Edit /></el-icon
            ></el-button>
            <el-button
              v-if="data.id != 0"
              type="text"
              title="删除当前节点和所有子节点"
              @click="delNode(node, data)"
              ><el-icon class="el-icon--right" color="#F56C6C"
                ><Delete /></el-icon
            ></el-button>
          </span>
        </div>
      </template>
    </el-tree>
  </div>
  <Alert
    :show="state.showAlert"
    :data="state.handleData"
    :allMenuData="state.allMenuData"
    @confirm="confirm"
    @cancel="
      () => {
        state.showAlert = false;
      }
    "
  />
</template>
<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Edit, Delete } from "@element-plus/icons";
import api from "./api/index";
import Alert from "./components/asyncRoute-alert.vue";

const state = reactive({
  showAlert: false,
  props: {
    label: "label",
    children: "children",
    isLeaf: "isLeaf",
  },
  handleData: {}, //缓存当前操作的节点原始数据
});

//加载子节点
const loadNode = async (node, resolve) => {
  if (node.level == 0) {
    return resolve([
      {
        label: "异步路由配置",
        id: 0,
        extData: { title: "异步路由配置", id: 0 },
        isLeaf: false,
      },
    ]);
  } else {
    let { data } = await api.getMenusByParentId(node.data.id);
    return resolve(
      data
        .sort((a, b) => a.order - b.order)
        .map((i) => {
          return {
            label: i.title,
            id: i.id,
            extData: i,
            isLeaf: i.type != 0,
          };
        })
    );
  }
};

//节点点击事件
const handleNodeClick = (data, node) => {
  console.log(data, node);
};
//节点拖拽判断 只允许同级拖拽
const allowDrop = (draggingNode, dropNode, type) => {
  if (
    draggingNode.level == dropNode.level &&
    draggingNode.data.parentId == dropNode.data.parentId
  ) {
    return type == "prev" || type == "next";
  } else {
    return false;
  }
};

//拖拽完成的提示
const dropCallback = (draggingNode, dropNode, type, event) => {
  if (type == "before" || type == "after") {
    api
      .drop({ draggingId: draggingNode.data.id, dropId: dropNode.data.id })
      .then((res) => {
        if (res.code == 200) {
          ElMessage.success("拖拽成功!");
        } else {
          draggingNode.parent.loaded = false;
          draggingNode.parent.loadData();
          ElMessage.error(res.msg);
        }
      });
  } else {
    ElMessage.warning("只允许同级拖拽！");
  }
};
let handleNode = null; //缓存操作的节点数据
//新增子节点
const addNode = (node, data) => {
  handleNode = node;
  state.handleData = data.extData;
  state.showAlert = "add";
};
//修改当前节点
const editNode = (node, data) => {
  handleNode = node;
  state.handleData = data.extData;
  state.showAlert = "edit";
};
//删除节点
const delNode = (node, data) => {
  ElMessageBox.confirm(
    "删除后该路由下的所有子路由都将一并被删除",
    "确认删除该路由节点吗",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      api.delMenu(data.id).then((res) => {
        if (res.code == 200) {
          node.parent.loaded = false;
          node.parent.loadData();
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
//弹框的确定事件
const confirm = () => {
  if (state.showAlert == "add") {
    handleNode.loaded = false;
    handleNode.loadData();
  }
  if (state.showAlert == "edit") {
    handleNode.parent.loaded = false;
    handleNode.parent.loadData();
  }
  state.showAlert = false;
};
</script>

<style scoped lang="less">
.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
