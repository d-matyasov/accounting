<template>
    <v-row class="d-flex flex-grow-1">
        <v-toolbar
            cols="12">
            <v-btn
                @click="inputDatePeriod = {dateFrom: dateFrom, dateTo: dateTo}"
                prepend-icon="mdi-calendar-range"
                elevated>
                {{ moment(dateFrom, 'YYYY-MM-DD').format('DD.MM.YYYY') }} - {{ !dateTo ? '__.__.____' : moment(dateTo, 'YYYY-MM-DD').format('DD.MM.YYYY') }}
            </v-btn>
            <v-divider
                class="mx-3 align-self-center"
                length="24"
                thickness="2"
                vertical
            ></v-divider>
            <v-btn
                @click="shiftUp(selectedItem)"
                :disabled="!selectedItem || !selectedItem.id || selectedItem.id == items[0].id"
                _disabled="!selectedItem || !selectedItem.id || selectedItem.id == computedItems[0].id"
                icon="mdi-arrow-up-circle-outline"
                density="comfortable">
            </v-btn>
            <v-btn
                @click="shiftDown(selectedItem)"
                :disabled="!selectedItem || !selectedItem.id || selectedItem.id == items[items.length - 1].id"
                _disabled="!selectedItem || !selectedItem.id || selectedItem.id == computedItems[computedItems.length - 1].id"
                icon="mdi-arrow-down-circle-outline"
                density="comfortable">
            </v-btn>
        </v-toolbar>

        <v-divider/>
        <v-col
            cols="12"
            class="pa-8">
            <v-table
                v-if="!!headers"
                class="my-table"
                fixed-header
                density="compact"
                hover
                height="600px">
                <thead>
                    <tr>
                        <th class="my-buttons"></th>
                        <th v-for="head in headers"
                            :key="head.key">
                            {{ head.label }}
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="item in items"
                        :key="item.id">
                        <v-hover>
                            <template #default="{ props }">
                                <tr
                                    @click="selectedItem == item ? selectedItem = null : selectedItem = item"
                                    @dblclick="!item.isFactsRow ? (editingItem = item, selectedItem = item, prev = false, next = false) : null"
                                    v-bind="props"
                                    style="overflow: auto!important;"
                                    :class="{ element: true, elementSelected: selectedItem ? selectedItem.id == item.id && selectedItem.date == item.date: false, isFactsRow: item.isFactsRow ? true : false}" >
                                    <td class="d-flex my-buttons">
                                        <template v-if="selectedItem ? selectedItem.id == item.id && selectedItem.date == item.date: false">
                                            <!-- <v-icon @click="editingItem = { _index: item.indexByDate - 1 }" class="my-buttons-prev" color="grey-darken-1">mdi-plus-circle-outline</v-icon> -->
                                            <div 
                                                v-if="next && item.id"
                                                class="my-buttons-prev">
                                                <v-btn
                                                    @click="editingItem = { date: item.date, indexByDate: item.indexByDate }, selectedItem = { item }, next = false"
                                                    size="25"
                                                    rounded
                                                    color="primary">+</v-btn>
                                            </div>
                                            <!-- <v-icon @click="editingItem = { _index: item.indexByDate + 1 }" class="my-buttons-next" color="grey-darken-1">mdi-plus-circle-outline</v-icon> -->
                                            <div 
                                                v-if="next && item.id"
                                                class="my-buttons-next">
                                                <v-btn
                                                    @click="editingItem = { date: item.date, indexByDate: !!item.pairOperationId ? item.indexByDate + 2 : item.indexByDate + 1 }, selectedItem = { item }, prev = false"
                                                    size="25"
                                                    rounded
                                                    color="primary">+</v-btn>
                                            </div>
                                        </template>
                                    </td>
                                    <template v-for="{ key, type, editable } in headers"
                                        :key="key">
                                        <component :is="operationItemMap[type]"
                                            :value="item[key]"
                                            :editable="editable && !!item.id"
                                            @update="e => {item[key] = e; changeIsFact(item)}" />
                                    </template>
                                    <td class="text-lg-right">
                                        <v-menu location=start>
                                            <template v-slot:activator="{ props }">
                                                <v-icon
                                                    v-if="item.id"
                                                    v-bind="props"
                                                    size="small"
                                                    color="grey-darken-1"
                                                    >mdi-delete</v-icon>
                                            </template>
                                            <v-list>
                                                <v-list-item>
                                                    <v-list-item-title @click="remove(item)" class="menu-element"><v-icon>mdi-delete-forever</v-icon></v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </td>
                                </tr>
                            </template>
                        </v-hover>
                    </template>
                </tbody>
            </v-table>
        </v-col>
    </v-row>

    <operation-edit-dialog
        :modelValue="editingItem"
        :selectedItem="selectedItem"
        @save="(data) => {save(data), prev = true, next = true}"
        @update="editingItem = null, prev = true, next = true"/>

    <operation-date-period-input-dialog
        :modelValue="inputDatePeriod"
        @save="(data) => {changeDatePeriod(data)}"
        @update="inputDatePeriod = null"/>

