<template>
    <v-dialog
        v-model="show"
        persistent
        scrollable
        max-width="800px">
        <v-card class="pa-4">
            <v-card-title>
                Категория операции - {{itemToListEdit.name}}: Добавление связи с быстрым дополнением
            </v-card-title>
            <v-card-text>
                <v-col>
                    <v-table>
                        <thead>
                            <tr>
                                <th @click="sort('id', sortMap, items)" class="column-header">ИД <v-icon size="small" end>{{ getSortIcon(sortMap.id.sign) }}</v-icon></th>
                                <th @click="sort('_isActual', sortMap, items)" class="column-header">Актуальная <v-icon size="small" end>{{ getSortIcon(sortMap._isActual.sign) }}</v-icon></th>
                                <th @click="sort('name', sortMap, items)" class="column-header" >Наименование <v-icon size="small" end>{{ getSortIcon(sortMap.name.sign) }}</v-icon></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="item in items" :key="item.id">
                                <tr @click="selectedItem == item ? selectedItem = null : selectedItem = item"
                                    :class="{ element: true, elementSelected: selectedItem == item  }" >                        
                                    <td>{{ item.id }}</td>
                                    <td>
                                        <v-icon v-if="item.isActual" color="grey-darken-1">mdi-checkbox-marked</v-icon>
                                        <v-icon v-else color="grey-darken-1">mdi-checkbox-blank-outline</v-icon>
                                    </td>
                                    <td>{{ item.name }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </v-table>
                </v-col>
            </v-card-text>

            <v-card-actions
                class="pr-4">
                <v-spacer />
                <v-btn 
                    @click="$emit('save', itemToListEdit, selectedItem)"
                    color="primary"
                    variant="elevated"
                    :disabled="!selectedItem"
                    >
                    <!-- :disabled="!valid" -->
                    Добавить
                </v-btn>
                <v-btn
                    @click="$emit('update', null)"
                    variant="elevated">
                    Отмена
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script setup>

import { ref, watch } from 'vue'
import { sort, getSortIcon } from '@/components/index'
import useStore from '@/store'

const store = useStore.useQuickAddonStore()

const storeItems = await store.get()

const items = ref(null)

const itemToListEdit = ref(null)

const selectedItem = ref(null)

const sortMap = ref({

    id: { 
        primer: parseInt,
        sign: null
    },
    _isActual: { sign: null, nested: item => !item.isActual  },
    name: { sign: null }

})

const props = defineProps({
    modelValue: Object
})

const show = ref(false)

watch(() => props.modelValue, (e) => {

    if (e) {
        show.value = true
        itemToListEdit.value = e
        const s = new Set(itemToListEdit.value.quickAddonList.map(e => JSON.stringify(e)))
        items.value = storeItems.filter(e => !s.has(JSON.stringify(e)))
    } else {
        show.value = false
    }
})

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

</style>