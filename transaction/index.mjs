
import model from './model.mjs'
import routes from './routes.mjs'

export default {
    "name": "transaction",
    "model": model,
    "modelName": "Transaction",
    "routes": routes,
    "admin": {
        "list": {
            "header": [
                {"name": "Authority", "type": "string"},
                {"name": "RefID","type": "string"},
                {"name": "amount","type":"price"},
                {"name": "order","type":"object","keys":["orderNumber"]},
                {"name": "statusCode","type":"string"},
                {"name": "createdAt","type":"date"},
                {"name": "updatedAt","type":"date"}
                ]
        },
        "create": {
            "fields": [{"name": "title", "type": "string"},]
        },
        "edit": {
            "fields": [
                {"name": "statusCode", "type": "string"},
                {"name": "amount", "type": "string"},
                {"name": "Authority", "type": "string"},
                {"name": "createdAt", "type": "date"},
                {"name": "updatedAt", "type": "date"},
            ]
        },
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