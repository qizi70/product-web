import { createRouter, createWebHistory } from 'vue-router';

import repairManage from '@/views/repairManage/repairList.vue';
import repairManageEdit from '@/views/repairManage/repairEdit.vue';

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/view', component: () => import('@/views/RecordList.vue') },
  { path: '/view/:id', component: () => import('@/views/RecordDetail.vue') },

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
  }


];

export default createRouter({
  history: createWebHistory(),
  routes
});
