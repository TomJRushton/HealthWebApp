import {mount} from '@vue/test-utils'
import PatientData from "../src/views/PatientData";

// Define a mock router to avoid runtime error
const $route = {
    params: {
        patient_id: 'not_used'
    }
};

describe('PatientData.vue', () => {
    it('Check initialisation with valid patient', () => {
        const wrapper = mount(PatientData, {
            mocks: {
              $route
            },
            mounted() {
                // override firebase
            },
            data() {
                return {
                    patient: {
                        displayName: "Hans Doleman",
                        dob: {
                            time: 827356047844,
                            timezoneOffset: 0,
                            year: 96
                        },
                        gender: "Male",
                        height: 171,
                        lastSynced: {
                            time: 1584565646784,
                            timezoneOffset: 0,
                            year: 120
                        },
                        photoUrl: "https://i.picsum.photos/id/0/100/100.jpg",
                        uid: "patient-1",
                        weight: 80,
                    },
                }
            },
            stubs: {
                PatientChart: true,
                DataTable: true,
                PatientStatus: true
            }
        });
        expect(wrapper.isVueInstance()).toBeTruthy()
        expect(wrapper.find('.md-display-2').text()).toBe('Patient Info - Hans Doleman')

    });

    it('Check invalid id', () => {
        const wrapper = mount(PatientData, {
            mocks: {
                $route
            },
            mounted() {
                // override firebase
            },
            data() {
                return {
                    invalid_id: true
                }
            },
            stubs: {
                PatientChart: true,
                DataTable: true,
                PatientStatus: true,
                'md-label': true
            }
        });
        expect(wrapper.isVueInstance()).toBeTruthy()
        expect(wrapper.find('.md-dialog-title').text()).toBe('Invalid Patient')
        expect(wrapper.find('.md-button-content').find('md-label-stub').text()).toBe('Return')
    });
});
