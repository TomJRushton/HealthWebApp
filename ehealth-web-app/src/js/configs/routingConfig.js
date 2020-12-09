import Vue from 'vue';
import VueRouter from "vue-router";
import * as firebase from "firebase";
import Home from "../../views/Home";
import PatientData from "../../views/PatientData"
import Login from "../../views/Login";
import Logout from "../../views/Logout";
import NotFound from "../../views/NotFound";

Vue.use(VueRouter);

const appName = 'eHealth';

// Define the routes for the app.
const routes = [
    // Base route
    {
        path: '/',
        name: Home,
        component: Home,
        meta: {
            title: 'Home | ' + appName,
            requiresAuth: true
        }
    },
    // Route for patient data
    {
        path: '/patientdata/:patient_id',
        name: 'PatientData',
        component: PatientData,
        meta: {
            title: 'Patient Data | ' + appName,
            requiresAuth: true
        }
    },
    // Login screen
    {
        path: '/login',
        name: Login,
        component: Login,
        meta: {
            title: 'Login | ' + appName,
        }
    },
    // Logout component
    {
        path: '/logout',
        name: Logout,
        component: Logout,
        meta: {
            title: 'Logout | ' + appName,
        }
    },
    // Wildcard to redirect to a page not found page if the route doesn't match anything else.
    {
        path: "*",
        name: 'Page Not Found',
        component: NotFound,
        meta: {
            title: 'Page Not Found | ' + appName,
        }
    }
];

// Define the router with the routes
let router = new VueRouter({
    routes: routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;

    // Check if the user is logged in and if the page needs authentication.
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    // If user not logged in and the page requires auth then we redirect to the login page.
    if (requiresAuth && !currentUser) next('login');
    else next();
});

// Expose config to be used in app setup
export default router;
