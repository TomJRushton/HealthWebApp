<template>
    <div id="patientview">
        <div v-if="invalid_id === false">
            <div>
                <span class="md-display-2">Patient Info - {{patient.displayName}}</span>
            </div>
            <b-container fluid>
                    <b-row>
                        <b-col cols="3">
                            <b-col class="buttonContainer">
                                <div class="md-layout-item custom-align-left">
                                    <md-checkbox v-model="filtersArray" value="stepCount">Step Activity</md-checkbox>
                                </div>
                                <div class="md-layout-item custom-align-left">
                                    <md-checkbox v-model="filtersArray" value="heartRate">Heart Rate</md-checkbox>
                                </div>
                                <div class="md-layout-item custom-align-left">
                                    <md-checkbox v-model="filtersArray" value="bloodPressure">Blood Pressure</md-checkbox>
                                </div>
                            </b-col>
                            <br>

                            <div class="md-layout-item custom-align-left">
                                <label for="selectedDate">Select Date</label>
                                <md-datepicker id="selectedDate" v-model="selectedDate">
                                    <label>Select date</label>
                                </md-datepicker>
                            </div>
                            <br>

                            <div class="md-layout-item custom-align-left">Time Frame
                                <md-field>
                                    <label for="timeFrameFilter">Add Time Frame</label>
                                    <md-select v-model="timeFrameFilter" name="timeFrameFilter" id="timeFrameFilter"
                                               md-dense>
                                        <md-option value="daily">Daily</md-option>
                                        <md-option value="weekly">Weekly</md-option>
                                        <md-option value="monthly">Monthly</md-option>
                                        <md-option value="yearly">Yearly</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                            <div>
                                <md-dialog-prompt
                                        :md-active.sync="active"
                                        v-model="appointmentText"
                                        md-title="Appointment - Set Up"
                                        md-content="Enter the reason for wanting to arrange an appointment, please provide enough valid information for your patient, so the proper urgency is used."
                                        md-input-maxlength="150"
                                        md-input-placeholder="Enter reason here..."
                                        md-confirm-text="Submit"/>
                                <md-button class="md-primary md-raised" @click="active = true">Set Up Appointment
                                </md-button>
                            </div>
                        </b-col>
                        <b-col cols="9">
                            <b-row >
                                <b-col>
                                    <PatientChart  :chart-data="this.chartData"/>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col style="flex-grow: 1; max-width: 100%">
                                    <data-table :data="this.table_data"/>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <patient-status v-bind:patient="this.patient"/>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
            </b-container>

        </div>
        <div v-else>
            <md-dialog :md-active="true">
                <md-dialog-title>Invalid Patient</md-dialog-title>
                <md-list>
                    <md-list-item>
                        <md-content>You have selected an invalid patient. Please revisit the patient table and select a
                            valid patient.
                        </md-content>
                        <md-button to="/">
                            <md-label>Return</md-label>
                        </md-button>
                    </md-list-item>
                </md-list>
            </md-dialog>
        </div>

        <md-dialog :md-active.sync="noMeasurements">
            <md-dialog-title>No Measurements for Date</md-dialog-title>
            <md-list>
                <md-list-item>
                    <md-content>
                        <p>You have selected a date where no data exists.
                            The latest dates before {{selectedDate.toUTCString()}} which contain data are: </p>
                        <ul>
                            <li v-for="(value, name) in latestDates" :key="name">
                                {{name}}: {{value.toUTCString()}}
                            </li>
                        </ul>
                    </md-content>
                </md-list-item>
            </md-list>
        </md-dialog>
    </div>
</template>


