//单个产品对象
product = {
    id: 0,
    tid:0,
    name: "",
    num: 0,
    price: 0.00,
    odate: '',
    ordercount:0,
};
//订单汇总1
osum = {
    userid: "",
    username: "",
    phone: "",
    totalNumber: 0,
    totalAmount: 0.00
}
cart = {
    //向购物车中添加商品  
    add: function (product) {
        var ShoppingCart = utils.getParam("ShoppingCart");
        if (ShoppingCart == null||ShoppingCart==undefined || ShoppingCart == "") {
            //第一次加入商品  
            var jsonstr = { "productlist": [{ "id": product.id, "tid": product.tid, "name": product.name, "num": product.num, "price": product.price, "odate": product.odate, "ordercount": product.ordercount }], "totalNumber": product.num, "totalAmount": (product.price * product.num) };
            utils.setParam("ShoppingCart", "'" + JSON.stringify(jsonstr));
        } else {
            var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
            var productlist = jsonstr.productlist;
            var result = false;
            //查找购物车中是否有该商品  
            for (var i in productlist) {
                if (productlist[i].id == product.id && productlist[i].odate == product.odate) {
                    productlist[i].num = parseInt(productlist[i].num) + parseInt(product.num);
                    result = true;
                }
            }
            if (!result) {
                //没有该商品就直接加进去  
                productlist.push({ "id": product.id, "tid": product.tid, "name": product.name, "num": product.num, "price": product.price, "odate": product.odate, "ordercount": product.ordercount });
            }
            //重新计算总价  
            jsonstr.totalNumber = parseInt(jsonstr.totalNumber) + parseInt(product.num);
            jsonstr.totalAmount = parseFloat(jsonstr.totalAmount) + (parseInt(product.num) * parseFloat(product.price));
            osum.totalNumber = jsonstr.totalNumber;
            osum.totalAmount = jsonstr.totalAmount;
            //保存购物车  
            utils.setParam("ShoppingCart", "'" + JSON.stringify(jsonstr));
        }
    },
    //修改给买商品数量  
    set: function (id, odate, num) {
        var ShoppingCart = utils.getParam("ShoppingCart");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;

        for (var i in productlist) {
            if (productlist[i].id == id && productlist[i].odate == odate) {
                jsonstr.totalNumber = parseInt(jsonstr.totalNumber) + (parseInt(num) - parseInt(productlist[i].num));
                jsonstr.totalAmount = parseFloat(jsonstr.totalAmount) + ((parseInt(num) * parseFloat(productlist[i].price)) - parseInt(productlist[i].num) * parseFloat(productlist[i].price));
                productlist[i].num = parseInt(num);

                osum.totalNumber = jsonstr.totalNumber;
                osum.totalAmount = jsonstr.totalAmount;
                utils.setParam("ShoppingCart", "'" + JSON.stringify(jsonstr));
                return;
            }
        }
    },
    //获取购物车中的所有商品  
    get: function () {
        var ShoppingCart = utils.getParam("ShoppingCart");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return null;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        osum.totalNumber = jsonstr.totalNumber;
        osum.totalAmount = jsonstr.totalAmount;
        return productlist;
    },
    //获取指定字段以逗号分隔的值
    getvalues: function (field) {
        var ShoppingCart = utils.getParam("ShoppingCart");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return null;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        var s = '|';
        for (var i in productlist) {
            if (field == 'id') {
                s += productlist[i].id + '|';
            }
            if (field == 'num') {
                s += productlist[i].num + '|';
            }
            if (field == 'odate') {
                s += productlist[i].odate + '|';
            }
        }
        return s;
    },
    gettypecount:function(tid)
    {
        var ShoppingCart = utils.getParam("ShoppingCart");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return 0;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        var c = 0;
        for (var i in productlist) {
            if (productlist[i].tid == tid) {                
                c += parseInt(productlist[i].num) + parseInt(productlist[i].ordercount);
            }
        }
        return c;
    },
    //判断购物车中是否存在商品  
    exists: function (id, odate) {        
        var ShoppingCart = utils.getParam("ShoppingCart");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return false;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        var result = false;
        for (var i in productlist) {
            if (productlist[i].id == product.id && productlist[i].odate == product.odate) {
                result = true;
            }
        }
        return result;
    },
    //删除购物车中商品  
    del: function (id,odate) {
        var ShoppingCart = utils.getParam("ShoppingCart");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        var list = [];
        for (var i in productlist) {
            if (productlist[i].id == id && productlist[i].odate == odate) {
                jsonstr.totalNumber = parseInt(jsonstr.totalNumber) - parseInt(productlist[i].num);
                jsonstr.totalAmount = parseFloat(jsonstr.totalAmount) - parseInt(productlist[i].num) * parseFloat(productlist[i].price);
            } else {
                list.push(productlist[i]);
            }
        }
        jsonstr.productlist = list;
        osum.totalNumber = jsonstr.totalNumber;
        osum.totalAmount = jsonstr.totalAmount;
        utils.setParam("ShoppingCart", "'" + JSON.stringify(jsonstr));
    },
    //清空购物车
    clear: function () {
        utils.setParam("ShoppingCart", "");
        osum.totalNumber = 0;
        osum.totalAmount = 0.00;
    },
    //刷新购物车重新计算总数
    ref: function () {
        var ShoppingCart = utils.getParam("ShoppingCart");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return null;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        osum.totalNumber = jsonstr.totalNumber;
        osum.totalAmount = jsonstr.totalAmount;
    }
};
//订单汇总2
osum2 = {
    userid: "",
    username: "",
    phone: "",
    totalNumber: 0,
    totalAmount: 0.00
}
cart2 = {
    //向购物车中添加商品  
    add: function (product) {
        var ShoppingCart = utils.getParam("ShoppingCart2");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            //第一次加入商品  
            var jsonstr = { "productlist": [{ "id": product.id, "name": product.name, "num": product.num, "price": product.price, "odate": product.odate }], "totalNumber": product.num, "totalAmount": (product.price * product.num) };
            utils.setParam("ShoppingCart2", "'" + JSON.stringify(jsonstr));
        } else {
            var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
            var productlist = jsonstr.productlist;
            var result = false;
            //查找购物车中是否有该商品  
            for (var i in productlist) {
                if (productlist[i].id == product.id && productlist[i].odate == product.odate) {
                    productlist[i].num = parseInt(productlist[i].num) + parseInt(product.num);
                    result = true;
                }
            }
            if (!result) {
                //没有该商品就直接加进去  
                productlist.push({ "id": product.id, "name": product.name, "num": product.num, "price": product.price, "odate": product.odate });
            }
            //重新计算总价  
            jsonstr.totalNumber = parseInt(jsonstr.totalNumber) + parseInt(product.num);
            jsonstr.totalAmount = parseFloat(jsonstr.totalAmount) + (parseInt(product.num) * parseFloat(product.price));
            osum2.totalNumber = jsonstr.totalNumber;
            osum2.totalAmount = jsonstr.totalAmount;
            //保存购物车  
            utils.setParam("ShoppingCart2", "'" + JSON.stringify(jsonstr));
        }
    },
    //修改给买商品数量  
    set: function (id, odate, num) {
        var ShoppingCart = utils.getParam("ShoppingCart2");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;

        for (var i in productlist) {
            if (productlist[i].id == id && productlist[i].odate == odate) {
                jsonstr.totalNumber = parseInt(jsonstr.totalNumber) + (parseInt(num) - parseInt(productlist[i].num));
                jsonstr.totalAmount = parseFloat(jsonstr.totalAmount) + ((parseInt(num) * parseFloat(productlist[i].price)) - parseInt(productlist[i].num) * parseFloat(productlist[i].price));
                productlist[i].num = parseInt(num);

                osum2.totalNumber = jsonstr.totalNumber;
                osum2.totalAmount = jsonstr.totalAmount;
                utils.setParam("ShoppingCart2", "'" + JSON.stringify(jsonstr));
                return;
            }
        }
    },
    //获取购物车中的所有商品  
    get: function () {
        var ShoppingCart = utils.getParam("ShoppingCart2");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return null;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        osum2.totalNumber = jsonstr.totalNumber;
        osum2.totalAmount = jsonstr.totalAmount;
        return productlist;
    },
    //获取指定字段以逗号分隔的值
    getvalues: function (field) {
        var ShoppingCart = utils.getParam("ShoppingCart2");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return null;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        var s = '|';
        for (var i in productlist) {
            if (field == 'id') {
                s += productlist[i].id + '|';
            }
            if (field == 'num') {
                s += productlist[i].num + '|';
            }
            if (field == 'odate') {
                s += productlist[i].odate + '|';
            }
        }
        return s;
    },
    //判断购物车中是否存在商品  
    exists: function (id, odate) {
        var ShoppingCart = utils.getParam("ShoppingCart2");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return false;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        var result = false;
        for (var i in productlist) {
            if (productlist[i].id == product.id && productlist[i].odate == product.odate) {
                result = true;
            }
        }
        return result;
    },
    //删除购物车中商品  
    del: function (id, odate) {
        var ShoppingCart = utils.getParam("ShoppingCart2");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        var productlist = jsonstr.productlist;
        var list = [];
        for (var i in productlist) {
            if (productlist[i].id == id && productlist[i].odate == odate) {
                jsonstr.totalNumber = parseInt(jsonstr.totalNumber) - parseInt(productlist[i].num);
                jsonstr.totalAmount = parseFloat(jsonstr.totalAmount) - parseInt(productlist[i].num) * parseFloat(productlist[i].price);
            } else {
                list.push(productlist[i]);
            }
        }
        jsonstr.productlist = list;
        osum2.totalNumber = jsonstr.totalNumber;
        osum2.totalAmount = jsonstr.totalAmount;
        utils.setParam("ShoppingCart2", "'" + JSON.stringify(jsonstr));
    },
    //清空购物车
    clear: function () {
        utils.setParam("ShoppingCart2", "");
        osum2.totalNumber = 0;
        osum2.totalAmount = 0.00;
    },
    //刷新购物车重新计算总数
    ref: function () {
        var ShoppingCart = utils.getParam("ShoppingCart2");
        if (ShoppingCart == null || ShoppingCart == undefined || ShoppingCart == "") {
            return null;
        }
        var jsonstr = JSON.parse(ShoppingCart.substr(1, ShoppingCart.length));
        osum2.totalNumber = jsonstr.totalNumber;
        osum2.totalAmount = jsonstr.totalAmount;
    }
};