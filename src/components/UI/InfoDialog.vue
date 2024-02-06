<template>
    <v-dialog
        v-model="show"
        persistent
        scrollable
        max-width="800px">
        <v-card class="pa-4">
            <v-card-title>
                <v-icon>mdi-information-variant</v-icon>
            </v-card-title>
            <v-card-text>
                {{ data }}
            </v-card-text>

            <v-card-actions
                class="pr-4">
                <v-spacer />

                <v-btn
                    @click="$emit('update', null)"
                    variant="elevated">
                    OK
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>



<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: String
})

const show = ref(false)

const data = ref(null)


watch(() => props.modelValue, (e) => {
    if (e) {
        show.value = true
        data.value = props.modelValue

    } else {
        show.value = false
        data.value = null
    }
})

</script>