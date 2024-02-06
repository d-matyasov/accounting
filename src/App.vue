<template>
  <v-app>
    <v-app-bar flat>
      <v-container class="fill-height d-flex align-center">
        <v-avatar
            class="me-10 ms-4"
            color="grey-darken-1"
            size="32"
        ></v-avatar>

        <v-btn
            v-for="link in links"
            :key="link"
            :to="{ name: link.routeName }"
            variant="text">
            {{ link.label }}
        </v-btn>

        <v-spacer></v-spacer>

        {{ username }}
        <v-btn
            @click="logout"
            v-if="!!username"
            >
            Выход
        </v-btn>
        <v-btn
            @click="router.push('/auth/login')"
            v-if="!username"
            >
            Вход
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main 
      class="d-flex bg-grey-lighten-3">
      <v-container 
        fluid
        class="flex-grow-1 d-flex flex-column">
            <v-card
                flat
                rounded="lg"
                class="flex-grow-1">
                <Suspense>
                    <router-view />
                </Suspense>
            </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axiosInstance from './services/AxiosInstanceService'
import { getActivePinia } from 'pinia'
import VueJwtDecode from 'vue-jwt-decode'

const pinia = getActivePinia()

const route = useRoute()

const router = useRouter()

const username = ref(null)

const links = ref([
    {
        label: 'Операции',
        routeName: 'Operations'
    },
    {
        label: 'Справочники',
        routeName: 'References'
    }

])

watch(() => route.path, (e) => {
    
    if (e != "/auth/login") {

        checkAuthentication()

    }

})

const checkAuthentication = async () => {

    await axiosInstance.get(`/api/auth/check-authentication`)

        .then(response => {

            if (!response.data.isAuthenticationNeeded) {

                const token = localStorage.getItem("jwtToken");

                if (!!token) {

                    username.value = VueJwtDecode.decode(token).sub

                }

            } else {

                window.localStorage.setItem("preAuthenticationRoutePath", route.path);

                router.push('/auth/login');

            }

        })

        .catch(error => {
            
            console.log(error);
            
        })

}

const logout = () => {

    window.localStorage.removeItem('jwtToken');

    pinia._s.forEach((store) => {
    
        store.$dispose();

        delete pinia.state.value[store.$id]
    
    });

    username.value = null

    router.push('/auth/login');
}

</script>