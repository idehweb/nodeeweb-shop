import controller from './controller.mjs'
export default [
    {
        "path": "/",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },{
        "path": "/createByCustomer",
        "method": "post",
        "access": "admin_user,admin_shopManager,customer_user",
    },
    {
        "path": "/count",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/cart",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.createCart,
    },
    {
        "path": "/cart/:id",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.createCart,
    },
    {
        "path": "/:offset/:limit",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:id",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/",
        "method": "post",
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