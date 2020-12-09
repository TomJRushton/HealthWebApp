import {mount} from '@vue/test-utils'
import DataTable from "../src/components/DataTable";

describe('DataTable.vue', () => {

    let dt = new Date();

    it('Check basic initialisation with data', () => {
        const wrapper = mount(DataTable, {
            propsData: {
                data: {
                    stepCount: [
                        {x: dt, y: 33},
                        {x: dt, y: 34},
                        {x: dt, y: 57},
                        {x: dt, y: 84},
                        {x: dt, y: 213},
                        {x: dt, y: 68}
                    ],
                }
            }});
        expect(wrapper.isVueInstance()).toBeTruthy();

        // Check we have the correct amount of table elements
        expect(wrapper.findAll("table > tbody > tr > td > b").length).toBe(18);
        // Assert on the first element
        const firstRow = wrapper.find("table > tbody > tr:nth-child(1)");

        expect(firstRow.exists()).toBe(true);
        const cols = firstRow.findAll("td > b");
        expect(cols.length).toBe(3);

        const dtOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        expect(cols.at(0).text()).toBe(dt.toLocaleDateString(undefined, dtOptions));
        expect(cols.at(1).text()).toBe('Step Count');
        expect(cols.at(2).text()).toBe('33');
    });
});
