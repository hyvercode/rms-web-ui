<template>
  <div class="combo-chart">
    <GChart type="ComboChart" :data="chartData" :options="chartOptions"/>
  </div>
</template>

<script>
import {GChart} from "vue-google-charts";

export default {
  name: "ComboChart",
  components: {
    GChart
  },
  props: {
    chartData: Array,
    title: String
  },
  data() {
    return {
      chartOptions: {
        title: this.title,
        seriesType: 'bars',
        series: {2: {type: 'line'}},
        height: 450,
        width: "100%",
        legend: {position: "right", maxLines: 3},
        bar: {groupWidth: "30%"},
        isStacked: true,
      }
    };
  }
};
</script>
<style>
.combo-chart {
  margin-top: 35px;
  background-color: #FFFFFF;
  border-radius: 10px;
}
</style>