<template>
    <td>
        {{ moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY') }}
    </td>
</template>

<script setup>
import moment from 'moment'

defineProps({
    value: String
})

</script>