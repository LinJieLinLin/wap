var xxyj = angular.module('xxyj', []);
xxyj.controller('xxyjCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.listWtCur = 0;
    $scope.listWts = [];
    $scope.listGoods = {};
    $scope.leftPic = {};
    $scope.rightPic = {};
    $scope.item = {};
    $scope.listPic = 1;
    $scope.back = function () {
        location.href = "../home/index.html";
    };
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
            alert(arg_err);
        })
    };
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
    $scope.goDetail = function(arg_date){
        if(!arg_date){
            return
        }
        localStorage.goodsData = angular.toJson(arg_date);
        location.href = "detail.html";
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
    console.log(localStorage.goodsData)
    $scope.back = function () {
        window.history.back();
    };

}]);