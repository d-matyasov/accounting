<template>
    <v-text-field
            v-model="displayValue"            
            _label="label"
            @input="handleInput"
            @blur="blurInput"
            v-bind="{ ...$attrs, 'onUpdate:modelValue': null }" />
</template>




<script setup>
import { ref, watch } from 'vue'
import { toFormattedMonetaryUnit } from '@/common'

const props = defineProps({
    modelValue: Number
})

const amount = ref()

const displayValue = ref()

const emit = defineEmits([ "update:modelValue" ])

const handleInput = (v) => {

    amount.value = null

    v.target.value = v.target.value
        .replace(/\./g, ",")
        .replace(/[^0-9\,]/g, "")
        .replace(/^0{2}/g, "0")
        .replace(/^0+(\d)/g, "0,$1")
        .replace(/^\,/g, "0,")
        .replace(/^([0-9]+,[0-9]{2}).*$/g, "$1")
        .replace(/(?<=,)([^\,]*),([^\,]*)/g, "$1$2")
        .replace(/\B(?=(\d{3})+(?!\d))/g, "\xa0")

    displayValue.value = v.target.value

}

const blurInput = (v) => {

    if (!v.target.value) {
        amount.value = null
        displayValue.value = null
        emit('update:modelValue', null)
        return
    }

    displayValue.value = displayValue.value.replace(/(?<x>\d+)(?<y>,)*(?<z>\d+)*$/, (...e) => {
        const m = e.slice(-1)[0]
        m.z ??= "00"
        if (m.z.length == 1) m.z += "0"
        return m.x + ',' + m.z
    })

    amount.value = Number(displayValue.value.replace(/[^\d]/g, ""))

    emit('update:modelValue', amount.value)
}

watch(() => props.modelValue, e => {
    amount.value = e

    displayValue.value = toFormattedMonetaryUnit(amount.value)
}, { immediate: true })

</script>