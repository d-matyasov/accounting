<template>
    <v-dialog
        v-model="show"
        persistent
        scrollable
        max-width="800px">
        <v-card class="pa-4">
            <v-card-title>
                Период дат
            </v-card-title>
            <v-card-text>
                <v-form
                    v-model="valid"
                    ref="form"
                    class="mb-1">
                    <v-row>
                        <v-col class="pa-1" cols="4">
                            <date-field
                                v-model="data.dateFrom"
                                :rules="[rules.required]"
                                label="С"
                                :datePicker="true"
                                clearable
                                />
                        </v-col>
                        <v-col class="pa-1" cols="4">
                            <date-field
                                v-model="data.dateTo"
                                label="По"
                                :datePicker="true"
                                clearable
                                />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions
                class="pr-4">
                <v-spacer />
                <v-btn 
                    @click="$emit('save', data)"
                    color="primary"
                    variant="elevated"
                    :disabled="!valid">
                    Выбрать
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
import { ref, watch, nextTick } from 'vue'
import _ from 'lodash'
import DateField from '@/components/UI/DateField.vue'

const props = defineProps({
    modelValue: Object
})

const show = ref(false)

const data = ref(null)

const valid = ref(false)

const form = ref(null)

const rules = ref({
    required: value => !!value || "Обязательное поле"
})

watch(() => props.modelValue, (e) => {
    if (e) {

        show.value = true
        data.value = { ...props.modelValue }

        nextTick(() => {
            if (form.value) form.value.validate()
        })
    } else {
        show.value = false
        data.value = {}
    }
})

</script>