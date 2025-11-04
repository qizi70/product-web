<template>
  <div class="model-list-container">
    <!-- 这里的标题栏将固定在顶部 -->
    <van-nav-bar title="维修管理" left-text="返回" left-arrow @click-left="$router.back" />

    <!-- 日期选择器 -->
    <van-cell title="选择日期" is-link @click="showPicker = true" class="date-picker-cell">
      <template #right-icon>
        {{ selectedDate || '请选择日期' }}
      </template>
    </van-cell>

    <van-popup v-model:show="showPicker" position="bottom">
      <van-date-picker
        v-model="datePickerValue"
        :theme="datePickerTheme"
        title="选择日期"
        @confirm="handleDateConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>

    <!-- 费用支出 -->
    <div class="cost">
      <van-cell title="费用支出" center class="date-picker-cell">
        <div>
          <span>销售额：¥{{ cost.curSale }}&nbsp;&nbsp;</span>
          <span>商品成本：¥{{ cost.curCost }}</span>
        </div>
        <div>
          <span>房租：¥{{ cost.curRent }}&nbsp;&nbsp;</span>
          <span>工资：¥{{ cost.curSalary }}</span>
        </div>
        <div>
          <span>利润：¥{{ cost.curProfit }}</span>
        </div>
        <div>
          <span>平均利润：¥{{ cost.curAverageProfit }}</span>
        </div>
        <div>
          <span>大众分成：¥{{ cost.dazhongSale }}&nbsp;&nbsp;</span>
          <span>恒捷分成：¥{{ cost.hjSale }}</span>
        </div>
      </van-cell>
    </div>

    <!-- 车型列表 -->
    <div class="model-list">
      <van-swipe-cell v-for="model in models" :key="model.id">
        <van-cell
          :title="model.modelName"
          @click="editModel(model.id)"
          class="model-item"
          center
          inset
        >
          <template #default>
            <div class="model-item-cell">
              <div class="model-date">时间：{{ model.createdAt }}</div>
              <div class="model-profit">{{ calculateProfit(model) }}</div>
              <div class="model-profit">
                利润：<span style="color: #f40">¥{{ model.totalProfit }}</span>
              </div>
            </div>
          </template>
        </van-cell>
        <template #right>
          <van-button
            style="height: 100%"
            square
            type="danger"
            text="删除"
            @click="deleteModel(model.id)"
          />
        </template>
      </van-swipe-cell>
    </div>

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading" />

    <!-- 空数据状态 -->
    <div v-if="!loading && models.length === 0" class="empty-state">
      <van-empty description="暂无车型数据" image="search" />
      <van-button type="primary" style="margin-top: 20px" @click="addNewModel">
        添加首个车型
      </van-button>
    </div>

    <!-- 添加车型按钮 -->
    <div class="add-button-container">
      <van-button type="primary" block class="add-button" @click="addNewModel">
        <van-icon name="plus" /> 添加新车型
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { handleConfirm } from '@/common/CompostionFunc'
import { getRepairRecords, deleteRepairRecord } from '@/api/index'
import { showToast } from 'vant'
import Utils from '@/common/utils'

const router = useRouter()

const models = ref<any[]>([])
const selectedDate = ref(Utils.getNewDate())
const showPicker = ref(false)
const datePickerValue = ref(Utils.getNewDate().split('-'))
const loading = ref(false)

function getList() {
  getRepairRecords({ date: selectedDate.value }).then(
    (res) => {
      if (res.code == 200 && res.data) {
        models.value = res.data
      }
      loading.value = false
    },
    () => {
      showToast('加载车型失败')
      loading.value = false
    },
  )
}

onMounted(getList)

const cost = computed(() => {
  const obj = {
    curSale: 0, // 当日销售额
    curCost: 0, // 当日商品成本
    curRent: 824, // 当日租金
    curSalary: 683, // 当日工资
    curProfit: 0, // 当日利润
    curAverageProfit: 0, // 当日平均利润
    dazhongSale: 0, // 当日大众利润
    hjSale: 0, // 当日恒捷利润
  }
  models.value.forEach((item) => {
    obj.curCost += +item.inputTotalCostPrice || +item.autoTotalCostPrice || 0
    obj.curSale += +item.inputTotalSalePrice || +item.autoTotalSalePrice || 0
  })
  // 当日总成本
  const curTotalCost = obj.curRent + obj.curSalary + obj.curCost
  // 当日总利润
  obj.curProfit = obj.curSale - curTotalCost
  // 当日平均利润
  obj.curAverageProfit = obj.curProfit / 2
  // 当日收入分成：二分之一给大众
  obj.dazhongSale = obj.curAverageProfit + obj.curRent
  // 当日收入分成：二分之一给恒捷
  obj.hjSale = obj.curAverageProfit + obj.curSalary

  return obj
})

// 日期选择器主题配置
const datePickerTheme = {
  colorPrimary: '#1989fa',
  confirmButtonText: '确定',
  cancelButtonText: '取消',
}

// 处理日期选择确认
const handleDateConfirm = (date) => {
  date = new Date(
    date.selectedOptions[0].value +
      '-' +
      date.selectedOptions[1].value +
      '-' +
      date.selectedOptions[2].value,
  )

  selectedDate.value = Utils.formatDate(date)
  showPicker.value = false
  loading.value = true
  getList()
}

// 编辑车型
const editModel = (modelId) => {
  router.push({ name: 'repairManageEdit', query: { id: modelId } })
}

// 删除车型
const deleteModel = async (modelId) => {
  const confirm = await handleConfirm('确定删除该车型吗？')
  if (!confirm) return

  deleteRepairRecord({ id: modelId }).then(
    (res) => {
      if (res.code == 200) {
        showToast('删除成功')
        getList()
      } else {
        showToast('删除失败')
      }
    },
    () => {
      showToast('删除失败')
    },
  )
}

// 添加新车型
const addNewModel = () => {
  router.push({ name: 'repairManageEdit' })
}

// 计算单个车型的利润
const calculateProfit = (model) => {
  const totalCostPrice = model.inputTotalCostPrice || model.autoTotalCostPrice || 0
  const totalSalePrice = model.inputTotalSalePrice || model.autoTotalSalePrice || 0
  return `总收入：¥${totalSalePrice} 总成本：¥${totalCostPrice}`
}
</script>

<style>
.cost .date-picker-cell .van-cell__title {
  flex: 0 0 20%;
}
.model-list .model-item .van-cell__title {
  flex: 0 0 30%;
}
</style>

<style scoped>
.model-list-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 80px;
  /* 添加顶部内边距，防止内容被悬浮标题栏遮挡 */
  padding-top: 46px;
}

/* 将标题栏设置为固定定位 */
.model-list-container :deep(.van-nav-bar) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 其他样式保持不变 */
.date-picker-cell {
  background-color: #fff;
  margin-bottom: 12px;
}

.model-list {
  background-color: #fff;
}

.model-item {
  transition: background-color 0.3s;
}

.model-item:active {
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
  flex-direction: column;
  align-items: center;
}

.add-button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.add-button {
  width: 100%;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* 适配手机端的样式 */
@media (max-width: 768px) {
  .model-list-container {
    padding-bottom: 100px;
  }

  .add-button-container {
    padding: 16px 20px;
  }

  .add-button {
    height: 44px;
    font-size: 16px;
  }
}
</style>
