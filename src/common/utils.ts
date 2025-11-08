

const Utils = {
  /**
   * 获取当前日期的字符串格式（yyyy-MM-dd）
   * @returns (yyyy-MM-dd）
   */
  getNewDate: () => Utils.formatDate(new Date()),

  /**
   * 将日期转换为yyyy-MM-dd格式
   * @param date 日期字符串
   * @returns 格式化后的日期字符串（yyyy-MM-dd）
   */
  formatDate: (date: Date) => date.toISOString().split('T')[0],

  /**
   * @description: 将日期时间转换为yyyy-MM-dd HH:mm:ss格式
   * @return {*}
   */
  formatDateTime: (dateString: Date) => dateString.toISOString().replace('T', ' ').split('.')[0],

  /**
   * @description: 输入字符串日期，返回yyyy-MM-dd HH:mm:ss格式
   * @return {*}
   */
  formatStringDateTime: (dateString: string) => Utils.formatDateTime(new Date(dateString)),

  /**
   * @description: 检查值是否为数字、字符串类型的数字
   * @return {*}
   */
  isNumber: (value: unknown) => typeof value === 'number' && !isNaN(value),

  /**
   * @description: 传入对象，返回对象的 字符串key=value&key=value格式
   * @param {object} obj
   * @return {string}
   */
  objToQueryString: (obj: object): string => {
    return Object.keys(obj)
      .map(key => `${key}=${encodeURIComponent(obj[key])}`)
      .join('&')
  },

  getDaysAgo: (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return Utils.formatDate(date);
  }

}

export default Utils
