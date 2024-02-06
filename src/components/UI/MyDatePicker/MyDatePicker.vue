<template>
    <v-card
        v-if="!!dateObject"
        flat
        v-bind="$attrs">
        <v-card-title class="bg-primary text-center pa-4">
            <template v-if="!!data">{{ dateObject.result }}</template>
            <template v-else>{{ dateObject.year }}</template>
        </v-card-title>
        <v-card-text
            class="px-4 py-8">
            <v-row>
                <v-col cols="2" class="text-left">
                    <v-icon @click.stop="() => change('month', -1)">mdi-chevron-left</v-icon>
                </v-col>
                <v-col cols="8" class="text-center">
                    {{ dateObject.MONTH }}
                </v-col>
                <v-col cols="2" class="text-right">
                    <v-icon @click.stop="() => change('month', 1)">mdi-chevron-right</v-icon>
                </v-col>
                <v-col cols="12">
                    <v-row                        
                        no-gutters
                        class="my-grid">
                        <v-col
                            v-for="day in MyDate.DAYS"
                            class="text-center">
                            <v-btn
                                icon
                                variant="flat"
                                size="small"
                                class="font-weight-light"
                                _disabled
                                @click="() => {}">{{ day.substring(0, 2) }}</v-btn>
                        </v-col>
                    </v-row>

                    <v-row
                        no-gutters
                        class="my-grid">
                        <v-col
                            v-for="day in dateObject.days.prev"
                            class="text-center text-disabled">
                                <v-btn
                                    flat
                                    icon
                                    variant="flat" 
                                    _disabled
                                    _click="() => {}">{{ day }}</v-btn>
                        </v-col>
                        <v-col
                            v-for="day in dateObject.days.now"
                            class="text-center">
                                <v-btn
                                    icon
                                    variant="flat" 
                                    :class="{ 'bg-grey-lighten-4': day.isToday && !day.isSelected, 'bg-primary': day.isSelected }"
                                    @click="() => select(day.date)">
                                    {{ day.date }}
                                </v-btn>
                        </v-col>
                        <v-col
                            v-for="day in dateObject.days.next"
                            class="text-center text-disabled">
                                <v-btn
                                    flat
                                    icon
                                    variant="flat" 
                                    _disabled
                                    @click="() => {}">{{ day }}</v-btn>
                        </v-col>
                    </v-row>
                    <!-- <div>modelValue: <b>{{  modelValue  }}</b></div> -->
                    <!-- <div>date: {{ date }}</div>

                    <div>firstDay: {{ dateObject.firstDay }}</div>
                    <div>lastDay: {{ dateObject.lastDay }}</div>
                    <div>days: {{ dateObject.days }}</div>
                    <div>{{ firstDayOfMonth() }}</div>
                    <div>{{ lastDayOfMonth() }}</div> -->
                </v-col>
            </v-row>
            
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { MyDate } from './index.js'

const props = defineProps({
    modelValue: {
        type: [Number, String, Date],
        default: Date.now()
    },
    format: {
        type: String,
        default: 'YYYY-MM-DD'
    }
})

const emit = defineEmits([ 'update:modelValue' ])

const date = ref(null)
const data = ref(null)
const type = ref(null)

const dateObject = computed(() => {

    const d = new MyDate(date.value)

    
    const today = new MyDate().extractDate().valueOf()
    const newToday = new MyDate(d)

    const _lastDayOfMonth = d.lastDayOfMonth()

    const firstDay = d.firstDayOfMonth().getDay()
    const lastDay = _lastDayOfMonth.getDay()


    const rd = new MyDate(data.value)
    const result = rd.getDate() + ' ' + MyDate.DAYS[rd.getDay()].substring(0, 3) + ' ' + MyDate.MONTH[rd.getMonth()] + ' ' + rd.getFullYear()
    
    return {
        year:   d.getFullYear(),
        month:  d.getMonth(),
        MONTH:  MyDate.MONTH[d.getMonth()],
        firstDay,
        lastDay,
        days: {
            prev: firstDay > 0 
                ? [...new Array(firstDay - 1)]
                    .reduce((result, item, idx) => { result.splice(0, 0, result[0] - 1); return result }, [MyDate.lastDayOfMonth(new MyDate(d).add('month', -1)).getDate()])
                : [],
            now: [...new Array(_lastDayOfMonth.getDate())]
                .map((_, idx) => {
                    const thisDayMs = newToday.setDate(idx + 1)
                    return { 
                        date: idx + 1, 
                        isToday: today == thisDayMs,
                        isSelected: !!data.value && data.value == thisDayMs
                    }
                }),
            next: [...new Array((6 - lastDay) || 0)].map((_, idx) => idx + 1)
        },
        result
    }
})

const change = (...m) => date.value = new MyDate(date.value).add(...m).valueOf()
const select = _date => emit('update:modelValue', (date => {
    switch (type.value) {
        case 'string':
            return new MyDate(date).format(props.format)
        case 'date':
            return new Date(date)
        default:
            return date
    }
})(new Date(date.value).setDate(_date)))

watch(() => props.modelValue, e => {
    if (!!e) {
        type.value = typeof e != 'object' 
            ? typeof e
            : e instanceof Date
                ? 'date'
                : 'string'

        switch (typeof e) {
            case 'string': 
                e = MyDate.parse(e, props.format).valueOf()
                // e = Date.parse(e).valueOf()
                break
            default:
        }

        date.value = new MyDate(e).extractDate().valueOf()
        data.value = date.value
    } else {
        date.value = new MyDate().extractDate().valueOf()
        data.value = null
    }
}, { immediate: true })

</script>

<style land="scss" scoped>

.my-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

</style>