<template>
    <div class="table-wrapper">
        <b-table :items="tableData" :fields="fields">
            <template v-slot:cell(date)="data">
                <b>{{ data.item.x}}</b>
            </template>
            <template v-slot:cell(type)="data">
                <b>{{ data.item.type}}</b>
            </template>
            <template v-slot:cell(value)="data">
                <b>{{ data.item.y}}</b>
            </template>
        </b-table>
    </div>

</template>

<script>
    export default {
        name: "DataTable",
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        data() {
          return {
              fields: [
                  'date',
                  'type',
                  'value'
              ],
          }
        },

        computed: {
            tableData: function () {
                let combinedData = [];
                for(let key in this.data){

                    if (!this.data.hasOwnProperty(key)) continue;
                    let dataType = this.data[key];

                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

                    dataType = dataType.map(data => {

                        switch (key) {
                            case "stepCount":
                                data.type = "Step Count";
                                break;
                            case "average":
                                data.type = "Average HR";
                                break;
                            case "max":
                                data.type = "Max HR";
                                break;
                            case "min":
                                data.type = "Min HR";
                                break;
                            case "systolicValue":
                                data.type = "Systolic";
                                break;
                            case "diastolicValue":
                                data.type = "Diastolic";
                                break;
                        }

                        data.x = data.x.toLocaleDateString(undefined, options);
                        return data;
                    });
                    combinedData = combinedData.concat(dataType);
                }

                return combinedData;
            }
        }
    }
</script>

<style scoped>
    .table-wrapper {
        height: 200px;
        overflow-y: auto;
    }
</style>
