<template>
    <v-dialog
        _v-if="modelValue"
        v-model="dialog"
        persistent
        scrollable
        max-width="800px">

        <v-card 
            class="pa-4">
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
                                v-model="data.id"
                                label="ИД"
                                bg-color="transparent"
                                readonly
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
                                v-model="data.ordinalNumber"
                                label="Порядковый номер"
                                clearable
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <v-text-field
                                v-model="data.code"
                                label="Код"
                                autofocus
                                clearable
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <v-text-field
                                v-model="data.name"
                                label="Наименование*"
                                :rules="[rules.required, rules.min3Characters]"                                
                                color="primary"
                                clearable
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <v-text-field
                                v-model="data.grapheme"
                                label="Графема"
                                clearable
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="12">
                            <v-textarea
                                v-model="data.comment"
                                label="Примечание"
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
import { CURRENCY } from './index'

const props = defineProps({
    modelValue: Object
})

const dialog = ref(false)

const data = ref(CURRENCY)

const valid = ref(false)

const form = ref(null)

const rules = ref({
        required: value => !!value || 'Обязательное поле',
        min3Characters: value => (value && value.length >= 3) || 'Min 3 characters'
      })

watch(() => props.modelValue, (e, prev) => {
    
    if (e) {
        dialog.value = true
        data.value = { ...CURRENCY, ...props.modelValue }

        nextTick(() => {
            if (form.value) form.value.validate()

        })

    } else {
        dialog.value = false
        data.value = {}
    }
})


</script>