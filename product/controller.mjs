import _ from 'lodash'
import path from 'path'
import mime from 'mime'
import fs from 'fs'
import https from 'https'

let self = ({

    getAll: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        if (req.headers.response !== "json") {
            return res.show()

        }
        console.log('==> getAll()', Product);
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        let fields = '';
        if (req.headers && req.headers.fields) {
            fields = req.headers.fields
        }
        let search = {};
        if (req.params.search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.params.search,
                "$options": "i"
            };
        }
        if (req.query.search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.search,
                "$options": "i"
            };
        }
        if (req.query.Search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.Search,
                "$options": "i"
            };
        }
        if (req.query) {
            console.log(req.query);
        }
        // return res.json(Product.schema.paths);
        // console.log("Product.schema => ",Product.schema.paths);
        // console.log(Object.keys(req.query));
        let tt = Object.keys(req.query);
        // console.log('type of tt ==> ', typeof tt);
        // console.log("tt => ", tt);
        _.forEach(tt, (item) => {
            // console.log("item => ",item);
            if (Product.schema.paths[item]) {
                // console.log("item exists ====>> ",item);
                // console.log("instance of item ===> ",Product.schema.paths[item].instance);
                let split = req.query[item].split(',');
                if (mongoose.isValidObjectId(split[0])) {
                    search[item] = {
                        $in: split
                    }
                }

            }
            else {
                console.log("filter doesnot exist => ", item);
            }
        });
        console.log('search', search);
        let thef = '';
        if (req.query.filter) {
            if (JSON.parse(req.query.filter)) {
                thef = JSON.parse(req.query.filter);
            }
        }
        console.log('thef', thef);
        if (thef && thef != '')
            search = thef;
        // console.log(req.mongoose.Schema(Product))
        console.log('search', search)
        var q;
        if (search['productCategory.slug']) {
            let ProductCategory = req.mongoose.model('ProductCategory');

            console.log('search[\'productCategory.slug\']', search['productCategory.slug'])
            ProductCategory.findOne({slug: search['productCategory.slug']}, function (err, productcategory) {
                console.log('err',err)
                console.log('req',productcategory)
                if (err || !productcategory)
                    return res.json([]);
                if(productcategory._id){
                    // console.log({productCategory: {
                    //         $in:[productcategory._id]
                    //     }})
                    Product.find({"productCategory": productcategory._id}, function (err, products) {

                        Product.countDocuments({"productCategory": productcategory._id}, function (err, count) {
                            if (err || !count) {
                                res.json([]);
                                return 0;
                            }
                            res.setHeader(
                                "X-Total-Count",
                                count
                            );
                            return res.json(products);

                        })
                    }).populate('productCategory','_id slug').skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
                }

            });
            // console.log('q', q)
        } else {
            console.log('no \'productCategory.slug\'')
            q = Product.find(search, fields).populate('productCategory','_id slug').skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
            q.exec(function (err, model) {

                console.log('err', err)
                if (err || !model)
                    return res.json([]);
                Product.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count);
                    if (err || !count) {
                        res.json([]);
                        return 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    return res.json(model);

                })
            });
        }

    },

    importFromWordpress: function (req, res, next) {
        let url = '';
        if (req.query.url) {
            url = req.query.url;
        }
        if (req.query.consumer_secret) {
            url += '?consumer_secret=' + req.query.consumer_secret;
        }
        if (req.query.consumer_key) {
            url += '&consumer_key=' + req.query.consumer_key;
        }

        if (req.query.per_page) {
            url += '&per_page=' + req.query.per_page;
        }
        if (req.query.page) {
            url += '&page=' + req.query.page;
        }
        console.log('importFromWordpress', url);
        let count = 0;
        req.httpRequest({
            method: "get",
            url: url,
        }).then(function (response) {
            count++;
            let x = count * parseInt(req.query.per_page)
            let Product = req.mongoose.model('Product');

            response.data.forEach((dat) => {
                let obj = {};
                if (dat.name) {
                    obj['title'] = {
                        fa: dat.name

                    }
                }
                if (dat.description) {
                    obj['description'] = {
                        fa: dat.description

                    }
                }

                if (dat.slug) {
                    obj['slug'] = dat.name.split(' ').join('-') + 'x' + x;
                }
                obj['data'] = dat;
                Product.create(obj)
            });
            // return res.json(response.data)
        });


    },
    rewriteProducts: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        let Media = req.mongoose.model('Media');
        Product.find({}, function (err, products) {
            _.forEach(products, (item) => {
                let obj = {};

                if (item.data.regular_price) {
                    obj['price'] = item.data.regular_price;
                }
                if (item.data.regular_price) {
                    obj['salePrice'] = item.data.sale_price;
                }
                Product.findByIdAndUpdate(item._id, obj, function (err, products) {
                })

            })
        })
    },
    rewriteProductsImages: function (req, res, next) {
        let Product = req.mongoose.model('Product');
        let Media = req.mongoose.model('Media');
        Product.find({}, function (err, products) {
            _.forEach(products, (item) => {
                // console.log('item', item.data.short_description)
                // console.log('item', item.data.sku)
                // console.log('item', item.data.regular_price)
                // console.log('item', item.data.sale_price)
                // console.log('item', item.data.total_sales)
                // console.log('item', item.data.images)
                let photos = [];
                if (item.photos) {
                    _.forEach((item.photos ? item.photos : []), async (c, cx) => {
                        let mainUrl = encodeURI(c);
                        console.log('images[', cx, ']', mainUrl);

                        let filename =
                                c.split('/').pop(),
                            __dirname = path.resolve(),
                            // name = (req.global.getFormattedTime() + filename).replace(/\s/g, ''),
                            name = filename,
                            type = path.extname(name),
                            mimtype = mime.getType(type),
                            filePath = path.join(__dirname, "./public_media/customer/", name),
                            fstream = fs.createWriteStream(filePath);
                        console.log('name', filename)
                        console.log('getting mainUrl', req.query.url + mainUrl);

                        https.get(req.query.url + mainUrl, function (response) {
                            response.pipe(fstream);
                        });

                        // console.log('cx', cx);

                        fstream.on("close", function () {
                            // console.log('images[' + cx + '] saved');
                            let url = "customer/" + name,
                                obj = [{name: name, url: url, type: mimtype}];
                            // Media.create({
                            //     name: obj[0].name,
                            //     url: obj[0].url,
                            //     type: obj[0].type
                            //
                            // }, function (err, media) {
                            //     if (err) {
                            //         // console.log({
                            //         //     err: err,
                            //         //     success: false,
                            //         //     message: 'error'
                            //         // })
                            //     } else {
                            // console.log(cx, ' imported');

                            // photos.push(media.url);
                            // if (photos.length == item.photos.length) {
                            //     Product.findByIdAndUpdate(item._id, {photos: photos}, function (err, products) {
                            //     })
                            // }
                            //     }
                            // });

                        });


                    });
                } else {
                }
                // if (item.photos)
                //     Product.findByIdAndUpdate(item._id, {thumbnail: item.photos[0]}, function (err, products) {
                //     })

            })
        })
    }


});
export default self;