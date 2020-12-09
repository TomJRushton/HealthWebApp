import {Line, mixins} from 'vue-chartjs'

const {reactiveProp} = mixins

// Wrapper for the vue-chartjs line chart. Made so we can setup the configs in a separate file.
export default {
    extends: Line,
    mixins: [reactiveProp],
    data() {
        return {
            options: { //Chart.js options
                scales: {
                    yAxes: [
                        // Default axis for the blood pressure and heart rate.
                        // Defined on the same axis as they will always have values between 50-200
                        {
                            id: 'default',
                            position: 'left',
                        },
                        // Secondary axis for the step count. Defined on it's own axis as it can be 10000+
                        {
                            id: 'secondary',
                            position: 'right',
                            gridLines: {
                                display: false
                            }
                        },
                    ],
                    xAxes: [{
                        type: 'time',
                        distribution: 'linear',
                        time: {
                            unit: 'hour'
                        },
                        gridLines: {
                            display: false
                        }
                    }]
                },
                legend: {
                    display: true
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    mounted() {
        this.renderChart(this.chartData, this.options)
    }
}
