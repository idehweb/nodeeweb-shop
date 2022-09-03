
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "transaction",
    "model": model,
    "modelName": "Transaction",
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