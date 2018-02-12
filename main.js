const axios = require('axios')
const vorpal = require('vorpal')()
const config = require('./config')

axios.interceptors.request.use((c) => {
  c.headers.Cookie = config.cookie
  return c
}, error => Promise.reject(error))

const getRequestId = () => {
  return Math.floor(new Date())
}

const URLs = {
  list: 'https://pet-chain.baidu.com/data/market/queryPetsOnSale',
  gen: 'https://pet-chain.baidu.com/data/captcha/gen',
  order: 'https://pet-chain.baidu.com/data/txn/create'
}

const sortTypes = {
  aa: 'AMOUNT_ASC', // 最便宜
  cd: "CREATETIME_DESC", // 最新 
  rd: "RAREDEGREE_DESC" // 高等级
}

/**
 * 获取验证码并输出到当前目录
 * @param {*} petId 
 * @param {*} amount 
 * @param {*} validCode 
 */
const gen = async (petId, amount, validCode) => {
  try {
    const res = await axios.post(URLs.gen, {
      "requestId": getRequestId(), "appId": 1, "tpl": ""
    })
    const captcha = res.data.data
    const { seed, img } = captcha
    console.log(`得到验证码和Seed: ${seed}`)

    const base64Data = img
    require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
      console.log(err)
    })

    vorpal
      .delimiter('请输入验证码，格式为[a xxxx]: ')
      .show()
      .command('a <captcha>', 'Executes arbitrary sql.')
      .action((args, cb) => {
        const captcha = args.captcha
        order(petId, amount, validCode, seed, captcha)
      })
    // return captcha
  } catch (err) {
    // console.log(JSON.stringify(err.response))
  }
}

let pageNo = 0
let min = 100000

const getCheapestPet = async () => {
  pageNo = pageNo >= 5 ? 1 : pageNo + 1
  try {
    console.log(`第${pageNo}页`)
    const res = await axios.post(URLs.list, {
      pageNo,
      'pageSize': 20,
      'querySortType': sortTypes.cd,
      'petIds': [],
      'lastAmount': null,
      'lastRareDegree': null,
      'requestId': getRequestId(),
      'appId': 1,
      'tpl': ''
    })
    
    const pets = res.data.data.petsOnSale

    for (let i = 0; i < pets.length; i ++) {
      const { id, petId, amount, validCode, rareDegree } = pets[i]
      const order = config.orderList[rareDegree]
      if (order.isOrder) {
        // 打印宠物价格
        // console.log(`${order.degree}: ${amount}`)
        // 打印宠物号
        console.log(id)
      }
      if (order.isOrder && amount <= order.maxAmount) {
        clearInterval(timmer)
        gen(petId, amount, validCode)
        break
      }
      // if (petId === '') {
      //   console.log(validCode)
      // }
    }
  } catch (err) {
    // console.log('获取失败')
  }
}

const order = async (petId, amount, validCode, seed, captcha) => {
  console.log(`开始下单${petId} ${amount} ${validCode} ${seed} ${captcha}`)
  try {
    const res = await axios.post(URLs.order, {
      petId,
      amount,
      seed,
      captcha,
      validCode,
      "requestId": getRequestId(),
      "appId": 1,
      "tpl": ""
    })
    const result = res.data
    console.log(`下单结果: ${result.errorMsg}`)
    // return captcha
  } catch (err) {
    console.log(err.response.status)
  }
}

const timmer = setInterval(getCheapestPet, 800 + Math.floor(Math.random(1) * 100))
