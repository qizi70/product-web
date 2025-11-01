

const Utils = {
  /**
   * 获取当前日期的字符串格式（yyyy-MM-dd）
   * @returns (yyyy-MM-dd）
   */
  getNewDate: () => new Date().toISOString().split('T')[0],

  /**
   * 将日期转换为yyyy-MM-dd格式
   * @param dateString 日期字符串
   * @returns 格式化后的日期字符串（yyyy-MM-dd）
   */
  formatDate: (dateString: Date) => dateString.toISOString().split('T')[0],

  /**
   * @description: 将日期时间转换为yyyy-MM-dd HH:mm:ss格式
   * @return {*}
   */
  formatDateTime: (dateString: Date) => dateString.toISOString().replace('T', ' ').split('.')[0],

  /**
   * @description: 检查值是否为数字、字符串类型的数字
   * @return {*}
   */
  isNumber: (value: unknown) => typeof value === 'number' && !isNaN(value),

}

export default Utils
