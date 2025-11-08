<template>
  <div class="model-list-container">
    <van-nav-bar title="记录查看" left-text="返回" left-arrow @click-left="$router.back" />

    <!-- 日期选择器部分 -->
    <div class="date-picker-container">
      <div class="date-item">
        <span class="date-label">开始日期：</span>
        <van-cell :value="formData.startDate" @click="showStartPicker = true" is-link />
        <van-popup v-model:show="showStartPicker" position="bottom">
          <van-date-picker
            :value="formData.startDate.split('-')"
            type="date"
            title="选择开始日期"
            @confirm="handleStartDateConfirm"
            format="YYYY-MM-DD"
          />
        </van-popup>
      </div>
      <div class="line"></div>
      <div class="date-item">
        <span class="date-label">结束日期：</span>
        <van-cell :value="formData.endDate" @click="showEndPicker = true" is-link />
        <van-popup v-model:show="showEndPicker" position="bottom">
          <van-date-picker
            :value="formData.endDate.split('-')"
            type="date"
            title="选择结束日期"
            @confirm="handleEndDateConfirm"
            format="YYYY-MM-DD"
          />
        </van-popup>
      </div>
    </div>

    <div class="wrapper">
      <div class="item" v-for="item in tableData" :key="item.date">
        <div class="left">{{ item.date }}</div>
        <div class="right">
          <div>销售额：¥{{ item.sale }}</div>
          <div>
            <span class="mr-5">商品成本：¥{{ item.cost }}</span>
            <span>员工/房租成本：¥{{ Number(item.salaryCost) + Number(item.rent) }}</span>
          </div>
          <div>利润：¥{{ item.profit }}</div>
          <div>当日平均利润：{{ Number(item.profit) / 2 }}</div>
          <div>
            <span class="mr-5"
              >大众分成：¥{{ Number(item.profit) / 2 + Number(item.rent) }}&nbsp;</span
            >
            <span>恒捷分成：¥{{ Number(item.profit) / 2 + Number(item.salaryCost) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDailySummaries } from '@/api/index'
import { showToast } from 'vant'
import Utils from '@/common/utils'
import { DailySummary } from '@/common/type'

const router = useRouter()

const showStartPicker = ref(false)
const showEndPicker = ref(false)
const formData = ref({
  startDate: Utils.getDaysAgo(7),
  endDate: Utils.getNewDate(),
})

const tableData = ref([] as DailySummary[])

// 添加日期确认处理函数
function handleStartDateConfirm(value: any) {
  formData.value.startDate = value.selectedValues.join('-')
  showStartPicker.value = false
  getList()
}

function handleEndDateConfirm(value: any) {
  formData.value.endDate = value.selectedValues.join('-')
  showEndPicker.value = false
  getList()
}

function getList() {
  getDailySummaries('?' + Utils.objToQueryString(formData.value)).then((res) => {
    if (res.code == 200 && res.data) {
      console.log('res: ', res)
      tableData.value = res.data || []
    } else {
      showToast(res.message || '获取失败')
    }
  })
}

onMounted(getList)
</script>

<style lang="scss" scoped>
.date-picker-container {
  padding: 12px;
  background-color: #fff;
  margin-top: 10px;

  .date-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    :nth-child(1) {
      min-width: 80px;
    }

    .date-label {
      display: inline-block;
      width: 80px;
      font-size: 14px;
      color: #666;
      vertical-align: middle;
    }
  }
  .line {
    height: 1px;
    background-color: #e5e5e5;
    box-sizing: border-box;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 0 12px;

  .item {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    padding: 12px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    .right {
      margin-top: 10px;
      font-size: 14px;
      text-align: right;
    }
  }
}
</style>
