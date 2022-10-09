
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "productCategory",
    "model": model,
    "modelName": "ProductCategory",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "name", "type": "multiLang"},
                {"name": "slug", "type": "string"},
                {"name": "order", "type": "number"},
                {"name": "parent", "type": "string"},
                {"name": "actions", "type": "actions", "edit": true, "delete": true}

            ],
        },
        "create": {
            "fields": [
                {name: "name", type: "object"},
                {name: "slug", type: "string"},
                {name: "order", type: "number"},
                {name: "kind", type: "string"},
                // {name: "parent", type: "reference", reference: "ProductCategory"}
            ]
        }
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