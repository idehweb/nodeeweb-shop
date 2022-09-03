import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "order",
    "model": model,
    "modelName": 'Order',
    "routes": routes,

    "views": [{
        "func": (req, res, next) => {
        }
    }],
    "edits": [{
        "func": (req, res, next) => {
        }
    }],

}