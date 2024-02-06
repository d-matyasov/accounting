<template>
    <v-card
        class="ma-4">
        <v-form
            v-model="valid"
            ref="form"
            @keyup.enter="login"
            class="pa-4">
                <v-row
                    justify="center">
                    <v-col
                        cols="4">
                        <v-text-field type="text" v-model="user.login" placeholder="Логин" :rules="[rules.required]"/>
                    </v-col>
                </v-row>
                <v-row
                    justify="center">
                    <v-col
                        cols="4">
                        <v-text-field type="password" v-model="user.password" placeholder="Пароль" :rules="[rules.required]"/>
                    </v-col>
                </v-row>
                <v-row
                    justify="center">
                    <v-col
                        cols="auto">
                        <v-btn
                            @click="login"
                            :disabled="!valid">
                            Login
                        </v-btn>
                    </v-col>
                </v-row>
        </v-form>
    </v-card>
</template>
  
<script setup>
    import {ref} from 'vue';
    import AuthService from "@/services/AuthService";
    import router from "@/router";

    const valid = ref(false)

    const form = ref(null)

    const user = ref({
            login: "",
            password: "",
        })

    const rules = ref({
        required: value => !!value || 'Обязательное поле'
        })

    const login = () => {

        AuthService.login(user.value).then((response) => {

            var preAuthenticationRoutePath = null
            
            if (response.data.token) {

                preAuthenticationRoutePath = window.localStorage.getItem("preAuthenticationRoutePath");
                
                window.localStorage.clear();
                
                window.localStorage.setItem("jwtToken", response.data.token);
            }
            
            if (!!preAuthenticationRoutePath) {

                router.push(preAuthenticationRoutePath);

            } else {

                router.push("/operations")

            }

        });
      }
  </script>