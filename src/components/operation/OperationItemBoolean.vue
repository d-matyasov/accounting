<template>
    <td>
        <v-icon 
            v-if="editable"
            @click="$emit('update', !value)"
            color="grey-darken-1">
            {{ value ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'}}
        </v-icon>
        <v-icon 
            v-else
            color="grey-darken-1">
            {{ value ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'}}
        </v-icon>
    </td>
</template>

<script setup>

defineProps({
    value: Boolean,
    editable: {
        type: Boolean,
        default: false
    }
})

defineEmits([ 'update' ])

</script>