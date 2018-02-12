/**
 * 配置1: cookie
 */
const cookie = ''

/**
 * 配置3: 要下单的信息
 * @key {boool} isOrder 是否购买
 * @key {number} maxAmount 价格上限
 */
const orderList = [{
  degree: '普通',
  isOrder: true,
  maxAmount: 10
}, {
  degree: '稀有',
  isOrder: true,
  maxAmount: 200
}, {
  degree: '卓越',
  isOrder: true,
  maxAmount: 300
}, {
  degree: '史诗',
  isOrder: true,
  maxAmount: 1800
}, {
  degree: '神话',
  isOrder: true,
  maxAmount: 67900
}]

module.exports = {
  cookie,
  orderList
}
