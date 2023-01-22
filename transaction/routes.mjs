import controller from './controller.mjs'

export default [
    {
        "path": "/",
        "method": "get",
        "access": "admin_user,admin_shopManager",
        "controller": controller.all,

    },{
        "path": "/status",
        "method": "get",
        "access": "admin_user,admin_shopManager",
        "controller": controller.statusZibal,

    },{
        "path": "/verify",
        "method": "get",
        "access": "admin_user,admin_shopManager",
        "controller": controller.verify,

    },
    {
        "path": "/count",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },


    {
        "path": "/",
        "method": "post",
        "access": "admin_user,admin_shopManager",
    }, {
        "path": "/buy/:_id",
        "method": "get",
        "access": "customer_all",
        "controller": controller.buy,
    },
    {
        "path": "/buy/:_id",
        "method": "post",
        "access": "customer_all",
        "controller": controller.buy,
    }, {
        "path": "/buy/:_id/:_price",
        "method": "get",
        "access": "customer_all",
        "controller": controller.buy,
    }, {
        "path": "/buy/:_id/:_price",
        "method": "post",
        "access": "customer_all",
        "controller": controller.buy,
    },
    {
        "path": "/:offset/:limit",
        "method": "get",
        "access": "admin_user,admin_shopManager",
        "controller": controller.all,

    },
    {
        "path": "/:id",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:id",
        "method": "put",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:id",
        "method": "delete",
        "access": "admin_user,admin_shopManager",
    },
]