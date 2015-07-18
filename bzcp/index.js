/**
 * Created by LinLin on 2015/7/16.
 */
var bzcp = angular.module('bzcp', []);
bzcp.controller('bzcpCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.menuName = "大厅早餐精美套餐菜";
    $scope.cur = 0;
    $scope.menuLists = [];
    $scope.menuList = {};
    $scope.date = getDateStr();
    $scope.checkWidth = function () {
        var banWidth = win_w-41;
        $(".banner").width((banWidth));
        $(".banner_w").width((banWidth-3) / 3);
    };

    $scope.selectBan = function (arg_data) {
        $scope.cur = arg_data;
        if (arg_data == 0) {
            $scope.menuName = "大厅早餐精美套餐菜";
            if ($scope.menuLists[arg_data].FmClassName == "早餐") {
                $scope.menuList = $scope.menuLists[arg_data];
            } else {
                for (var i = 0; i < 3; i++) {
                    if ($scope.menuLists[i].FmClassName == "早餐") {
                        $scope.menuList = $scope.menuLists[0];
                        break;
                    }
                }
            }
        } else if (arg_data == 1) {
            $scope.menuName = "大厅午餐精美套餐菜";
            if ($scope.menuLists[arg_data].FmClassName == "午餐") {
                $scope.menuList = $scope.menuLists[arg_data];
            } else {
                for (var i = 0; i < 3; i++) {
                    if ($scope.menuLists[i].FmClassName == "午餐") {
                        $scope.menuList = $scope.menuLists[0];
                        break;
                    }
                }
            }
        } else if (arg_data == 2) {
            $scope.menuName = "大厅晚餐精美套餐菜";
            if ($scope.menuLists[arg_data].FmClassName == "晚餐") {
                $scope.menuList = $scope.menuLists[arg_data];
            } else {
                for (var i = 0; i < 3; i++) {
                    if ($scope.menuLists[i].FmClassName == "晚餐") {
                        $scope.menuList = $scope.menuLists[0];
                        break;
                    }
                }
            }
        }
    };
    $scope.getData = function () {
        var d = {m: "getfoodmenubydate", UserID: "3ddff7b03eb1f6cf160d431584b83448"};
        ajax(d, function (arg_data) {
            if (!arg_data || !angular.isArray(arg_data)) {
                alert("没有获取到数据！");
                return
            }
            $scope.$apply(
                function () {
                    var temL = arg_data.length;
                    $scope.menuLists = [];
                    $scope.menuList = {};
                    $scope.menuLists = arg_data;
                    for (var i = 0; i < temL; i++) {
                        if ($scope.menuLists[i].FmClassName == "早餐") {
                            $scope.menuList = $scope.menuLists[0];
                            break;
                        }
                    }
                }
            );
        }, function (arg_err) {
            console.log(arg_err);
            alert(arg_err);
        })
    };
    $timeout(function () {
        $('.select_date').pickadate({
            min: "1900-01-01",
            max: $scope.date
        });
        $("#select_date").change(function () {
            date = $("#select_date").val();
            $scope.getData();
        });
        $("#select_date").change();
        $scope.checkWidth();
    }, 10);
    $scope.back = function () {
        location.href = "../home/index.html";
    }
}]);

