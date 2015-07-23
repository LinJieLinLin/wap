var wdzh = angular.module('wdzh', []);
wdzh.controller('wdzhCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.isOpen = {eat:false,wash:false};
    //$scope.isOpen = {eat:true,wash:true};
    //$scope.time = {eat:{sTime:"",eTime:""},wash:{sTime:"",eTime:""}};
    $scope.data = {eat:[],wash:[]};
    $scope.userInf = {};
    $scope.style = {};
    $scope.back = function () {
        location.href = "../home/index.html";
    };
    $scope.changeOpen = function(arg_type){
        if(!arg_type){
            return;
        }
        $scope.isOpen[arg_type] = !$scope.isOpen[arg_type];
        if(arg_type=="eat"&&$scope.isOpen[arg_type]){
            $("#begin_date").change();
        }else if(arg_type=="wash"&&$scope.isOpen[arg_type]){
            $("#begin_date1").change();
        }
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
    //获取充值消费记录
    $scope.searchRecord = function(arg_type,arg_b,arg_e){
        //$scope.time[arg_type].sTime = arg_b.replace(/-/g,".");
        //$scope.time[arg_type].eTime = arg_e.replace(/-/g,".");
        var m = "";
        if(arg_type=="eat"){
            m = "cardaccountquery";
        }else if (arg_type == "wash"){
            m = "laundryaccountquery";
        }
        var d = {m: m, UserID: "3ddff7b03eb1f6cf160d431584b83448", BeginDate: arg_b, EndDate: arg_e};
        ajax(d, function (arg_data) {
            console.log(arg_data);
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isArray(arg_data)) {
                Alert("没有获取到数据！");
                return
            }
            $scope.$apply(
                function () {
                    $scope.data[arg_type] = [];
                    $scope.data[arg_type] = arg_data;
                    var temL = $scope.data[arg_type].length
                    for(var i=0;i<temL;i++){
                        var dateTime = getDateStrByOne($scope.data[arg_type][i].FeeTime);
                        $scope.data[arg_type][i].M = dateTime.m;
                        $scope.data[arg_type][i].D = dateTime.d;
                    }
                });
        }, function (arg_err) {
            //console.log(arg_err);
            Alert(arg_err);
        })
    };
    $scope.search = function(arg_type){
        var btime = "";
        var etime = "";
        if(arg_type=="eat"){
            btime = $("#begin_date").val();
            etime = $("#end_date").val();
        }else if (arg_type == "wash"){
            btime = $("#begin_date1").val();
            etime = $("#end_date1").val();
        }

        if (dateCompare(etime, btime) < 0) {
            Alert("结束日期不能大于开始日期！");
            return;
        }
        $scope.searchRecord(arg_type,btime, etime);
    };

    $timeout(function () {
        $scope.style.textR = {width:win_w-102+"px"};
        console.log($scope.style.textR);
        $('#begin_date').pickadate({
            min: "1900-01-01"
            //max: date
        });
        $('#end_date').pickadate({
            min: "1900-01-01",
            max: date
        });
        $('#begin_date1').pickadate({
            min: "1900-01-01"
            //max: date
        });
        $('#end_date1').pickadate({
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
            $scope.searchRecord("eat",btime, etime);
        });
        $("#begin_date1").add("#end_date1").change(function () {
            var btime = $("#begin_date1").val();
            var etime = $("#end_date1").val();
            if (dateCompare(etime, btime) < 0) {
                Alert("结束日期不能大于开始日期！");
                return;
            }
            $scope.searchRecord("wash",btime, etime);
        });
        $("#begin_date").val(date);
        $("#end_date").val(date);
        $("#begin_date1").val(date);
        $("#end_date1").val(date);
        $scope.getMoney();
        $("#begin_date").change();

    }, 10);
}]);

