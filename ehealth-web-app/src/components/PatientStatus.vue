<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <h2>Patient Status</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="6">
                    <b-row>
                        <b-col>
                            <md-card class="data-box">
                                <md-card-header>
                                    <b-row>
                                        <b-col cols="6">
                                            <span class="md-title">Patient Risk Level :</span>
                                        </b-col>
                                        <b-col cols="6" class="data-box-value">
                                            <span class="md-title" >20%</span>
                                        </b-col>
                                    </b-row>
                                </md-card-header>
                            </md-card>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col >
                            <md-card class="data-box">
                                <md-card-header>
                                    <b-row>
                                        <b-col cols="6">
                                            <div class="md-title">Patient Last Checkup :</div>
                                        </b-col>
                                        <b-col cols="6" class="data-box-value">
                                            <span class="md-title" >22/07/2005</span>
                                        </b-col>
                                    </b-row>

                                </md-card-header>
                            </md-card>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col cols="6">
                    <b-row>
                        <b-col >
                            <md-card class="data-box">
                                <md-card-header>
                                    <md-switch class="md-title" v-model="flag_patient">Flag Patient Data</md-switch>
                                </md-card-header>
                            </md-card>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col >
                            <md-card class="data-box">
                                <md-card-header>
                                    <md-switch class="md-title" v-model="add_to_watch_list">Add Patient To Watch List</md-switch>
                                </md-card-header>
                            </md-card>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <span class="md-display-1">Patient Data</span>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <md-field>
                        <label>Patient Analysis</label>
                        <md-textarea v-model="textarea"></md-textarea>
                    </md-field>
                </b-col>
                <b-col>
                    <md-field>
                        <label>Prescribed Actions</label>
                        <md-textarea v-model="textarea"></md-textarea>
                    </md-field>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <b-row>
                        <b-col cols="12">
                            <span class="md-display-2">Appointment Response</span>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col cols="12">
                            <span class="md-display-1">{{this.appointment.message}}</span>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-col>
    </b-row>





</template>

<script>
    import * as firebase from "firebase";

    export default {
        name: "PatientStatus",
        props: {
            patient: {
                type: Object,
                required: true,
            }
        },
        data(){
            return {
                lastCheckup: null,
                patientAnalysis: "" ,
                prescribedActions: "",
                appointment: null
            }
        },
        mounted() {
            let that = this;
            setTimeout(function () {

                // eslint-disable-next-line no-console
                console.log(JSON.stringify(that.patient))
                let ref = firebase.database().ref('appointments')
                ref.orderByChild('patientId')
                    .equalTo(that.patient.uid)
                    .once('value', (snapshot) =>{
                        let respose = snapshot.val()
                        // eslint-disable-next-line no-console
                        console.log(JSON.stringify(respose));
                        let appointments = [];
                        for(let key in respose) {
                            if (!respose.hasOwnProperty(key)) continue;
                            appointments.push(respose[key]);
                        }
                        appointments = appointments.filter(value => {
                            return value.from === "patient";
                        });

                        appointments = appointments.sort(function (a, b) {
                            return b.time - a.time;
                        });
                        if (appointments.length > 0) {
                            that.appointment = appointments[0];
                        }

                    });
            }, 3000)
        },
        watch: {

        },
        computed:{
        }
    }
</script>

<style scoped>

    .data-box {
        height: 80px;
    }

    .data-box-value {
        text-align: right;
    }

</style>