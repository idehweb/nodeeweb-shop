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
            "fields": [
                {"name": "title","type":"object","kind":"multiLang","size":{"lg":12,"sm":12}},
                {"name": "slug","type":"string","size":{"lg":6,"sm":12}},
                {"name": "categories","type":"checkbox","entity":"productCategory","limit":2000,"size":{"lg":6,"sm":12}},
                {"name": "excerpt","type":"object","kind":"multiLang","size":{"lg":12,"sm":12}},
                {"name": "description","type":"object","kind":"multiLang","size":{"lg":12,"sm":12}},
                {"name": "type","type":"select","options":[{"label":"normal","value":"normal","name":"normal"},{"label":"variable","value":"variable","name":"variable"}]},
                {"name": "price","type":"price"},
                {"name": "salePrice","type":"price"},
                {"name": "in_stock","type":"boolean"},
                {"name": "quantity","type":"number"},
                {"name": "options","type":"array"},
                {"name": "combinations","type":"array","children":"object","objectRules":{}},
                {"name": "photo","type":"images","size":{"lg":12,"sm":12}},
                {"name": "extra_attr","type":"array"},
                {"name": "status","type":"select","options":[{"label":"published","value":"published","name":"published"},{"label":"processing","value":"processing","name":"processing"},{"label":"draft","value":"draft","name":"draft"}],"size":{"lg":12,"sm":12}},


            ]
        },
        "edit": {
            "fields": [
                {"name": "_id","type":"string","disabled":true},
                {"name": "title","type":"object","kind":"multiLang","size":{"lg":12,"sm":12}},
                {"name": "slug","type":"string","size":{"lg":6,"sm":12}},
                {"name": "categories","type":"checkbox","entity":"productCategory","limit":2000,"size":{"lg":6,"sm":12}},
                {"name": "excerpt","type":"object","kind":"multiLang","size":{"lg":12,"sm":12}},
                {"name": "description","type":"object","kind":"multiLang","size":{"lg":12,"sm":12}},
                {"name": "type","type":"select","options":[{"label":"normal","value":"normal","name":"normal"},{"label":"variable","value":"variable","name":"variable"}]},
                {"name": "price","type":"price"},
                {"name": "salePrice","type":"price"},
                {"name": "in_stock","type":"boolean"},
                {"name": "quantity","type":"number"},
                {"name": "options","type":"array"},
                {"name": "combinations","type":"array","children":"object","objectRules":{}},
                {"name": "photo","type":"images","size":{"lg":12,"sm":12}},
                {"name": "extra_attr","type":"array"},
                {"name": "status","type":"select","options":[{"label":"published","value":"published","name":"published"},{"label":"processing","value":"processing","name":"processing"},{"label":"draft","value":"draft","name":"draft"}],"size":{"lg":12,"sm":12}},


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