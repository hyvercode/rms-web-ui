<template>
  <div class="bar-control-chart">
    <GChart
        :settings="{ packages: ['bar', 'corechart', 'controls'] }"
        :data="chartData"
        :options="chartOptions"
        :createChart="(el, google) => new google.charts.Bar(el)"
        @ready="onChartReady"
    />
  </div>
</template>

<script>
import {GChart} from "vue-google-charts";

export default {
  name: "BarControlChart",
  components: {
    GChart,
  },
  props: {
    chartData: Array,
    title: String,
    subtitle: String
  },
  data() {
    return {
      chartsLib: null
    }
  },
  computed: {
    chartOptions() {
      if (!this.chartsLib) return null;
      return this.chartsLib.charts.Bar.convertOptions({
        chart: {
          title: this.title,
          subtitle: this.subtitle,
        },
        width: "100%",
        height: 450,
        legend: {position: "bottom", maxLines: 4},
        bar: {groupWidth: "30%"},
        isStacked: true,
        series: {0: {color: '#E6242C'},1: {color: '#FF8828'}, 2: {color: '#F2D422'}, 3: {color: '#148DCD'}, 4: {color: '#00cc00'}},
      });
    },
  },
  methods: {
    onChartReady(chart, google) {
      this.chartsLib = google;
    },
  },
};
</script>
<style>
.bar-control-chart {
  margin-top: 35px;
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 30px;
}
</style>
