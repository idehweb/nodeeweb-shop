
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "attributes",
    "model": model,
    "modelName": "Attributes",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "name", "type": "object"},
                {"name": "slug", "type": "string"},
                {"name": "type", "type": "string"},
                {"name": "actions", "type": "actions", "edit": true,"delete":true}

            ],
        },
        "create": {
            "fields": [
                {name: "name", type: "object"},
                {name: "slug", type: "string"},
                {name: "image", type: "string"},
                {name: "order", type: "number"},
                {name: "kind", type: "string"},
                {name: "link", type: "string"},
                {name: "icon", type: "string"},
                {name: "data", type: "object"},
                {name: "parent", type: "ref", ref: "Menu"}
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