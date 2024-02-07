<template>
    <v-row>
        <v-col cols="12"
            class="text-right">
            <v-btn 
                @click="create"
                color="primary"
                >Создать</v-btn>
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
                        <th @click="sort('grapheme', sortMap, items)" class="column-header" >Графема <v-icon size="small" end>{{ getSortIcon(sortMap.grapheme.sign) }}</v-icon></th>
                        <th @click="sort('comment', sortMap, items)" class="column-header" >Примечание <v-icon size="small" end>{{ getSortIcon(sortMap.comment.sign) }}</v-icon></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    <template v-for="item in items" :key="item.id">

                        <tr
                            @dblclick="editItem = item"
                            class="element" >
                            <td>{{ item.id }}</td>
                            <td>
                                <v-icon v-if="item.isActual" color="grey-darken-1">mdi-checkbox-marked</v-icon>
                                <v-icon v-else color="grey-darken-1">mdi-checkbox-blank-outline</v-icon>
                            </td>
                            <td>{{ item.ordinalNumber }}</td>
                            <td>{{ item.code }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.grapheme }}</td>
                            <td>{{ item.comment }}</td>
                            <td class="text-lg-right">
                                <v-menu location=start>
                                    <template v-slot:activator="{ props }">
                                <v-icon
                                    size="small"
                                    v-bind="props"
                                    @click="checkAuthority()"
                                    color="grey-darken-1"
                                    >mdi-delete</v-icon>
                                    </template>
                                <v-list
                                    v-if="!infoMessage">
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

    <currency-editor-dialog
        :modelValue="editItem"
        @update="e => editItem = e"
        @save="(data) => save(data)"/>

    <info-dialog
        :modelValue="infoMessage"
        @update="e => infoMessage = e"/>

</template>
 
<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import axios from 'axios'
import CurrencyEditorDialog from './CurrencyEditorDialog.vue'
import { sort, getSortIcon } from '@/components/index'
import useStore from '@/store'
import VueJwtDecode from 'vue-jwt-decode'
import InfoDialog from '@/components/UI/InfoDialog.vue'

const store = useStore.useCurrencyStore()

const items = await store.get()

const editItem = ref(null)

const delMenuItems = [{title: "Удалить"}]

const infoMessage = ref(null)

const sortMap = ref({
    id: { 
        primer: parseInt,
        sign: null
    },
    _isActual: { sign: null, nested: item => !item.isActual  },
    ordinalNumber: { sign: null },
    code: {  sign: null },
    name: {  sign: null },
    grapheme: {  sign: null },
    comment: { sign: null }
})

const create = () => {

    checkAuthority()

    if (!!infoMessage.value) {

        return

    } else {

        editItem.value = {}

    }

}

const save = async data => {

    checkAuthority()

    try {        

        await store.save(data)
        
        editItem.value = null

    } catch (e) {
        
        console.log(e)
        
    }
}

const checkAuthority = () => {

    const token = localStorage.getItem("jwtToken");

    if (VueJwtDecode.decode(token).authorities.findIndex(f => f.authority == 'ADMIN') < 0) {

        infoMessage.value = "Отсутствуют права на редактирование справочника"

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