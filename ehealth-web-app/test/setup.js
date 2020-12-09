import Vue from 'vue'
import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue";
import VueMaterial from "vue-material";
import * as firebase from "firebase";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueMaterial);

firebase.initializeApp({apiKey: "AIzaSyBj1XaB-d_dVGVTjbj09J8GK-pQgU4mSVk",
    authDomain: "ehealth-c0e96.firebaseapp.com",
    databaseURL: "https://ehealth-c0e96.firebaseio.com",
    projectId: "ehealth-c0e96",
    storageBucket: "ehealth-c0e96.appspot.com",
    messagingSenderId: "697352222918",
    appId: "1:697352222918:web:7599f5c9f0c8ddae3b3fc7",
    measurementId: "G-XGVHWXQN5Y"});
