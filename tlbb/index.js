var tlbb = angular.module('tlbb', []);
tlbb.controller('tlbbCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.places = [];
    $scope.serviceLists = [];
    $scope.leftPic = {};
    $scope.rightPic = {};
    $scope.rightPic_item_h = {};
    $scope.item = {};
    $scope.back = function () {
        location.href = "../home/index.html";
    };

    $scope.getPlace = function () {
        var d = {m: "servicesitequerybysiteid", UserID: "3ddff7b03eb1f6cf160d431584b83448", SiteID: "-1"};
        ajax(d, function (arg_data) {
            //console.log(arg_data.length)
            console.log(arg_data[0]);
            //console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isArray(arg_data)) {
                Alert("没有获取到数据！");
                return
            }
            $scope.$apply(
                function () {
                    $scope.places = [];
                    $scope.places = arg_data;
                    $scope.getServerItem($scope.places[0].SiteID)
                });
        }, function (arg_err) {
            Alert(arg_err);
        })
    };
    $scope.getServerItem = function (arg_SiteID) {
        if (!arg_SiteID) {
            return;
        }
        var d = {
            m: "servicesitepersonporjectquerybysiteid",
            UserID: "3ddff7b03eb1f6cf160d431584b83448",
            SiteID: arg_SiteID
        };
        ajax(d, function (arg_data) {
            console.log(arg_data.length)
            console.log(arg_data[0]);
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isArray(arg_data)) {
                Alert("没有获取到数据！");
                return
            }
            $scope.$apply(
                function () {
                    $scope.serviceLists = [];
                    $scope.serviceLists = arg_data;
                });
        }, function (arg_err) {
            Alert(arg_err);
        })
    };
    $scope.goDetail = function (arg_date) {
        if (!arg_date) {
            return
        }
        localStorage.Service = angular.toJson(arg_date);
        location.href = "select.html?" + urlParam;
    };
    $timeout(function () {
        var w = (win_w - 30);
        var h = w * 0.4 * 1.42;
        $scope.leftPic['width'] = w * 0.4 + "px";
        $scope.leftPic['height'] = h + "px";
        $scope.rightPic['width'] = w * 0.6 + "px";
        $scope.rightPic['height'] = h + "px";
        $scope.rightPic["left"] = w * 0.4 + 10 + 'px';
        $scope.rightPic_item_h['height'] = (h - 6) / 2 + "px";

        var itemW = w / 2;
        $scope.item['width'] = itemW + "px";
        $scope.item['height'] = itemW + "px";
        $("#show_pic_r").width(win_w - 206 - 10 - 10 - 10);

        $scope.getPlace();
        localStorage.ktyyUrlParam = urlParam;
    }, 10);
    //$scope.info=function (arg_name) {
    //    var content = "";
    //    if(!arg_name){
    //        return;
    //    }else if(arg_name=="套餐介绍"){
    //        content = $scope.places[0]
    //    }else if(arg_name=="预约需知"){
    //
    //    }
    //    show_dialog(arg_name, content, function () {
    //        hide_dialog();
    //    });
    //};
    $(function () {
        $(".note").click(function () {
            var content = $("#note").html();
            show_dialog("预约需知", content, function () {
                hide_dialog();
            });
        });
        $(".note_img").click(function () {
            var content = $("#note").html();
            show_dialog("预约需知", content, function () {
                hide_dialog();
            });
        });
        $(".item").click(function () {
            location.href = "select.html";
        });

        $(".small").click(function () {
            location.href = "select.html";
        });
        $(".item").each(function (i, n) {
            //0开始
            $(n).removeClass("m_l_10");
            $(n).removeClass("m_r_10");
            {
                if (i % 2 == 0) {//第一个
                    $(n).addClass("m_r_10");
                } else {//第二个
                    $(n).addClass("m_l_10");
                }
            }
        });
        //上两个图标的宽度与图片一致
        var w1 = $(".item_name").parent().width();
        $(".item_name").width(w1);
        var content_w = win_w - 20;//内容宽度
        var item_w = (content_w - 20) / 2;
        $(".item").width(item_w);
        //下面图标的宽度与图片一致
        var w2 = $(".item_text").parent().width();
        $(".item_text").width(w2);

        //产品标签添位置处理
        $(".item_tag").each(function (i, n) {
            var img = $(n).next();
            var img_left = $(img).offset().left;
            var img_w = $(img).width();
            var tag_left = img_left + img_w - 21;
            $(n).css("left", tag_left + 'px');
        });
        $(".big_pic").click(function () {
            var content = $("#rule").html();
            show_dialog("套餐介绍", content, function () {
                hide_dialog();
            });
        });
    });
    $scope.toOrder = function () {
        location.href = "order.html?" + urlParam;
    };
    return;


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
}]);
tlbb.controller('tlbbSCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.userList = [];
    $scope.style = {};
    $scope.dateList = [];
    $scope.endDate = "";
    $scope.service = angular.fromJson(localStorage.Service);
    if (!$scope.service) {
        Alert("没有数据！");
        return;
    }
    $scope.back = function () {
        window.history.back();
    };
    $scope.getServerUserList = function () {
        var SppID = $scope.service.SppID;
        if (!SppID) {
            return
        }
        var d = {
            m: "servicesitepersonquerybysppid",
            UserID: "3ddff7b03eb1f6cf160d431584b83448",
            SppID: SppID,
            SiteID: 11
        };
        ajax(d, function (arg_data) {
            console.log(arg_data);
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                Alert("没有获取到数据！");
                return
            }
            $scope.$apply(
                function () {
                    $scope.userList = [];
                    $scope.userList = arg_data;
                });
        }, function (arg_err) {
            Alert(arg_err);
        })
    };
    $scope.openList = function (arg_index) {
        if ($scope.userList[arg_index].showTime) {
            $scope.userList[arg_index].showTime = false;
            return
        }
        $scope.getTimeList(arg_index);
    };
    $scope.changeDate = function (arg_d, arg_index) {
        var preDate = new Date(date);
        if (arg_d == -1 && date == getDateStr()) {
            return;
        }
        preDate.setDate(preDate.getDate() + arg_d);
        if(dateCompare(getDateStr(preDate),$scope.endDate)>0){
            return;
        }
        date = getDateStr(preDate);
        $("#d" + arg_index).val(date);
        $("#d" + arg_index).change();
    };
    $scope.getTimeList = function (arg_index) {
        if (!$scope.userList[arg_index] || $scope.userList[arg_index].SpID < 1) {
            return;
        }
        if (!$scope.userList[arg_index].selectDate) {
            $scope.userList[arg_index].selectDate = getDateStr();
            if (!$scope.dateList.length) {
                Alert("可选日期数据有误！");
                return;
            }
            $('.select_date').pickadate({
                disable: $scope.dateList
            });
            $("#d" + arg_index).change(function () {
                date = $("#d" + arg_index).val();
                $scope.getTimeList(arg_index);
            });
            $("#d" + arg_index).val(date);
            $("#d" + arg_index).change();
        }

        var d = {
            m: "servicesitepersontimequerybyspid",
            UserID: "3ddff7b03eb1f6cf160d431584b83448",
            SpID: $scope.userList[arg_index].SpID
        };
        ajax(d, function (arg_data) {
            console.log(arg_data);
            console.log(angular.toJson(arg_data));
            if (!arg_data || !angular.isObject(arg_data)) {
                Alert("没有获取到数据！");
                alert("没有获取到数据！");
                return
            }
            $scope.$apply(function () {
                if (!arg_data.SitePersonTimeList) {
                    $scope.userList[arg_index].userDate = [];
                }
                $scope.userList[arg_index].userDate = [];
                $scope.userList[arg_index].showTime = true;
                var temL = arg_data.SitePersonTimeList.length;
                for (var i = 0; i < temL; i++) {
                    if (arg_data.SitePersonTimeList[i].Date == date) {
                        $scope.userList[arg_index].userDate = arg_data.SitePersonTimeList[i];
                        console.log($scope.userList[arg_index].userDate);
                        break;
                    }
                }
            });
        }, function (arg_err) {
            Alert(arg_err);
        })
    };
    $scope.openWin = function (arg_data, art_time) {
        if (!arg_data) {
            return;
        }
        console.log(arg_data);
        var content = '<div style="font-size:11px;">' +
            '<div style="margin: 12px 0 15px 0;">以下为您的预约信息，请确认</div>' +
            '<div class="m_b_12">预约套餐：<span class="spName">' + $scope.service.SppName + '</span></div>' +
            '<div class="m_b_12">预约服务员：<span class="spPreson">' + arg_data.SpName + '</span></div>' +
            '<div class="m_b_12"> 预约日期：<span class="spOrderDate">' + date + '</span></div>' +
            ' <div class="m_b_12">预约时间：<span class="spOrderTime">' + art_time.TimeText + '</span></div>' +
            '</div>';
        show_dialog("预约确认", content, function () {
            hide_dialog();
        }, '确认', function () {
            var d = {
                m: "servicesiteordersubmit",
                UserID: "3ddff7b03eb1f6cf160d431584b83448",
                SiteID: 11,
                SppID: $scope.service.SppID,
                SpID: arg_data.SpID,
                SoDate: date,
                SoBeginTime: art_time.BTime,
                SoEndTime: art_time.BTime + 100,
                Date: getDateTimeStr()
            };
            ajax(d, function (arg_data) {
                console.log(arg_data);
                console.log(angular.toJson(arg_data));
                if (!arg_data || !angular.isObject(arg_data)) {
                    Alert("没有获取到数据！");
                    alert("没有获取到数据！");
                    return
                }
                alert(arg_data.Msg)

                if (arg_data.Id == 1) {
                    location.href = 'order.html?' + urlParam;
                    hide_dialog();
                } else {
                    Alert(arg_data.Msg)
                }
            });
            //生成订单本地数据


        }, '返回', function () {
            hide_dialog();
        });
    };

    $scope.getDateList = function () {
        ajax({m: 'foodorderrulequery', UserID: "3ddff7b03eb1f6cf160d431584b83448"}, function (arg_data) {
            console.log('foodorderrulequery:');
            console.log(arg_data);
            utils.setParam("foodorderrulequery", JSON.stringify(arg_data));
            $scope.$apply(function () {
                $scope.dateList = JSON.parse(arg_data.CanOrderDates);//获取可预订的日期
                var temD = $scope.dateList[$scope.dateList.length-1];
                if(temD.length!=3){
                    Alert("获取日期出错！");
                    return;
                }
                $scope.endDate = temD[0]+"-"+(temD[1]+1)+"-"+(temD[2]+1);
            });
        }, function (arg_data) {
            Alert("请求超时")
        });
    };
    $timeout(function () {
        var w = win_w - 41;
        $scope.style.user_info_pic = {width: w * 0.4 + "px", height: w * 0.4 * 1.4 + "px"};
        $scope.style.user_info_text = {width: w * 0.6 + "px", height: w * 0.4 * 1.4 + "px"};
        $scope.getDateList();
        $scope.getServerUserList();

        //$("#select_date").change(function () {
        //    date = $("#select_date").val();
        //    $scope.getPlaceList();
        //});
        //$("#select_date").val(date);
        //$("#select_date").change();
    }, 10);

    $(function () {
        //var pic_w = $(".user_info_pic").width();
        //var des_w = $(".user_info_des").width();
        //var w = (win_w - pic_w - des_w) / 3;
        //$(".user_info_pic").css("padding-left", w);
        //$(".user_info_pic").css("padding-right", w);
        //$(".user_info_des").css("padding-right", w);
        //$(".user_title_pl").width(w);
        //$(".user_title_pr").width(w);

        //$(".time").width(((win_w - 50) / 3) - 22);
        //
        ////var time_w = $(".time").width() + 2 + (2 * 10);;//本身宽度+边框+左右外边距
        ////var times_pl = ((win_w- (time_w * 3)) / 2);//窗口宽度-3个时间宽度
        //$(".times_text").css("padding-left", (25 + 11) + 'px');//预订时间位置
        //
        //$(".show_hide").click(function () {
        //    var spid = $(this).attr("spid");
        //    //$(".select").hide();
        //    //$(".show_hide").attr("src","../images/down01.png");
        //    var $select = $(".select" + spid);
        //    if ($select.is(":hidden")) {
        //        $select.show();
        //        $(this).attr("src", "../images/up01.png");
        //    } else {
        //        $select.hide();
        //        $(this).attr("src", "../images/down01.png");
        //    }
        //});

        //$(".time").click(function () {
        //    if ($(this).hasClass("time_2")) {
        //        return;
        //    }
        //    //if ($(this).hasClass("time_0")) {
        //    //    $(this).removeClass("time_0");
        //    //    $(this).addClass("time_1");
        //    //} else {
        //    //    $(this).removeClass("time_1");
        //    //    $(this).addClass("time_0");
        //    //}
        //    var content = $("#post_check").html();
        //    show_dialog("预约确认", content, function () {
        //        hide_dialog();
        //    }, '确认', function () {
        //        location.href = 'order.html';
        //        hide_dialog();
        //    }, '返回', function () {
        //        hide_dialog();
        //    });
        //
        //});
    });
}]);
tlbb.controller('tlbbOCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.orders = [];
    $scope.style = {};
    $scope.getOrder = function (arg_b, arg_e) {
        var d = {
            m: "servicesiteorderquerybyuserid",
            UserID: "3ddff7b03eb1f6cf160d431584b83448",
            BeginDate: arg_b,
            EndDate: arg_e
        };
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
                    var temL = arg_data.length;
                    for (var i = 0; i < temL; i++) {
                        $scope.orders[i].DateNew = $scope.orders[i].Date.split(" ")[0] + "，" + getWeekStr($scope.orders[i].Date)
                    }
                });
        }, function (arg_err) {
            //console.log(arg_err);
            Alert(arg_err);
        })
    };
    $scope.back = function () {
        //location.href = "index.html?" + localStorage.ktyyUrlParam;
        window.history.back();
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

        var obW = (win_w - 55);
        $scope.style.order_img = {width: obW / 3 + "px", height: obW / 3 * 1.4 + "px"};
        $scope.style.order_text = {width: obW / 3 * 2 + "px", height: obW / 3 * 1.4 + "px"};
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
