var xxyj = angular.module('xxyj', ['ngTouch']);
xxyj.controller('xxyjCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.listWtCur = 0;
    $scope.listWts = [];
    $scope.listGoods = {};
    $scope.leftPic = {};
    $scope.rightPic = {};
    $scope.item = {};
    $scope.listPic = 1;
    $scope.rule = {};
    $scope.cartData = angular.fromJson(localStorage.CARTDATA);
    var xxyjIndex = angular.fromJson(localStorage.xxyjIndex);
    if(angular.isDefined(xxyjIndex)&&angular.isDefined(xxyjIndex.listWtCur)){
        $scope.listWtCur = xxyjIndex.listWtCur;
        $scope.listPic = xxyjIndex.listPic;
    }
    if (angular.isUndefined($scope.cartData)) {
        $scope.cartData = [];
    }
    //当前类别
    $scope.nowList = {};
    $scope.back = function () {
        localStorage.xxyjIndex = "123";
        location.href = homeurl+'?'+urlParam;
    };
    //进入其它页面
    $scope.goTo = function (arg_url) {
        location.href = arg_url + "?" + urlParam;
    };
    //拿预订规则查询
    $scope.getRule = function () {
        var d = {m: "washorderrulequery"};
        ajax(d, function (arg_data) {
            console.log(arg_data[0]);
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                alert("没有获取到数据！");
                return
            }
            localStorage.RULE = angular.toJson(arg_data);
            $scope.$apply(function () {
                    $scope.rule = {};
                    $scope.rule = arg_data;
                    if ($scope.rule.TodayCanOrder != 1) {
                        Alert("今天不提供订购服务！");
                        return;
                    }
                    if ($scope.rule.ThisWeekCanOrder != 1) {
                        Alert("本周已订购，不能再次订购！");
                        return;
                    }
                }
            );
            $scope.nowList = arg_data;
            //$scope.getLists($scope.listWts[0]);
        }, function (arg_err) {
            console.log(arg_err);
            Alert("请求超时！");
        })
    };
    //商品类别查询
    $scope.getWt = function (arg_i) {
        if (angular.isUndefined(arg_i)) {
            arg_i = 0;
        }
        var d = {m: "washtypequery", WtId: -1};
        ajax(d, function (arg_data) {
            console.log(arg_data[0]);
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isArray(arg_data)) {
                alert("没有获取到数据！");
                return
            }
            $scope.$apply(function () {
                    $scope.listWts = [];
                    $scope.listWts = arg_data;
                }
            );
            $scope.getLists(arg_data[arg_i]);
        }, function (arg_err) {
            console.log(arg_err);
            Alert("请求超时！");
        })
    };
    //根据商品类别查询商品列表
    $scope.getLists = function (arg_data) {
        var d = {m: "washquerybywtid", WtId: arg_data.WtID};
        ajax(d, function (arg_data) {
            //console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                alert("没有获取到数据！");
                return
            }
            $scope.$apply(function () {
                    $scope.listGoods = {};
                    $scope.listGoods = arg_data;
                }
            );
            $scope.setCss();
        }, function (arg_err) {
            console.log(arg_err);
            alert(arg_err);
        })
    };
    $scope.setCss = function () {
        var maxH = 0;
        $(".goods_h").each(function (i, n) {
            if ($(this).outerHeight(true) > maxH) {
                maxH = $(this).outerHeight(true);
            }
        });
        console.log(maxH);
        $(".goods_h").height(maxH + 6 + "px");
        $(".goods_text").each(function (i, n) {
            $(this).css("margin-top", (maxH + 6 - $(this).outerHeight(true)) * 0.5);
        });
        console.log($(".goods_top_img").height())
        //console.log($(".goods_img_w_h").height())
        var temW = $(".goods_top_img").width();
        $(".goods_img_w_h").css("width",$(".goods_top_img").height());
        $(".goods_img_w_h").css("height",$(".goods_top_img").height());
        $(".goods_img_w_h").css("margin-left",(temW-$(".goods_top_img").height())*0.5);
    };
    $scope.changeList = function (arg_data, arg_index) {
        if (!arg_data) {
            return;
        }
        $scope.listPic = arg_data.WtID;
        $scope.listWtCur = arg_index;
        localStorage.xxyjIndex = angular.toJson({listPic:$scope.listPic,listWtCur:$scope.listWtCur});
        $scope.getWt($scope.listPic - 1);
    };
    $scope.show_rule = function () {
        var title = '预定规则';
        var content = '<div style="line-height:20px;">'
            + '<div style="color: #ff6633; font-size: 16px;">预订时间：</div>'
            + '<div style="font-size: 12px; line-height: 30px;">'
            + '工作日全天各时段'
            + '</div>'
            + '<div style="color: #ff6633; font-size: 16px;">预订要求：</div>'
            + '<div style="font-size: 12px; line-height: 30px;">'
            + '每次批量预订量需<span style="color: #ff6633">三件以上（含三件）</span>，且每次订单金额上限不超一千元'
            + '</div>'
            + '<div style="color: #ff6633; font-size: 16px;">领取时间：</div>'
            + '<div style="font-size: 12px;line-height: 30px;">'
            + '隔周领取（即本周一订单可下周一<span style="color: #ff6633">凭短信及工卡</span>领取）'
            + '</div>'
            + '</div>';
        show_dialog(title, content, function () {
                hide_dialog();
            }
        );
    };
    //进入商品详情
    $scope.goDetail = function (arg_date) {
        if (!arg_date) {
            return
        }
        if ($scope.rule.TodayCanOrder != 1) {
            Alert("今天不提供订购服务！");
            return;
        }
        if ($scope.rule.ThisWeekCanOrder != 1) {
            Alert("本周已订购，不能再次订购！");
            return;
        }
        if (angular.isDefined($scope.nowList.WtCanOrderMaxCount) && $scope.nowList.WtCanOrderMaxCount > 0) {
            //当前类别最大限购
            arg_date.maxCount = $scope.nowList.WtCanOrderMaxCount;
            arg_date.WtID = $scope.nowList.WtID;
        }
        localStorage.goodsData = angular.toJson(arg_date);
        location.href = "detail.html?" + urlParam;
    };
    //获取用户信息
    $scope.getUserInf = function () {
        ajax({
            m: 'userquerybyportal2',
            PortalType: 'wx'
        }, function (result) {
            utils.setParam("userinfo", JSON.stringify(result));
        }, function (result) {
            Alert("连接出错，请重试")
        });
    };

    //进入购物车
    $scope.goToCart = function () {
        if (angular.isUndefined($scope.cartData) || $scope.cartData.length == 0) {
            Alert("购物车为空，先选购些商品吧！");
            return;
        }
        location.href = "cart.html?" + urlParam;
    };
    $timeout(function () {
        var w = (win_w - 30);
        var h = w * 0.4 * 1.42;
        $scope.leftPic['width'] = w * 0.4 + "px";
        $scope.leftPic['height'] = h + "px";
        $scope.rightPic['width'] = w * 0.6 + "px";
        $scope.rightPic['height'] = h + "px";
        $scope.rightPic["left"] = w * 0.4 + 10 + 'px';

        var itemW = (w - 10) / 3;
        $scope.item['width'] = itemW + "px";
        $scope.item['height'] = itemW + "px";
        $scope.getRule();
        //$scope.getUserInf();

        $('#date').pickadate({
            min: "1900-01-01",
            max: $scope.date
        });
        $("#date").change(function () {
            date = $("#date").val();
            $scope.getWt($scope.listPic - 1);
        });
        $("#date").val(date);
        $("#date").change();
        $("#show_pic_r").width(win_w - 206 - 10 - 10 - 10);
    }, 10);
    $("body").css("display", "inline");
}]);
xxyj.controller('xxyjDCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    console.log(localStorage.goodsData);
    $scope.goods = angular.fromJson(localStorage.goodsData);
    if (angular.isUndefined($scope.goods) || angular.isUndefined($scope.goods.WashName)) {
        Alert("无商品数据!");
        return
    }
    $scope.back = function () {
        //window.history.back();
        location.href = "index.html" + "?" + urlParam;
    };
    $scope.goTo = function (arg_url) {
        location.href = arg_url + "?" + urlParam;
    };
    $scope.cartData = angular.fromJson(localStorage.CARTDATA);
    //修改数量
    $scope.changeCount = function (arg_type) {
        if (arg_type == "-" && $scope.goods.count > 1) {
            $scope.goods.count = $scope.goods.count - 1;
        } else if (arg_type == "+") {
            $scope.goods.count = $scope.goods.count + 1;
        }
    };
    //加入购物车
    $scope.addCart = function () {
        if (angular.isUndefined(localStorage.CARTDATA) || angular.fromJson(localStorage.CARTDATA).length == 0) {
            localStorage.CARTDATA = angular.toJson([]);
        }
        $scope.cartData = angular.fromJson(localStorage.CARTDATA);
        if (!angular.isArray($scope.cartData)) {
            Alert("购物车数据有误");
            return
        }
        var temL = $scope.cartData.length;
        var isPush = true;
        for (var i = 0; i < temL; i++) {
            if ($scope.cartData[i].WashCode == $scope.goods.WashCode) {
                isPush = false;
                Alert("该产品已在购物车，可进入购物车修改");
                return
            }
        }
        //var preDate = new Date(date);
        //preDate.setDate(preDate.getDate() -1);
        //$scope.goods.addDate = getDateStrByDate(preDate);
        $scope.goods.addDate = getDateStr();
        $scope.goods.week = getWeekStr();
        $scope.goods.from = "洗新艳旧";
        $scope.goods.index = $scope.cartData.length;
        //判断是否打折
        if ($scope.goods.WashUseDisCount) {
            $scope.goods.WashPrice = $scope.goods.WashDiscountPrice;
        }
        $scope.cartData.push($scope.goods);
        Alert("加入购物车成功");
        localStorage.CARTDATA = angular.toJson($scope.cartData);
    };
    //进入购物车
    $scope.goToCart = function () {
        if (angular.isUndefined($scope.cartData) || $scope.cartData.length == 0) {
            Alert("购物车为空，先选购些商品吧！");
            return;
        }
        location.href = "cart.html?" + urlParam;
    };
    $("body").css("display", "inline");
}]);
xxyj.controller('xxyjCCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.cartData = [];
    $scope.cartData = angular.fromJson(localStorage.CARTDATA);
    $scope.userInf = angular.fromJson(localStorage.userinfo);
    $scope.allPrice = 0;
    $scope.selectCount = 0;
    $scope.rule = {};
    $scope.delAll = false;
    $scope.delOne = false;
    $scope.delIndex = "";
    $("body").css("display", "inline");
    if (angular.isUndefined($scope.cartData)) {
        $scope.cartData = [];
    }


    $scope.swipeLeft = function (arg_type, arg_index, arg_d) {
        var tmeW = $("#car_" + arg_index).width();
        if (arg_type == "left") {
            //$("#car_"+arg_index).animate({left:'-20%'});
            //arg_d.style = {left:'-'+tmeW*0.2+'px'};
            $("#car_" + arg_index).css("left", "-" + tmeW * 0.2 + "px");
        } else {
            arg_d.style = {left: "0%"};
            $("#car_" + arg_index).css("left", "0%");
            //$("#car_"+arg_index).animate({left:'0%'});
        }
    };


    if (!angular.isArray($scope.cartData)) {
        $timeout(function () {
            //Alert("购物车数据有误", 1000000);
        }, 10);
        //return
    }
    if (!angular.isObject($scope.userInf)) {
        $timeout(function () {
            Alert("用户数据有误");
        }, 10);
        $timeout(function () {
            location.href = homeurl+'?'+urlParam;
        }, 1000);
        return
    }
    $scope.back = function () {
        window.history.back();
    };
    $scope.delOneD = function (arg_data, arg_index) {
        show_dialog("提示", "是否移出购物车?", null, '确认', function () {
            arg_data.count--;
            $scope.$apply(function () {
                //var temL = $scope.cartData.length;
                //$scope.cartData.splice(temL-1-arg_index,1);
                $scope.cartData.splice(arg_index, 1);
                $scope.countPrice();
                localStorage.CARTDATA = angular.toJson($scope.cartData);
            });
            hide_dialog();
        }, '返回', function () {
            hide_dialog();
        });
        return;
    };
    $scope.changeCount = function (arg_data, arg_type, arg_index) {
        if (!arg_data || !arg_type) {
            return;
        }
        if (arg_type == '+') {
            arg_data.count++;
        } else if (arg_type == '-') {
            if (arg_data.count == 1) {
                //$scope.showDelOne(arg_index);
                show_dialog("提示", "是否移出购物车?", null, '确认', function () {
                    arg_data.count--;
                    $scope.$apply(function () {
                        //var temL = $scope.cartData.length;
                        //$scope.cartData.splice(temL-1-arg_index,1);
                        $scope.cartData.splice(arg_index, 1);
                        $scope.countPrice();
                        localStorage.CARTDATA = angular.toJson($scope.cartData);
                    });
                    hide_dialog();
                }, '返回', function () {
                    hide_dialog();
                });
                return;
            }
            arg_data.count--;
        }
        $scope.countPrice();
        localStorage.CARTDATA = angular.toJson($scope.cartData);
    };
    $scope.showDelAll = function (arg_data) {
        //$scope.delAll = arg_data;
        if($scope.selectCount==0){
            return;
        }
        show_dialog("提示", "确认要清空吗？", function () {
                hide_dialog()
            }, "确认", function () {
                $scope.$apply(function(){
                    $scope.cartData = [];
                    $scope.allPrice = 0;
                    $scope.selectCount = 0;
                    localStorage.CARTDATA = angular.toJson([]);
                });
                hide_dialog();
            }, "取消", function () {
                hide_dialog();
            }
        );


    };
    $scope.delAllData = function () {
        $scope.cartData = [];
        $scope.allPrice = 0;
        $scope.selectCount = 0;
        localStorage.CARTDATA = angular.toJson([]);
        $scope.showDelAll(false);
    };
    $scope.showDelOne = function (arg_index) {
        if (angular.isNumber(arg_index)) {
            $scope.delOne = true;
            $scope.delIndex = arg_index;
        } else {
            $scope.delOne = false;
        }
    };
    $scope.delOneData = function () {
        if (!angular.isNumber($scope.delIndex)) {
            return;
        }
        $scope.cartData.splice($scope.delIndex, 1);
        $scope.countPrice();
        localStorage.CARTDATA = angular.toJson($scope.cartData);
        $scope.showDelOne(false);
    };
    $scope.countPrice = function () {
        $scope.allPrice = 0;
        $scope.selectCount = 0;
        var temL = $scope.cartData.length;
        for (var i = 0; i < temL; i++) {
            $scope.selectCount = $scope.selectCount + $scope.cartData[i].count;
            $scope.allPrice = $scope.allPrice + $scope.cartData[i].count * $scope.cartData[i].WashPrice;
        }
    };
    $scope.countPrice();
//去结算
    $scope.goToPost = function () {
        if (!$scope.cartData.length) {
            return
        }
        location.href = "post.html?" + urlParam;
    };
//提交订单
    $scope.showSubmit = function () {
        //这里判断规则
        console.log(localStorage.RULE);
        $scope.rule = angular.fromJson(localStorage.RULE);
        var sTime = $scope.rule.OrderBeginTime.replace(":", ".")
        var eTime = $scope.rule.OrderEndTime.replace(":", ".")
        var now = getDateHourMStr();
        if (now - sTime < 0 || eTime - now < 0) {
            Alert("商品未开放购买")
            return;
        }
        //if($scope.cartData.length>$scope.rule.MinOrderCount){
        //    Alert("订单商品不能超过"+$scope.rule.MinOrderCount+"件")
        //    return;
        //}
        if ($scope.allPrice > $scope.rule.MaxOrderMoney) {
            Alert("订单金额不能超过" + $scope.rule.MaxOrderMoney + "元");
            return;
        }

        var content = '' +
            '<div class="dialog_text">以下为您购买的商品信息，请确认<br>' +
            '<table style="width:100%; line-height:20px; text-align:left;">' +
            '<tbody>' +
            '<tr style="border-bottom:1px solid #666666;">' +
            '<th style="width:60%;">商品名称</th>' +
            '<th style="width:20%;">单价</th>' +
            '<th style="width:20%;">数量</th>' +
            '</tr>';
        var temL = $scope.cartData.length;
        for (var i = 0; i < temL; i++) {
            content += '<tr><td>' + $scope.cartData[i].WashName + '</td><td>' + $scope.cartData[i].WashPrice.toFixed(2) + '</td><td>' + $scope.cartData[i].count + '</td></tr>';
        }
        content += '</tbody>' +
            '</table>' +
            '<div style="width:100%; font-size:12px; color:#ff6633;">共计￥' + $scope.allPrice.toFixed(2) + '元</div>' +
            '</div>';
        show_dialog("订单确认", content, null, '确认', function () {
            $scope.submitOrder();
            hide_dialog();
        }, '返回', function () {
            hide_dialog();
        });
    };
    $scope.submitOrder = function () {
        console.log($scope.cartData[0])

        var orderNo = getTimeStr() + Math.floor(Math.random() * 9999 + 1000);
        var washIds = "|";
        var washCounts = "|";
        var temL = $scope.cartData.length;
        for (var i = 0; i < temL; i++) {
            washIds = washIds + $scope.cartData[i].WashID + "|";
            washCounts = washCounts + $scope.cartData[i].count + "|";
        }
        var d = {
            m: "washorderpost",
            posid: orderNo,
            washIds: washIds,
            washCounts: washCounts
        };
        ajax(d, function (arg_data) {
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                alert("没有获取到数据！");
                return
            }
            if (arg_data.Id == 1) {
                Alert(arg_data.Msg);
                localStorage.CARTDATA = angular.toJson([]);
                location.href = "order.html?" + urlParam;
            } else {
                Alert(arg_data.Msg);
                return;
            }
        }, function (arg_err) {
            console.log(arg_err);
            Alert("请求超时！");
        })
    };
    $timeout(function () {
        $(".img").each(function (i, n) {
            $(this).height($(this).width());
        });
        $(".car_body").each(function (i, n) {
            $(".car_item").height($(this).outerHeight(true));
            $(".delOne").height($(this).outerHeight(true));
            $(".delOne").css("line-height", $(this).outerHeight(true) + "px");
        });
    }, 100);


}]);
xxyj.controller('xxyjOCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.orders = [];
    $scope.cartData = angular.fromJson(localStorage.CARTDATA);
    if (angular.isUndefined($scope.cartData)) {
        $scope.cartData = [];
    }
    $scope.getOrder = function (arg_b, arg_e) {
        var d = {m: "washorderquery", BeginDate: arg_b, EndDate: arg_e};
        ajax(d, function (arg_data) {
            console.log(arg_data);
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                Alert("没有获取到数据！");
                return
            }
            $scope.$apply(
                function () {
                    $scope.orders = [];
                    $scope.orders = arg_data;
                    var temL = $scope.orders.length;
                    for (var i = 0; i < temL; i++) {
                        var temItem = $scope.orders[i].OrderItems.length;
                        var p = 0;
                        for (var j = 0; j < temItem; j++) {
                            p = p + $scope.orders[i].OrderItems[j].Price * $scope.orders[i].OrderItems[j].Number;
                        }
                        $scope.orders[i].allPrice = p;
                    }
                });
        }, function (arg_err) {
            //console.log(arg_err);
            Alert(arg_err);
        })
    };
    $scope.cancelOrder = function (arg_order) {
        if (!arg_order || !angular.isObject(arg_order)) {
            return;
        }
        var d = {
            m: "servicesiteorderclear",
            SoID: arg_order.SoID,
            Date: arg_order.Date
        };
        ajax(d, function (arg_data) {
            //console.log(arg_data);
            //console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                Alert("没有获取到数据！");
                return
            }
            Alert(arg_data.Msg);
            $scope.$apply(function () {
                var btime = $("#begin_date").val();
                var etime = $("#end_date").val();
                if (dateCompare(etime, btime) < 0) {
                    Alert("结束日期不能大于开始日期！");
                    return;
                }
                $scope.getOrder(btime, etime);
            });
        }, function (arg_err) {
            //console.log(arg_err);
            Alert(arg_err);
        })
    };
    //进入购物车或首页
    $scope.goTo = function (arg_url) {
        location.href = arg_url + "?" + urlParam;
    };
    $timeout(function () {
        $(".content").width(win_w - 40);
        $(".line").width((win_w - 70) / 2);
        $(".line0").width($(".line").width() - 7);
        $(".sp").width(win_w - 20);

        $('#begin_date').pickadate({
            min: "1900-01-01"
            //max: date
        });
        $('#end_date').pickadate({
            min: "1900-01-01"
            //max: date
        });

        $("#begin_date").add("#end_date").change(function () {
            var btime = $("#begin_date").val();
            var etime = $("#end_date").val();
            if (dateCompare(etime, btime) < 0) {
                Alert("结束日期不能大于开始日期！");
                return;
            }
            $scope.getOrder(btime, etime);
        });
        $("#begin_date").val(date);
        $("#end_date").val(date);
        $("#begin_date").change();
        $("body").css("display", "inline")
    }, 10);
}]);
