<template>
  <div class="record-list-container">
    <!-- 这里的标题栏将固定在顶部 -->
    <van-nav-bar title="记录查看" left-text="返回" left-arrow @click-left="$router.back" />

    <!-- 搜索框 -->
    <van-search
      v-model="searchQuery"
      placeholder="搜索车型或车架号"
      class="search-bar"
      @search="handleSearch"
    />

    <!-- 筛选条件 -->
    <div class="filter-container">
      <van-cell title="选择日期" is-link @click="showDatePicker = true">
        <template #right-icon>
          {{ selectedDate || '全部日期' }}
        </template>
      </van-cell>

      <van-popup v-model:show="showDatePicker" position="bottom">
        <van-date-picker
          v-model="dateValue"
          type="date"
          title="选择日期"
          @confirm="handleDateConfirm"
          @cancel="showDatePicker = false"
        />
      </van-popup>
    </div>

    <!-- 记录列表 -->
    <div class="records">
      <van-swipe-cell v-for="model in filteredRecords" :key="model.id">
        <van-cell
          :title="model.name"
          :value="calculateProfit(model)"
          @click="viewDetail(model.id)"
          class="record-item"
        >
          <template #label>
            <div>{{ model.vin }}</div>
            <div style="font-size: 12px; color: #999">{{ formatDate(model.date) }}</div>
          </template>
          <template #right-icon>
            <van-icon name="arrow-right" size="16" color="#999" />
          </template>
        </van-cell>
      </van-swipe-cell>
    </div>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading" />

    <!-- 空数据状态 -->
    <div v-if="!loading && filteredRecords.length === 0" class="empty-state">
      <van-empty description="暂无记录" image="file-text" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useModelStore } from '@/store/modelStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const store = useModelStore()
const { models } = storeToRefs(store)

// 搜索和筛选
const searchQuery = ref('')
const showDatePicker = ref(false)
const dateValue = ref(new Date())
const selectedDate = ref('')
const loading = ref(false)

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 计算筛选后的记录
const filteredRecords = computed(() => {
  let result = [...models.value]

  // 按日期筛选
  if (selectedDate.value) {
    result = result.filter((model) => {
      const modelDate = formatDate(model.date)
      return modelDate === selectedDate.value
    })
  }

  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (model) =>
        model.name.toLowerCase().includes(query) || model.vin.toLowerCase().includes(query),
    )
  }

  // 按日期倒序排列
  return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// 计算利润
const calculateProfit = (model) => {
  const totalCost = model.products.reduce(
    (sum, p) => sum + (p.costPrice || 0) * (p.quantity || 0),
    0,
  )
  const totalIncome = model.products.reduce(
    (sum, p) => sum + (p.salePrice || 0) * (p.quantity || 0),
    0,
  )
  const profit = totalIncome - totalCost
  const profitClass = profit >= 0 ? 'profit-positive' : 'profit-negative'

  return {
    default: `利润: ¥${profit.toFixed(2)}`,
    class: profitClass,
  }
}

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已在计算属性中实现
}

// 处理日期选择
const handleDateConfirm = (date) => {
  selectedDate.value = formatDate(date)
  showDatePicker.value = false
}

// 查看详情
const viewDetail = (modelId) => {
  router.push(`/view/${modelId}`)
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 加载所有数据（在实际应用中可能需要分页）
    await store.fetchModels('')
  } catch (error) {
    console.error('加载记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
loadData()
</script>

<style scoped>
.record-list-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  /* 添加顶部内边距，防止内容被悬浮标题栏遮挡 */
  padding-top: 46px;
}

/* 将标题栏设置为固定定位 */
.record-list-container :deep(.van-nav-bar) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 其他样式保持不变 */
.search-bar {
  padding: 12px;
  background-color: #fff;
}

.filter-container {
  background-color: #fff;
  margin-top: 10px;
}

.records {
  margin-top: 10px;
  background-color: #fff;
}

.record-item {
  transition: background-color 0.3s;
}

.record-item:active {
  background-color: #f5f5f5;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
}

.empty-state {
  padding: 80px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profit-positive {
  color: #07c160;
}

.profit-negative {
  color: #ee0a24;
}

/* 适配手机端的样式 */
@media (max-width: 768px) {
  .record-list-container {
    padding-bottom: 20px;
  }
}
</style>
