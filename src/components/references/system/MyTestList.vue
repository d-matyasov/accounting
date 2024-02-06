<template>
    
    <v-col>
        <v-col cols="12"
            class="text-right">
            <v-btn 
                @click="create"
                color="primary">Создать</v-btn>
        </v-col>
    </v-col>

    <!-- <accounting-object-type-edit-dialog/> -->

    <!-- <v-dialog
    :modelValue=true

        >
        <v-col>
        фыва
        </v-col>    
    </v-dialog> -->

    <!-- <v-btn @click="showMyTest = true">Show {{ showMyTest }}</v-btn>

    <my-test
        :modelValue="showMyTest"
        @update:modelValue="showMyTest = false"></my-test>

    <my-test
        v-model="showMyTest"
        v-model:test="test1"></my-test>

        test1: {{ test1 }} -->

        <!-- <v-text-field
            label="Начальная сумма"
            _v-model="data.startAmount"
            v-model="displayValue"
            @input="handleInput"
            @blur="blurInput"
            clearable />
     
    "displayValue:" {{ displayValue }}
    <br/>
    "amount:" {{ amount }} -->

    <br/>
    <amount-input
        label="Сумма"
        v-model="testAmount"
    />

    <br/>

    <v-btn 
                @click="create"
                color="primary">
                Создать
    </v-btn>

    {{ testAmount }}

</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
// import AccountingObjectTypeEditDialog from './AccountingObjectTypeEditDialog.vue';
import MyTest from './MyTest.vue';
import { toFormattedMonetaryUnit } from '@/common'
// import { AmountInput } from '@/components/UI/index'
import AmountInput from '@/components/UI/AmountInput.vue'


const testAmount = ref(123456)

const create = () => {
    testAmount.value = 12345
    console.log(testAmount.value);
}

const amount = ref()

const displayValue = ref()

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

    // if (v.target.value.lastIndexOf(",") != v.target.value.indexOf(",")) {
    //     v.target.value = v.target.value.replace(/\,$/, "")
    // }

    // if ((/\,\d{3}/g).test(v.target.value)) {
    //     v.target.value = v.target.value.replace(/\d$/, "")
    // }

    displayValue.value = v.target.value
}

const blurInput = (v) => {

    if (!v.target.value) {
        amount.value = null
        displayValue.value = null
        return
    }

    displayValue.value = displayValue.value.replace(/(?<x>\d+)(?<y>,)*(?<z>\d+)*$/, (...e) => {
        const m = e.slice(-1)[0]
        m.z ??= "00"
        if (m.z.length == 1) m.z += "0"
        return m.x + ',' + m.z
    })

    amount.value = Number(displayValue.value.replace(/[^\d]/g, ""))
    // amount.value = displayValue.value ? displayValue.value.replace(/[^\d]/g, "").replace(/^0*/g, "") : null

    // if (!v.target.value) {
    //     amount.value = null
    //     displayValue.value = null
    // } else {
    //     if (!(/\,/g).test(v.target.value) || (/\,$/g).test(v.target.value)) {
    //         amount.value = amount.value + '00'
    //     }
    //     if ((/\,\d{1}$/g).test(v.target.value)) {
    //         amount.value = amount.value + '0'
    //     }

    //     displayValue.value = toFormattedMonetaryUnit(amount.value)

    //     amount.value = Number(amount.value)
               
    // }
}

const showMyTest = ref(false)
const test1 = ref(123)

// const editItem = ref(null)

// const create = () => {editItem.value = {}}

</script>