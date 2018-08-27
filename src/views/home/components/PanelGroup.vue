<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel'>
        <div class="card-panel-icon-wrapper icon-people">
          <img src="../../../assets/images/01.png"/>
        </div>
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="statistical_data.pv?statistical_data.pv:0" :duration="2600"></count-to>
          <div class="card-panel-text">曝光次数</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <img src="../../../assets/images/02.png"/>
        </div>
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="statistical_data.click_count?statistical_data.click_count:0" :duration="3000"></count-to>
          <div class="card-panel-text">点击量</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-money">
          <img src="../../../assets/images/03.png"/>
        </div>
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="statistical_data.click_rate?statistical_data.click_rate:0" :duration="3200"></count-to>
          <div class="card-panel-text">点击率</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <img src="../../../assets/images/04.png"/>
        </div>
        <div class="card-panel-description">
          <count-to class="card-panel-num" :startVal="0" :endVal="statistical_data.daily_price?statistical_data.daily_price:0" :duration="3600"></count-to>
          <div class="card-panel-text">花费(元)</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  props: {
    statistical_data: {
      default: false
    }
  },
  components: {
    CountTo
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    .card-panel-icon-wrapper {
      float: left;
      margin: 5px 0 0 100px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      font-weight: bold;
      margin-top: 35px;
      text-align: center;
      margin-right: 90px;
      float: right;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
