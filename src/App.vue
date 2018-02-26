<template>
  <div id="app">
    <div class="header">
      <span class="content">说明: 1. 点击头像去购买; 2. 价格忽略万以后</span>
      <span class="btn btn-info" @click="sortByPrice">
        按价格排序<span class="arrow-up" v-if="!defaultSorting"></span>
      </span>
      <span class="btn btn-info" :class="{animate: loading}" @click="refresh">{{loading ? '刷新中' : '刷新'}}</span>
    </div>
    <div class="pets-container">
      <div class="pet" :key="pet.id" v-for="pet in pets">
        <img @click="order(pet.petId, pet.validCode)" :src="pet.petUrl" />
        <div class="title">{{pet.id}}</div>
        <div class="amount">{{`${Math.floor((pet.amount / 10000))}w`}}</div>
      </div>
    </div>
    <div class="loader-wrapper" v-if="loading">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import _ from "lodash";

export default {
  name: "app",
  data() {
    return {
      loading: false,
      defaultSorting: true,
      pets: []
    };
  },
  created() {
    this.getPets();
  },
  methods: {
    async getPets() {
      this.loading = true;
      try {
        const res = await axios.get("/api/pets");
        this.pets = res.data.map(item => {
          const { id, petId, petUrl, amount, validCode } = item;
          return {
            id,
            petId,
            petUrl,
            amount: Number(amount || 0),
            validCode
          };
        });
        this.defaultSorting = true;
      } catch (err) {
        this.defaultSorting = true;
      }
      this.loading = false
    },
    sortByPrice() {
      if (this.defaultSorting) {
        this.pets = _.sortBy(this.pets, [o => Number(o && o.amount || 0)]);
        this.defaultSorting = false;
      }
    },
    refresh() {
      window.location = window.location.href
    },
    order(id, validCode) {
      const url = `https://pet-chain.baidu.com/chain/detail?channel=market&petId=${id}&validCode=${validCode}`;
      location.href = url;
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  text-align: right;
  font-size: 3vw;
  color: #555555;
}
.header {
  background: #000000;
  color: #ffffff;
  padding: 2vw 0;
  text-align: center;
  position: fixed;
  width: 100%;
  margin-top: 0;
  display: flex;
  justify-content: flex-end;
}
.content {
  line-height: 7vw;
  margin-right: 3vw;
  font-size: 2vw;
}
.header > span {
  display: inline-block;
}
.arrow-up {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid white;
  margin-top: 1.5vw;
  position: absolute;
  margin-left: 1vw;
}
.pets-container {
  display: flex;
  padding-top: 10vw;
  text-align: center;
  flex-wrap: wrap;
}
.pets-container .pet {
  padding: 2vw 0;
  width: 20vw;
}
.pets-container .title {
  font-size: 2vw;
}
.pets-container .amount {
  font-size: 3vw;
  color: red;
}
img {
  width: 20vw;
}
.btn {
  padding: 1vw 0;
  color: white;
  border-radius: 1vw;
  font-weight: normal;
  text-align: center;
  width: 80%;
}
@keyframes move {
  0% {
    padding-left: 3vw;
    padding-right: 3vw;
  }
  50% {
    padding-left: 5vw;
    padding-right: 5vw;
  }
  100% {
    padding-left: 3vw;
    padding-right: 3vw;
  }
}
.btn-info {
  margin-right: 3vw;
  padding: 1vw 4vw;
  width: auto;
  line-height: 5vw;
  background-color: rgb(131, 225, 241);
}
.btn-info.animate {
  animation: move 2s infinite;
}
.btn-buy {
  background-color: black;
}

.loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 499;
  background-color: rgba(100, 100, 100, 0.8);
}
.loader {
  display: block;
  position: relative;
  left: 50%;
  top: 40%;
  width: 28vw;
  height: 28vw;
  border-radius: 50%;
  border: 3px solid transparent;
  /* COLOR 1 */
  border-top-color: white;
  animation: spin 2s linear infinite;
  z-index: 605;
  margin-left: -14vw;
}
.loader:before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 50%;
  border: 3px solid transparent;
  /* COLOR 2 */
  border-top-color: white;
  animation: spin 3s linear infinite;
}
.loader:after {
  content: "";
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: white;
  /* COLOR 3 */
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
