<template>
  <div class="control-panel">
    <div class="data">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>今日订单数</span>
        </div>
        <div class="text item">2000</div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>今日日活</span>
        </div>
        <div class="text item">36271</div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>转化率</span>
        </div>
        <div class="text item">20%</div>
      </el-card>
    </div>
    <div id="echart" class="echart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'control-panel',
  methods: {
    drawEchart() {
      var chartDom = document.getElementById('echart')
      var myChart = echarts.init(chartDom)
      var option

      option = {
        title: {
          text: '系统折线图',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['新增注册', '付费用户', '活跃用户', '订单数', '当日总收入'],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [
              '2022-04-12',
              '2022-04-13',
              '2022-04-14',
              '2022-04-15',
              '2022-04-16',
              '2022-04-17',
              '2022-04-18',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '新增注册',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: '付费用户',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: '活跃用户',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: '订单数',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: '当日总收入',
            type: 'line',
            stack: 'Total',
            label: {
              show: true,
              position: 'top',
            },
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      }

      myChart.setOption(option)
    },
  },
  mounted() {
    this.drawEchart()
  },
}
</script>

<style lang="less" scoped>
.control-panel {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  .data {
    width: 100%;
    margin: 0 0 50px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .box-card {
    width: 100%;
    font-size: 14px;
    margin: 0 10px;
  }
  .echart {
    width: 100%;
    height: 60%;
  }
}
</style>
