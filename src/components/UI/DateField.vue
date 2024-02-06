<template>
    <v-menu>
        <template v-slot:activator="{ props }">

            <v-text-field
                v-model="formattedDate"
                label="Date"
                v-bind="{ ...$attrs, 'onUpdate:modelValue': null }">
                <template 
                    #append-inner
                    v-if="datePicker">
                    <v-icon
                        v-bind="props">mdi-calendar</v-icon>
                </template>
            </v-text-field>

        </template>

        <v-list class="pa-0 ma-0">
            <v-list-item class="ma-0 pa-0">
                <my-date-picker
                    :modelValue="rawDate"
                    @update:modelValue="update"
                    max-width="360" />
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup>
import { ref, watch } from 'vue'
import { STATIC } from '@/common'
import { MyDate } from '@/components/UI/MyDatePicker'
import MyDatePicker from '@/components/UI/MyDatePicker/MyDatePicker.vue'

const props = defineProps({
    modelValue: String,
    format: {
        type: String,
        default: STATIC.dateFormat()
    },
    datePicker: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue'])

const rawDate = ref(null)
const formattedDate = ref(null)

const update = date => {
    if (!!date) {
        emit('update:modelValue', new MyDate(date).format('yyyy-MM-dd'))
    } else {
        emit('update:modelValue', null)
    }
}

watch(() => props.modelValue, value => {
    if (!value) {
        rawDate.value = null
        formattedDate.value = null
    } else {
        rawDate.value = MyDate.parse(value, 'yyyy-MM-dd')
        formattedDate.value = new MyDate(rawDate.value).format(props.format)
    }
}, { immediate: true })

watch(formattedDate, e => {
    try {
        if (!!e) {
            update(MyDate.parse(e, props.format).valueOf())
        } else {
            update(e)
        }        
    } catch (e) {
        console.log('Invalid date...')
    }
})

</script>