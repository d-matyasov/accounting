import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import axiosInstance from '@/services/AxiosInstanceService'



export const entities = {
    useCurrencyStore: 'currencies',
    useAccountingObjectTypeStore: 'accounting-object-types',
    useAccountingObjectStore: 'accounting-objects',
    useAccountingObjectsAndTransfersStore: 'accounting-objects/accounting-objects-and-transfers-view',
    useOperationCategoryStore: 'operation-categories',
    useQuickAddonStore: 'quick-addons'
}

const store = Object.assign(
    ...Object.keys(entities).map(entity => {
        
        return { 
            
            [entity]: defineStore(entities[entity], () => {
                
                const state = ref([])
                
                let isLoaded = false

                const get = async () => {

                    if (isLoaded) return state.value

                    await axiosInstance.get(`/api/${entities[entity]}`)

                        .then(response => {

                            state.value = response.data

                            isLoaded = true    

                        })

                        .catch(error => {
                            
                            console.log(error.response.status)    

                    })
                
                return state.value    

                }

                const save = async data => {
                    
                    if (data.id) {    
                        // const response = await axios.patch(`/api/${entities[entity]}/${data.id}`, data)
                        // const idx = state.value.findIndex(f => f.id == data.id)
                        // if (idx > -1) 
                        //     state.value.splice(idx, 1, response.data)

                        await axiosInstance.patch(`/api/${entities[entity]}/${data.id}`, data)

                        .then((response) => {
                            
                            const idx = state.value.findIndex(f => f.id == data.id)

                            if (idx > -1) 

                                state.value.splice(idx, 1, response.data)
    
                        })
    
                        .catch(error => {
                            
                            console.log(error.response.status)    
    
                        })

                    } else {
                        // const response = await axios.post(`/api/${entities[entity]}`, data)
                        // state.value.push(response.data)

                        await axiosInstance.post(`/api/${entities[entity]}`, data)

                        .then((response) => {
                            
                            state.value.push(response.data)
    
                        })
    
                        .catch(error => {
                            
                            console.log(error.response.status)    
    
                        })

                    }
                }

                const remove = async item => {
                    // const response = await axios.delete(`/api/${entities[entity]}/${item.id}`)
                    // const idx = state.value.findIndex(f => f.id == item.id)
                    //     if (idx > -1) 
                    //         state.value.splice(idx, 1)

                    await axiosInstance.delete(`/api/${entities[entity]}/${item.id}`)

                    .then((response) => {
                        
                        const idx = state.value.findIndex(f => f.id == item.id)
                            if (idx > -1) 
                                state.value.splice(idx, 1)

                    })

                    .catch(error => {
                        
                        console.log(error.response.status)    

                    })
                }

                const findById = (id) => ((e)=> e ?? {})(state.value.find(f => f.id == id))

                return {
                    // state,
                    get,
                    save,
                    remove,
                    findById
                }
            })
        }
    })  
)


// console.log({store})


// export const currencyStore = defineStore('currency', () => {
    
//     const state = ref([])
//     let isInit = false

//     const get = async () => {

//         if (isInit) return state.value

//         const result = await axios.get("/api/currencies", {
//             withCredentials: false
//         })

//         state.value = result.data

//         isInit = true

//         return state.value        
//     }

//     const save = async data => {
//         if (data.id) {    
//             const response = await axios.patch(`/api/currencies/${data.id}`, data)
//             const idx = state.value.findIndex(f => f.id == data.id)
//             if (idx > -1) 
//                 state.value.splice(idx, 1, data)
//         } else {
//             const response = await axios.post('/api/currencies', data)
//             state.value.push(response)
//         }
//     }

//     return {
//         state,

//         get,
//         save
//     }

// })

export default store