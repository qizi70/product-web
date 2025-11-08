import { createRouter, createWebHistory } from 'vue-router';

import repairManage from '@/views/repairManage/repairList.vue';
import repairManageEdit from '@/views/repairManage/repairEdit.vue';
import repairSummaries from '@/views/DailySummaries/index.vue';

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },

  // 维修管理
  {
    path: '/repairManageList',
    name: 'repairManageList',
    component: repairManage,
    meta: {
      title: '维修管理',
    },
  },
  {
    path: '/repairManage/edit',
    name: 'repairManageEdit',
    component: repairManageEdit,
    meta: {
      title: '详情管理',
    }
  },
  // 记录查看
  {
    path: '/repairSummaries',
    name: 'repairSummaries',
    component: repairSummaries,
    meta: {
      title: '记录查看',
    },
  },



];

export default createRouter({
  history: createWebHistory(import.meta.env.VITE_NODE_CODE === 'development' ? '' : '/product-web/'),
  routes
});
