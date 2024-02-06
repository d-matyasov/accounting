// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/default/Default.vue')
    },
    {
        path: '/operations',
        name: 'Operations',
        component: () => import('@/components/Operations.vue')
    },
    {
        path: '/references',
        name: 'References',
        component: () => import('@/components/References.vue'),
        children: [
        {
            path: '/currencies',
            name: 'Currencies',
            component: () => import('@/components/references/system/CurrencyList.vue')
        },
        {
            path: '/accounting-object-types',
            name: 'AccountingObjectTypes',
            component: () => import('@/components/references/system/AccountingObjectTypeList.vue')
        },
        {
            path: '/accounting-objects',
            name: 'AccountingObjects',
            component: () => import('@/components/references/user/AccountingObjectList.vue')
        },
        {
            path: '/operation-categories',
            name: 'OperationCategories',
            component: () => import('@/components/references/user/OperationCategoryList.vue')
        },
        {
            path: '/quick-addons',
            name: 'QuickAddons',
            component: () => import('@/components/references/user/QuickAddonList.vue')
        },
        {
            path: '/users',
            name: 'Users',
            component: () => import('@/components/references/system/UserList.vue')
        }
        ],
    },
    {
        path: '/test',
        name: 'Test',
        component: () => import('@/components/references/Test.vue')
    },
    {
        path: '/auth/login',
        name: 'Login',
        component: () => import('@/components/auth/LoginForm.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
