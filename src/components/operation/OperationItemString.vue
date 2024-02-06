<template>
    <td>
        {{ string }}
    </td>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    value: String
})

const string = computed(() => {

    return props.value
})

</script>