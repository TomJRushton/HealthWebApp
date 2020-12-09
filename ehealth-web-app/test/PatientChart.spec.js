import {shallowMount} from '@vue/test-utils'
import PatientChart from "../src/components/PatientChart";

describe('PatientChart.vue', () => {

    // Due to the way vue chart js is created, we cant run assertions on the data we put into the chart so we just
    // check that we can create a chart with and without data.

    it('Check basic initialisation with no data', () => {
        const wrapper = shallowMount(PatientChart, {
            propsData: {
                chartData: {}
            }
        });
        expect(wrapper.isVueInstance()).toBeTruthy();
    });

    it('Check basic initialisation with data', () => {
        const wrapper = shallowMount(PatientChart, {
            propsData: {
                chartData: {
                    datasets: [{
                        label: 'Label One',
                        backgroundColor: '#0028f8',
                        borderColor: '#0028f8',
                        data: [1, 2, 3, 4, 5, 6],
                        fill: false
                    }]
                }
            }
        });
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
});
