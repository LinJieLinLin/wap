//窗口宽度
var win_w;
//窗口高度
var win_h;
//网页宽度
var doc_w;
//网页高度
var doc_h;
//参数内容
var urlParam = "";
//PortalLinkID
var plid;
//公司ID
var companyid = "";
//用户ID
var userid = "";
//微信平台ID
var portalno = "";
//日期(默认当天)
var date = "";
//当天
var today = "";
//数据请求地址
var ajaxUrl = "";
//var ajaxUrl = "http://115.29.179.99:7777/service/Handler.ashx?jsoncallback=?";
//获取请求路径中指定参数的值
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        if (window.location.search.indexOf('@') > -1) {
            reg = new RegExp("(^|@)" + name + "=([^@]*)(@|$)");
        }
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
})(jQuery);
//页面初始化
$(function () {
    //console.log("public-function");
    win_w = $(window).width();
    win_h = $(window).height();
    doc_w = $(document).width();
    doc_h = $(document).height();
    urlParam = window.location.search.substr(1);

    plid = $.getUrlParam("plid");
    companyid = $.getUrlParam("companyid");
    userid = $.getUrlParam("userid");
    portalno = $.getUrlParam("portalno");
    if (portalno == null) {
        portalno = $.getUrlParam("PortalNo");
    }
    date = getDateStr();
    today = getDateStr();
    //页面添加加载的隐藏div
    var $dh = $("#divLoading");
    if ($.dh == null) {
        $("body").append('<img id="divLoading" src="../images/loading.gif" style="display: none;width: 70px; height: 70px;background-color:#e1e1e1;" />');
    }
    if (window.localStorage) {
        //alert('This browser supports localStorage');
    } else {
        //alert('This browser does NOT support localStorage');
    }
})
utils = {
    setParam: function (name, value) {
        localStorage.setItem(name, value)
    },
    getParam: function (name) {
        return localStorage.getItem(name)
    }
}
//是微信浏览器
function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
//替换参数
function replaceParam(params, name, value) {
    var res = '';
    if (params.indexOf(name + '=') == -1) {
        return params + "&" + name + "=" + value;
    }
    var arr = params.split('&');
    for (i = 0; i < arr.length; i++) {
        if (arr[i].indexOf(name + '=') > -1) {
            arr[i] = name + "=" + value;
        }
        res += "&" + arr[i];
    }
    return res;
}

