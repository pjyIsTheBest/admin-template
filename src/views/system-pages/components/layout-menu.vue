<!-- 菜单 -->
<template>
  <template v-for="item in props.tree" :key="item.id">
    <el-sub-menu v-if="item.children.length > 0" :index="item.title">
      <template #title
        ><el-icon><Folder-opened /></el-icon
        ><span style="margin-left: 5px">{{ item.title }}</span></template
      >
      <layout-menu :tree="item.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="String(item.id)">
      <el-icon>
        <Document v-if="item.type == 1" />
        <Link v-if="item.type == 2" />
      </el-icon>
      <span style="margin-left: 5px">{{ item.title }}</span>
    </el-menu-item>
  </template>
</template>
<script setup>
import { FolderOpened, Document, Link } from "@element-plus/icons";
const props = defineProps({
  tree: {
    type: Array,
    default: [],
  },
});
</script>
<style scoped lang="less"></style>
