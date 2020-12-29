/**
 * @Date: 2020-12-29 18:03:20
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-12-29 18:21:11
 * @FilePath: \datax-web-ui\src\utils\sortArr.js
 * @Description: 数组排序
 */

/**
 * @description: 对象数组排序
 * @param {Array} arr 数组
 * @param {String} orderBy 排序项
 * @param {String} order 排序方式  asc-正序 desc-逆序
 * @return {Array}
 */
export function objList(arr = [], orderBy = '', order = 'asc') {
  return arr.sort((a, b) => {
    if (order.toLowerCase() === 'asc') {
      if (typeof a[orderBy] === 'number') {
        return a[orderBy] - b[orderBy]
      }
      return (a[orderBy] > b[orderBy]) - (a[orderBy] < b[orderBy])
    } else {
      if (typeof a[orderBy] === 'number') {
        return b[orderBy] - a[orderBy]
      }
      return (a[orderBy] < b[orderBy]) - (a[orderBy] > b[orderBy])
    }
  })
}
