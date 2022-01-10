<!-- 404 -->
<template>
  <el-row>
    <el-col :span="12" :offset="6">
      <el-result
        icon="error"
        title="404"
        sub-title="您访问的页面不存在或权限不足，请联系管理员。"
      >
        <template #extra>
          <el-button type="primary" size="medium" @click="back">返回</el-button>
        </template>
      </el-result>
    </el-col>
  </el-row>
</template>
<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const back = () => {
  router.back();
};
</script>
<style scoped lang="less"></style>
