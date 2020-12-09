<template>
    <md-avatar class="md-avatar-icon"
               v-bind:class="{'md-large': this.large}"
               v-bind:style="{'background-color': stringColour(accountDetails.displayName)}">
        <img v-if="accountDetails && accountDetails.photoUrl" v-bind:src="accountDetails.photoUrl"
             alt="Photo"/>
        <span v-else>{{ userInitials }}</span>
    </md-avatar>
</template>

<script>
    import Util from "../js/Util";

    export default {
        name: "MaterialAvatar",
        props: ["accountDetails", "large"],
        computed: {
            // Generates the user initials for the icon on the fly from the injected account details.
            userInitials: function () {
                if (this.accountDetails?.displayName) {
                    return this.accountDetails.displayName.charAt(0).toUpperCase()
                } else {
                    return ""
                }
            }
        },
        methods: {
            // Populates the background colour using the hash of the displayName.
            stringColour: function (str) {
                Util.stringColour(str);
            }
        }
    }
</script>

<style scoped>

</style>
