var wdzh = angular.module('wdzh', []);
wdzh.controller('wdzhCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.userInf = {};
    $scope.back = function () {
        location.href = "../home/index.html";
    };
    $scope.getMoney = function () {
        var d = {m: "accountinfoquery", UserID: "3ddff7b03eb1f6cf160d431584b83448"};
        ajax(d, function (arg_data) {
            console.log(arg_data[0]);
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                Alert("没有获取到数据！");
                return
            }
            $scope.$apply(function () {
                $scope.userInf = {};
                $scope.userInf = arg_data;
            });
        }, function (arg_err) {
            Alert("请求超时！");
            return
        })
    };

    $scope.getPrice = function () {
        var d = {
            m: "traninfoquery",
            UserID: "3ddff7b03eb1f6cf160d431584b83448",
            BeginDate: "2015-07-10",
            EndDate: "2015-07-20"
        };
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
            Alert("请求超时！");
            return
        })
    };
    $scope.getRecord = function (arg_b, arg_e) {
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
    $scope.getRecord = function (arg_b, arg_e) {
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
    //获取充什消费记录
    $scope.search = function(arg_type){

    };

    $timeout(function () {
        $('#begin_date').pickadate({
            min: "1900-01-01"
            //max: date
        });
        $('#end_date').pickadate({
            min: "1900-01-01",
            max: date
        });
        $("#begin_date").add("#end_date").change(function () {
            var btime = $("#begin_date").val();
            var etime = $("#end_date").val();
            if (dateCompare(etime, btime) < 0) {
                Alert("结束日期不能大于开始日期！");
                return;
            }
            $scope.getRecord(btime, etime);
        });
        $("#begin_date").val(date);
        $("#end_date").val(date);
        $scope.getMoney()
    }, 10);
}]);

