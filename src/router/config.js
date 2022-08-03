export default [//配置菜单
    {
        path: '/home',
        component: 'Home',
        children: [
            {
                path: '/approve_chain',
                component: 'ApproveChain',
                icon: 'pull-request',
                title:"菜单1",
                appCode:'approve_chain',
            },
            {
                path: '/approve_proxy',
                component: 'ApproveProxy',
                icon: 'retweet',
                title:"菜单2",
                appCode:'approve_proxy',
            },
        ]
    }

]