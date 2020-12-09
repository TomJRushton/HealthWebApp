<template>
    <div>
        <md-table v-model="searched" md-sort="name" class="overflow" md-card md-fixed-header>
            <md-table-toolbar>
                <div class="md-toolbar-section-start">
                    <div>
                        <md-field md-clearable class="md-toolbar-section-end">
                            <label>Search by name...</label>
                            <md-input v-model="search" @input="searchOnTable" />
                        </md-field>
                    </div>
                </div>
            </md-table-toolbar>
            <md-table-row @click=selectPatient(patient) v-for="patient in searched" :key="patient.displayName">
                <md-table-cell md-label="Priority" md-sort-by="priority">{{ patient.priority }}</md-table-cell>
                <md-table-cell md-label="First Name" md-sort-by="firstname">{{ patient.firstName }}</md-table-cell>
                <md-table-cell md-label="Surname" md-sort-by="surname">{{ patient.surname }}</md-table-cell>
                <md-table-cell md-label="Date Of Birth" md-sort-by="dob">{{ patient.dob }}</md-table-cell>
                <md-table-cell md-label="Gender" md-sort-by="gender">{{ patient.gender }}</md-table-cell>
            </md-table-row>
        </md-table>
        <!--  
            // * This is Sam Unwin's individual contribution in this assignment
            This is the HTML structure for a Floating Action Button that opens
            a dialog that allows the doctor to add himself as a patient's doctor
            which will then refresh the table and add the patient to it.
            -->
        <md-button class="md-fab" @click="showAddDialog = true">
            <md-icon>add</md-icon>
        </md-button>
        <md-dialog :md-active.sync="showAddDialog">
            <md-dialog-title>Add a Patient</md-dialog-title>
            <md-list>
                <md-list-item>
                    <md-autocomplete v-model="addedPatient" :md-options="allPatientNames">
                        <label>Patient name</label>

                        <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                            <md-highlight-text :md-term="term">{{ item.displayName }}</md-highlight-text>
                        </template>

                        <template slot="md-autocomplete-empty" slot-scope="{ term }">
                            No patients matching "{{ term }}" were found.
                        </template>
                    </md-autocomplete>
                    <md-button>
                        <md-label @click="addPatient">Add</md-label>
                    </md-button>
                </md-list-item>
            </md-list>
        </md-dialog>
        <!-- // * End of part 1 of Sam Unwin's individual contribution 
            Below is JS code that goes along this HTML 
            -->
    </div>

</template>

<script>
    import * as firebase from "firebase";

    const toLower = text => {
        return text.toString().toLowerCase()
    }
    const searchByName = (items, term) => {
        if (term) {
            return items.filter(items => toLower(items.displayName).includes(toLower(term)));
        }
        return items
    }

    export default {
        name: "Home",
        data : () => ({
            database: firebase.database(),
            search: "",
            searched: [],
            patients: [],
            allPatients: [],
            addedPatient: null,
            showAddDialog: false,
        }),
        methods: {
            searchOnTable () {
                this.searched = searchByName(this.patients, this.search)
            },
            selectPatient (patient) {
                this.$router.push({ name: 'PatientData', params: { patient_id: patient.uid } })
            },
            // * This is part 2 of Sam Unwin's individual contribution to this assignment
            addPatient () {
                let updates = {};
                updates['/patients/' + this.addedPatient.uid + '/doctorId'] = firebase.auth().currentUser.uid;

                this.database.ref().update(updates);

                this.showAddDialog = false;

                this.refreshPatients();
            },
            // * End of Sam Unwin's contribution to this assignment
            
            /**
             * ! refreshPatients reloads the patients values from the Firebase
             * ! database, and reloads them into the the 'allPatients' and 'searched'
             * ! values in the page's context, only if their doctor's ID is equal to
             * ! the current user's ID. These are then used in the table of patients
             * ! below on the page.
             * @param
             * @return
             */
            refreshPatients() {
                let that = this;
                this.database.ref('/patients').once('value').then(function(snapshot) {
                    let temp = [];
                    for (let [key, value] of Object.entries(snapshot.val())) {

                        // Push all the values, despite if the current user is their doctor,
                        // onto the allPatients array
                        that.allPatients.push(value);

                        // However, only push the values onto the temp array
                        // if the patient's doctor is the current user.
                        if(value.doctorId === firebase.auth().currentUser.uid) {
                            value.uid = key;
                            value.dob = new Date(value.dob.time).toLocaleDateString();
                            temp.push(value);
                        }
                    }
                    that.searched = temp;
                    that.patients = temp;
                });
            }
        },
        computed: {
            /**
             * ! allPatientNames is a computed function which is only run when,
             * ! the value needs to be updated. It maps the values of each
             * ! of the patients to a value in the 'allPatients' array in the 
             * ! page context. The toLowerCase and toString are mapped to a 
             * ! lambda function that, calculates the lower case values of a string
             * ! and returns a string version of an object, respectively. 
             * @params
             * @return 'allPatients' array, containing a list of patients with
             *          properly formatted and calculated values.
             */
            allPatientNames() {
                return this.allPatients.map(patient => ({
                    'uid': patient.uid,
                    'displayName': patient.displayName,
                    'toLowerCase': () => patient.displayName.toLowerCase,
                    'toString' : () => patient.displayName
                }));
            }
        },
        mounted () {
            this.refreshPatients();
        }
    }
</script>

<style scoped>
    .md-title {
        padding: 20px;
    }
    .md-table {
        width: 90%;
        margin-left: auto;
        margin-right: auto;
        border-radius: 5px;
    }
    .md-table-cell {
        text-align: left;
    }
    .md-fab {
        float: right;
        position: fixed;
        right: 100px;
    }
    .md-dialog {
        z-index: 8;
    }
    .md-toolbar-section-end {

    }
    input {
        border-radius: 10px;
    }

    .overflow {
        overflow-x: hidden;
    }
</style>
