var ktyy = angular.module('ktyy', []);
ktyy.controller('ktyyCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.places = [];
    $scope.back = function () {
        location.href = "../home/index.html";
    };
    $scope.toOrder = function () {
        location.href = "order.html?" + urlParam;
    };
    $scope.getPlace = function () {
        var d = {m: "sitequerybysiteid", UserID: "3ddff7b03eb1f6cf160d431584b83448", SiteID: "-1"};
        ajax(d, function (arg_data) {
            //console.log(arg_data[0]);
            //console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isArray(arg_data)) {
                Alert("没有获取到数据！");
                return
            }
            $scope.$apply(
                function () {
                    $scope.places = [];
                    $scope.places = arg_data;
                });
        }, function (arg_err) {

        })
    };
    $timeout(function () {
        $scope.getPlace();
        localStorage.ktyyUrlParam = urlParam;
    }, 10);
    $scope.showRule = function (title, content) {
        if (!title || !content) {
            return
        }
        show_dialog(title, content, function () {
            hide_dialog();
        });
    };
    $scope.select = function (sid) {
        if (!sid) {
            return
        }
        location.href = 'select.html?sid=' + sid + "&" + urlParam;
    };

    $(function () {
        $(".item_text_right").click(function () {
            var sid = $(this).parent().attr('sid');
            location.href = 'select.html?sid=' + sid;
        });
        $(".item_text_left").click(function () {
            var sid = $(this).parent().attr('sid');
            showRule(sid);
        });
        $(".order_link").click(function () {
            location.href = 'order.html';
        });
    });

}]);
ktyy.controller('ktyySCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.places = [];
    $scope.timeList = {};
    $scope.placeCur = 0;
    //$scope.date = getDateStr();
    $scope.back = function () {
        location.href = "index.html?" + localStorage.ktyyUrlParam;
    };
    $scope.getPlaceList = function () {
        var sid = $.getUrlParam("sid");
        if (!sid) {
            return
        }
        var d = {m: "sitepointquerybysiteid", UserID: "3ddff7b03eb1f6cf160d431584b83448", SiteID: sid};
        ajax(d, function (arg_data) {
            //console.log(arg_data);
            //console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                Alert("没有获取到数据！");
                return
            }
            $scope.$apply(
                function () {
                    $scope.places = [];
                    $scope.timeList = {};
                    $scope.placeCur = 0;
                    $scope.places = arg_data.SitePointList;
                    $scope.timeList = $scope.places[0];
                });
        }, function (arg_err) {
            //console.log(arg_err);
            Alert(arg_err);
        })
    };
    $timeout(function () {
        $('.select_date').pickadate({
            min: date
        });
        $("#select_date").change(function () {
            date = $("#select_date").val();
            $scope.getPlaceList();
        });
        $("#select_date").val(date);
        $("#select_date").change();
    }, 10);
    $scope.changeDate = function (arg_d) {
        var preDate = new Date(date);
        if (arg_d == -1 && date == getDateStr()) {
            return;
        }
        preDate.setDate(preDate.getDate() + arg_d);  //后一天
        date = $scope.getDateStr(preDate);
        $("#select_date").val(date);
        $("#select_date").change();
    };
    $scope.getDateStr = function (arg_d) {
        var date = arg_d;
        var yyyy = date.getFullYear();
        var MM = date.getMonth() + 1;
        var dd = date.getDate();
        if (MM < 10) MM = '0' + MM
        if (dd < 10) dd = '0' + dd;
        return yyyy + "-" + MM + "-" + dd;
    };
    $scope.selectPlace = function (arg_index, arg_data) {
        if (!arg_data) {
            return
        }
        $scope.placeCur = arg_index;
        $scope.timeList = arg_data;
    };
    $scope.selectTime = function (arg_data) {
        if (!arg_data || arg_data.IsOrder > 0) {
            return
        }
        if (arg_data.IsOrder != -1) {
            var temL = $scope.timeList.Times.length;
            var hour = 0;
            for (var i = 0; i < temL; i++) {
                if ($scope.timeList.Times[i].IsOrder == -1) {
                    hour++;
                }
            }
            if (hour > 1) {
                Alert("每人每天最多可预订2小时！");
                return
            }
            arg_data.IsOrder = -1;
        } else {
            arg_data.IsOrder = 0;
        }
        //console.log(angular.toJson($scope.timeList));
    };
    $scope.submitOrder = function () {
        var spID = $scope.timeList.SpID;
        var bTimes = ",";
        var eTimes = ",";
        var temL = $scope.timeList.Times.length;
        for (var i = 0; i < temL; i++) {
            if ($scope.timeList.Times[i].IsOrder == -1) {
                bTimes += $scope.timeList.Times[i].BTime + ",";
                eTimes += $scope.timeList.Times[i].ETime + ",";
            }
        }
        if (bTimes == ",") {
            Alert("请先选择时间！");
            return;
        }
        var d = {
            m: "siteorderpost",
            UserID: "3ddff7b03eb1f6cf160d431584b83448",
            SpID: spID,
            BTimes: bTimes,
            ETimes: eTimes
        };
        ajax(d, function (arg_data) {
            //console.log(arg_data);
            //console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                Alert("没有获取到数据！");
                return
            }
            Alert(arg_data.Msg);
            if (arg_data.Id == 1) {
                location.href = "order.html?" + urlParam;
            }
        }, function (arg_err) {
            //console.log(arg_err);
            Alert(arg_err);
        })
    };
    $scope.getContent = function () {
        var place = $scope.timeList.SpName;
        var d = date;
        var time = "";
        var temL = $scope.timeList.Times.length;
        for (var i = 0; i < temL; i++) {
            if ($scope.timeList.Times[i].IsOrder == -1) {
                time += $scope.timeList.Times[i].TimeText + " ";
            }
        }
        var content = '<div style="line-height: 30px; font-size: 11px;padding: 6px 0 0 0;">' +
            '<div style="font-size: 15px;">以下为您的预订信息,请确认。</div>' +
            '<div>预订场地：<span style="color: #ff6633;">' + place + '</span></div>' +
            '        <div>预订日期：<span style="color: #ff6633;">' + d + '</span></div>' +
            '        <div style="margin-bottom: 15px;">预订时段：<span style="color: #ff6633;">' + time + '</span></div>' +
            '        </div>';
        return content;
    };
    $(".post").click(function () {
        var title = '预订确认';
        var content = $scope.getContent();
        show_dialog(title, content, null, '确认', function () {
            $scope.submitOrder();
            hide_dialog();
        }, '返回', function () {
            hide_dialog();
        });
    });

}]);
ktyy.controller('ktyyOCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.orders = [];
    $scope.getOrder = function (arg_b, arg_e) {
        var d = {m: "siteorderquery", UserID: "3ddff7b03eb1f6cf160d431584b83448", BeginDate: arg_b, EndDate: arg_e};
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
                });
        }, function (arg_err) {
            //console.log(arg_err);
            Alert(arg_err);
        })
    };
    $scope.back = function () {
        location.href = "index.html?" + localStorage.ktyyUrlParam;
    };
    $scope.cancelOrder = function (arg_order) {
        if (!arg_order || !angular.isObject(arg_order)) {
            return;
        }
        var d = {
            m: "servicesiteorderclear",
            UserID: "3ddff7b03eb1f6cf160d431584b83448",
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
    }, 10);
}]);
