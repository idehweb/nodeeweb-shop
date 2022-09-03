
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "product",
    "model": model,
    "modelName": "Product",
    "routes": routes,

    "admin": {
        "list": {
            "header":["title"]
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