import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "product",
    "model": model,
    "modelName": "Product",
    "routes": routes,

    "admin": {
        "list": {
            "header": [
                {"name": "thumbnail", "type": "image"},
                {"name": "title", "type": "multiLang"},
                {"name": "category"},
                {"name": "createdAt","type":"date"},
                {"name": "updatedAt","type":"date"},
                {"name": "actions","type":"actions","edit":true,"delete":true},
            ]
        },
        "create": {
            "fields": [{"name": "title"},]
        },
        "edit": {},
    },
    "views": [{
        "func": (req, res, next) => {
        }
    }],
    "edits": [{
        "func": (req, res, next) => {
        }
    }],

}