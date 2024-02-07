<template>
    <v-row>
        <v-col cols="12"
            class="text-right">
        </v-col>
        <v-col>
            <v-table>
                <thead>
                    <tr>
                        <th @click="sort('id', sortMap, items)" class="column-header">ИД <v-icon size="small" end>{{ getSortIcon(sortMap.id.sign) }}</v-icon></th>
                        <th @click="sort('login', sortMap, items)" class="column-header" >Логин <v-icon size="small" end>{{ getSortIcon(sortMap.login.sign) }}</v-icon></th>
                        <th @click="sort('_isEnabled', sortMap, items)" class="column-header">Действующий <v-icon size="small" end>{{ getSortIcon(sortMap._isEnabled.sign) }}</v-icon></th>
                        <th @click="sort('_isEnabled', sortMap, items)" class="column-header">Действующий <v-icon size="small" end>{{ getSortIcon(sortMap._isEnabled.sign) }}</v-icon></th>
                        <th @click="sort('role', sortMap, items)" class="column-header" >Роль <v-icon size="small" end>{{ getSortIcon(sortMap.role.sign) }}</v-icon></th>
                    </tr>
                </thead>
                <tbody>

                    <template v-for="item in items" :key="item.id">

                        <tr
                            class="element" >
                            <td>{{ item.id }}</td>
                            <td>{{ item.login }}</td>
                            <td>{{ item.isEnabled }}</td>
                            <td>
                                <v-icon 
                                    @click="item.isEnabled = !item.isEnabled; changeIsEnabled(item)"
                                    :editable="true"
                                    color="grey-darken-1">
                                    {{ item.isEnabled ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'}}
                                </v-icon>
                            </td>
                            <td>{{ item.role }}</td>
                        </tr>

                    </template>
                </tbody>
            </v-table>
        </v-col>
    </v-row>

</template>
 
<script setup>

import { ref, onBeforeMount, computed } from 'vue'
import axiosInstance from '@/services/AxiosInstanceService'
import { sort, getSortIcon } from '@/components/index'

const items = ref()

const sortMap = ref({
    id: { 
        primer: parseInt,
        sign: null
    },
    login: {  sign: null },
    _isEnabled: { sign: null, nested: item => !item.isEnabled  },
    role: { sign: null }
})

const get = async () => {

    await axiosInstance.get(`/api/users`)
        .then(response => {

            items.value = response.data

        })

        .catch(error => {
            
            console.log(error);
            
        })

}

const changeIsEnabled = async item => {

    const body = { isEnabled: item.isEnabled }

    await axiosInstance.patch(`/api/users/${item.id}/change-is-enabled`, body)
        
        .then()

        .catch(error => {

        console.log(error)

    })

}

onBeforeMount(() => {

    get()

})

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