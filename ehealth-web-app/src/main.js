import Vue from 'vue'
import App from './App.vue'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
import VueStickyDirective from '@renatodeleao/vue-sticky-directive'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './js/configs/routingConfig.js'
import * as firebase from "firebase/app";
import Util from "./js/Util";
import "firebase/auth";
import "firebase/database";
import VueMaterial  from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

// Initialise firebase for the app
firebase.initializeApp({apiKey: "AIzaSyBj1XaB-d_dVGVTjbj09J8GK-pQgU4mSVk",
    authDomain: "ehealth-c0e96.firebaseapp.com",
    databaseURL: "https://ehealth-c0e96.firebaseio.com",
    projectId: "ehealth-c0e96",
    storageBucket: "ehealth-c0e96.appspot.com",
    messagingSenderId: "697352222918",
    appId: "1:697352222918:web:7599f5c9f0c8ddae3b3fc7",
    measurementId: "G-XGVHWXQN5Y"})

// Setup util function.
Util.setupDate();

// Tell Vue to use Bootstrap, Icons, Material and the sticky sidebar globally. Defining them here allows us to use them
// further down the hierarchy.
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueMaterial);
Vue.use(VueStickyDirective);

Vue.config.productionTip = false;
let app = '';

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        // Define application start
        app = new Vue({
            router,
            render: h => h(App)
        }).$mount('#app');
    }
});
