<template>
  <vue-highcharts :options="options" :highcharts="highcharts" ref="Highcharts"></vue-highcharts>
</template>

<script>
import Highcharts from 'highcharts'

export default {
  async asyncData({ app }) {
    const fetchedData = await app.$axios.get('/api/activity')
    const counts = fetchedData.data.counts
    return { counts }
  },
  data() {
    return {
      options: {
        chart: {
          type: 'column'
        },
        title: {
          text: "Activity for 48h"
        },
        xAxis: {
          categories: [],
          crosshair: true,
          reversed: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Recipes'
          }
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Activity',
          data: []
        }]
      },
      highcharts: Highcharts
    }
  },
  middleware: ['auth', 'admin'],
  created() {
    this.options.series[0].data = this.counts
    let d = new Date()
    let minusDate = new Date()
    const oneHour = 60 * 60 * 1000
    for (let i = 1; i < 49; i++) {
      this.options.xAxis.categories.push(minusDate.getHours())
      minusDate = new Date(d.getTime() - oneHour)
      d = minusDate
    }
  }
}
</script>
