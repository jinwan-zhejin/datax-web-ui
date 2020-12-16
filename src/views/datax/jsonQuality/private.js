/**
     * @description: 查找sets中某一项的attr属性与item相同，若有则返回sets中某一项的distAttr属性值
     * @param {String} item
     * @param {array} sets
     * @param {String} attr
     * @param {String} distAttr
     * @returns {String}
     */
export function finder(item, sets, attr, distAttr) {
  var temp = ''
  if (sets) {
    temp = sets.find(ele => ele[attr] === item)
  }
  if (!temp) {
    return ''
  }
  return temp[distAttr]
}

/** 没有值显示短横线，有值显示值 */
export function dashOrValue(val) {
  if (val) {
    return val
  } else {
    return '-'
  }
}