<script>
    import PatientChart from "../components/PatientChart";
    import * as firebase from "firebase";
    import DataTable from "../components/DataTable.vue";
    import PatientStatus from "../components/PatientStatus";
    import Util from "../js/Util";

    export default {
        name: 'DenseSelect',
        components: {
            PatientStatus,
            DataTable,
            PatientChart
        },
        data: () => ({
            filtersArray: [],
            timeFrameFilter: null,
            selectedDate: new Date(),
            latestDates: {},
            chartData: {},
            patient: {},
            invalid_id: false,
            active: false,
            appointmentText: null,
            flag_patient: false,
            add_to_watch_list: false,
            noMeasurements: false,
            table_data: {
                diastolicValue: [],
                systolicValue: [],
                stepCount: [],
                max: [],
                min: [],
                average: []
            }
        }),
        methods: {
            refreshChart: async function () {
                let endRange = new Date(this.selectedDate.getTime());
                switch (this.timeFrameFilter) {
                    case "daily":
                        endRange = endRange.addDays(1);
                        break;
                    case "weekly":
                        endRange = endRange.addDays(7);
                        break;
                    case "monthly":
                        endRange = endRange.addDays(30);
                        break;
                    case "yearly":
                        endRange = endRange.addDays(365);
                        break;
                    default:
                        endRange = endRange.addDays(1);
                        break;
                }

                const inRange = function(date, first, second){
                   return first.getTime() <= date.getTime() && date.getTime()  <= second.getTime()
                };

                // Function for building the dataset so we are not duplicating code per filter.
                const buildDataset = async function(componentReference, datasets, dbRef, map, labelName, isPrimary) {
                    if (componentReference.filtersArray.includes(dbRef)) {
                        if (componentReference.invalid_id === false) {
                            let ref = firebase.database().ref(dbRef);
                            let localDataset = componentReference.table_data;
                            Object.keys(map).forEach((key) => {
                                localDataset[key] = [];
                            });
                            // Stores when the closest date in is relation to the selected date.
                            let latestDate;
                            // Get all blood pressure database objects for the patient.
                            await ref.child(componentReference.patient.uid)
                                .once('value', (snapshot) => {
                                    let measurements = snapshot.val();
                                    // Iterate over each measurement and use it to build up separate.
                                    for (let key in measurements) {
                                        let entry = measurements[key];
                                        // Parse the stored date into something we can use for comparison.
                                        let created = new Date(entry.timestamp.time);
                                        // Check that the date is later than the current latest date but before the
                                        // selected date. If so set latest date to the date this measurement was created.
                                        if (latestDate == null || (created > latestDate
                                            && created < componentReference.selectedDate)) {
                                            latestDate = created;
                                        }
                                        // Check that the created date is within the given timeframe and if so, we push the
                                        // values in a way chart js can understand into the datasets we created earlier.
                                        if (componentReference.selectedDate &&
                                            inRange(created, componentReference.selectedDate, endRange)) {
                                            Object.keys(map).forEach((key) => {
                                                localDataset[key].push({
                                                    x: new Date(entry.timestamp.time),
                                                    y: Reflect.get(entry, key)
                                                });
                                            });
                                        }
                                    }
                                }).finally(() => {
                                    // After we created the datasets, check if one of them is empty. If so then we display
                                    // a dialog that states the closest date that contains data to the user. We only need to
                                    // check the one dataset as both datasets are derived from the same dates.
                                    if (localDataset[Object.keys(map)[0]].length === 0) {
                                        componentReference.latestDates[labelName] = latestDate;
                                        componentReference.noMeasurements = true;
                                    }

                                    // Push both local datasets into the main data variable that will be passed to the
                                    // graph.
                                    Object.keys(map).forEach((key) => {
                                        let subset = {
                                            label: map[key],
                                            backgroundColor: Util.stringColour(map[key]),
                                            borderColor: Util.stringColour(map[key]),
                                            data: localDataset[key],
                                            fill: false
                                        };
                                        if (!isPrimary) {
                                            subset['yAxisID'] = 'secondary';
                                        }
                                        datasets.push(subset);
                                    });
                                });
                        }
                    }
                };

                // Define dataset to build up.
                let datasets = [];
                // Define storage for latest dates each data is available. Also resets the var when the graph is
                // refreshed.
                this.latestDates = {};

                // Build the Blood Pressure dataset
                await buildDataset(this, datasets, 'bloodPressure',
                    {diastolicValue: 'Diastolic', systolicValue: 'Systolic'}, 'Blood Pressure', true
                );

                // Build the Heart Rate dataset
                await buildDataset(this, datasets, 'heartRate',
                    {max: 'Max', min: 'Min', average: 'Average'}, 'Heart Rate', true
                );

                // Build the Step Count dataset
                await buildDataset(this, datasets, 'stepCount',
                    {stepCount: 'Step Count'}, 'Step Count', false
                );

                // eslint-disable-next-line no-console
                console.log(this.table_data);

                // Finally, take the built up dataset and update the chart data with it. The chart is reponsive so will
                // auto detect data changes.
                this.chartData = {datasets : datasets};
            }
        },
        watch: {
            // eslint-disable-next-line no-unused-vars
            appointmentText: function (newVal, oldVal) {
                if (newVal != null) {
                    let newPostKey = firebase.database().ref().child('appointments').push().key;

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    let updates = {};

                    let patientId = this.patient.uid;
                    updates['/appointments/' + newPostKey] = {
                        id: newPostKey,
                        from: "doctor",
                        patientId: patientId,
                        message: newVal,
                        time: Date.now()
                    };

                    firebase.database().ref().update(updates);
                }
            },
            // When time frame, selected date or the filters changes then refresh the chart
            timeFrameFilter: function(){
                this.refreshChart();
            },
            selectedDate: function () {
                this.refreshChart();
            },
            filtersArray: function () {
                this.refreshChart();
            }
        },
        mounted() {
            // Check we have a patient id in the route params.
            if (this.$route.params.patient_id == null) {
                // If not found then set invalid id flag. This renders the a dialog to redirect a user back to the
                // patient table.
                this.invalid_id = true;
            } else {
                // If the id exists then we use it to lookup the patient in the database.
                firebase.database().ref('/patients')
                    .child(this.$route.params.patient_id)
                    .once('value').then((snapshot) => {
                    if (snapshot.val() != null) {
                        this.patient = snapshot.val()
                    } else {
                        this.invalid_id = true;
                    }
                });
            }
        }
    }
</script>

<style scoped>

    #patientview {
        margin: 20px;
    }

    .container-dropdowns {
        /*margin-right: 0;*/
        /*margin-left: 0;*/
        width: 90%;
        display: inline;
    }

    .container-table {
        /*margin-right: 0;*/
        /*margin-left: 0;*/
        width: 90%;
        display: inline;
    }


    .custom-align-left {
        text-align: left;
    }

</style>
