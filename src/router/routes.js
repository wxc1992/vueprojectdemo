const Home =()=> import(/*webpackChunkName: "Home"*/'../pages/index.vue')
const ApproveChain = ()=>import (/*webpackChunkName: "approveChain"*/'../pages/approveChain/index.vue')


export default [
    {
        path: '/',
        redirect: '/approve_chain'
    },
    {
        path: '/',
        component: Home,
        children: [
           
            {
                path: '/approve_chain',
                component: ApproveChain,
                title:"菜单1",
                meta:{appCode:'approve_chain',title:"菜单1"},
            }
        ]
    }

]