<template>
    <div></div>
</template>

<script>
    import * as firebase from "firebase";

    export default {
        name: "Logout",
        /**
         * ! When mounted is called when the page is loaded, it
         * ! removes the authenticed account from the application
         * ! and then reroutes the page to the 'login' page.
         * @param
         * @returns
         */
        mounted() {
            firebase.auth().signOut().then(() => {
                this.$emit("auth-event", {currentUser: null})
                this.$router.replace('login')
            });
        }
    }
</script>

<style scoped>
    #login {
        align-content: center;
        margin-top: 50px;
        text-align: center;
    }
</style>
