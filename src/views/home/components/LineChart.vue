<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    setOptions({ xData, pv, click_count, click_rate, daily_price, attend_count, unattend_count, legend } = {}) {
      this.chart.setOption({
        xAxis: {
          data: xData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: legend
        },
        series: [
          {
            name: '曝光次数', itemStyle: {
              normal: {
                color: '#5c9deb',
                lineStyle: {
                  color: '#5c9deb',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: pv,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: '点击量',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#f15854',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                }
              }
            },
            data: click_count,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '点击率',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#62c87f',
                lineStyle: {
                  color: '#62c87f',
                  width: 2
                }
              }
            },
            data: click_rate,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '花费',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#fd863e',
                lineStyle: {
                  color: '#fd863e',
                  width: 2
                }
              }
            },
            data: daily_price,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '关注',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3700e9',
                lineStyle: {
                  color: '#3700e9',
                  width: 2
                }
              }
            },
            data: attend_count,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '取消关注',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#deec01',
                lineStyle: {
                  color: '#deec01',
                  width: 2
                }
              }
            },
            data: unattend_count,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
