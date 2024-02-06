import { defineCustomElement } from 'vue'
import AmountInputComponent from './AmountInput.vue'

export const AmountInput = defineCustomElement(AmountInputComponent)
customElements.define('amount-input', AmountInput)