<template>
  <div class="edit-container">
    <!-- 这里的标题栏将固定在顶部 -->
    <van-nav-bar title="维修记录编辑" left-text="返回" left-arrow @click-left="handleBack" />

    <!-- 车型基本信息 -->
    <van-cell-group inset style="margin-top: 12px">
      <van-field
        label="车型名称"
        v-model="formData.modelName"
        placeholder="请输入车型名称"
        :rules="[{ required: true, message: '请输入车型名称' }]"
      />
      <van-field
        label="车架号(VIN)"
        v-model="formData.vin"
        placeholder="请输入17位车架号"
        :rules="[
          {
            required: true,
            pattern: /^[A-HJ-NPR-Z\d]{17}$/,
            message: '请输入有效车架号',
          },
        ]"
      />
      <van-cell is-link title="选择日期" @click="showDatePicker = true">
        <template #right-icon>
          {{ datePickerValue.join('-') || '请选择日期' }}
        </template>
      </van-cell>
      <van-popup v-model:show="showDatePicker" position="bottom">
        <van-date-picker
          v-model="datePickerValue"
          type="date"
          title="选择日期"
          @confirm="handleDateConfirm($event)"
          @cancel="showDatePicker = false"
        />
      </van-popup>
    </van-cell-group>

    <!-- 商品列表 -->
    <div v-for="(product, index) in formData.productList" :key="product.id" class="product-item">
      <van-divider>商品 {{ index + 1 }}</van-divider>

      <van-field
        label="产品名称"
        v-model="product.name"
        @change="handleProductNameChange($event, index)"
        placeholder="请输入产品名称"
        :rules="[{ required: true, message: '请输入产品名称' }]"
        input-align="right"
      />

      <van-field label="规格" v-model="product.spec" placeholder="请输入规格" input-align="right" />

      <van-field
        label="数量"
        type="number"
        v-model.number="product.quantity"
        placeholder="请输入数量"
        input-align="right"
      />
      <!-- 价格输入增加货币格式 -->
      <van-field
        label="成本价"
        type="number"
        v-model.number="product.costPrice"
        placeholder="请输入成本价"
        input-align="right"
      />
      <van-field
        label="销售价"
        type="number"
        v-model.number="product.salePrice"
        placeholder="请输入销售价"
        input-align="right"
      />

      <van-button block type="danger" @click="removeProduct(index)" class="remove-btn">
        删除此商品
      </van-button>
    </div>

    <!-- 操作按钮组 -->
    <div class="action-buttons">
      <van-button type="primary" block icon="plus" @click="addProduct" class="add-btn">
        新增商品
      </van-button>
    </div>

    <!-- 统计信息卡片 -->
    <van-collapse v-model="showSummary">
      <van-collapse-item title="统计概览" name="summary">
        <van-row>
          <van-col span="12">总成本：¥{{ autoTotalCostPrice }}</van-col>
          <van-col span="12">总收入：¥{{ autoTotalSalePrice }}</van-col>
          <van-field
            label="手动总成本"
            v-model="formData.inputTotalCostPrice"
            placeholder="请输入"
            type="number"
            class="total-cost-input"
          />
          <van-field
            label="手动总收入"
            v-model="formData.inputTotalSalePrice"
            placeholder="请输入"
            type="number"
            class="total-sale-input"
          />
          <van-col span="24" :class="['profit-display', profitClass]">
            净利润：¥{{ totalProfit }}
          </van-col>
        </van-row>
      </van-collapse-item>
    </van-collapse>

    <div class="action-buttons" style="margin-top: 20px">
      <van-button type="success" block icon="success" @click="handleSave" class="save-btn">
        保存全部更改
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { handleConfirm } from '@/common/CompostionFunc'
import { getRepairRecordsById, editRepairRecord, addRepairRecord } from '@/api/index'
import Utils from '@/common/utils'
import { RepairRecord } from '@/common/type'

const router = useRouter()
const route = useRoute()

const datePickerValue = ref(Utils.getNewDate().split('-'))

// 类型断言
// const formData = ref({} as RepairRecord)

const formData = ref<Partial<RepairRecord>>({
  modelName: '',
  vin: '',
  repairDate: Utils.getNewDate(),
  autoTotalCostPrice: '',
  autoTotalSalePrice: '',
  inputTotalCostPrice: '',
  inputTotalSalePrice: '',
  totalProfit: '',
  productList: [
    {
      name: '',
      quantity: '',
      spec: '',
      costPrice: '',
      salePrice: '',
    },
  ],
})

// 显示状态控制
const showDatePicker = ref(false)
const showSummary = ref(['summary']) // 默认展开统计概览

