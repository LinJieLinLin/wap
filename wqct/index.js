/**
 * Created by LinLin on 2015/7/26.
 */
var wqct = angular.module('wqct', ['ngTouch']);
wqct.controller('wqctCCtrl', ['$scope', '$timeout', '$compile', function ($scope, $timeout, $compile) {
    //$scope.cartData = [];
    //$scope.cartData = angular.fromJson(localStorage.CARTDATA);
    //$scope.userInf = angular.fromJson(localStorage.userinfo);
    //$scope.allPrice = 0;
    //$scope.selectCount = 0;
    //$scope.rule = {};
    $scope.delAll = false;
    $scope.delOne = false;
    $scope.delIndex = "";
    $scope.delOdate = "";
    $scope.t = 0;

    $scope.swipeLeft = function (arg_type, arg_index) {
        var tmeW = $("#cart_" + arg_index).width();
        if (arg_type == "left") {
            $("#cart_" + arg_index).css("left", "-" + tmeW * 0.2 + "px");
        } else {
            $("#cart_" + arg_index).css("left", "0%");
            //$("#car_"+arg_index).animate({left:'0%'});
        }
    };
    $scope.showDelAll = function (arg_data) {
        if($(".car_info2").text()=="已选:0"){
            return;
        }
        carClear();
        //$scope.delAll = arg_data;
    };
    $scope.delAllData = function () {
        $(".car_list").hide();
        cart.clear();
        cart2.clear();
        refCount();
        $scope.delAll = false;
    };
    $scope.back = function () {
        window.history.back();
    };

    $scope.showDelOne = function (arg_fid, arg_odate,arg_t) {
        //if(arg_t){
        //    $scope.t = arg_t;
        //}
        //if (angular.isDefined(arg_fid)) {
        //    $scope.delOne = true;
        //    $scope.delIndex = arg_fid;
        //    $scope.delOdate = arg_odate;
        //} else {
        //    $scope.delOne = false;
        //}
        show_dialog("提示", "是否移出购物车?", null, '确认', function () {
            if (arg_t == '1') {
                cart.del(arg_fid, arg_odate);
            }
            if (arg_t == "2") {
                cart2.del(arg_fid, arg_odate);
            }
            $("#cart_item_"+arg_fid).hide();
            refCount();
            hide_dialog();
        }, '返回', function () {
            hide_dialog();
        });
    };
    $scope.delOneData = function () {
        if ($scope.t == '1') {
            cart.del($scope.delIndex, $scope.delOdate);
        }
        if ($scope.t == "2") {
            cart2.del($scope.delIndex, $scope.delOdate);
        }
        $("#cart_item_"+$scope.delIndex).hide();
        refCount();
        $scope.showDelOne();
    };
    $timeout(function () {
        $("body").css("display","inline");
        loadData();
    }, 10);

    function loadData() {
        var ids1 = cart.getvalues('id');
        var counts1 = cart.getvalues('num');
        var dates1 = cart.getvalues('odate');
        var ids2 = cart2.getvalues('id');
        var counts2 = cart2.getvalues('num');
        var dates2 = cart2.getvalues('odate');
        var car_list = "";
        $(".car_list").html("");


        var JsonData = {m: 'foodquerybyfids', FIds: ids1, FCounts: counts1, Dates: dates1};
        //console.log(JSON.stringify(JsonData));
        ajax(JsonData, function (result) {
            console.log("result.length=" + result.length);
            var temp_date = '';
            $.each(result, function (i, o) {
                if (temp_date != o.OrderDate) {
                    temp_date = o.OrderDate;
                    //添加一行日期
//                        car_list += '<div class="order_date">'+o.OrderDate+'&nbsp;'+o.WeekDay+'</div>';
                }
                car_list +='<div class="cat_h" id="cart_item_'+o.FId+'" style="position: relative;">';
                car_list += '<div class="car_item" id="cart_'+o.FId+'" ng-swipe-left="swipeLeft('+"'left'"+','+o.FId+')" ng-swipe-right="swipeLeft('+"'right'"+','+o.FId+')"   >';
                car_list += '    <div class="item_img">';
                car_list += '        <img class="img" src="' + o.FPicture + '" /></div>';
                car_list += '    <div class="item_sp">&nbsp;</div>';
                car_list += '    <div class="item_content">';
                car_list += '        <div class="item_name">' + o.FName + '</div>';
                car_list += '        <div class="item_from">来源：' + o.FSourceFrom + '</div>';
                car_list += '        <div class="item_stock">库存：' + o.FRemainCount + '</div>';
                car_list += '        <div class="item_price">';
                car_list += '            <div class="item_price_tag">￥</div>';
                car_list += '            <div class="item_price_value">' + o.FPrice.toFixed(2) + '</div>';
                car_list += '        </div>';
                car_list += '        <div class="item_set_count">';
                car_list += '            <div class="subtract" t="1" fid="' + o.FId + '" odate="' + o.OrderDate + '" ></div>';
                car_list += '            <div class="count"  ><input class="fcount" id="fcount' + o.FId + o.OrderDate + '"type="text" value="' + o.Fcount + '" /></div>';
                car_list += '            <div class="add" t="1" fid="' + o.FId + '" odate="' + o.OrderDate + '" ></div>';
                car_list += '        </div>';
                car_list += '    </div>';
                car_list += '     <div style="clear:both"></div>';
                car_list += '</div>';
                car_list += '<div class="line"></div>';
                car_list += '<div class="delOne" data-ng-click="showDelOne('+"'"+o.FId+"'"+",'"+ o.OrderDate+"',1"+')">删除</div>';
                car_list +='</div>'
            });
            if (ids2 != null && ids2 != "" && ids2.length > 2) {
                JsonData = {m: 'hotfoodquerybyfids', FIds: ids2, FCounts: counts2, Dates: dates2};
                console.log(JSON.stringify(JsonData));
                ajax(JsonData, function (result2) {
                    //console.log(JSON.stringify(result2));

                    $.each(result2, function (i, o) {
                        car_list +='<div class="cat_h" id="cart_item_'+o.FId+'" style="position: relative;">';
                        car_list += '<div class="car_item" id="cart_'+o.FId+'" ng-swipe-left="swipeLeft('+"'left'"+','+o.FId+')" ng-swipe-right="swipeLeft('+"'right'"+','+o.FId+')"   >';
                        car_list += '    <div class="item_img">';
                        car_list += '        <img class="img" src="' + o.FPicture + '" /></div>';
                        car_list += '    <div class="item_sp">&nbsp;</div>';
                        car_list += '    <div class="item_content">';
                        car_list += '        <div class="item_name">' + o.FName + '</div>';
                        car_list += '        <div class="item_from">来源：屋企餐厅</div>';
                        car_list += '        <div class="item_stock">库存：' + o.FRemainCount + '</div>';
                        car_list += '        <div class="item_price">';
                        car_list += '            <div class="item_price_tag">￥</div>';
                        car_list += '            <div class="item_price_value">' + o.FPrice.toFixed(2) + '</div>';
                        car_list += '        </div>';
                        car_list += '        <div class="item_set_count">';
                        car_list += '            <div class="subtract" t="2" fid="' + o.FId + '" odate="' + o.OrderDate + '" ></div>';
                        car_list += '            <div class="count"><input  class="fcount" id="fcount' + o.FId + o.OrderDate + '" type="text" value="' + o.Fcount + '" /></div>';
                        car_list += '            <div class="add" t="2" fid="' + o.FId + '" odate="' + o.OrderDate + '" ></div>';
                        car_list += '        </div>';
                        car_list += '    </div>';
                        car_list += '     <div style="clear:both"></div>';
                        car_list += '</div>';
                        car_list += '<div class="line"></div>';
                        car_list += '<div class="delOne" data-ng-click="showDelOne('+"'"+o.FId+"'"+",'"+ o.OrderDate+"',2"+')">删除</div>';
                        car_list +='</div>'
                    });
                    //$(".car_list").html(car_list);
                    $(".car_list").html($compile(car_list)($scope));

                    pageInit();
                    refCount();
                }, function (result2) {

                });
            } else {
                //$(".car_list").html(car_list);
                var tt = angular.element(car_list);
                $(".car_list").html($compile(tt)($scope));

                ////通过$compile动态编译html
                //var html="<div ng-click='test()'>{{allPrice}}</div>";
                //var template = angular.element(html);
                //var mobileDialogElement = $compile(template)($scope);
                //angular.element(document.body).append(mobileDialogElement);

                pageInit();
                refCount();
            }

        }, function (result) {

        });
        refCount();
    }

    function pageInit() {
        $(".car_list").width(win_w);
        $(".back_img").click(function () {
            window.history.back();
        });
        $(".btn_go").click(function () {
            var sumCount = (parseInt(osum.totalNumber) + parseInt(osum2.totalAmount));
            if (sumCount > 0) {
                location.href = 'post1.html?' + urlParam;
            }
        });

        //var screenImage = $(".img");
        //var theImage = new Image();
        //theImage.src = screenImage.attr("src");
        //var imageWidth = theImage.width;
        //var imageHeight = theImage.height;

        $(".img").each(function (i, n) {
            $(this).height($(this).width());
            $(".cat_h").height($(".car_item").outerHeight(true));
            $(".delOne").height($(".car_item").outerHeight(true));
            $(".delOne").css("line-height",$(".car_item").outerHeight(true)+"px");
        });

        $(".btn_clear").click(carClear);

        $(".subtract").click(function () {
            var t = $(this).attr('t');
            var fid = $(this).attr('fid');
            var odate = $(this).attr('odate');
            var fcount = $("#fcount" + fid + odate).val();
            if (parseInt(fcount) > 1) {
                var newcount = parseInt(fcount) - 1;
                $("#fcount" + fid + odate).val(newcount);
                if (t == '1') {
                    cart.set(fid, odate, newcount);
                }
                if (t == "2") {
                    cart2.set(fid, odate, newcount);
                }
            } else {
                //$scope.$apply(function () {
                //    $scope.showDelOne(fid, odate);
                //    $scope.t = t;
                //});
                show_dialog("提示", "是否移出购物车?", null, '确认', function () {
                    if (t == '1') {
                        cart.del(fid, odate);
                    }
                    if (t == "2") {
                        cart2.del(fid, odate);
                    }
                    $("#cart_item_"+fid).hide();
                    refCount();
                    hide_dialog();
                }, '返回', function () {
                    hide_dialog();
                });
            }
            refCount();
        });
        $(".add").click(function () {
            var t = $(this).attr('t');
            var fid = $(this).attr('fid');
            var odate = $(this).attr('odate');

            var fcount = $("#fcount" + fid + odate).val();

            var newcount = parseInt(fcount) + 1;
            $("#fcount" + fid + odate).val(newcount);
            if (t == '1') {
                cart.set(fid, odate, newcount);
            }
            if (t == "2") {
                cart2.set(fid, odate, newcount);
            }
            refCount();
        });
    }

    function carClear() {
        if($(".car_info2").text()=="已选:0"){
            return;
        }
        show_dialog("提示", "确认要清空吗？", function () {
                hide_dialog()
            }, "确认", function () {
                $(".car_list").hide();
                cart.clear();
                cart2.clear();
                refCount();
                hide_dialog();
            }, "取消", function () {
                hide_dialog();
            }
        );
    }

    function refCount() {
        cart.ref();
        cart2.ref();
        var sumMoney = parseFloat(osum.totalAmount) + parseFloat(osum2.totalAmount);
        var sumCount = (parseInt(osum.totalNumber) + parseInt(osum2.totalAmount));
        $(".car_info1_money").text(sumMoney.toFixed(2));
        $(".car_info2").text('已选:' + sumCount);
        if (sumCount == 0) {
            var h = $("#cart_null").height();
            $("#btn_go").addClass("disable");
            $("#cart_null").css('top', ((win_h - h) / 2) + 'px');
            $("#cart_null").show();
        }
    }
}]);