<template>
    <v-dialog
        v-model="show"
        persistent
        scrollable
        max-width="800px">
        <v-card class="pa-4">
            <v-card-title>
                <span v-if="data.id">Редактирование</span><span v-else>Создание</span> записи
            </v-card-title>
            <v-card-text>
                <v-form
                    v-model="valid"
                    ref="form"
                    class="mb-1">
                    <v-row>
                        <v-col  class="pa-1" cols="6">
                            <v-text-field
                                v-if="data.id"
                                label="ИД"
                                v-model="data.id"
                                disabled
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <v-checkbox
                                v-model="data.isActual"
                                label="Актуальная"
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <v-text-field
                                label="Код"
                                v-model="data.code"
                                _class="my-field-required"
                                autofocus
                                clearable
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <v-text-field
                                label="Наименование*"
                                v-model="data.name"
                                :rules="[rules.required, rules.min3Characters]"                                
                                color="primary"
                                clearable
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <v-text-field
                                label="Краткое наименование"
                                v-model="data.nameShort"
                                clearable
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <v-checkbox
                                v-model="data.isCredit"
                                label="Кредит"
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="12">
                            <v-textarea
                                label="Примечание"
                                v-model="data.comment"
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
                    <span v-if="data.id">Сохранить</span><span v-else>Создать</span>
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
import { ACCOUNTING_OBJECT_TYPE } from './index'

const props = defineProps({
    modelValue: Object
})

const show = ref(false)

const data = ref(ACCOUNTING_OBJECT_TYPE)

const valid = ref(false)

const form = ref(null)

const rules = ref({
        required: value => !!value || 'Обязательное поле',
        min3Characters: value => (value && value.length >= 3) || 'Min 3 characters'
      })

watch(() => props.modelValue, (e) => {
    if (e) {
        show.value = true
        data.value = { ...ACCOUNTING_OBJECT_TYPE, ...props.modelValue }
        
        nextTick(() => {
            if (form.value) form.value.validate()
        })
    } else {
        show.value = false
        data.value = {}
    }
})

</script>