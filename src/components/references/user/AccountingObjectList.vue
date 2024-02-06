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
                        <th @click="sort('ordinalNumber', sortMap, items)" class="column-header" >Порядковый номер <v-icon size="small" end>{{ getSortIcon(sortMap.ordinalNumber.sign) }}</v-icon></th>
                        <th @click="sort('code', sortMap, items)" class="column-header" >Код <v-icon size="small" end>{{ getSortIcon(sortMap.code.sign) }}</v-icon></th>
                        <th @click="sort('name', sortMap, items)" class="column-header" >Наименование <v-icon size="small" end>{{ getSortIcon(sortMap.name.sign) }}</v-icon></th>
                        <th @click="sort('nameShort', sortMap, items)" class="column-header" >Краткое наименование <v-icon size="small" end>{{ getSortIcon(sortMap.nameShort.sign) }}</v-icon></th>
                        <th @click="sort('openDate', sortMap, items)" class="column-header" >Дата открытия <v-icon size="small" end>{{ getSortIcon(sortMap.openDate.sign) }}</v-icon></th>
                        <th @click="sort('closeDate', sortMap, items)" class="column-header" >Дата закрытия <v-icon size="small" end>{{ getSortIcon(sortMap.closeDate.sign) }}</v-icon></th>
                        <th @click="sort('startAmount', sortMap, items)" class="column-header" >Начальная сумма <v-icon size="small" end>{{ getSortIcon(sortMap.startAmount.sign) }}</v-icon></th>
                        <th @click="sort('currentAmount', sortMap, items)" class="column-header" >Текущая сумма <v-icon size="small" end>{{ getSortIcon(sortMap.currentAmount.sign) }}</v-icon></th>
                        <th @click="sort('_currencyName', sortMap, items)" class="column-header" >Валюта <v-icon size="small" end>{{ getSortIcon(sortMap._currencyName.sign) }}</v-icon></th>
                        <th @click="sort('_accountingObjectTypeName', sortMap, items)" class="column-header" >Тип объекта учёта <v-icon size="small" end>{{ getSortIcon(sortMap._accountingObjectTypeName.sign) }}</v-icon></th>
                        <th @click="sort('comment', sortMap, items)" class="column-header" >Примечание <v-icon size="small" end>{{ getSortIcon(sortMap.comment.sign) }}</v-icon></th>
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
                            <td>{{ item.ordinalNumber }}</td>
                            <td>{{ item.code }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.nameShort }}</td>
                            <td>{{ new Date(item.openDate).toLocaleDateString() }}</td>
                            <td>{{ !!item.closeDate ? new Date(item.closeDate).toLocaleDateString() : '' }}</td>
                            <td>{{ toFormattedMonetaryUnit(item.startAmount) }}</td>
                            <td>{{ toFormattedMonetaryUnit(item.currentAmount) }}</td>
                            <td>{{ sortMap._currencyName.nested(item) }}</td>
                            <td>{{ sortMap._accountingObjectTypeName.nested(item) }}</td>
                            <td>{{ item.comment }}</td>
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

    <accounting-object-edit-dialog
        :modelValue="editingItem"
        @save="(data) => save(data)"
        @update="editingItem = null"/>

</template>

<script setup>
import { ref } from 'vue'
import AccountingObjectEditDialog from './AccountingObjectEditDialog.vue'
import useStore from '@/store'
import { toFormattedMonetaryUnit } from '@/common'

const store = useStore.useAccountingObjectStore()

const currencyStore = useStore.useCurrencyStore()

const accountingObjectTypeStore = useStore.useAccountingObjectTypeStore()

const items = await store.get()

const sortMap = ref({
    id: { 
        primer: parseInt,
        sign: null
    },
    _isActual: { sign: null, nested: item => !item.isActual  },
    ordinalNumber: { sign: null },
    code: { sign: null },
    name: { sign: null },
    nameShort: { sign: null },
    openDate: { sign: null },
    closeDate: { sign: null },
    startAmount: { sign: null },
    currentAmount: { sign: null },
    _currencyName: { sign: null, nested: item => currencyStore.findById(item.currencyId).name },
    _accountingObjectTypeName: { sign: null, nested: item => accountingObjectTypeStore.findById(item.typeId).name },
    comment: { sign: null }
})

await currencyStore.get()

await accountingObjectTypeStore.get()

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