import { defineStore } from 'pinia';
import { ref } from 'vue';

// 定义产品接口
export interface Product {
  id: number;
  name: string;
  spec: string;
  quantity: number;
  costPrice: number;
  salePrice: number;
}

// 定义车型接口
export interface VehicleModel {
  id: number;
  name: string;
  vin: string;
  date: Date;
  products: Product[];
}

/**
 * 车型数据存储中心
 * @description 管理所有车型数据及关联商品信息
 */
export const useModelStore = defineStore('model', {
  state: () => ({
    models: [] as VehicleModel[],
  }),
  getters: {
    // 获取所有车型
    getAllModels: (state) => state.models,

    // 根据ID获取车型
    getModelById: (state) => (id: number) => {
      return state.models.find(m => m.id === id);
    }
  },
  actions: {
    // 添加车型
    addModel(model: Omit<VehicleModel, 'id'>) {
      const newModel: VehicleModel = {
        ...model,
        id: Date.now(),
        date: new Date(model.date),
        products: model.products || []
      };
      this.models.push(newModel);
      return newModel.id;
    },

    // 删除车型
    deleteModel(id: number) {
      this.models = this.models.filter(m => m.id !== id);
    },

    // 更新车型
    updateModel(id: number, payload: Partial<VehicleModel>) {
      const index = this.models.findIndex(m => m.id === id);
      if (index !== -1) {
        // 特殊处理日期类型
        if (payload.date) {
          payload.date = new Date(payload.date);
        }
        this.models[index] = { ...this.models[index], ...payload };
      }
    },

    // 获取指定日期的车型数据（模拟实现）
    async fetchModels(date: string) {
      try {
        // 因为没有实际接口，我们模拟数据加载
        // 这里可以根据日期过滤本地数据
        console.log(`加载日期 ${date} 的车型数据`);

        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        // 如果是首次加载且没有数据，创建一些模拟数据
        if (this.models.length === 0) {
          this.createMockData();
        }

        // 返回按日期过滤的数据（在实际应用中应该是API返回的数据）
        return this.models;
      } catch (error) {
        console.error('获取车型失败:', error);
        throw error;
      }
    },

    // 创建模拟数据
    createMockData() {
      const mockModels: Omit<VehicleModel, 'id'>[] = [
        {
          name: '丰田卡罗拉',
          vin: 'LFMBE82A8E0123456',
          date: new Date(),
          products: [
            {
              id: 1,
              name: '机油',
              spec: '全合成 5W-30',
              quantity: 4,
              costPrice: 80,
              salePrice: 120
            },
            {
              id: 2,
              name: '机滤',
              spec: '原厂',
              quantity: 1,
              costPrice: 30,
              salePrice: 50
            }
          ]
        },
        {
          name: '本田思域',
          vin: '19XFC2F53GE012345',
          date: new Date(),
          products: [
            {
              id: 3,
              name: '空气滤芯',
              spec: '原厂',
              quantity: 1,
              costPrice: 50,
              salePrice: 85
            },
            {
              id: 4,
              name: '空调滤芯',
              spec: '活性炭',
              quantity: 1,
              costPrice: 40,
              salePrice: 75
            }
          ]
        }
      ];

      // 添加模拟数据到store
      mockModels.forEach(model => this.addModel(model));
    }
  },
  persist: true
});
