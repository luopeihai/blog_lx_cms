<template>
  <div class="container">
    <!-- <div class="quantity-statistics">
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">总访问量</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">11,590</div>
          </div>
        </div>
        <div class="quantity-icon"><img
            src="../../assets/image/about/icon.png"
            alt=""
          /></div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">总用户数</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">51,862</div>
          </div>
        </div>
        <div class="quantity-icon"><img
            src="../../assets/image/about/icon.png"
            alt=""
          /></div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">新增访问量 (月)</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">1,862</div>
          </div>
        </div>
        <div class="quantity-icon"><img
            src="../../assets/image/about/icon.png"
            alt=""
          /></div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">新增用户数</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">1,323</div>
          </div>
        </div>
        <div class="quantity-icon"><img
            src="../../assets/image/about/icon.png"
            alt=""
          /></div>
      </div>
    </div> -->
    <div class="information">
      <div class="left">
        <Chart></Chart>
      </div>
      <div class="right">
        <ip-list></ip-list>
      </div>
    </div>
  </div>
</template>
<script>
import IpList from './ip-list.vue'
import Chart from './chart'

export default {
  components: {
    IpList,
    Chart,
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="scss">
.information {
  padding-top: 30px;
  display: flex;
  .left {
    flex: 1;
  }
  .right {
    flex: 1;
  }
}
</style>
