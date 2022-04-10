<template>
  <div class="area-chart mt-4">
    <GChart
        type="AreaChart"
        :data="chartData"
        :options="chartOptions"
    />
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";
const dataset = [
  [new Date(2018, 9, 1, 2, 52), Math.floor(Math.random() * Math.floor(300)), 'point { fill-color: #fff; stroke-color: #1c91c0}'],
  [new Date(2018, 9, 1, 3, 52), Math.floor(Math.random() * Math.floor(300)), 'point { fill-color: #fff; stroke-color: #1c91c0}'],
  [new Date(2018, 9, 1, 4, 52), Math.floor(Math.random() * Math.floor(300)), 'point { fill-color: #fff; stroke-color: #1c91c0}'],
  [new Date(2018, 9, 1, 5, 52), Math.floor(Math.random() * Math.floor(300)), 'point { fill-color: #fff; stroke-color: #1c91c0}'],
  [new Date(2018, 9, 1, 6, 52), Math.floor(Math.random() * Math.floor(300)), 'point { fill-color: #fff; stroke-color: #1c91c0}'],
  [new Date(2018, 9, 1, 7, 52), Math.floor(Math.random() * Math.floor(300)), null],
  [new Date(2018, 9, 1, 8, 52), Math.floor(Math.random() * Math.floor(300)), null],
  [new Date(2018, 9, 1, 9, 52), Math.floor(Math.random() * Math.floor(300)), null],
  [new Date(2018, 9, 1, 10, 52), Math.floor(Math.random() * Math.floor(300)), null],
  [new Date(2018, 9, 1, 11, 52), null, 'point { fill-color: #fff; stroke-color: #1c91c0}'],
  [new Date(2018, 9, 1, 12, 52), -200, null],
  [new Date(2018, 9, 1, 13, 52), Math.floor(Math.random() * Math.floor(300)), null],
];
export default {
  name: "AreaChart",
  components: {
    GChart
  },
  data() {
    return {
      chartData: [
        [
          { type: "datetime", label: "Time"},
          { type: "number", label: "Level" },
          { type: "string", role: "style" },
        ],
        ...dataset,
      ],
      chartOptions: {
        chart: {
          title: "Cassidy Wellhead Corrosion & Scale Inhibitor CDS1",
        },
        vAxis: {
          format: 'short',
          maxValue: 320,
          minValue: -230,
          // textPosition: 'none',
          baselineColor: '#777',
          ticks: Array.apply(null, { length: 13 }).map((v, idx) => idx * 50 - 300),
        },
        hAxis: {
          // @see http://icu-project.org/apiref/icu4c/classSimpleDateFormat.html#_details
          format: 'hh:mma MM/dd',
          ticks: dataset.map(i => i[0]),
          slantedText: true,
          slantedTextAngle: 90,
          showTextEvery: 1,
          // textPosition: 'none',
          // maxValue: new Date(2018, 9, 4),
        },
        legend: 'none',
        crosshair: {
          trigger: 'both',
          orientation: 'vertical',
          color: 'gray',
          opacity: .3,
          selected: {
            color: 'red',
            opacity: .3,
          },
        },
        series: {
          0: {
            lineWidth: 3,
            color: '#1c91c0',
            pointShape: 'circle',
            pointSize: 4,
            dataOpacity: 1,
            areaOpacity: .3,
          },
        },
        aggregationTarget: 'category',
        tooltip: {
          trigger: 'both',
        },
        focusTarget: 'category',
        backgroundColor: {
          stroke: '#666',
          strokeWidth: 0,
          fill: 'transparent',
        },
        chartArea: {
          left: 35,
          right: 10,
          top: 15,
          height: 200,
        },
        // explorer: {},
        interpolateNulls: false,
        height: 320,
      },
    };
  },
};
</script>
