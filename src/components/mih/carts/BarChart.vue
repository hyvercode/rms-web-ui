<template>
  <div class="bar-chart mt-4">
    <GChart
        :settings="{packages: ['bar']}"
        :data="chartData"
        :options="chartOptions"
        :createChart="(el, google) => new google.charts.Bar(el)"
        @ready="onChartReady"
    />
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
export default {
  name: 'BarChart',
  components: {
    GChart
  },
  props: {
    chartData: Array,
    title: String,
    subtitle: String,
    bars:String
  },
  data () {
    return {
      chartsLib: null,
    }
  },
  computed: {
    chartOptions () {
      if (!this.chartsLib) return null
      return this.chartsLib.charts.Bar.convertOptions({
        chart: {
          title: this.title,
          subtitle: this.subtitle
        },
        bars: this.bars,
        hAxis: { format: 'decimal' },
        height: 400,
        colors: ['#148DCD', '#ED3439', '#7570b3']
      })
    }
  },
  methods: {
    onChartReady (chart, google) {
      this.chartsLib = google
    }
  }
}
</script>