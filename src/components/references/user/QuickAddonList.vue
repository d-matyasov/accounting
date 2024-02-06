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
        <v-col>
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
                        <tr @dblclick="editingItem = item"
                            class="element" >                        
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
    </v-row>

    <quick-addon-edit-dialog
        :modelValue="editingItem"
        @save="(data) => save(data)"
        @update="editingItem = null"/>

</template>

<script setup>

import { ref } from 'vue'
import QuickAddonEditDialog from './OperationCategoryEditDialog.vue'
import useStore from '@/store'

const store = useStore.useQuickAddonStore()

const items = await store.get()

const sortMap = ref({
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

const save = async data => {
    try {        
        await store.save(data)
        editingItem.value = null
    } catch (e) {
        console.log(e)
    }
}

</script>

<style scoped>

    .column-header:hover {
        background: #F5F5F5;
        cursor: pointer;
    }
    .element:hover {
        background: #F5F5F5;

    }

    .menu-element {
        color: #757575;
    }
    .menu-element:hover {
        cursor: pointer;
        color: #E53935;
    }

</style>