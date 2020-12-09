import {mount} from '@vue/test-utils'
import Home from "../src/views/Home";
import * as firebase from "firebase";

let patients = {
    "patient-1": {
        firstName: "Hans",
        surname: "Doleman",
        dob: {
            time: 827356047844,
            timezoneOffset: 0,
            year: 96
        },
        gender: "Male",
        uid: "patient-1",
    }
};
const snapshot = {val: () => patients};

const database = () => {
    return {
        ref: jest.fn().mockReturnThis(),
        update: jest.fn(() => Promise.resolve({val: () => true})),
        once: jest.fn(() => Promise.resolve(snapshot))
    }
};

const auth = () => {
    return {
        currentUser: {
            uid: 'doctor-1',
            displayName: 'Dr Nicolas',
            email: 'nick@example.com',
            emailVerified: true
        },
    }
};

jest.spyOn(firebase, 'initializeApp')
    .mockImplementation(() => {
        return {
            auth: auth
        }
    });

jest.spyOn(firebase, 'auth').mockImplementation(auth);

jest.spyOn(firebase, 'database').mockImplementation(database);

describe('Home.vue', () => {

    it('Check initialisation of doctor with no patients assigned', async () => {
        const wrapper = mount(Home, {
            stubs: {
                'md-label': true
            }
        });
        const currentUser = await firebase.auth().currentUser;
        expect(currentUser).toEqual({
            uid: 'doctor-1',
            displayName: 'Dr Nicolas',
            email: 'nick@example.com',
            emailVerified: true
        });
        expect(wrapper.vm.patients).toStrictEqual([]);
        expect(wrapper.vm.allPatients).toStrictEqual([patients["patient-1"]]);
    });

    it('Check we can assign a patient to the doctor', async () => {
        const wrapper = mount(Home, {
            stubs: {
                'md-label': true,
                'md-autocomplete': true
            }
        });
        let currentUser = await firebase.auth().currentUser;
        expect(currentUser).toEqual({
            uid: 'doctor-1',
            displayName: 'Dr Nicolas',
            email: 'nick@example.com',
            emailVerified: true
        });
        let dialog = wrapper.find("div.md-dialog");
        expect(dialog.exists()).toBe(false);
        expect(wrapper.vm.patients).toStrictEqual([]);
        expect(wrapper.vm.allPatients).toStrictEqual([patients["patient-1"]]);
        const fab = wrapper.find("button.md-fab");
        fab.trigger('click');
        await wrapper.vm.$nextTick();
        dialog = wrapper.find("div.md-dialog");
        expect(dialog.exists()).toBe(true);
        expect(dialog.find('.md-title').text()).toBe('Add a Patient');
        //dialog.find("input.md-input").setValue("not used");
        wrapper.vm.addedPatient = {
            firstName: "Hans",
            surname: "Doleman",
            dob: {
                time: 827356047844, // Wednesday, March 20, 1996 9:07:27.844 PM
                timezoneOffset: 0,
                year: 96
            },
            gender: "Male",
            uid: "patient-1",
        };
        wrapper.vm.addPatient();
        await firebase.database().ref().update();
        dialog = wrapper.find("div.md-dialog");
        let updated = {
            "patient-1": {
                firstName: "Hans",
                surname: "Doleman",
                dob: {
                    time: 827356047844, // Wednesday, March 20, 1996 9:07:27.844 PM
                    timezoneOffset: 0,
                    year: 96
                },
                gender: "Male",
                doctorId: 'doctor-1',
                uid: "patient-1",
            }
        };
        firebase.database().ref().once = jest.fn(() => Promise.resolve({val: () => updated}));
        const patient = await firebase.database().ref().once();
        expect(patient.val()).toEqual(patients);
        currentUser = await firebase.auth().currentUser;
        expect(currentUser).toEqual({
            uid: 'doctor-1',
            displayName: 'Dr Nicolas',
            email: 'nick@example.com',
            emailVerified: true
        });
        expect(dialog.exists()).toBe(false);
    });

    it('Check a doctor can see assigned patients', async () => {
        let updated = {
            "patient-1": {
                firstName: "Hans",
                surname: "Doleman",
                dob: {
                    time: 827356047844, // Wednesday, March 20, 1996 9:07:27.844 PM
                    timezoneOffset: 0,
                    year: 96
                },
                gender: "Male",
                doctorId: 'doctor-1',
                uid: "patient-1",
            }
        };
        const database = () => {
            return {
                ref: jest.fn().mockReturnThis(),
                update: jest.fn(() => Promise.resolve({val: () => true})),
                once: jest.fn(() => Promise.resolve({val: () => updated}))
            }
        };
        jest.spyOn(firebase, 'database').mockImplementation(database);

        const wrapper = mount(Home, {
            stubs: {
                'md-label': true
            }
        });

        const currentUser = await firebase.auth().currentUser;
        expect(currentUser).toEqual({
            uid: 'doctor-1',
            displayName: 'Dr Nicolas',
            email: 'nick@example.com',
            emailVerified: true
        });
        const patient = await firebase.database().ref().once();
        const expectedPatients = {
            "patient-1": {
                firstName: "Hans",
                surname: "Doleman",
                dob: new Date("1996-3-20").toLocaleDateString(),
                gender: "Male",
                doctorId: 'doctor-1',
                uid: "patient-1",
            }
        };
        expect(patient.val()).toEqual(expectedPatients);

        expect(wrapper.vm.patients).toStrictEqual([expectedPatients["patient-1"]]);
        expect(wrapper.vm.allPatients).toStrictEqual([expectedPatients["patient-1"]]);

        const tableBody = wrapper.find('tbody');
        const patientRow = tableBody.findAll("tbody > tr > td");
        expect(patientRow.isEmpty()).toBe(false);
        expect(patientRow.length).toBe(5);
        expect(tableBody.find("tbody > tr > td:nth-child(2) > div").text()).toBe('Hans');
        expect(tableBody.find("tbody > tr > td:nth-child(3) > div").text()).toBe('Doleman');
        expect(tableBody.find("tbody > tr > td:nth-child(4) > div").text()).toBe(new Date("1996-3-20").toLocaleDateString());
        expect(tableBody.find("tbody > tr > td:nth-child(5) > div").text()).toBe('Male');
    });
});
