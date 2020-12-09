<template>
    <div id="chart">
        <line-chart :chart-data="chartData"></line-chart>
    </div>
</template>

<script>
    import LineChart from "../js/LineChart";

    // Wrapper for a pre configured line chart
    export default {
        name: "PatientChart",
        components: {
            LineChart
        },
        props: {
            chartData: null
        },
    }
</script>

<style scoped>

</style>
