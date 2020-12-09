<template>
    <div id="app">
        <div id="navbar" v-if="this.currentUser != null">
            <md-dialog :md-active.sync="showDetailsDialog">
                <md-dialog-title>Account Details</md-dialog-title>
                <md-list>
                    <md-list-item>
                        <MaterialAvatar :account-details="accountDetails" :large="true"/>
                    </md-list-item>

                    <md-subheader>Name</md-subheader>

                    <md-list-item>
                        <div class="md-list-item-text">
                            <span>{{ accountDetails ? accountDetails.displayName : "" }}</span>
                        </div>
                        <md-button class="md-icon-button md-list-action" @click="editAccount('displayName')" >
                            <md-icon>edit</md-icon>
                        </md-button>
                    </md-list-item>

                    <md-subheader>Email</md-subheader>
                    <md-list-item>
                        <div class="md-list-item-text">
                            <span>{{ accountDetails ? accountDetails.email : "" }}</span>
                        </div>
                        <md-button class="md-icon-button md-list-action" @click="editAccount('email')" >
                            <md-icon>edit</md-icon>
                        </md-button>
                    </md-list-item>
                </md-list>
            </md-dialog>
            <md-dialog-prompt
                    :md-active.sync="showEditNameDialog"
                    v-model="name"
                    md-title="Change Name"
                    md-input-maxlength="30"
                    md-input-placeholder="Enter your new name"
                    md-confirm-text="Done" />
            <md-dialog-prompt
                    :md-active.sync="showEditEmailDialog"
                    v-model="email"
                    md-title="Change Email"
                    md-input-maxlength="30"
                    md-input-placeholder="Enter your new email"
                    md-confirm-text="Done" />
            <b-navbar type="light" variant="faded">
                <b-navbar-nav tabs fill>
                    <b-nav-item>
                        <md-button class="md-icon-button" to="/">
                            <md-icon>home</md-icon>
                        </md-button>

                    </b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item right>
                        <md-menu md-size="big" md-direction="bottom-end">
                            <md-button class="md-icon-button" md-menu-trigger>
                                <MaterialAvatar :account-details="accountDetails"/>
                            </md-button>

                            <md-menu-content>
                                <md-menu-item @click="showDetailsDialog = true">
                                    <span>Details</span>
                                </md-menu-item>

                                <md-menu-item to="/logout">
                                    <span>Logout</span>
                                </md-menu-item>
                            </md-menu-content>
                        </md-menu>
                    </b-nav-item>
                </b-navbar-nav>
            </b-navbar>
        </div>
        <router-view @auth-event="getLoginDetails"></router-view>
    </div>
</template>

<script>
    import * as firebase from "firebase";
    import MaterialAvatar from "./components/MaterialAvatar";

    export default {
        name: 'app',
        components: {MaterialAvatar},
        data() {
            return {
                currentUser: firebase.auth().currentUser,
                accountDetails: {},
                name: null,
                email: null,
                showDetailsDialog: false,
                showEditNameDialog: false,
                showEditEmailDialog: false
            }
        },
        watch: {
            // eslint-disable-next-line no-unused-vars
            currentUser: function (newVal, oldVal) {
                // If value changes then update the account details.
                if (newVal) {
                    this.getAccountDetails(newVal);
                }
            },
            name: function (newVal, oldVal) {
                // On name change, fire logic to update in the database.
                if (newVal && newVal !== oldVal) {
                    let user = firebase.auth().currentUser;
                    let updates = {};
                    updates['/doctors/' + user.uid + '/displayName'] = newVal;
                    firebase.database().ref().update(updates);
                    this.accountDetails.displayName = newVal;
                }
            },
            email: function (newVal, oldVal) {
                // On name change, fire logic to update in the database.
                if (newVal && newVal !== oldVal) {
                    let user = firebase.auth().currentUser;
                    let updates = {};
                    updates['/doctors/' + user.uid + '/email'] = newVal;
                    firebase.database().ref().update(updates);
                    this.accountDetails.email = newVal;
                }
            }
        },
        methods: {
            // Gets the current user from the fired login event. Populating the user this way prevents the need for a
            // page refresh to show any difference.
            getLoginDetails: function (e) {
                this.currentUser = e.currentUser
            },
            // Populates stored account details from the database.
            getAccountDetails: function (acc) {
                let ref = firebase.database().ref(`doctors`).child(acc.uid);
                ref.once("value", account => {
                    let storedAccount;
                    if (!account.exists()) {
                        storedAccount = {
                            uid: acc.uid,
                            displayName: acc.displayName,
                            email: acc.email,
                            photoUrl: acc.photoUrl ? acc.photoUrl : null
                        };
                        ref.set(storedAccount);
                    } else {
                        storedAccount = account.val();
                    }
                    this.accountDetails = storedAccount
                });
            },
            // Show a dialog depending on the type of field you want to edit.
            editAccount: function (type) {
                this.showDetailsDialog = false;
                if (type === 'email') {
                    this.showEditEmailDialog = true;
                } else {
                    this.showEditNameDialog = true;
                }
            }
        },
        // Populates account details from logged in user on component load.
        mounted() {
            if (this.currentUser && !this.accountDetails.uid) {
                this.getAccountDetails(this.currentUser);
            }
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    md-menu {
        text-align: left;
    }

    a :hover {
        text-decoration: none;
    }

    .row {
        margin: 10px;
    }
</style>
