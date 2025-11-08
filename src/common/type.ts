
/**
 * @description: 指定对象为该类型后，可以动态添加属性，而不会提示属性具有隐式 any 类型
 */
export interface AnyObj {
  [index: string]: unknown
}

/**
 * @description: 维修记录
 */
export interface RepairRecord {
  id: number
  modelName: string // 车型名称
  vin: string // 车架号
  repairDate: string // 维修日期
  autoTotalCostPrice: string // 自动计算成本价格
  autoTotalSalePrice: string // 自动计算销售额
  inputTotalCostPrice: string // 手动输入成本价格
  inputTotalSalePrice: string // 手动输入销售额
  totalProfit: string // 利润

  productList: [{
    id?: number
    name: string // 产品名称
    quantity: string // 数量
    spec: string // 规格
    costPrice: string // 成本价格
    salePrice: string // 销售价格
  }]

}

export interface DailySummary {
  date: string // 日期
  cost: string // 成本价格
  sale: string // 销售额
  profit: string // 利润
  rent: string // 房租成本
  salaryCost: number // 员工成本
  salaryList: [{
    id?: number
    name: string // 员工姓名
    salary: number // 工资
    work: 1 | 2 | 3 | 4 // 是否工作 1 全天 2 上午班 3 下午班 4 请假'
  }]
}
