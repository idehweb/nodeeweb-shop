import _ from 'lodash'

let self = ({

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
                            console.log('create order 2...');
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
                            console.log('create order 2...');
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

        let Order = req.mongoose.model('Order');

        console.log('creating order by admin...');
        req.body.orderNumber = Math.floor(10000 + Math.random() * 90000);
        Order.create({
            amount: req.body.amount,
            total: req.body.amount,
            orderNumber: req.body.orderNumber,
            sum: req.body.amount,
            status: 'checkout',
        }, function (err, order) {
            if (err || !order) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!',
                });
                return 0;
            }
            if (req.headers.user && req.headers.token) {
                let action = {
                    customer: req.headers.user._id,
                    title: 'create order by user successfully ' + order._id,
                    data: req.body,
                    order: order._id,
                };
                req.global.submitAction(action);
            }
            console.log('creating order successfully:', order);

            let options = {
                method: 'POST',
                url: 'https://gateway.zibal.ir/v1/request',
                body: {
                    merchant: '624c13f118f93463f8c541b8',
                    amount: parseInt(order.amount) * 10,
                    callbackUrl: global.domain + '/' + 'transaction',
                    description: 'سفارش #' + order.orderNumber,
                },
                json: true, // Automatically stringifies the body to JSON
            };
            // console.log(options);
            request(options, function (error, response, parsedBody) {

                // rp(options)
                // .then(function (parsedBody) {
                console.log('parsedBody', parsedBody);

                let obj = {
                    // 'customer': req.headers.customer._id,
                    'amount': order.amount * 10,
                    'order': req.params._id,
                    Authority: parsedBody['trackId'],
                };
                Transaction.create(obj, function (err, transaction) {
                    if (parsedBody['result'] == 100) {
                        res.json({
                            success: true,
                            order: order,
                            url: 'https://gateway.zibal.ir/start/' + parsedBody['trackId'],
                        });
                        return 0;

                    } else {
                        res.json({
                            success: false,
                        });
                        return 0;
                    }
                });
            });

            // res.json({success: true, order: order});
            // return 0;

        });

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