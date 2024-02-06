import { ref } from 'vue'

export const toFormattedMonetaryUnit = v => {
    
    if (v == null || !v.toString()) {

        return ""

    }

    const sign = v < 0 ? "-" : ""
    
    const v_abs = Math.abs(v);

    return v_abs.toString() == 0 
            ? "0,00" 
            : v_abs < 10 
                ? sign + '0,0' + v_abs.toString() 
                : v_abs < 100 
                    ? sign + '0,' + v_abs.toString() 
                    : sign + v_abs.toString().replace(/\B(?=\d{2}$)/g, ",").replace(/\B(?=(\d{3})+(?!\d))/g, "\xa0")
}

export const STATIC = {
    dateFormat: () => 'dd.MM.yyyy'
}

export const _OPERATIONS = {
    "headers": [
        {
            "key": "date",
            "label": "Дата",
            "type": "date",
            "editable": false
        },
        {
            "key": "amount_plus",
            "label": "Приход",
            "type": "amount",
            "editable": false
        },
        {
            "key": "amount_minus",
            "label": "Расход",
            "type": "amount",
            "editable": false
        },
        {
            "key": "is_fact",
            "label": "Ф",
            "type": "boolean",
            "editable": true
        },
        {
            "key": "accounting_object_7",
            "label": "А1",
            "type": "amount",
            "editable": false
        },
        {
            "key": "accounting_object_1",
            "label": "Н",
            "type": "amount",
            "editable": false
        }
    ],
    "_header": {
        "date": "Дата",
        "amount_plus": "Приход",
        "amount_minus": "Расход",
        "is_fact": "Ф",
        "accounting_object_7": "А1",
        "accounting_object_1": "Н"
    },
    "data": [
        {
            "id": 1,
            "pair_operation_id": null,
            "date": "2023-06-01",
            "amount_plus": 10000,
            "is_fact": false,
            "accounting_object_1": 10000
        },
        {
            "id": 2,
            "pair_operation_id": 3,
            "date": "2023-06-01",
            "amount_plus": 10000,
            "amount_minus": 10000,
            "is_fact": false,
            "accounting_object_1": -10000,
            "accounting_object_7": 10000
        }
    ]
}