</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import axiosInstance from '@/services/AxiosInstanceService'
import moment from 'moment'
import OperationItemDate from '@/components/operation/OperationItemDate.vue'
import OperationItemAmount from '@/components/operation/OperationItemAmount.vue'
import OperationItemBoolean from '@/components/operation/OperationItemBoolean.vue'
import OperationItemString from '@/components/operation/OperationItemString.vue'
import OperationEditDialog from '@/components/operation/OperationEditDialog.vue'
import OperationDatePeriodInputDialog from '@/components/operation/OperationDatePeriodInputDialog.vue'

const operationItemMap = {
    date: OperationItemDate,
    amount: OperationItemAmount,
    boolean: OperationItemBoolean,
    string: OperationItemString
}


const auth = ref(false)

const dateFrom = ref(moment(moment().subtract(15, 'days').calendar(), 'MM/DD/YYYY').format('YYYY-MM-DD'))

const dateTo = ref('')

const headers = ref(null)

const items = ref(null)

const selectedItem = ref(null)

const prev = ref(true)

const next = ref(true)

const editingItem = ref(null)

const inputDatePeriod = ref(null)

const get = async () => {

    await axiosInstance.get(`/api/operations/headers-and-data?dateFrom=${dateFrom.value}&dateTo=${dateTo.value}`)
        .then(response => {

            headers.value = response.data.headers

            items.value = response.data.data

        })

        .catch(error => {
            
            console.log(error);
            
        })
}

const save = async data => {

    if (data.date > data._date) {
        data.indexByDate = 1
    }
    if (data.date < data._date) {
        data.indexByDate = null
    }

    if (data.id) {    

        await axiosInstance.patch(`/api/operations/${data.id}`, data)
        
            .then()

            .catch(error => {

            console.log(error)

        })

    } else {

        await axiosInstance.post(`/api/operations`, data)
        
            .then()

            .catch(error => {

            console.log(error)

        })
    }

    get()

    editingItem.value = null
}

const remove = async item => {
    
    await axiosInstance.delete(`/api/operations/${item.id}`)
        
        .then()

        .catch(error => {

        console.log(error)

    })

    get()
}

const shiftUp = async item => {
        
    await axiosInstance.patch(`/api/operations/${item.id}/shift-up`)
        
        .then(response => {
            
            selectedItem.value = response.data
            
        }
        )

        .catch(error => {

        console.log(error)

    })

    get()
    
}

const shiftDown = async item => {
    
    await axiosInstance.patch(`/api/operations/${item.id}/shift-down`)
        
        .then(response => {
            
            selectedItem.value = response.data
            
        })

        .catch(error => {

        console.log(error)
    
    })

    get()

}

const changeIsFact = async item => {

    const body = { isFact: item.isFact }

    await axiosInstance.patch(`/api/operations/${item.id}/change-is-fact`, body)
        
        .then()

        .catch(error => {

        console.log(error)
    
    })

    await axiosInstance.get(`/api/operations/facts-row`)
        .then(response => {

            items.value = items.value.map(entity => entity.isFactsRow ? response.data : entity)

        })

        .catch(error => {
            
            console.log(error);
            
        })

    get()

}

const changeDatePeriod = data => {

    dateFrom.value = data.dateFrom
    dateTo.value = !!data.dateTo ? data.dateTo : ''

    get()

    inputDatePeriod.value = null

}

onBeforeMount(() => {

    get()

})



</script>

<style scoped lang="scss">
.my-table {
    & > .v-table__wrapper {
        overflow: visible;
    }
}
.my-buttons {
    position: relative;
    width: 0!important;
    margin: 0!important;
    padding: 0!important;

    &-prev, &-next {
        position: absolute;
    }

    &-prev {
        transform: translate(1%, -50%);
        top: 0;
    }

    &-next {
        transform: translate(1%, 50%);
        bottom: 0;
    }

}

.elementSelected {
    background-color: #E4E4E4;
}

.isFactsRow {
    font-weight: bold;
    background-color: antiquewhite;
}

.menu-element {
        color: #757575;
    }
.menu-element:hover {
    cursor: pointer;
    color: #E53935;
}

</style>