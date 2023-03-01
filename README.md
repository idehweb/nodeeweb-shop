# [Nodeeweb Shop | How to create online shop with nodejs reactjs mongodb](https://idehweb.com/product/creare-website-or-application-with-nodeeweb/)

The plugin add shop functionality to your nodeeweb core.

You can create and online shop, website or application, handle products, orders, transactions with this plugin.

Here we are creating an example of usage


## Table of contents

* [Usage](#usage)
* [Documentation](#documentation)
* [API](#api)
* [License](#license)
* [Changelogs](#Changelogs)




## Usage

### 1. install using command
```bash
npm install @nodeeweb/shop
```
or
```bash
yarn add @nodeeweb/shop
```

### 2. use it in your server function like below:
(you imported Server function from @nodeeweb/server)
```jsx static
import Server from '@nodeeweb/server'
import Shop from '@nodeeweb/shop'
Server({entity:[...Shop]});
```

### 3. now your shop is ready, just type command:
```bash
npm start
```
or
```bash
yarn start
```
or
```bash
node index.mjs
```
### 3. after that .env.local will be created

after you start server for first time, .env.local will be created, you can change configurations in it and restart server

## Documentation

Check the getting started guide here: [Documentation]


## API
These routes have been added to your server after installing shop:
```html
GET      /customer/attributes
GET      /customer/attributes/count
GET      /customer/attributes/:offset/:limit
GET      /customer/attributes/:id
POST     /customer/attributes
PUT      /customer/attributes/:id
DELETE   /customer/attributes/:id
GET      /admin/attributes
GET      /admin/attributes/count
GET      /admin/attributes/:offset/:limit
GET      /admin/attributes/:id
POST     /admin/attributes
PUT      /admin/attributes/:id
DELETE   /admin/attributes/:id
GET      /customer/discount
GET      /customer/discount/count
GET      /customer/discount/:offset/:limit
GET      /customer/discount/:id
POST     /customer/discount
PUT      /customer/discount/:id
DELETE   /customer/discount/:id
GET      /admin/discount
GET      /admin/discount/count
GET      /admin/discount/:offset/:limit
GET      /admin/discount/:id
POST     /admin/discount
PUT      /admin/discount/:id
DELETE   /admin/discount/:id
GET      /customer/order
GET      /customer/order/count
GET      /customer/order/:offset/:limit
GET      /customer/order/:id
POST     /customer/order
PUT      /customer/order/:id
DELETE   /customer/order/:id
GET      /admin/order
GET      /admin/order/count
GET      /admin/order/:offset/:limit
GET      /admin/order/:id
POST     /admin/order
PUT      /admin/order/:id
DELETE   /admin/order/:id
GET      /customer/product
GET      /customer/product/count
GET      /customer/product/:offset/:limit
GET      /customer/product/:id
POST     /customer/product
PUT      /customer/product/:id
DELETE   /customer/product/:id
GET      /admin/product
GET      /admin/product/count
GET      /admin/product/:offset/:limit
GET      /admin/product/:id
POST     /admin/product
PUT      /admin/product/:id
DELETE   /admin/product/:id
GET      /customer/productCategory
GET      /customer/productCategory/count
GET      /customer/productCategory/:offset/:limit
GET      /customer/productCategory/:id
POST     /customer/productCategory
PUT      /customer/productCategory/:id
DELETE   /customer/productCategory/:id
GET      /admin/productCategory
GET      /admin/productCategory/count
GET      /admin/productCategory/:offset/:limit
GET      /admin/productCategory/:id
POST     /admin/productCategory
PUT      /admin/productCategory/:id
DELETE   /admin/productCategory/:id
GET      /customer/transaction
GET      /customer/transaction/count
GET      /customer/transaction/:offset/:limit
GET      /customer/transaction/:id
POST     /customer/transaction
PUT      /customer/transaction/:id
DELETE   /customer/transaction/:id
GET      /admin/transaction
GET      /admin/transaction/count
GET      /admin/transaction/:offset/:limit
GET      /admin/transaction/:id
POST     /admin/transaction
PUT      /admin/transaction/:id
DELETE   /admin/transaction/:id
```
More API References could be found here: [API-Reference]


## presets , examples , demo


## Support

If you like the project and you wish to see it grow, please consider supporting us with a donation of your choice or become a backer/sponsor via [Open Collective](https://idehweb.com/)

we used these modules:

shards

grapesjs

mongoose


## License

Nodeeweb is licensed under the GNU GENERAL PUBLIC LICENSE, sponsored and supported by [https://idehweb.com](idehweb.com)

[Documentation]: <https://idehweb.com/nodeeweb/>
[API-Reference]: <https://idehweb.com/nodeeweb/api/>
[CMS]: <https://en.wikipedia.org/wiki/Content_management_system>

## Changelogs

== 0.0.387
    * add submit actions

== 0.0.386
    * add top sale parts

== 0.0.385
    * add buy price limit

== 0.0.383
    * add transaction event

== 0.0.379
    * add description to product category and attributes

== 0.0.378
    * add telegram notification

== 0.0.377
    * add track view in product

== 0.0.375
    * bugs of my orders

== 0.0.369
    * remove bugs of add order on quantity 0

== 0.0.368
    * add $lt and export orders

== 0.0.367
    * add first buy

== 0.0.366
    * add my orders and my order
    
== 0.0.365
    * create payment link

== 0.0.363
    * add rewriteProducts to fix slug

== 0.0.362
    * change transaction model
    * add auth of transaction from gateway
    * change `all` function of transactions

== 0.0.359 && 60
    remove bugs of discount

== 0.0.358
    update discount

== 0.0.356
    add order tax and tax amount

== 0.0.353
    update order from wordpress api

== 0.0.34
    usable in filter attrs

== 0.0.33
    update order , add taxes
    
== 0.0.32
    update transaction / add string math

== 0.0.31
    add attributes to customer routes

== 0.0.30
    set discount code

== 0.0.29
    remove bugs from product controller

== 0.0.28
    remove bugs from product controller

== 0.0.27
    add weight

== 0.0.26
    move gateway to core

== 0.0.25
    add order by admin

== 0.0.24
    change transaction buy function

== 0.0.23
    add sitemap to product and product_category

== 0.0.22
    add extra button

== 0.0.21
    update torob

== 0.0.20
    added torob

== 0.0.19
    update photos and thumbnail type

== 0.0.18
    add photos and thumbnail
   
== 0.0.17   
    update product controller
    
== 0.0.16   
    update transaction controller


== 0.0.15
    update routes

== 0.0.13
    change and update routes fields


== 0.0.12
    add discount functions
    add gateways

== 0.0.11
    add defaultValue
    add optionName
    add optionValue

== 0.0.10
    add transaction

== 0.0.9
    add rewriteProductsImages to products , req.query.url

== 0.0.8
    add special create function to order
    
== 0.0.7
    change product routes access
    
== 0.0.6
    change routes
    
== 0.0.5
    update readme file and docs
    
== 0.0.1 
    stable