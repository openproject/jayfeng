$(function() {
    var ieAdjust = function() {
        var winWidth = $(window).width();
        if (parseInt(winWidth) < 1440) {
            mbsrc = './img/bg1_s.jpg';
            pcsrc = './img/bg1_s.jpg';
            $('.bncont').css("width", "945px");
            // $('.pcqqbg a').css({'margin':'40px 16px;'});
        } else {
            mbsrc = './img/bg1_s.jpg';
            pcsrc = './img/bg1_s.jpg';
            $('.bncont').css("width", "1109px");
        }
        $('.pcqqbg').css({
            "filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + pcsrc + ",sizingMethod='scale')"
        });
        $('.mbqqbg').css({
            "filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + mbsrc + ",sizingMethod='scale')"
        });
    }
    ieAdjust();

    $.stellar({
        horizontalScrolling: false,
        verticalOffset: 40
    });

    var cookie = {
        get: function(n) {
            var m = document.cookie.match(new RegExp("(^| )" + n + "=([^;]*)(;|$)"));
            return !m ? "" : decodeURIComponent(m[2])
        },
        set: function(name, value, domain, path, hour) {
            var expire = new Date();
            expire.setTime(expire.getTime() + (hour ? 3600000 * hour : 30 * 24 * 60 * 60 * 1000));
            document.cookie = name + "=" + value + "; expires=" + expire.toGMTString() + "; path=" + (path ? path : "/") + "; " + (domain ? ("domain=" + domain + ";") : "")
        },
        del: function(name, domain, path) {
            document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (path ? path : "/") + "; " + (domain ? ("domain=" + domain + ";") : "")
        },
        uin: function() {
            var u = cookie.get("uin");
            return !u ? null  : parseInt(u.substring(1, u.length), 10)
        }
    };
    var htmlEncodeDict = {
        '"': "#34",
        "<": "#60",
        ">": "#62",
        "&": "#38",
        " ": "#160"
    };
    var encodeHtml = function(s) {
        s += "";
        return s.replace(/["<>& ]/g, function(all) {
            return "&" + htmlEncodeDict[all] + ";"
        })
    };

    function str2JSON(str) {
        eval("var __pt_json=" + str);
        return __pt_json
    }

    var mod = $(".qfigure");
    var $body = $("body");
    var dataArr = [];
    $(mod).each(function(i, item) {
        if (i === 0) {
            dataArr[i] = $(item).offset().top - Math.floor($(item).height() / 2) - 500
        } else {
            dataArr[i] = $(item).offset().top - Math.floor($(item).height() / 2)
        }
    });
    var winHeight = $(window).height();
    var bodyheight = $body.height();
    $(".crossbanenr").animate({
        height: (winHeight - 130) > 560 ? (winHeight - 130) : 560
    }, 100, function() {}
    );
    $(window).resize(function() {
        winHeight = $(window).height();
        bodyheight = $body.height();
        $(".crossbanenr").animate({
            height: (winHeight - 130) > 560 ? (winHeight - 130) : 560
        }, 100, function() {}
        );
        ieAdjust();
    }
    );
    var isIE = !!window.ActiveXObject;
    var scrollTop = $(window).scrollTop();
    var clientHeight = $(window).height();
    var contentHeight = 584;
    var barHeight = 600;
    var firstHeight = 778;
    var topHeight = 321;
    var thirdScroll = clientHeight < (topHeight + firstHeight) ? contentHeight : (contentHeight - clientHeight + topHeight + firstHeight);
    var fourthScroll = thirdScroll + contentHeight + barHeight;
    var fifthScroll = fourthScroll + contentHeight + barHeight;
    var sixthScroll = fifthScroll + contentHeight + barHeight;
    var changeH = (firstHeight + topHeight - clientHeight) / 2;
    var st = new Date().getTime();
    $(window).scroll(function(e) {
        scrollTop = $(window).scrollTop();
        if (scrollTop >= firstHeight) {
            $("#topbar").addClass("topicfixed")
        } else {
            if ($("#topbar").hasClass("topicfixed")) {
                $("#topbar").removeClass("topicfixed")
            }
        }
        if (scrollTop < 100) {
            $body.attr("id", "pg0")
        }
        $(dataArr).each(function(i, item) {
            if (Math.floor(winHeight / 2) + scrollTop >= item) {
                $body.attr("id", "pg" + (i + 1))
            }
        });
        if (scrollTop + winHeight >= bodyheight) {
            $body.attr("id", "pg3")
        }
    });

    // 二维码
    $('#qrcode').hover(function(){
        $('#qrlayer').show();
    }, function(){
        $('#qrlayer').hide();
    });

    // 到达顶部
    $('.js_gotop').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 500);  // 兼容
    })

});
