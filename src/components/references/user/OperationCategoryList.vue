<template>
    <v-row>
        <v-col cols="12"
            class="text-right">
            <v-btn 
                @click="create"
                color="primary">
                Создать
            </v-btn>
        </v-col>
        <v-col
            cols="12">
            <v-table>
                <thead>
                    <tr>
                        <th @click="sort('id', sortMap, items)" class="column-header">ИД <v-icon size="small" end>{{ getSortIcon(sortMap.id.sign) }}</v-icon></th>
                        <th @click="sort('_isActual', sortMap, items)" class="column-header">Актуальная <v-icon size="small" end>{{ getSortIcon(sortMap._isActual.sign) }}</v-icon></th>
                        <th @click="sort('name', sortMap, items)" class="column-header" >Наименование <v-icon size="small" end>{{ getSortIcon(sortMap.name.sign) }}</v-icon></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    <template v-for="item in items" :key="item.id">
                        <tr 
                            @click="selectedItem == item ? selectedItem = null : selectedItem = item"
                            @dblclick="editingItem = item"
                            :class="{ element: true, elementSelected: selectedItem == item }" >                        
                            <td>{{ item.id }}</td>
                            <td>
                                <v-icon v-if="item.isActual" color="grey-darken-1">mdi-checkbox-marked</v-icon>
                                <v-icon v-else color="grey-darken-1">mdi-checkbox-blank-outline</v-icon>
                            </td>
                            <td>{{ item.name }}</td>
                            <td class="text-lg-right">
                                <v-menu location=start>
                                    <template v-slot:activator="{ props }">
                                <v-icon
                                    size="small"
                                    v-bind="props"
                                    color="grey-darken-1"
                                    >mdi-delete</v-icon>
                                    </template>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title @click="store.remove(item)" class="menu-element"><v-icon>mdi-delete-forever</v-icon></v-list-item-title>
                                    </v-list-item>
                                </v-list>

                                </v-menu>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </v-table>
        </v-col>
        <v-divider />
        <v-col
            _v-if="addonItems.length"
            v-if="selectedItem"
            cols="12">
            <h3>Связанные быстрые дополнения</h3>
            <v-col cols="12"
                class="text-right">
                <v-btn 
                    @click="add"
                    color="primary">
                    Добавить
                </v-btn>
            </v-col>
            <v-table>
                <thead>
                    <tr>
                        <th @click="sort('id', sortMapAddonItems, addonItems)" class="column-header">ИД <v-icon size="small" end>{{ getSortIcon(sortMapAddonItems.id.sign) }}</v-icon></th>
                        <th @click="sort('_isActual', sortMapAddonItems, addonItems)" class="column-header">Актуальная <v-icon size="small" end>{{ getSortIcon(sortMapAddonItems._isActual.sign) }}</v-icon></th>
                        <th @click="sort('name', sortMapAddonItems, addonItems)" class="column-header" >Наименование <v-icon size="small" end>{{ getSortIcon(sortMapAddonItems.name.sign) }}</v-icon></th>
                        <th> <v-icon
                                    size="small"
                                    color="grey-darken-1"
                                    >mdi-delete</v-icon></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="addonItem in addonItems" :key="addonItem.id">
                        <tr _dblclick="editingItem = item"
                            class="element" >                        
                            <td>{{ addonItem.id }}</td>
                            <td>
                                <v-icon v-if="addonItem.isActual" color="grey-darken-1">mdi-checkbox-marked</v-icon>
                                <v-icon v-else color="grey-darken-1">mdi-checkbox-blank-outline</v-icon>
                            </td>
                            <td>{{ addonItem.name }}</td>
                            <td class="text-lg-right">
                                <v-menu location=start>
                                    <template v-slot:activator="{ props }">
                                <v-icon
                                    size="small"
                                    v-bind="props"
                                    color="grey-darken-1"
                                    >mdi-delete</v-icon>
                                    </template>
                                <v-list>
                                    <v-list-item>
                                        <v-list-item-title @click="removeRelation(selectedItem, addonItem)" class="menu-element"><v-icon>mdi-delete-forever</v-icon></v-list-item-title>
                                    </v-list-item>
                                </v-list>

                                </v-menu>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </v-table>
        </v-col>
    </v-row>

    <operation-category-edit-dialog
        :modelValue="editingItem"
        @save="(data) => save(data)"
        @update="editingItem = null"/>

    <quick-addon-add-to-list-dialog
        :modelValue="itemToListEdit"
        @save="(item, addonItem) => addRelation(item, addonItem)"
        @update="itemToListEdit = null"/>

</template>

<script setup>

import { ref, computed } from 'vue'
import OperationCategoryEditDialog from './OperationCategoryEditDialog.vue'
import QuickAddonAddToListDialog from './QuickAddonAddToListDialog.vue'
import { sort, getSortIcon } from '@/components/index'
import useStore from '@/store'
import axios from 'axios'
import axiosInstance from '@/services/AxiosInstanceService'

const store = useStore.useOperationCategoryStore()

const items = await store.get()

const selectedItem = ref(null)

const addonItems = computed(() => selectedItem.value?.quickAddonList ?? [])

const sortMap = ref({
    id: { 
        primer: parseInt,
        sign: null
    },
    _isActual: { sign: null, nested: item => !item.isActual  },
    name: { sign: null }
})

const sortMapAddonItems = ref({
    id: { 
        primer: parseInt,
        sign: null
    },
    _isActual: { sign: null, nested: item => !item.isActual  },
    name: { sign: null }
})

const editingItem = ref(null)

const create = () => {
    editingItem.value = {}
}

const itemToListEdit = ref(null)

const add = () => {
    itemToListEdit.value = selectedItem.value
}

const save = async data => {
    try {        
        await store.save(data)
        editingItem.value = null
    } catch (e) {
        console.log(e)
    }
}

const removeRelation = async (item, addonItem) => {

    await axiosInstance.delete(`/api/operation-categories/${item.id}/quick-addons?ids=${addonItem.id}`)
        
        .then(response => {
            
            item.quickAddonList = response.data
            
        })

        .catch(error => {

        console.log(error)

    })

}

const addRelation = async (item, addonItem) => {

    await axiosInstance.post(`/api/operation-categories/${item.id}/quick-addons`, [addonItem])
        
        .then(response => {
            
            item.quickAddonList = response.data

            itemToListEdit.value = null
            
        })

        .catch(error => {

        console.log(error)

    })

}

</script>

<style scoped>

    .column-header:hover {
        background-color: #F5F5F5;
        cursor: pointer;
    }
    .element:hover {
        background-color: #F5F5F5;

    }

    .elementSelected {
        background-color: #E4E4E4;
    }

    .menu-element .table-icon {
        color: #757575;
    }
    .menu-element:hover {
        cursor: pointer;
        color: #E53935;
    }

</style>