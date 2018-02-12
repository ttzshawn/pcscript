# 配置config.js
## 1. config.js >> cookie
通过chrome debugger network查看request头，拷贝Request Headers中的Cookie到

## 2. config.js >> orderList
配置下单的条件：等级和价格上限

# 运行
## 1. 下载最新版本nodejs

## 2. 项目目录下安装依赖包
```bash
npm i
```

## 3. 项目目录下运行
```bash
npm run start
```

## 4. 符合购买条件时输入验证码
- 验证码在项目目录下out.png
- 验证码格式为[a][空格][验证码]，如下
```bash
  a xxxx
```

# DEMO
## Demo
![Show case](https://raw.githubusercontent.com/ttzshawn/pcscript/master/assets/screenshot.png)
