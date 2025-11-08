import { myPut, myGet, myPost, myPostForm, myDelete } from './http'

// 维修管理
// 获取维修记录列表
export const getRepairRecords = params => myGet(`/api/repair-records`, params)
// 根据id获取维修记录
export const getRepairRecordsById = params => myGet(`/api/repair-records/${params.id}`)
// 添加维修记录
export const addRepairRecord = params => myPost(`/api/repair-records/add`, params)
// 更新维修记录
export const editRepairRecord = params => myPost(`/api/repair-records/edit/${params.id}`, params)
// 删除维修记录
export const deleteRepairRecord = params => myPost(`/api/repair-records/delete/${params.id}`)


// 记录查看
// 获取记录查看列表
export const getDailySummaries = date => myGet(`/api/daily-summary/get${date}`)
