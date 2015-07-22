var xxyj = angular.module('xxyj', []);
xxyj.controller('xxyjCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.listWtCur = 0;
    $scope.listWts = [];
    $scope.listGoods = {};
    $scope.leftPic = {};
    $scope.rightPic = {};
    $scope.item = {};
    $scope.listPic = 1;
    $scope.rule = {};
    //当前类别
    $scope.nowList = {};
    $scope.back = function () {
        location.href = "../home/index.html";
    };
    //拿预订规则查询
    $scope.getRule = function () {
        var d = {m: "washorderrulequery", UserID: "3ddff7b03eb1f6cf160d431584b83448"};
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
            $scope.nowList = arg_data[arg_i];
            $scope.getLists($scope.nowList);
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
        var d = {m: "washtypequery", UserID: "3ddff7b03eb1f6cf160d431584b83448", WtId: -1};
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
        var d = {m: "washquerybywtid", UserID: "3ddff7b03eb1f6cf160d431584b83448", WtId: arg_data.WtID};
        ajax(d, function (arg_data) {
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                alert("没有获取到数据！");
                return
            }
            $scope.$apply(function () {
                    $scope.listGoods = {};
                    $scope.listGoods = arg_data;
                }
            );
        }, function (arg_err) {
            console.log(arg_err);
            alert(arg_err);
        })
    };
    $scope.changeList = function (arg_data, arg_index) {
        if (!arg_data) {
            return;
        }
        $scope.listPic = arg_data.WtID;
        $scope.listWtCur = arg_index;
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

}]);
xxyj.controller('xxyjDCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    console.log(localStorage.goodsData);
    $scope.goods = angular.fromJson(localStorage.goodsData);
    if (angular.isUndefined($scope.goods) || angular.isUndefined($scope.goods.WashName)) {
        Alert("无商品数据!");
        return
    }
    $scope.back = function () {
        window.history.back();
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

        localStorage.CARTDATA = angular.toJson($scope.cartData);
    };
    //进入购物车
    $scope.goToCart = function () {
        location.href = "cart.html?" + urlParam;
    }
}]);
xxyj.controller('xxyjCCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.cartData = [];
    $scope.cartData = angular.fromJson(localStorage.CARTDATA);

    $scope.allPrice = 0;

    if (!angular.isArray($scope.cartData)) {
        Alert("购物车数据有误");
        return
    }
    $scope.back = function () {
        window.history.back();
    };
    $scope.changeCount = function (arg_data, arg_type,arg_index) {
        if (!arg_data || !arg_type) {
            return;
        }
        if (arg_type == '+') {
            arg_data.count++;
        } else if (arg_type == '-') {
            if (arg_data.count == 1) {
                show_dialog("提示", "是否移出购物车?", null, '确认', function () {
                    arg_data.count--;
                    $scope.$apply(function(){
                        var temL = $scope.cartData.length;
                        //$scope.cartData.splice(temL-1-arg_index,1);
                        $scope.cartData.splice(arg_index,1);
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
    $scope.delAll = function(){
        $scope.cartData = [];
        $scope.allPrice = 0;
        localStorage.CARTDATA = angular.toJson([]);
    };
    $scope.countPrice = function(){
        $scope.allPrice = 0;
        var temL = $scope.cartData.length;
        for(var i=0;i<temL;i++){
                $scope.allPrice = $scope.allPrice+$scope.cartData[i].count*$scope.cartData[i].WashPrice;
        }
    };
    $scope.countPrice();
}]);