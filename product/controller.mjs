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
        if (req.query && req.query.status) {
            search = {...search, status: req.query.status}
            console.log('****************req.query', req.query);
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
                if (req.mongoose.isValidObjectId(split[0])) {
                    search[item] = {
                        $in: split
                    }
                }

            }
            else {
                console.log("filter doesnot exist => ", item);
            }
        });
        // console.log('search', search);
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
        var q;
        if (search['productCategory.slug']) {
            let ProductCategory = req.mongoose.model('ProductCategory');

            console.log('search[\'productCategory.slug\']', search['productCategory.slug'])
            ProductCategory.findOne({slug: search['productCategory.slug']}, function (err, productcategory) {
                console.log('err', err)
                console.log('req', productcategory)
                if (err || !productcategory)
                    return res.json([]);
                if (productcategory._id) {
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
                    }).populate('productCategory', '_id slug').skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
                }

            });
            // console.log('q', q)
        } else {
            console.log('no \'productCategory.slug\'')
            if (!search['status'])
                search['status'] = 'published'
            console.log('search q.exec', search)

            q = Product.find(search, fields).populate('productCategory', '_id slug').skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
            q.exec(function (err, model) {

                console.log('err', err)
                if (err || !model)
                    return res.json([]);
                Product.countDocuments(search, function (err, count) {
                    console.log('countDocuments', count, model ? model.length : '');
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
    importFromWebzi: function (req, res, next) {
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
                if (item.price) {
                    obj['price'] = (item.price /109) * 100
                }
                if (item.salePrice) {
                    obj['salePrice'] = (item.salePrice/109) * 100
                }
                // if (item.data.regular_price) {
                //     obj['price'] = item.data.regular_price;
                // }
                // if (item.data.regular_price) {
                //     obj['salePrice'] = item.data.sale_price;
                // }
                Product.findByIdAndUpdate(item._id, obj, function (err, products) {
                })

            })
        })
    },
    torob: function (req, res, next) {
        console.log("it is Torob!");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        let searchf = {};
        searchf["title.fa"] = {
            $exists: true
        };
        let Product = req.mongoose.model('Product');

        // _id:'61d71cf4365a2313a161456c'
        Product.find({}, "_id title price type salePrice in_stock combinations firstCategory secondCategory thirdCategory slug", function (err, products) {
            console.log('err', err)
            console.log('products', products)
            if (err || !products) {
                return res.json([]);
            }

            function arrayMin(t) {
                var arr = [];
                t.map((item) => (item != 0) ? arr.push(item) : false);
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        console.log("p", p, "v", v);
                        return (p < v ? p : v);
                    });
                else
                    return false;
            }

            let modifedProducts = [];
            _.forEach(products, (c, cx) => {
                let price_array = [];
                let sale_array = [];
                let price_stock = [];
                let last_price = 0;
                let last_sale_price = 0;

                if (c.combinations && c.type == "variable") {
                    _.forEach(c.combinations, (comb, cxt) => {
                        if (comb.price && comb.price != null && parseInt(comb.price) != 0) {
                            price_array.push(parseInt(comb.price));
                        } else {
                            price_array.push(0);

                        }
                        if (comb.salePrice && comb.salePrice != null && parseInt(comb.salePrice) != 0) {
                            sale_array.push(parseInt(comb.salePrice));

                        } else {
                            sale_array.push(0);
                        }
                        if (comb.in_stock && !comb.quantity) {
                            comb.in_stock = false;
                        }
                        price_stock.push(comb.in_stock);
                        //
                        // if (parseInt(comb.price) < parseInt(last_price))
                        //     last_price = parseInt(comb.price);
                    });
                }
                if (c.type == "normal") {
                    price_array = [];
                    sale_array = [];
                    price_stock = [];
                    if (c.price && c.price != null)
                        price_array.push(c.price);
                }
                last_price = arrayMin(price_array);
                last_sale_price = arrayMin(sale_array);
                console.log("last price", last_price, last_sale_price);

                if ((last_price !== false && last_sale_price !== false) && (last_price < last_sale_price)) {
                    console.log("we have got here");
                    var cd = price_array.indexOf(last_price);
                    if (sale_array[cd] && sale_array[cd] != 0)
                        last_sale_price = sale_array[cd];
                    else
                        last_sale_price = false;
                    // if(sale_array[cd] && (sale_array[cd]<last_sale_price)){
                    //
                    // }

                } else if ((last_price !== false && last_sale_price !== false) && (last_price > last_sale_price)) {
                    console.log("we have got there");

                    // last_price = last_sale_price;
                    // last_sale_price = tem;

                    var cd = sale_array.indexOf(last_sale_price);
                    if (price_array[cd] && price_array[cd] != 0)
                        last_price = price_array[cd];
                    // else {
                    // last_sale_price = false;
                    var tem = last_price;

                    last_price = last_sale_price;
                    last_sale_price = tem;
                    // }
                }

                //
                // if (last_sale_price) {
                //     var tem = last_price;
                //     last_price = last_sale_price;
                //     last_sale_price = tem;
                //
                // }
                if (c.type == "normal") {
                    price_array = [];
                    sale_array = [];
                    price_stock = [];
                    if (c.in_stock) {
                        price_stock.push(true);
                    }
                    if (c.price && c.price != null)
                        price_array.push(c.price);
                }
                console.log("price_stock", price_stock);


                let slug = c.slug;
                let cat_inLink = "";
                if (c.firstCategory && c.firstCategory.slug)
                    cat_inLink = c.firstCategory.slug;
                if (c.secondCategory && c.secondCategory.slug)
                    cat_inLink = c.secondCategory.slug;
                if (c.thirdCategory && c.thirdCategory.slug)
                    cat_inLink = c.thirdCategory.slug;
                modifedProducts.push({
                    product_id: c._id,
                    name: ((c.title && c.title.fa) ? c.title.fa : ""),

                    // page_url: CONFIG.SHOP_URL + "p/" + c._id + "/" + encodeURIComponent(c.title.fa),
                    page_url: process.env.BASE_URL + "/product/" + c._id + "/" + c.slug,
                    price: last_price,
                    old_price: last_sale_price,
                    availability: (price_stock.indexOf(true) >= 0 ? "instock" : "outofstock")
                    // comb: price_array,
                    // combSale: sale_array,
                    // price_stock: price_stock,

                });
            });
            return res.json(modifedProducts);


        }).skip(offset).sort({
            updatedAt: -1,
            createdAt: -1
            // "combinations.in_stock": -1,
        }).limit(parseInt(req.params.limit)).lean();
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
    },
    viewOneS: function (req, res, next) {
        console.log("===> viewOneS() ");
        return new Promise(function (resolve, reject) {
            console.log('req.params._id', req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return (p < v ? p : v);
                    });
            };
            let obj = {};
            if (req.mongoose.isValidObjectId(req.params._slug)) {
                obj["_id"] = req.params._slug;
            } else {
                obj["slug"] = req.params._slug;

            }
            if (req.mongoose.isValidObjectId(req.params._id)) {
                obj["_id"] = req.params._id;
                delete obj["slug"];
            }
            let Product = req.mongoose.model('Product');

            Product.findOne(obj, "title metadescription keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                function (err, product) {
                    if (err || !product) {
                        resolve({});
                        return 0;
                    }
                    let in_stock = "outofstock";
                    let product_price = 0;
                    let product_old_price = 0;
                    let product_prices = [];
                    let product_sale_prices = [];
                    if (product.type === "variable") {
                        if (product.combinations)
                            _.forEach(product.combinations, (c) => {
                                if (c.in_stock) {
                                    in_stock = "instock";
                                    product_prices.push(parseInt(c.price) || 1000000000000);
                                    product_sale_prices.push(parseInt(c.salePrice) || 1000000000000);
                                }

                            });
                        // console.log("gfdsdf");
                        // console.log(product_prices);
                        // console.log(product_sale_prices);
                        let min_price = arrayMin(product_prices);
                        let min_sale_price = arrayMin(product_sale_prices);
                        // console.log("min_price", min_price);
                        // console.log("min_sale_price", min_sale_price);
                        product_price = min_price;
                        if (min_sale_price > 0 && min_sale_price < min_price) {
                            product_price = min_sale_price;
                            product_old_price = min_price;
                        }
                    }
                    if (product.type === "normal") {
                        if (product.in_stock) {
                            in_stock = "instock";
                        }
                        if (product.price) {
                            product_price = product.price;
                        }
                        if (product.price && product.salePrice) {
                            product_price = product.salePrice;
                            product_old_price = product.price;
                        }
                    }

                    // product.title = product['title'][req.headers.lan] || '';
                    // product.description = '';
                    // console.log(c);
                    // });
                    delete product.data;
                    delete product.transaction;
                    console.log(" product", product);
                    let img = '';
                    if (product.photos && product.photos[0]) {
                        img = product.photos[0]

                    }
                    if (product.thumbnail) {
                        img = product.thumbnail
                    }

                    let obj = {
                        _id: product._id,
                        product_price: product_price || "",
                        product_old_price: product_old_price || "",
                        availability: in_stock || "",
                        image: img,
                        keywords: "",
                        metadescription: "",
                    };
                    if (product["keywords"]) {
                        obj["keywords"] = product["keywords"][req.headers.lan] || product["keywords"];

                    }
                    if (product["metadescription"]) {
                        obj["metadescription"] = product["metadescription"][req.headers.lan] || product["metadescription"];

                    }
                    if (product["title"]) {
                        obj["title"] = product["title"][req.headers.lan] || product["title"];
                    } else {
                        obj["title"] = "";
                    }
                    if (product["product_name"]) {
                        obj["product_name"] = product["product_name"][req.headers.lan] || product["product_name"];
                    } else {
                        obj["product_name"] = "";
                    }
                    if (product["description"]) {
                        obj["description"] = product["description"][req.headers.lan] || product["description"];
                    } else {
                        obj["description"] = "";
                    }
                    if (product["slug"]) {
                        obj["slug"] = product["slug"];
                    }
                    if (product["labels"]) {
                        obj["labels"] = product["labels"];
                    }
                    resolve(obj);
                    return 0;

                }).lean();
        });
    }


});
export default self;