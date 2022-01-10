<template>
  <el-container
    style="width: 100%; height: 100%; background-color: #f0f0f0"
    direction="horizontal"
  >
    <el-menu
      class="layout-menu"
      :default-active="activeMenu"
      :collapse="state.isCollapse"
      @select="menuHandle"
    >
      <div class="logo">
        <strong>管理系统模板</strong>
      </div>
      <el-menu-item index="home"
        ><el-icon><House /></el-icon
        ><span style="margin-left: 5px">首页</span></el-menu-item
      >
      <MenuItem :tree="state.tree" />
    </el-menu>
    <el-container>
      <el-header
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #fff;
        "
      >
        <el-button
          type="text"
          @click="() => (state.isCollapse = !state.isCollapse)"
        >
          <el-icon>
            <Fold v-if="!state.isCollapse" />
            <Expand v-else />
          </el-icon>
        </el-button>

        <el-dropdown>
          <span class="el-dropdown-link"
            >{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i
          ></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toChangePwd">修改密码</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main style="background-color: #fff; padding: 0">
        <el-space
          style="
            width: 100%;
            border-top: 1px solid #e6e6e6;
            border-bottom: 1px solid #e6e6e6;
            padding: 5px 10px;
          "
        >
          <el-tag
            v-for="(tag, index) in tags"
            :key="tag.name"
            :closable="index != 0"
            style="cursor: pointer"
            :effect="tag.name == path ? 'dark' : 'plain'"
            @click="clickTag(tag)"
            @close="closeTag(tag, index)"
          >
            {{ tag.title }}
          </el-tag>
        </el-space>

        <div style="padding: 0 10px">
          <el-breadcrumb style="margin: 10px 0" separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">
              <el-icon><House /></el-icon>
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="i in state.breadcrumb"
              :to="{ path: i.path }"
              :key="i.id"
              >{{ i.title }}</el-breadcrumb-item
            >
          </el-breadcrumb>
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import api from "./api";
import { reactive, computed, watch, watchEffect, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { House, Fold, Expand } from "@element-plus/icons";
import MenuItem from "./components/layout-menu.vue";

const router = useRouter(); //路由实例
const route = useRoute(); //路由信息
const store = useStore(); //
//将数组转换为树形结构
const initTree = (data, parentId) => {
  return data
    .filter((i) => i.parentId == parentId && i.menu)
    .sort((a, b) => a.order - b.order)
    .map((i) => {
      return {
        type: i.type,
        name: i.name,
        title: i.title,
        path: i.path,
        id: i.id,
        component: i.component || null,
        order: i.order,
        parentId: i.parentId,
        children: initTree(data, i.id),
      };
    });
};
//找爸爸
const findParent = (data, parentId) => {
  let [parent] = data.filter((i) => i.id == parentId);
  if (parent) {
    return [parent].concat(findParent(data, parent.parentId));
  } else {
    return [];
  }
};
//保存接口返回的原始菜单数据
let menuData = computed(() => store.state.menu.menu);
//当前路由名称
let path = computed(() => route.name);
let activeMenu = computed(() => {
  let [r] = menuData.value.filter((i) => i.name == path.value);
  return r ? String(r.id) : "home";
});
//tag标签
const tags = reactive([{ title: "首页", name: "home", menu: true, type: 1 }]);
const state = reactive({
  isCollapse: false,
  tree: initTree(menuData.value, 0), //菜单树
  breadcrumb: [], //面包屑数据,
});
//用户名
let userName = computed(() => store.state.user.userInfo.name);

//点击菜单
const menuHandle = (index) => {
  if (index == "home") {
    router.push({ name: "home" });
    return;
  }
  let [currentMenuItem] = menuData.value.filter((i) => i.id == index);
  if (currentMenuItem.type == 1) {
    router.push({ name: currentMenuItem.name });
  } else {
    window.open(currentMenuItem.path);
  }
};
//修改密码
const toChangePwd = ()=>{
  router.push({name:'updatePwd'})
}
//退出登录
const logout = () => {
  store.commit("menu/logOut");
};
//标签点击事件
const clickTag = (tag) => {
  router.push({ name: tag.name });
};
//删除标签
const closeTag = (tag, index) => {
  let tagArr = toRaw(tags);
  if (index >= 1) {
    tags.splice(index, 1);
    if (path.value == tag.name) {
      router.push({ name: tagArr[index - 1].name });
    }
  } else {
    router.push({ name: "home" });
  }
};
watchEffect(() => {
  //根据路由变化更新面包屑数据
  state.breadcrumb.length = 0;
  let [me] = menuData.value.filter((i) => i.name == path.value);
  if (me) {
    let arr = [me].concat(findParent(menuData.value, me.parentId));
    arr.reverse().forEach((ele) => {
      state.breadcrumb.push(ele);
    });
    let tagArr = toRaw(tags);
    if (!tagArr.map((i) => i.name).includes(path.value) && me.menu) {
      tags.push({
        title: me.title,
        name: path.value,
      });
    }
  }
});
</script>
<style scoped lang="less">
.logo {
  width: 100%;
  text-align: center;
  line-height: 60px;
  overflow: hidden;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
}
.layout-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>
