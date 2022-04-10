<template>
  <div class="gauge-chart mt-4">
    <GChart
        :settings="{ packages: ['corechart', 'gauge'] }"
        type="Gauge"
        :data="chartData"
        :options="chartOptions"
    />
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";
export default {
  name: "GaugeChart",
  components: {
    GChart,
  },
  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      chartData: [
        ["dummy", "Rpm", "Oil pressure", "Temperature", "Voltage"],
        ["dummy", 10, 400, 200, 12],
      ],
      chartOptions: {
        height: 700,
        greenFrom: 0,
        greenTo: 75,
        yellowFrom: 75,
        yellowTo: 90,
        redFrom: 90,
        redTo: 100,
        minorTicks: 5,
      },
    };
  },
};
</script>
