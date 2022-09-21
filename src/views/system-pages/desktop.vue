<!-- 桌面 -->
<template>
  <el-container style="width: 100%; height: 100%; background-color: #f0f0f0">
    <el-header
      style="
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #c6e2ff;
        border-bottom: 1px solid #f1f1f1;
      "
    >
      
      <el-button type="text" @click="() => (showDrawer = !showDrawer)">
        <el-icon>
          <Fold v-if="!showDrawer" />
          <Expand v-else />
        </el-icon>
      </el-button>
      <h3>云桌面</h3>

      <el-dropdown>
        <span class="el-dropdown-link"
          >{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i
        ></span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <el-main style="background-color: #fff; padding: 10">
      <div class="desktop">
        <div
          class="menu"
          v-for="item in menus"
          :key="item.id"
          @click="openSystem(item.id)"
        >
          {{ item.title }}
        </div>
      </div>
    </el-main>
  </el-container>
  <el-drawer :size="size" :modal="true" v-model="showDrawer" title="I am the title" direction="btt">
    <span>Hi, there!</span>
  </el-drawer>
</template>
<script setup>
import { Fold, Expand } from "@element-plus/icons";
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter(); //路由实例
const store = useStore(); //
const showDrawer = ref(false);
const size = ref(document.body.offsetHeight - 60);
//用户名
let userName = computed(() => store.state.user.userInfo.name);
const menus = reactive([
  { id: 1, title: "系统管理" },
  { id: 2, title: "社区管理" },
  { id: 3, title: "设备管理" },
  { id: 4, title: "物业管理" },
  { id: 5, title: "客户管理" },
]);
const logout = () => {
  store.commit("menu/removeMenuData");
  store.commit("user/removeUserInfo");
  router.push("/login");
};
const openSystem = () => {
  router.push("/home");
};
</script>
<style scoped lang='less'>
.desktop {
  width: 100%;
  height: 100%;
  overflow: hidden auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  .menu {
    width: 350px;
    height: 200px;
    border-radius: 10px;
    border: 1px solid #f1f1f1;
    margin: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #e6a23c;
    color: #fff;
    transition: all 0.3s;
    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>