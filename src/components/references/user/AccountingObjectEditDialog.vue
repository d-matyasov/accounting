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
                                _class="my-field-required"
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
                                v-model="data.nameShort"
                                label="Краткое наименование"
                                clearable
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <date-field
                                label="Дата открытия"
                                v-model="data.openDate"
                                :datePicker="false" />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <date-field
                                label="Дата закрытия"
                                v-model="data.closeDate"
                                :datePicker="false" />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <amount-input
                                v-model="data.startAmount"
                                label="Начальная сумма"
                                clearable
                            />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <amount-input
                                v-model="data.currentAmount"
                                label="Текущая сумма"
                                bg-color="transparent"
                                readonly
                            />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <v-select
                                v-model="data.currencyId"
                                :items="currencies"
                                item-value="id"
                                item-title="name"                                
                                label="Валюта"
                                clearable
                                />
                        </v-col>
                        <v-col  class="pa-1" cols="6">
                            <v-select
                                v-model="data.typeId"
                                :items="accountingObjectTypes"
                                item-value="id"
                                item-title="name"
                                label="Тип объекта учёта"
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
import { ACCOUNTING_OBJECT } from './index'
import useStore from '@/store'
import AmountInput from '@/components/UI/AmountInput.vue'
import DateField from '@/components/UI/DateField.vue'

const currencyStore = useStore.useCurrencyStore()

const accountingObjectTypeStore = useStore.useAccountingObjectTypeStore()

const currencies = await currencyStore.get()

const accountingObjectTypes = await accountingObjectTypeStore.get()

const props = defineProps({
    modelValue: Object
})

const show = ref(false)

const data = ref(ACCOUNTING_OBJECT)

const valid = ref(false)

const form = ref(null)

const rules = ref({
        required: value => !!value || 'Обязательное поле',
        min3Characters: value => (value && value.length >= 3) || 'Min 3 characters'
      })


watch(() => props.modelValue, (e) => {
    if (e) {
        show.value = true
        data.value = { ...ACCOUNTING_OBJECT, ...props.modelValue }
        
        nextTick(() => {
            if (form.value) form.value.validate()
        })
    } else {
        show.value = false
        data.value = {}
    }
})

watch(() => data.value.startAmount, e => {
    !data.value.id ? data.value.currentAmount = e : null
})

</script>