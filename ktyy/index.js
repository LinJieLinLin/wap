var ktyy = angular.module('ktyy', []);
ktyy.controller('ktyyCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.places = [];
    $scope.back = function () {
        location.href = "../home/index.html";
    };
    $scope.getPlace = function () {
        var d = {m: "sitequerybysiteid", UserID: "3ddff7b03eb1f6cf160d431584b83448", SiteID: "-1"};
        ajax(d, function (arg_data) {
            console.log(arg_data[0]);
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isArray(arg_data)) {
                alert("没有获取到数据！");
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
    }, 10);
    $scope.showRule = function (title,content) {
        if(!title||!content){
            return
        }
        show_dialog(title, content, function () {
            hide_dialog();
        });
    };
    $scope.select = function(sid){
        if(!sid){
            return
        }
        location.href = 'select.html?sid=' + sid;
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
    $scope.timeList = [];
    $scope.placeCur = 0;
    $scope.date = getDateStr();
    $scope.back = function () {
        location.href = "index.html";
    };
    $scope.getPlaceList = function () {
        var sid = $.getUrlParam("sid");
        if(!sid){
            return
        }
        var d = {m: "sitepointquerybysiteid", UserID: "3ddff7b03eb1f6cf160d431584b83448", SiteID: sid};
        ajax(d, function (arg_data) {
            console.log(arg_data);
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                alert("没有获取到数据！");
                return
            }
            $scope.$apply(
                function () {
                    $scope.places = [];
                    $scope.places = arg_data.SitePointList;
                    $scope.timeList = $scope.places[0].Times;
                });
        }, function (arg_err) {

        })
    };
    $timeout(function () {
        $('.select_date').pickadate({
            min: $scope.date,
        });
        $("#select_date").change(function () {
            date = $("#select_date").val();
            $scope.getPlaceList();
        });
        $("#select_date").change();
    }, 10);
    $scope.selectPlace = function(arg_index,arg_data){
        if(!arg_data){
            return
        }
        $scope.placeCur = arg_index;
        $scope.timeList = arg_data.Times;
    }

}]);