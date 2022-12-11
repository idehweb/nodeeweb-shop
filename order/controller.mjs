import _ from 'lodash'
import crypto from 'crypto';

let self = ({
    all: function (req, res, next) {
        let Order = req.mongoose.model('Order');

        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        // search['$or'] = [{
        //     firstCategory: req.params._id
        // }, {
        //     secondCategory: req.params._id
        // }, {
        //     thirdCategory: req.params._id
        // }];

        if (req.query['firstName']) {
            // if (!Array.isArray(search['$or'])) {
            //     search['$or'] = [];
            //
            // }
            // search['$or'].push({
            //     "customer_data.firstName": {
            //         $exists: true,
            //         "$regex": req.query['firstName'],
            //         "$options": "i"
            //     }
            // });

            search['customer_data.firstName'] = {
                $exists: true,
                '$regex': req.query['firstName'],
                '$options': 'i',

            };

        }
        if (req.query['lastName']) {
            // if (!Array.isArray(search['$or'])) {
            //     search['$or'] = [];
            //
            // }
            // search['$or'].push({
            //     "customer_data.lastName": {
            //         $exists: true,
            //         "$regex": req.query['lastName'],
            //         "$options": "i"
            //     }
            // });
            search['customer_data.lastName'] = {
                $exists: true,
                '$regex': req.query['lastName'],
                '$options': 'i',

            };


        }
        if (req.query['paymentStatus']) {
            // if (!Array.isArray(search['$or'])) {
            //     search['$or'] = [];
            //
            // }
            // search['$or'].push({
            //     paymentStatus: req.query['paymentStatus']
            // });

            search['paymentStatus'] = req.query['paymentStatus'];
        }
        if (req.query['date_gte']) {

            search['createdAt'] = {$gt: new Date(req.query['date_gte'])};
        }

        search['status'] = {
            $nin: ['cart', 'checkout', ''],
        };
        if (req.query['status'] && req.query['status'] != 'all') {
            if (!search['status']) {

                search['status'] = {};
            }
            search['status']['$in'] = (req.query['status']);
        }

        if (req.query['search']) {
            // if (!Array.isArray(search['$or'])) {
            //     search['$or'] = [];
            //
            // }
            // search['$or'] = [];
            // search['$or'].push({
            //     "customer_data.phoneNumber": {
            //         $exists: true,
            //         "$regex": req.query['search'],
            //         "$options": "i"
            //     }
            // });
            // search['$or'].push({
            //     // "$where": "function() { return this.orderNumber.toString().match(/" + req.query['search'] + "/) != null; }"
            //     "orderNumber": parseInt(req.query['search'])
            // });
            // search['orderNumber'] = {
            //         $exists: true,
            //         "$regex": req.query['search'],
            //         "$options": "i"
            // };
            // search["$where"]=
            //     "function() { return this.orderNumber.toString().match(/" + req.params.search + "/) != null; }"};

            // search['orderNumber'] = { "$where": "function() { return this.number.toString().match(/"+req.query['search']+"/) != null; }" };
            search['orderNumber'] = parseInt(req.query['search']);
            delete search['status'];

        }

        console.log('search', search);
        Order.find(search, '_id , orderNumber , customer_data , customer , sum , amount , paymentStatus , status , createdAt , updatedAt', function (err, orders) {
            if (err || !orders) {
                console.log('err', err);
                res.json([]);
                return 0;
            }
            // console.log('orders', orders);
            delete search['$or'];
            Order.countDocuments(search, function (err, count) {
                console.log('countDocuments', count, err);
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader(
                    'X-Total-Count',
                    count,
                );
                res.json(orders);
                return 0;


            });

        }).populate('customer', '_id phoneNumber firstName lastName').skip(offset).sort({
            updatedAt: -1,

            _id: -1,

        }).limit(parseInt(req.params.limit));
    },

    createByCustomer: function (req, res, next) {
        console.log('createByCustomer...');
        let Product = req.mongoose.model('Product');
        let Order = req.mongoose.model('Order');

        // if (req.headers.user && req.headers.token) {
        //     let action = {
        //         user: req.headers.user._id,
        //         title: 'create order ' + order._id,
        //         data: order,
        //         // history:req.body,
        //         order: order._id
        //     };
        //     req.global.submitAction(action);
        // }
        if (req.headers.customer && req.headers.token) {
            let action = {
                customer: req.headers.customer._id,
                title: 'create order ' + req.body.amount,
                data: req.body,
                // history:req.body,
                // order: order._id
            };
            req.global.submitAction(action);
        }
        var _ids = [], len = 0, ii = 0;
        if (req.body.card && req.body.card.length)
            len = req.body.card.length;
        _.forEach(req.body.card, function (pack) {
            var main_id = pack._id.split('DDD');
            var id = main_id[0];
            if (!id) {
                id = pack._id;
            }

            console.log('_id', id, pack.price, pack.salePrice);
            // _ids.push(id);
            // console.log('find _id:', id);
            Product.findOne({_id: id}, '_id combinations type price salePrice title', function (err, ps) {
                console.log('found id:', id, 'main_id[1]:', main_id[1], 'ps', ps);
                ii++;
                if (ps.combinations) {
                    _.forEach(ps.combinations, function (comb, inde) {
                        if ((inde == main_id[1]) || (comb.id == main_id[1])) {
                            console.log('find comb', comb);
                            if (pack.salePrice) {
                                if (pack.salePrice != comb.salePrice) {
                                    return res.json({
                                        success: false,
                                        message: 'مغایرت در قیمت ها!',
                                        'pack.salePrice': pack.salePrice,
                                        'comb.salePrice': comb.salePrice,
                                        'ps.type': ps.type,
                                        'ps.title': ps.title,
                                        'err': 1,
                                    });
                                    // return 0;

                                }
                            } else if (pack.price) {
                                if (pack.price != comb.price) {
                                    return res.json({
                                        success: false,
                                        message: 'مغایرت در قیمت ها!',
                                        'pack.price': pack.price,
                                        'comb.price': comb.price,
                                        'ps.type': ps.type,
                                        'ps.title': ps.title,
                                        'err': 2,

                                    });
                                    // return 0;

                                }
                            }

                            if (comb.in_stock == false) {
                                return res.json({
                                    success: false,
                                    message: 'مغایرت در موجودی!',
                                    'comb.in_stock': comb.in_stock,
                                    'ps.type': ps.type,
                                    'ps.title': ps.title,

                                });
                                // return 0;
                            }
                        }
                    });
                }
                if (ps.type == 'normal') {
                    if (pack.salePrice) {
                        if (pack.salePrice != ps.salePrice) {
                            return res.json({
                                success: false,
                                message: 'مغایرت در قیمت ها!',
                                'pack.salePrice': pack.salePrice,
                                'ps.salePrice': ps.salePrice,
                                'ps.type': ps.type,
                                'ps.title': ps.title,


                            });
                            // return 0;

                        }
                    }
                    else if (pack.price)
                        if (pack.price != ps.price) {
                            return res.json({
                                success: false,
                                message: 'مغایرت در قیمت ها!',
                                'pack.price': pack.price,
                                'ps.price': ps.price,
                                'ps.type': ps.type,
                                'ps.title': ps.title,

                            });
                            // return 0;

                        }
                }
                if (ps.in_stock == false) {
                    return res.json({
                        success: false,
                        message: 'مغایرت در موجودی!',
                        'ps.in_stock': ps.in_stock,
                        'ps.type': ps.type,
                        'ps.title': ps.title,

                    });
                    // return 0;
                }
                // }


                console.log('ii', ii);
                console.log('len', len);
                req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);
                // return;
                if (ii == len)
                    req.global.checkSiteStatus().then(function (resp) {
                        console.log('resp', resp);

                        req.body.customer = req.headers.customer_id;
                        if (req.body.order_id) {
                            console.log('create order 1...', req.body.order_id);

                            Order.findOneAndUpdate(
                                {order_id: req.body.order_id}, {
                                    $set: {
                                        "billingAddress": req.body.billingAddress,
                                        "amount": req.body.amount,
                                        "card": req.body.card,
                                        "customer": req.body.customer,
                                        "customer_data": req.body.customer_data,
                                        "deliveryDay": req.body.deliveryDay,
                                        "deliveryPrice": req.body.deliveryPrice,
                                        // order_id: req.body.order_id,
                                        "status": 'processing',
                                        "package": req.body.package,
                                        "total": req.body.total,
                                        "sum": req.body.sum,
                                    },
                                    $push: {
                                        statusArray: {status: 'processing'},
                                    },
                                }, function (err, order) {
                                    if (err || !order) {
                                        console.log('err', err);
                                        Order.create({
                                            billingAddress: req.body.billingAddress,
                                            amount: req.body.amount,
                                            card: req.body.card,
                                            customer: req.body.customer,
                                            customer_data: req.body.customer_data,
                                            deliveryDay: req.body.deliveryDay,
                                            deliveryPrice: req.body.deliveryPrice,
                                            order_id: req.body.order_id,
                                            package: req.body.package,
                                            status: 'processing',
                                            total: req.body.total,
                                            orderNumber: req.body.orderNumber,
                                            sum: req.body.sum,
                                        }, function (err, order) {
                                            if (err || !order) {
                                                return res.json({
                                                    err: err,
                                                    success: false,
                                                    message: 'error!',
                                                });
                                            }
                                            if (req.headers.customer && req.headers.token) {
                                                let action = {
                                                    customer: req.headers.customer._id,
                                                    title: 'create order successfully ' + order._id,
                                                    data: req.body,
                                                    history: req.body,
                                                    order: order._id,
                                                };
                                                req.global.submitAction(action);
                                            }
                                            console.log('creating order successfully:', order);
                                            return res.json({success: true, order: order});

                                        });
                                        // res.json({
                                        //     // obj: {
                                        //     //     amount: req.body.amount,
                                        //     //     // card: req.body.card
                                        //     // },
                                        //     hrer:'jhjk',
                                        //     err: err,
                                        //     order: order,
                                        //     success: false,
                                        //     message: 'error!'
                                        // });
                                        // return 0;
                                    } else {
                                        // if (req.headers.customer && req.headers.token) {
                                        //     let action = {
                                        //         customer: req.headers.customer._id,
                                        //         title: 'create order successfully ' + order._id,
                                        //         data: req.body,
                                        //         history: req.body,
                                        //         order: order._id
                                        //     };
                                        //     req.global.submitAction(action);
                                        // }
                                        console.log('creating order successfully:', order);
                                        return res.json({success: true, order: order});
                                    }

                                });
                        } else {
                            console.log('create order 2... line 240');
                            Order.create({
                                billingAddress: req.body.billingAddress,
                                amount: req.body.amount,
                                card: req.body.card,
                                customer: req.body.customer,
                                customer_data: req.body.customer_data,
                                deliveryDay: req.body.deliveryDay,
                                deliveryPrice: req.body.deliveryPrice,
                                order_id: crypto.randomBytes(64).toString('hex'),
                                package: req.body.package,
                                total: req.body.total,
                                orderNumber: req.body.orderNumber,
                                sum: req.body.sum,
                            }, function (err, order) {
                                if (err || !order) {
                                    res.json({
                                        err: err,
                                        success: false,
                                        message: 'error!',
                                    });
                                    return 0;
                                }
                                if (req.headers.customer && req.headers.token) {
                                    let action = {
                                        customer: req.headers.customer._id,
                                        title: 'create order successfully ' + order._id,
                                        data: req.body,
                                        history: req.body,
                                        order: order._id,
                                    };
                                    req.global.submitAction(action);
                                }
                                console.log('creating order successfully:', order);
                                res.json({success: true, order: order});
                                return 0;

                            });
                        }


                    }).catch(function (err2) {
                        res.json({
                            success: false,
                            message: 'site is deactive!',
                        });
                        return 0;
                    });
            });
        });
    },
    create: function (req, res, next) {
        console.log('creating order...');
        let Product = req.mongoose.model('Product');
        let Order = req.mongoose.model('Order');

        // if (req.headers.user && req.headers.token) {
        //     let action = {
        //         user: req.headers.user._id,
        //         title: 'create order ' + order._id,
        //         data: order,
        //         // history:req.body,
        //         order: order._id
        //     };
        //     req.global.submitAction(action);
        // }
        if (req.headers.customer && req.headers.token) {
            let action = {
                customer: req.headers.customer._id,
                title: 'create order ' + req.body.amount,
                data: req.body,
                // history:req.body,
                // order: order._id
            };
            req.global.submitAction(action);
        }
        var _ids = [], len = 0, ii = 0;
        if (req.body.card && req.body.card.length)
            len = req.body.card.length;
        _.forEach(req.body.card, function (pack) {
            var main_id = pack._id.split('DDD');
            var id = main_id[0];
            if (!id) {
                id = pack._id;
            }

            console.log('_id', id, pack.price, pack.salePrice);
            // _ids.push(id);
            // console.log('find _id:', id);
            Product.findOne({_id: id}, '_id combinations type price salePrice title', function (err, ps) {
                console.log('found id:', id, 'main_id[1]:', main_id[1], 'ps', ps);
                ii++;
                if (ps.combinations) {
                    _.forEach(ps.combinations, function (comb, inde) {
                        if ((inde == main_id[1]) || (comb.id == main_id[1])) {
                            console.log('find comb', comb);
                            if (pack.salePrice) {
                                if (pack.salePrice != comb.salePrice) {
                                    return res.json({
                                        success: false,
                                        message: 'مغایرت در قیمت ها!',
                                        'pack.salePrice': pack.salePrice,
                                        'comb.salePrice': comb.salePrice,
                                        'ps.type': ps.type,
                                        'ps.title': ps.title,
                                        'err': 1,
                                    });
                                    // return 0;

                                }
                            } else if (pack.price) {
                                if (pack.price != comb.price) {
                                    return res.json({
                                        success: false,
                                        message: 'مغایرت در قیمت ها!',
                                        'pack.price': pack.price,
                                        'comb.price': comb.price,
                                        'ps.type': ps.type,
                                        'ps.title': ps.title,
                                        'err': 2,

                                    });
                                    // return 0;

                                }
                            }

                            if (comb.in_stock == false) {
                                return res.json({
                                    success: false,
                                    message: 'مغایرت در موجودی!',
                                    'comb.in_stock': comb.in_stock,
                                    'ps.type': ps.type,
                                    'ps.title': ps.title,

                                });
                                // return 0;
                            }
                        }
                    });
                }
                if (ps.type == 'normal') {
                    if (pack.salePrice) {
                        if (pack.salePrice != ps.salePrice) {
                            return res.json({
                                success: false,
                                message: 'مغایرت در قیمت ها!',
                                'pack.salePrice': pack.salePrice,
                                'ps.salePrice': ps.salePrice,
                                'ps.type': ps.type,
                                'ps.title': ps.title,


                            });
                            // return 0;

                        }
                    }
                    else if (pack.price)
                        if (pack.price != ps.price) {
                            return res.json({
                                success: false,
                                message: 'مغایرت در قیمت ها!',
                                'pack.price': pack.price,
                                'ps.price': ps.price,
                                'ps.type': ps.type,
                                'ps.title': ps.title,

                            });
                            // return 0;

                        }
                }
                if (ps.in_stock == false) {
                    return res.json({
                        success: false,
                        message: 'مغایرت در موجودی!',
                        'ps.in_stock': ps.in_stock,
                        'ps.type': ps.type,
                        'ps.title': ps.title,

                    });
                    // return 0;
                }
                // }


                console.log('ii', ii);
                console.log('len', len);
                req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);
                // return;
                if (ii == len)
                    req.global.checkSiteStatus().then(function (resp) {
                        console.log('resp', resp);

                        req.body.customer = req.headers.customer_id;
                        if (req.body.order_id) {
                            console.log('create order 1...', req.body.order_id);

                            Order.findOneAndUpdate({_id: req.body.order_id}, {
                                $set: {
                                    billingAddress: req.body.billingAddress,
                                    amount: req.body.amount,
                                    card: req.body.card,
                                    customer: req.body.customer,
                                    customer_data: req.body.customer_data,
                                    deliveryDay: req.body.deliveryDay,
                                    deliveryPrice: req.body.deliveryPrice,
                                    order_id: req.body.order_id,
                                    status: 'processing',
                                    package: req.body.package,
                                    total: req.body.total,
                                    sum: req.body.sum,
                                },
                                $push: {
                                    statusArray: {status: 'processing'},
                                },
                            }, function (err, order) {
                                if (err || !order) {
                                    Order.create({
                                        billingAddress: req.body.billingAddress,
                                        amount: req.body.amount,
                                        card: req.body.card,
                                        customer: req.body.customer,
                                        customer_data: req.body.customer_data,
                                        deliveryDay: req.body.deliveryDay,
                                        deliveryPrice: req.body.deliveryPrice,
                                        order_id: req.body.order_id,
                                        package: req.body.package,
                                        status: 'processing',
                                        total: req.body.total,
                                        orderNumber: req.body.orderNumber,
                                        sum: req.body.sum,
                                    }, function (err, order) {
                                        if (err || !order) {
                                            return res.json({
                                                err: err,
                                                success: false,
                                                message: 'error!',
                                            });
                                        }
                                        if (req.headers.customer && req.headers.token) {
                                            let action = {
                                                customer: req.headers.customer._id,
                                                title: 'create order successfully ' + order._id,
                                                data: req.body,
                                                history: req.body,
                                                order: order._id,
                                            };
                                            req.global.submitAction(action);
                                        }
                                        console.log('creating order successfully:', order);
                                        return res.json({success: true, order: order});

                                    });
                                    // res.json({
                                    //     // obj: {
                                    //     //     amount: req.body.amount,
                                    //     //     // card: req.body.card
                                    //     // },
                                    //     hrer:'jhjk',
                                    //     err: err,
                                    //     order: order,
                                    //     success: false,
                                    //     message: 'error!'
                                    // });
                                    // return 0;
                                } else {
                                    // if (req.headers.customer && req.headers.token) {
                                    //     let action = {
                                    //         customer: req.headers.customer._id,
                                    //         title: 'create order successfully ' + order._id,
                                    //         data: req.body,
                                    //         history: req.body,
                                    //         order: order._id
                                    //     };
                                    //     req.global.submitAction(action);
                                    // }
                                    console.log('creating order successfully:', order);
                                    return res.json({success: true, order: order});
                                }

                            });
                        } else {
                            console.log('create order 2... line 524');
                            Order.create({
                                billingAddress: req.body.billingAddress,
                                amount: req.body.amount,
                                card: req.body.card,
                                customer: req.body.customer,
                                customer_data: req.body.customer_data,
                                deliveryDay: req.body.deliveryDay,
                                deliveryPrice: req.body.deliveryPrice,
                                // order_id: req.body.order_id,
                                package: req.body.package,
                                total: req.body.total,
                                orderNumber: req.body.orderNumber,
                                sum: req.body.sum,
                            }, function (err, order) {
                                if (err || !order) {
                                    res.json({
                                        err: err,
                                        success: false,
                                        message: 'error!',
                                    });
                                    return 0;
                                }
                                if (req.headers.customer && req.headers.token) {
                                    let action = {
                                        customer: req.headers.customer._id,
                                        title: 'create order successfully ' + order._id,
                                        data: req.body,
                                        history: req.body,
                                        order: order._id,
                                    };
                                    req.global.submitAction(action);
                                }
                                console.log('creating order successfully:', order);
                                res.json({success: true, order: order});
                                return 0;

                            });
                        }


                    }).catch(function (err2) {
                        res.json({
                            success: false,
                            message: 'site is deactive!',
                        });
                        return 0;
                    });
            });
        });
    }
    ,
    createAdmin: function (req, res, next) {

        let Customer = req.mongoose.model('Customer');
        let Order = req.mongoose.model('Order');

        console.log('creating order by admin...');
        req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);
        let pack = [], amount = 0;
        let obj = {
            order_id: crypto.randomBytes(64).toString('hex'),
            amount: req.body.amount ? req.body.amount : amount,
            total: req.body.amount ? req.body.amount : amount,
            orderNumber: req.body.orderNumber,
            sum: req.body.amount ? req.body.amount : amount,
            status: req.body.status || 'checkout'
        }
        if (req.body.card) {
            obj['card'] = req.body.card

            _.forEach(req.body.card, function (item, i) {
                amount += (item.salePrice || item.price) * item.count;
                pack.push({
                    product_name: item.title,
                    product_id: item.product_id,
                    price: (item.salePrice || item.price),
                    total_price: (item.salePrice || item.price) * item.count,
                    quantity: item.count,
                })
            })

            obj['package'] = pack
            obj['amount'] = req.body.amount ? req.body.amount : amount

        }
        if (req.body.customer) {
            Customer.findById(req.body.customer, '_id firstName lastName countryCode internationalCode address phoneNumber', function (err, customer) {
                if (err || !customer) {
                    res.json({
                        err: err,
                        success: false,
                        message: 'error!',
                    });
                    return 0;
                }
                obj['customer'] = req.body.customer;
                obj['customer_data'] = customer;
                obj['billingAddress'] = (customer.address && customer.address[0]) ? customer.address[0] : {};
                Order.create(obj, function (err, order) {
                    if (err || !order) {
                        res.json({
                            err: err,
                            success: false,
                            message: 'error!',
                        });
                        return 0;
                    }
                    return res.json(order)

                })
            });
        } else {
            Order.create(obj, function (err, order) {
                if (err || !order) {
                    res.json({
                        err: err,
                        success: false,
                        message: 'error!',
                    });
                    return 0;
                }
                return res.json(order)

            });
        }
    }
    ,
    createCart: function (req, res, next) {

        let obj = {};
        if (req.body.billingAddress) {
            obj['billingAddress'] = req.body.billingAddress;
        }
        if (req.body.amount) {
            obj['amount'] = req.body.amount;
        }
        if (req.body.card) {
            obj['card'] = req.body.card;
        }
        if (req.body.customer) {
            obj['customer'] = req.body.customer;
        }
        if (req.body.customer_data) {
            obj['customer_data'] = req.body.customer_data;
        }
        if (req.body.customer_data && req.body.customer_data._id) {
            obj['customer'] = req.body.customer_data._id;
        }
        if (req.body.deliveryDay) {
            obj['deliveryDay'] = req.body.deliveryDay;
        }
        if (req.body.deliveryPrice) {
            obj['deliveryPrice'] = req.body.deliveryPrice;
        }
        if (req.body.package) {
            obj['package'] = req.body.package;
        }
        if (req.body.total) {
            obj['total'] = req.body.total;
        }
        if (req.body.sum) {
            obj['sum'] = req.body.sum;
        }
        if (req.body.orderNumber) {
            obj['orderNumber'] = req.body.orderNumber;

        } else {
            obj['orderNumber'] = Math.floor(10000 + Math.random() * 90000);
        }
        let Order = req.mongoose.model('Order');

        let status = 'cart';

        if (req.body.status == 'checkout')
            status = 'checkout';
        obj['status'] = status;
        if (req.params.id) {
            Order.findByIdAndUpdate(req.params.id, {
                $set: obj,
                $push: {statusArray: {status: status}},
            }, {new: true}, function (err, order) {
                if (err || !order) {
                    res.json({
                        success: false,
                        message: 'error!',
                        err: err,
                    });
                    return 0;
                }
                //console.log('req.headers', req.headers);
                if (req.headers.customer && req.headers.token) {
                    let action = {
                        customer: req.headers.customer._id,
                        title: 'customer edit cart ' + order._id,
                        data: order,
                        history: req.body,
                        order: order._id,
                    };
                    req.req.global.submitAction(action);
                }
                if (!req.headers.customer && !req.headers.token) {
                    let action = {
                        title: 'guest edit cart ' + order._id,
                        data: order,
                        history: req.body,
                        // order: order._id
                    };
                    req.req.global.submitAction(action);
                }
                res.json(order);
                return 0;

            });
        } else {
            req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);
            if (req.body.orderNumber) {
                obj['orderNumber'] = req.body.orderNumber;
            }
            Order.create(obj, function (err, order) {
                if (err || !order) {
                    res.json({
                        success: false,
                        message: 'error!',
                        err: err,
                    });
                    return 0;
                }
                //console.log('req.headers', req.headers);
                if (req.headers.customer && req.headers.token) {
                    let action = {
                        customer: req.headers.customer._id,
                        title: 'create cart ' + order._id,
                        data: order,
                        history: req.body,
                        order: order._id,
                    };
                    req.req.global.submitAction(action);
                }
                if (!req.headers.customer && !req.headers.token) {
                    let action = {
                        // customer: req.headers.customer._id,
                        title: 'guest created cart ' + order._id,
                        data: order,
                        history: req.body,
                        // order: order._id
                    };
                    req.req.global.submitAction(action);
                }
                res.json(order);
                return 0;

            });
        }
    },
});
export default self;