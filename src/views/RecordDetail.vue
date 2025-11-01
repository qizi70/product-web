<template>
  <div class="detail-container">
    <!-- 这里的标题栏将固定在顶部 -->
    <van-nav-bar title="记录详情" left-text="返回" left-arrow @click-left="$router.back" />

    <!-- 车型基本信息 -->
    <van-cell-group inset>
      <van-cell title="车型" :value="model?.name || '未知车型'" />
      <van-cell title="日期" :value="formatDate(model?.date)" />
      <van-cell title="车架号" :value="model?.vin || '未知'" />
    </van-cell-group>

    <van-divider>商品明细</van-divider>

    <!-- 商品列表 -->
    <div v-for="(product, index) in model?.products" :key="product.id" class="product-item">
      <van-cell :title="`商品 ${index + 1}`" title-class="product-title" />
      <van-field label="名称" :model-value="product.name" readonly />
      <van-field label="规格" :model-value="product.spec" readonly />
      <van-field label="数量" :model-value="product.quantity" readonly />
      <van-field label="成本价" :model-value="`¥${(product.costPrice || 0).toFixed(2)}`" readonly />
      <van-field label="售价" :model-value="`¥${(product.salePrice || 0).toFixed(2)}`" readonly />
      <van-field
        label="利润"
        :model-value="`¥${((product.salePrice || 0) - (product.costPrice || 0) * (product.quantity || 0)).toFixed(2)}`"
        readonly
        :value-class="
          (product.salePrice || 0) > (product.costPrice || 0)
            ? 'profit-positive'
            : 'profit-negative'
        "
      />
    </div>

    <van-divider>统计信息</van-divider>

    <!-- 统计信息 -->
    <van-cell-group inset>
      <van-cell title="总成本" :value="`¥${totalCost.toFixed(2)}`" />
      <van-cell title="总收入" :value="`¥${totalIncome.toFixed(2)}`" />
      <van-cell title="总利润" :value="`¥${totalProfit.toFixed(2)}`" :value-class="profitClass" />
    </van-cell-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useModelStore } from '@/store/modelStore'
import { storeToRefs } from 'pinia'

const route = useRoute()
const store = useModelStore()
const { models } = storeToRefs(store)

// 获取当前查看的车型ID
const modelId = computed(() => Number(route.params.id))

// 获取当前查看的车型
const model = computed(() => {
  return models.value.find((m) => m.id === modelId.value)
})

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 计算属性
const totalCost = computed(() => {
  return (
    model.value?.products?.reduce((sum, p) => sum + (p.costPrice || 0) * (p.quantity || 0), 0) || 0
  )
})

const totalIncome = computed(() => {
  return (
    model.value?.products?.reduce((sum, p) => sum + (p.salePrice || 0) * (p.quantity || 0), 0) || 0
  )
})

const totalProfit = computed(() => {
  return totalIncome.value - totalCost.value
})

// 利润样式类
const profitClass = computed(() => ({
  'profit-positive': totalProfit.value > 0,
  'profit-negative': totalProfit.value < 0,
}))
</script>

<style scoped>
.detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20px;
  /* 添加顶部内边距，防止内容被悬浮标题栏遮挡 */
  padding-top: 46px;
}

/* 将标题栏设置为固定定位 */
.detail-container :deep(.van-nav-bar) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.product-item {
  margin: 12px;
  padding: 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.product-title {
  font-weight: bold;
  color: #333;
}

.profit-positive {
  color: #07c160;
  font-weight: bold;
}

.profit-negative {
  color: #ee0a24;
  font-weight: bold;
}

/* 适配手机端的样式 */
@media (max-width: 768px) {
  .product-item {
    margin: 10px;
    padding: 6px;
  }
}
</style>
