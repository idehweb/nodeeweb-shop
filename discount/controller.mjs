
let self = ({
    setDiscount: function (req, res, next) {
        let Discount = req.mongoose.model('Discount');
        let Order = req.mongoose.model('Order');

        console.log('...setDiscount()')
        let obj = {};
        // if (mongoose.isValidObjectId(req.params.id)) {
        //     obj["_id"] = req.params.id;
        // } else {
        obj["slug"] = req.params.id;

        // }
        Discount.findOne(obj,
            function (err, discount) {
                if (err || !discount) {
                    console.log('ddd',{
                        success: false,
                        err:err,
                        discount:discount,
                        obj:obj,
                        message: 'did not find any discount!'
                    })
                    return res.json({
                        success: false,
                        err:err,
                        obj:obj,
                        message: 'did not find any discount!'
                    });

                }
                if (discount.count < 1) {
                    return res.json({
                        success: false,
                        message: 'discount is done!'
                    });
                }
                Order.findByIdAndUpdate(req.params.order_id, {
                        $set: {
                            discount: discount.price,
                            discountCode: discount.slug,
                        }
                    },
                    function (err, order) {
                        if (err || !order) {
                            return res.json({
                                success: false,
                                message: 'could not update order!',
                                err:err
                            });
                        }
                        Discount.findOneAndUpdate(obj, {
                                $set: {
                                    count: (discount.count - 1)
                                }
                            },
                            function (err, discount) {
                                if (err || !discount) {
                                    return res.json({
                                        success: false,
                                        message: 'could not update discount!'
                                    });
                                }
                                return res.json(discount);

                            });
                    });
            });
    },

});
export default self;