import { ref, reactive, watch, onMounted } from "vue"
import { showToast, showConfirmDialog } from 'vant'

/**
 * @description: 处理确认弹窗
 * @param {*} title 默认值：“是否确认删除？”
 * @return {*}
 */
export function handleConfirm(title = '是否确认删除？') {
  return showConfirmDialog({ title })
    .then(() => true)
    .catch(() => false)
}
