<template>

    is from my-test: {{ is }}

    <div v-if="is">
        <h1>TEST</h1>

        <v-btn @click="close()">Close</v-btn>
    </div>



</template>

<script setup>
import { ref, watch } from 'vue'



const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    test: Number
})

const emit = defineEmits([ "update:modelValue", "update:test" ])

const is = ref(props.modelValue)

const close = () => {
    console.log("Close btn clicked!")
    emit("update:modelValue")
    emit("update:test", 321)
}

watch(() => props.modelValue, (value, preValue) => {
    console.log({ value, preValue })
    is.value = props.modelValue
})

console.log("My-test rendered...")

</script>