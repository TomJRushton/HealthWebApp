<template>
    <div>
        <svg class="top" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#dc3545" fill-opacity="1"
                  d="M0,256L20,218.7C40,181,80,107,120,106.7C160,107,200,181,240,213.3C280,245,320,235,360,213.3C400,192,440,160,480,128C520,96,560,64,600,80C640,96,680,160,720,176C760,192,800,160,840,149.3C880,139,920,149,960,176C1000,203,1040,245,1080,261.3C1120,277,1160,267,1200,234.7C1240,203,1280,149,1320,149.3C1360,149,1400,203,1420,229.3L1440,256L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"></path>
            <path fill="#ff5500" fill-opacity=".5"
                  d="M0,32L40,42.7C80,53,160,75,240,74.7C320,75,400,53,480,74.7C560,96,640,160,720,181.3C800,203,880,181,960,176C1040,171,1120,181,1200,165.3C1280,149,1360,107,1400,85.3L1440,64L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
        </svg>
        <svg class="bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#a2d9ff" fill-opacity="1"
                  d="M0,192L17.1,208C34.3,224,69,256,103,234.7C137.1,213,171,139,206,117.3C240,96,274,128,309,149.3C342.9,171,377,181,411,160C445.7,139,480,85,514,58.7C548.6,32,583,32,617,69.3C651.4,107,686,181,720,218.7C754.3,256,789,256,823,224C857.1,192,891,128,926,96C960,64,994,64,1029,90.7C1062.9,117,1097,171,1131,181.3C1165.7,192,1200,160,1234,128C1268.6,96,1303,64,1337,64C1371.4,64,1406,96,1423,112L1440,128L1440,320L1422.9,320C1405.7,320,1371,320,1337,320C1302.9,320,1269,320,1234,320C1200,320,1166,320,1131,320C1097.1,320,1063,320,1029,320C994.3,320,960,320,926,320C891.4,320,857,320,823,320C788.6,320,754,320,720,320C685.7,320,651,320,617,320C582.9,320,549,320,514,320C480,320,446,320,411,320C377.1,320,343,320,309,320C274.3,320,240,320,206,320C171.4,320,137,320,103,320C68.6,320,34,320,17,320L0,320Z"></path>
            <path fill="#0099ff" fill-opacity="0.5"
                  d="M0,0L48,37.3C96,75,192,149,288,181.3C384,213,480,203,576,170.7C672,139,768,85,864,101.3C960,117,1056,203,1152,229.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <b-container fluid id="login">
            <md-card class="card-outer">
                <b-row>
                    <b-col>
                        <img id="logo" src="../assets/ehealth.png" alt="Site Logo"/>
                    </b-col>
                    <b-col>
                        <md-card-header>
                            <div class="md-title">Welcome to eHealth</div>
                        </md-card-header>
                        <md-card-content>
                            <md-content class="content md-scrollbar">
                                Disclaimer:
                                This is a tool in development, designed for doctors and healthcare
                                professionals, to view and interact with sensistive patient data.

                            </md-content>
                        </md-card-content>
                        <md-card-actions class="card-actions">
                            <md-button id="login-btn" class="md-raised md-primary" @click="login" style="bottom: 0">
                                Sign in with Google
                            </md-button>
                        </md-card-actions>
                    </b-col>
                </b-row>
            </md-card>
        </b-container>
    </div>
</template>

<script>
    import * as firebase from "firebase";

    export default {
        name: "Login",
        methods: {
            /**
             * ! This function opens a GoogleAuth page to allow the user to
             * ! authenticate themselves using a Google account. 
             * @param 
             * @return 
             */
            login: function () {
                this.provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(this.provider).then((snapshot) => {
                    if (snapshot.user) {
                        this.$emit("auth-event", {currentUser: snapshot.user})
                        this.$router.replace('/')
                    }
                }).catch((error) => {
                    // eslint-disable-next-line no-console
                    console.log(error.message)
                });
            }
        },
        mounted() {
            let user = firebase.auth().currentUser
            if (user) {
                this.$emit("auth-event", {currentUser: user})
                this.$router.replace('/')
            }
        }
    }
</script>

<style scoped>
    #login {
        width: 1000px;
        height: 900px;
        align-content: center;
        text-align: center;
        padding-top: 15%;
    }

    .top {
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
    }

    .bottom {
        display: inline-block;
        position: absolute;
        bottom: 0;
        left: 0;
    }

    #logo {
        padding: 5px;
    }

    .card-outer {
        position: relative;
        padding-bottom: 5px;
    }

    .card-actions {
        position: absolute;
        bottom: 0;
        right: 5%;
    }

    .content {
        overflow: auto;
        max-height: 300px;
        padding-bottom: 50px;
    }
</style>
