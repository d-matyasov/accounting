<template>
    <v-row class="d-flex flex-grow-1">
        <v-col
            cols="2"
            class="pr-0">
            <v-list rounded="lg">
                <v-list-item
                    v-for="link in links"
                    :key="link.label"
                    :to="{ name: link.routeName }"
                    link>
                    <v-list-item-title>
                        {{ link.label }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-col>

        <v-divider
            vertical />

        <v-col
            cols="10"
            class="pa-8">
            <Suspense>
                <router-view />
            </Suspense>
        </v-col>
    </v-row>
</template>

<script setup>

import { ref, onBeforeMount } from 'vue'
import VueJwtDecode from 'vue-jwt-decode'

const links = ref([
    {
        label: 'Валюты',
        routeName: 'Currencies',
    },
    {
        label: 'Типы объектов учёта',
        routeName: 'AccountingObjectTypes'
    },
    {
        label: 'Объекты учёта',
        routeName: 'AccountingObjects'
    },
    {
        label: 'Категории операций',
        routeName: 'OperationCategories'
    },
    {
        label: 'Быстрые дополнения',
        routeName: 'QuickAddons'
    }
])

const isAdmin = () => {

    const token = localStorage.getItem("jwtToken");

    if (token == null || VueJwtDecode.decode(token).authorities.findIndex(f => f.authority == 'ADMIN') < 0) {

        return false

    } else {

        return true

    }

}

onBeforeMount(() => {
    
    if (isAdmin()) {

    links.value.push({label: 'Пользователи', routeName: 'Users'})

    }
})

</script>