//给页面a标签添加服务器传来的参数
//参数为空时给所有的a链接添加
function linkAddParam(links) {
    var link = links || $("a[href]");
    var isALink = 1;
    for (var i = 0; i < link.length; i++) {
        var href = '';
        try {
            href = $(link[i]).attr("href");
        } catch (ex) {
            href = links;
            isALink = 0;
        }
        var an = "?";
        if (href.indexOf("?") > 0) {
            if (urlParam.indexOf("&") > -1) {
                an = "&";
            }
            if (urlParam.indexOf("@") > -1) {
                an = "@";
            }
        }
        if (isALink == 1) {
            $(link[i]).attr("href", href + an + urlParam);
        } else {
            return href + an + urlParam;
        }
    }
}
//回到页面顶部
function goTop() {
    $('body,html').animate({ scrollTop: 0 }, 1000);
    return false;
}
//获取图片的原始大小
function getImgSize(Img) {
    var img = new Image();
    img.src = Img.src;
    return {
        width: img.width,
        height: img.height
    };
}
//按比例处理图片高度
function autoImgH(src_w, src_h, new_w) {
    var height = (new_w * src_h) / src_w; //高度等比缩放 
    return height;
}
//获取时间字符串：yyyyMMddHHmmss
function getTimeStr() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    if (month < 10) month = '0' + month;
    var day = now.getDate();
    if (day < 10) day = '0' + day;
    var hour = now.getHours();
    if (hour < 10) hour = '0' + hour;
    var minute = now.getMinutes();
    if (minute < 10) minute = '0' + minute;
    var second = now.getSeconds();
    if (second < 10) second = '0' + second;
    return year + month + day + hour + minute + second;
}
//获取时间戳
function getTimestamp() {
    return new Date().getTime();
}
//获得日期字符串：yyyy-MM-dd
function getDateStr() {
    var date = new Date();
    var yyyy = date.getFullYear();
    var MM = date.getMonth() + 1;
    var dd = date.getDate();
    if (MM < 10) MM = '0' + MM
    if (dd < 10) dd = '0' + dd;
    return yyyy + "-" + MM + "-" + dd;
}
//
function getDateStrByDate (arg_d) {
    var date = arg_d;
    var yyyy = date.getFullYear();
    var MM = date.getMonth() + 1;
    var dd = date.getDate();
    if (MM < 10) MM = '0' + MM
    if (dd < 10) dd = '0' + dd;
    return yyyy + "-" + MM + "-" + dd;
}
//获得日期字符串：yyyy-MM-dd 00:00:00
function getDateTimeStr() {
    var date = new Date();
    var yyyy = date.getFullYear();
    var MM = date.getMonth() + 1;
    var dd = date.getDate();
    if (MM < 10) MM = '0' + MM
    if (dd < 10) dd = '0' + dd;
    var hour = date.getHours();
    if (hour < 10) hour = '0' + hour;
    var minute = date.getMinutes();
    if (minute < 10) minute = '0' + minute;
    var second = date.getSeconds();
    if (second < 10) second = '0' + second;
    return yyyy + "-" + MM + "-" + dd+" "+hour+":"+minute+":"+second;
}
//获取时分,返回12.30形式
function getDateHourMStr() {
    var date = new Date();
    var hour = date.getHours();
    if (hour < 10) hour = '0' + hour;
    var minute = date.getMinutes();
    if (minute < 10) minute = '0' + minute;
    return hour+"."+minute
}
//获取星期几
function getWeekStr() {
    var date = new Date();
    var dayNames = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
    return dayNames[date.getDay()];
}
//日期对比
function dateCompare(date1, date2) {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    return (Date.parse(d1) - Date.parse(d2));
}