function getList() {
  const id = route.query.id

  if (!id) return

  getRepairRecordsById({ id })
    .then((res) => {
      if (res.code == 200 && res.data) {
        formData.value = res.data || {}
        datePickerValue.value = res.data.repairDate.slice(0, 10).split('-')
      }
    })
    .catch(() => {
      formData.value = {}
      showToast('获取维修记录失败')
    })
}

onMounted(getList)

const handleProductNameChange = (value, index) => {
  console.log('产品名称更改为:', value.target.value, index)
  if (value && value.target && value.target.value && formData.value.productList) {
    formData.value.productList[index].quantity = '1'
    formData.value.productList[index].spec = '个'
  }
}

const autoTotalCostPrice = computed(() => {
  const costPrice =
    formData.value.productList &&
    formData.value.productList
      .reduce((acc, cur) => acc + parseFloat(cur.costPrice || '0'), 0)
      .toFixed(2)

  formData.value.autoTotalCostPrice = costPrice
  return costPrice
})

const autoTotalSalePrice = computed(() => {
  const salePrice =
    formData.value.productList &&
    formData.value.productList
      .reduce((acc, cur) => acc + parseFloat(cur.salePrice || '0'), 0)
      .toFixed(2)
  formData.value.autoTotalSalePrice = salePrice
  return salePrice
})

// 总利润
const totalProfit = computed(() => {
  let totalCostPrice = 0
  let totalSalePrice = 0

  const inputTotalCostPrice = formData.value.inputTotalCostPrice || undefined
  const inputTotalSalePrice = formData.value.inputTotalSalePrice || undefined

  formData.value.productList?.forEach((item) => {
    totalCostPrice += parseFloat(item.costPrice || '0')
    totalSalePrice += parseFloat(item.salePrice || '0')
  })

  totalCostPrice = Utils.isNumber(Number(inputTotalCostPrice))
    ? Number(inputTotalCostPrice)
    : totalCostPrice
  totalSalePrice = Utils.isNumber(Number(inputTotalSalePrice))
    ? Number(inputTotalSalePrice)
    : totalSalePrice

  const totalProfit = totalSalePrice - totalCostPrice

  formData.value.totalProfit = totalProfit.toFixed(2)

  return totalProfit
})

const profitClass = computed(() => {
  const profit = parseFloat(formData.value.totalProfit || '0')
  return profit > 0 ? 'profit-positive' : 'profit-negative'
})

// 返回按钮处理
const handleBack = () => {
  router.back()
}

const handleDateConfirm = (date) => {
  formData.value.repairDate = date.selectedValues.join('-')
  datePickerValue.value = date.selectedValues
  showDatePicker.value = false
}

// 添加商品
const addProduct = () => {
  const newProduct = {
    name: '',
    spec: '',
    quantity: '',
    costPrice: '',
    salePrice: '',
  }

  formData.value.productList?.push(newProduct)
}

// 删除商品
const removeProduct = async (index) => {
  const confirm = await handleConfirm('确定删除该商品吗？')
  if (!confirm) return

  if (formData.value.productList && formData.value.productList.length > 0) {
    formData.value.productList?.splice(index, 1)
    return
  }
  showToast('至少保留一个商品')
}

// 保存更改（无接口版本）
const handleSave = () => {
  const params = {
    ...formData.value,
    inputTotalCostPrice:
      formData.value.inputTotalCostPrice === '' ? null : formData.value.inputTotalCostPrice,
    inputTotalSalePrice:
      formData.value.inputTotalSalePrice === '' ? null : formData.value.inputTotalSalePrice,
  }

  const handleFunc = route.query.id ? editRepairRecord : addRepairRecord

  handleFunc(params)
    .then((res) => {
      if (res.code == 200) {
        showToast('保存成功')
        handleBack()
      } else {
        showToast(res.message || '保存失败')
      }
    })
    .catch(() => {
      showToast('保存失败')
    })
}
</script>

<style scoped>
.edit-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  /* 添加顶部内边距，防止内容被悬浮标题栏遮挡 */
  padding-top: 46px;
}

/* 将标题栏设置为固定定位 */
.edit-container :deep(.van-nav-bar) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 其他样式保持不变 */
.remove-btn {
  margin-top: 12px;
}

.add-btn {
  margin: 20px 0;
}

.save-btn {
  margin-bottom: 20px;
}

.profit-display {
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
}

.profit-positive {
  color: #ee0a24;
}

.profit-negative {
  color: #07c160;
}

.product-item {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-buttons {
  padding: 0 16px;
}

.total-cost-input {
  padding-left: 0;
}

.total-sale-input {
  padding-left: 0;
}

/* 适配手机端的样式 */
@media (max-width: 768px) {
  .product-item {
    margin: 12px;
    padding: 10px;
  }

  .van-button {
    font-size: 16px;
    height: 44px;
  }
}
</style>
