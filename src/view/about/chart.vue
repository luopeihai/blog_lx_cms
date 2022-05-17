<template>
  <div>
    <div class="time">
      <el-select v-model="value" placeholder="请选择时间段" @change="change">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
    </div>
    <div class="chart">
      <highcharts :options="chartOptions"></highcharts>
    </div>
  </div>
</template>

<script>
import ip from '@/model/ip'
import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'

exportingInit(Highcharts)

export default {
  components: {
    highcharts: Chart,
  },
  created() {
    this.getData(this.value)
  },
  data() {
    return {
      chartOptions: {
        credits: {
          enabled: false,
        },
        exporting: { enabled: false },
        title: {
          text: 'uv访问情况',
        },
        yAxis: {
          title: {
            text: '访问量',
          },
        },
        xAxis: {
          categories: [],
        },
        plotOptions: {},
        series: [
          {
            name: '',
            data: [],
          },
        ],
        legend: {
          enabled: false,
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom',
                },
              },
            },
          ],
        },
      },
      options: [
        {
          value: 'week',
          label: '7天',
        },
        {
          value: 'month',
          label: '30天',
        },
        // {
        //   value: 'year',
        //   label: '12月',
        // },
      ],
      value: 'week',
    }
  },
  methods: {
    change(value) {
      this.value = value
      this.getData(value)
    },
    async getData(value) {
      const { isSuccess, data } = await ip.getChart(value)
      if (isSuccess) {
        this.chartOptions.xAxis.categories = data.map(item => item.day)
        this.chartOptions.series = [{ name: '', data: data.map(item => item.count) }]
      }
    },
  },
}
</script>
<style scoped lang="scss">
.chart {
  margin-top: 20px;
}
.time {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
