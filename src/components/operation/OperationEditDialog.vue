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
                        <v-col class="pa-1" cols="4">
                            <date-field
                                v-model="data.date"
                                v-on:update:model-value="!data._date ? data._date=selectedItem.date : null"
                                :rules="[rules.required]"
                                label="Дата"
                                :datePicker="false"
                                clearable
                                />
                        </v-col>
                        <v-col class="pa-1" cols="6">
                            <v-select
                                v-model="data.accountingObjectOrTransferId"
                                :items="accountingObjectsAndTransfers"
                                item-value="id"
                                item-title="name"
                                :rules="[rules.required, rules.oneOfAmounts]"
                                label="Объект учёта/Перенос"
                                />
                        </v-col>
                        <v-col class="pa-1" cols="2">
                            <v-checkbox
                                v-model="data.isFact"
                                label="Факт"
                                clearable
                                />
                        </v-col>
                        <v-col v-if="!data.accountingObjectOrTransferId ? true : data.accountingObjectOrTransferId.indexOf(',') == -1" class="pa-1" cols="6">
                            <amount-input
                                v-model="data.amountPlus"
                                :rules="[rules.requiredAmountPlus]"
                                label="Приход"
                                :clearable="!data.amountMinus || (!!data.amountPlus && !!data.amountMinus)"
                                :readonly="!!data.amountMinus"
                                />
                        </v-col>
                        <v-col v-if="!data.accountingObjectOrTransferId ? true : data.accountingObjectOrTransferId.indexOf(',') == -1" class="pa-1" cols="6">
                            <amount-input
                                v-model="data.amountMinus"
                                :rules="[rules.requiredAmountMinus]"
                                label="Расход"
                                :clearable="!data.amountPlus || (!!data.amountPlus && !!data.amountMinus)"
                                :readonly="!!data.amountPlus"
                                />
                        </v-col>
                        <v-col v-if="!data.accountingObjectOrTransferId ? false : data.accountingObjectOrTransferId.indexOf(',') >= 0" class="pa-1" cols="12">
                            <amount-input
                                v-model="data.amountMinus"
                                :rules="[rules.required]"
                                label="Сумма переноса"
                                clearable
                                />
                        </v-col>
                        <v-col class="pa-1" cols="6">
                            <v-select
                                v-model="data.categoryId"
                                :items="operationCategories"
                                item-value="id"
                                item-title="name"
                                label="Категория"
                                clearable
                                />
                        </v-col>
                        <v-col class="pa-1" cols="6">
                            <v-autocomplete
                                v-model="data.categoryAddon"
                                @update:search="categoryAddonSearch"
                                @update:focused="categoryAddonFocused"
                                @keyup.enter="categoryAddonFocused(false)"
                                :items="operationCategoriesAddon"
                                item-value="name"
                                item-title="name"
                                label="Категория (доп.)"
                                clearable />
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
                    :disabled="!valid || (data.date == selectedItem.date 
                                            && data.amountPlus == selectedItem.amountPlus 
                                            && data.amountMinus == selectedItem.amountMinus 
                                            && data.isFact == selectedItem.isFact 
                                            && data.accountingObjectOrTransferId == selectedItem.accountingObjectOrTransferId 
                                            && data.categoryId == selectedItem.categoryId 
                                            && data.categoryAddon == selectedItem.categoryAddon)">
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
import _ from 'lodash'
import { OPERATION } from './index'
import useStore from '@/store'
import AmountInput from '@/components/UI/AmountInput.vue'
import DateField from '@/components/UI/DateField.vue'

const accountingObjectsAndTransfersStore = useStore.useAccountingObjectsAndTransfersStore()

const operationCategoryStore = useStore.useOperationCategoryStore()

const quickAddonStore = useStore.useQuickAddonStore()

const accountingObjectsAndTransfers = await accountingObjectsAndTransfersStore.get()

const operationCategories = await operationCategoryStore.get()

const quickAddons = await quickAddonStore.get()

const operationCategoriesAddon = ref([])

const props = defineProps({
    modelValue: Object,
    selectedItem: Object
})

const show = ref(false)

const data = ref(null)

const valid = ref(false)

const form = ref(null)

const rules = ref({
    required: value => !!value || "Обязательное поле",
    min3Characters: value => (value && value.length >= 3) || 'Минимум 3 символа',
    oneOfAmounts: value => (value && !(value.indexOf(',') < 0 && !!data.value.amountPlus && !!data.value.amountMinus)) || "Для объекта учёта: или приход или расход",
    requiredAmountPlus: value => (!!value || !!data.value.amountMinus) || "Обязательное, если не указан расход",
    requiredAmountMinus: value => (!!value || !!data.value.amountPlus) || "Обязательное, если не указан приход"
})

const categoryAddonNewValue = ref()

const categoryAddonSearch = e => {
    console.log('categoryAddonSearch:', e)
    categoryAddonNewValue.value = e
}

const categoryAddonFocused = e => {
    console.log('categoryAddonFocused:', e)
    if (!e && !!categoryAddonNewValue.value) {
        operationCategoriesAddon.value.push({ name: categoryAddonNewValue.value })
        data.value.categoryAddon = categoryAddonNewValue.value
        categoryAddonNewValue.value = null
    }
}

watch(() => props.modelValue, (e) => {
    if (e) {
        show.value = true
        data.value = { ..._.cloneDeep(OPERATION), ...props.modelValue }

        nextTick(() => {
            if (form.value) form.value.validate()
        })
    } else {
        show.value = false
        data.value = {}
    }
}, { immediate: true })

watch(() => data.value.accountingObjectOrTransferId, e => {
    if (!!e && e.indexOf(',') >= 0 && !!data.value.amountPlus && !data.value.amountMinus) {
        data.value.amountMinus = data.value.amountPlus
    }
    if (!!e && e.indexOf(',') >= 0 && !data.value.amountPlus && !!data.value.amountMinus) {
        data.value.amountPlus = data.value.amountMinus
    }
})

watch(() => data.value.amountPlus, (e) => {
    if (!e || (e && !data.value.amountMinus)) {
        if (form.value) form.value.validate()
    }
})

watch(() => data.value.amountMinus, (e) => {
    if (!e || (e && !data.value.amountPlus)) {
        if (form.value) form.value.validate()
    }
    if (!!data.value.accountingObjectOrTransferId && data.value.accountingObjectOrTransferId.indexOf(',') >= 0) {
        data.value.amountPlus = data.value.amountMinus
    }
})

watch(() => data.value.categoryId, () => {
    operationCategoriesAddon.value = operationCategories.find(f => f.id == data.value.categoryId)?.quickAddonList ?? []
})

</script>