<template>
  <div class="home-container">
    <!-- 这里的标题栏将固定在顶部 -->
    <van-nav-bar title="车辆管理系统" />

    <div class="button-group">
      <van-button type="primary" block size="large" @click="navigateToEdit"> 维修管理 </van-button>

      <van-button type="default" block size="large" @click="navigateToView"> 记录查看 </van-button>
    </div>

    <van-tabbar route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/edit" icon="edit">编辑</van-tabbar-item>
      <van-tabbar-item to="/view" icon="file-text-o">记录</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useModelStore } from '@/store/modelStore'

const router = useRouter()
const store = useModelStore()

// 导航到车型编辑页面
const navigateToEdit = () => {
  router.push({ name: 'repairManageList' })
}

// 导航到记录查看页面
const navigateToView = () => {
  router.push('/view')
}

// 初始化加载数据
const initializeData = async () => {
  try {
    // 加载当天的数据作为默认
    const today = new Date().toISOString().split('T')[0]
    await store.fetchModels(today)
  } catch (error) {
    console.error('初始化数据失败:', error)
  }
}

// 组件挂载时初始化数据
initializeData()
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* 添加顶部内边距，防止内容被悬浮标题栏遮挡 */
  padding-top: 46px;
}

/* 将标题栏设置为固定定位 */
.home-container :deep(.van-nav-bar) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 其他样式保持不变 */
.button-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px;
}

.van-button--large {
  font-size: 18px;
  height: 50px;
}
</style>
