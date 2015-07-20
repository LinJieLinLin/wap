
var wdzh = angular.module('wdzh', []);
wdzh.controller('wdzhCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.back = function () {
        location.href = "../home/index.html";
    }
    //例子
    $scope.getPlace = function () {
        var d = {m: "traninfoquery", UserID: "3ddff7b03eb1f6cf160d431584b83448", BeginDate: "2015-07-10",EndDate:"2015-07-20"};
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
}]);

