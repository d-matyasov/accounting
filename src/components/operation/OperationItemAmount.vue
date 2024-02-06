<template>
    <td
        class="text-right">
        {{ toFormattedMonetaryUnit(amount) }}
    </td>
</template>

<script setup>
import { computed } from 'vue'
import { toFormattedMonetaryUnit } from '@/common'

const props = defineProps({
    value: Number
})

const amount = computed(() => {

    return props.value
})

</script>