//显示灰色背景框
function show_gray_bg() {
    var gray_bg = $("#gray_bg");
    //onclick="hide_gray_bg()"
    var div_html = '<div id="gray_bg"  style="position:fixed;filter:alpha(opacity=50); top:0px; left:0px; opacity:0.5;-moz-opacity:0.5; background:#666;  z-index:200; width:' + doc_w + 'px; height:' + doc_h + 'px">&nbsp;</div>'
    $("#gray_bg").remove();
    $('body').append(div_html);
}
//关闭灰色背景框
function hide_gray_bg() {
    $("#gray_bg").remove();
}
//弹出提示框
//Msg:信息
//Time:显示时间
function Alert(msg, Time) {
    if (Time == null || Time == undefined || Time == "") { Time = 1000; }
    var ele = '<div style="text-align:center;max-width:90%;position:fixed;background-color:rgba(0, 0, 0, 0.60);z-index:999999999;color:#fff;font-size:16px;padding:10px;border-radius:5px;word-wrap: break-word;word-break: normal;" class="divHint">' + msg + '</div>';
    $(".divHint").remove();
    $("body").append(ele);
    var $dh = $(".divHint");
    var h = $dh.height();
    var w = $dh.width();
    $dh.css("top", (win_h - h) / 2 + "px").css("left", (win_w - w) / 2 - 10 + "px");
    //显示Time时间后，再2秒内淡出
    setTimeout(function () {
        $(".divHint").animate(
            { opacity: 0 },
            2000,
            function () {
                $(".divHint").remove();
            });
    }, Time);
}
//对话框
//标题、显示的内容，点击右上角关闭按钮事件、按钮1文字、按钮1点击事件、按钮2文字、按钮2点击事件
function show_dialog(title, content, close, btn1, btn1Event, btn2, btn2Event) {
    show_gray_bg();
    $("#alert_dialog").remove();
    var dialog = '<div id="alert_dialog" style="position:fixed; width:80%; z-index:300;left:0px; top:0px; ">'
    dialog = dialog + '<div class="dialog_close">X</div><div class="dialog_title"></div>'
    dialog = dialog + '<div class="dialog_content">'
    dialog = dialog + '<div class="dialog_text"></div>'
    dialog = dialog + '<div style="clear:both"></div>'
    if (!(btn1 == undefined || btn1 == null && btn2 == undefined || btn2 == null)) {
        dialog = dialog + '<div class="dialog_buttons">'
        if (btn1 != undefined && btn1 != null) {
            dialog = dialog + '<div class="dialog_button dialog_btn1"></div>'
        }
        if (btn2 != null) {
            dialog = dialog + '<div class="dialog_button dialog_btn2 dialog_button0"></div>'
        }
        dialog = dialog + '</div>'
        dialog = dialog + '<div style="clear:both"></div>'
    }
    dialog = dialog + '</div>'
    dialog = dialog + '<div class="dialog_bottom"> &nbsp;</div>'
    dialog = dialog + '</div>';

    $('body').append(dialog);//添加层

    $(".dialog_title").html(title);
    $(".dialog_text").html(content);

    if ($("#alert_dialog").height() + 100 > win_h) {
        $(".dialog_content").height(win_h - 100);
    }

    if (close != undefined && close != null) {
        $(".dialog_close").show();
        $(".dialog_close").click(close);
    }
    if (btn1 != undefined && btn1 != null) {
        $(".dialog_btn1").text(btn1);
    }
    if (btn2 != undefined && btn2 != null) {
        $(".dialog_btn2").text(btn2);
    }
    if (btn1Event != undefined && btn1Event != null) {
        $(".dialog_btn1").click(btn1Event);
    }
    if (btn2Event != undefined && btn2Event != null) {
        $(".dialog_btn2").click(btn2Event);
    }

    var d_w = $("#alert_dialog").width();
    var d_h = $("#alert_dialog").height();
    var d_left = (win_w - d_w) / 2;
    var d_top = (win_h - d_h) / 2;
    $("#alert_dialog").css("left", d_left + 'px');
    $("#alert_dialog").css("top", d_top + 'px');

    var c_w = $(".dialog_close").width();
    var c_h = $(".dialog_close").height();

    var c_top = (40 - c_h) / 2;//标题高度为40
    var c_left = d_w - c_w - c_top; //-c_top是关闭按钮右边距与上边距一样
    $(".dialog_close").css("left", c_left + 'px');
    $(".dialog_close").css("top", c_top + 'px');
}
//隐藏提示框
function hide_dialog() {
    $("#alert_dialog").remove();
    hide_gray_bg();
}
//显示加载图片
function show_loading() {
    var $dh = $("#divLoading");
    $dh.css({
        "border-radius": "100%",
        "border": "none",
        "z-index": "1000",
        "opacity": "0.8",
        "position": "fixed",
        "top": (win_h - $dh.height()) / 2 + "px",
        "left": (win_w - $dh.width()) / 2 + "px"
    });
    $("#divLoading").show();
}
//关闭加载图片
function hide_loading() {
    $("#divLoading").hide();
}
//ajax请求
//data:Json类型的参数
//onSuccess:请求成功后执行的函数
//onError:请求失败后执行的函数
function ajax(data, onSuccess, onError) {
    if (plid != null) {
        data.plid = plid;
    }
    if (companyid != null) {
        data.companyid = companyid;
    }
    if (userid != null) {
        data.userid = userid;
    }
    if (portalno != null) {
        data.portalno = portalno;
    }
    if(!data.Date){
        data.date = date;
    }
    if (ajaxUrl == "") {
        show_loading();
        jQuery.getJSON("http://115.29.179.99:7777/service/Handler.ashx?jsoncallback=?&m=getdataurlbyplid&plid=" + plid,
        function (res, textStatus, jqXHR) {
            ajaxUrl = res;
            hide_dialog();
            ajax(data, onSuccess, onError);
        });
    }
    else {
        show_loading();
        //console.log("ajaxUrl:" + ajaxUrl);
        console.log("ajaxUrl:" + ajaxUrl+"\ndata:" + JSON.stringify(data));
        $.ajax({
            url: ajaxUrl,
            timeout: 7000,
            dataType: "jsonp",
            data: data,
            success: function (result) {
                hide_loading();
                //console.log(JSON.stringify(result));
                onSuccess(result);
            },
            error: function (result) {
                hide_loading();
                //console.log(JSON.stringify(result));
                onError(result);
            },
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {
                    Alert("请求超时");
                }
            }
        });
    }
}

