function addPage(e, c, b) {
    var f, a = c.turn("pages");
    var d = $("<div />", {});
    if (c.turn("addPage", d, e)) {
        d.html('<div class="gradient"></div><div class="loader"></div>');
        loadPage(e, d, b + "?" + (Math.floor(Math.random() * 100) + 1));
        loadThumbnailIdx(e - 2)
    }
}

function loadPage(d, c, b) {
    var a = $("<img onerror=\"this.src='" + CONTEXT_PATH + "img/noimage@3x.png'\"/>");
    a.mousedown(function(f) {
        f.preventDefault()
    });
    a.load(function() {
        $(this).css({
            maxWidth: "100%",
            maxHeight: "100%",
            height: "100%",
            width: "100%"
        });
        $(this).appendTo(c);
        c.find(".loader").remove()
    });
    a.attr("src", b)
}

function zoomTo(a) {
    setTimeout(function() {
        if ($(".magazine-viewport").data().regionClicked) {
            $(".magazine-viewport").data().regionClicked = false
        } else {
            if (Ebook.IsZoom == false) {
                Ebook.IsZoom = true;
                if (status == 0) {
                    status = 1;
                    $(".magazine-viewport").zoom("zoomIn", a);
                    bookmark_all_hidden_function();
                    _zoom_event = a
                } else {
                    status = 0;
                    $(".magazine-viewport").zoom("zoomOut");
                    _zoom_event = null
                }
            }
        }
    }, 1)
}

function loadLargePage(f, d) {
    var a = $("<img />");
    a.load(function() {
        var g = d.find("img");
        $(this).css({
            width: "100%",
            height: "100%"
        });
        $(this).appendTo(d);
        g.remove()
    });
    var e = $(".page-" + f).attr("rel");
    var c = e.substring(0, e.lastIndexOf("/") + 1);
    var b = e.substring(e.lastIndexOf("/") + 2, e.length);
    b = b.substring(0, b.lastIndexOf("."));
    c = c + "" + b;
    a.attr("src", c + ".jpg?" + (Math.floor(Math.random() * 100000) + 1))
}

function loadMediumPage(f, d) {
    var a = $("<img />");
    a.load(function() {
        var g = d.find("img");
        $(this).css({
            width: "100%",
            height: "100%"
        });
        $(this).appendTo(d);
        g.remove()
    });
    var e = $(".page-" + f).attr("rel");
    var c = e.substring(0, e.lastIndexOf("/") + 1);
    var b = e.substring(e.lastIndexOf("/") + 2, e.length);
    b = b.substring(0, b.lastIndexOf("."));
    c = c + "m" + b;
    a.attr("src", c + ".jpg?" + (Math.floor(Math.random() * 100000) + 1))
}

function loadSmallPage(d, b) {
    var a = b.find("img");
    a.css({
        width: "100%",
        height: "100%"
    });
    a.unbind("load");
    var c = $(".page-" + d).attr("rel");
    a.attr("src", c + "?" + (Math.floor(Math.random() * 100000) + 1))
}

function isChrome() {
    return navigator.userAgent.indexOf("Chrome") != -1
}

function resizeViewport() {
    var b = $(".main_contents_wrapper").width();
    var c = $(".main_contents_wrapper").css("padding-top");
    c = Number(c.replace("px", ""));
    var f = $(".main_contents_wrapper").css("padding-bottom");
    f = Number(f.replace("px", ""));
    var i = $(window).height() - $(".top_nav_wrapper").height() - c - f;
    var j = $(".magazine").turn("options");
    $(".magazine").removeClass("animated");
    $(".magazine-viewport").css({
        width: b,
        height: i
    }).zoom("resize");
    if ($(".magazine").turn("zoom") == 1) {
        var d = calculateBound({
            width: j.width,
            height: j.height,
            boundWidth: Math.min(j.width, b),
            boundHeight: Math.min(j.height, i)
        });
        if (d.width % 2 !== 0) {
            d.width -= 1
        }
        if (d.width != $(".magazine").width() || d.height != $(".magazine").height()) {
            $(".magazine").turn("size", d.width, d.height);
            if ($(".magazine").turn("page") == 1) {
                $(".magazine").turn("peel", "br")
            }
        }
        $(".magazine").css({
            top: -d.height / 2 - (Math.round(($(".main_contents_wrapper").height() - $(".magazine").height()) / 2) - 2),
            left: -d.width / 2
        });
        var h = d.width - 21;
        $(".bottom_nav").css({
            maxWidth: h
        });
        thumb_w = $(".thumbnails ul li.d").width();
        $(".thumbnails ul").css("width", ((parseInt($(".thumbnails ul li.d").length)) * ((thumb_w * 2) + 20)))
    }
    var e = $(".magazine").offset(),
        g = i - e.top - $(".magazine").height(),
        a = (g - $(".thumbnails > div").height()) / 2;
    if (a < 0) {} else {}
    $(".thumbnails > div").addClass("dragscroll");
    dragscroll.reset();
    if (e.top < $(".made").height()) {
        $(".made").hide()
    } else {
        $(".made").show()
    }
    $(".magazine").addClass("animated");
    Link.resizeEbookLink();
    device_width = window.innerWidth;
    device_height = window.innerHeight;
    nav_main_switch_function();
    if (display == "double") {
        bookmark_all_function()
    } else {
        bookmark_one_function()
    }
}
var doitViewport;
$(window).resize(function() {
    clearTimeout(doitViewport);
    doitViewport = setTimeout(resizeViewport, 100)
}).bind("orientationchange", function() {
    clearTimeout(doitViewport);
    doitViewport = setTimeout(resizeViewport, 100)
});
var thumb_date = 1;
$(".thumbnails_button").click(function() {
    if ($(".thumbnails_button").hasClass("active")) {
        $(this).removeClass("active");
        $(".thumbnails").stop().animate({
            bottom: -270
        })
    } else {
        $(this).addClass("active");
        $(".thumbnails").stop().animate({
            bottom: 0
        })
    }
});

function largeMagazineWidth() {
    if (display == "single") {
        return 5424 / 2
    } else {
        return 5424
    }
}

function mediumMagazineWidth() {
    if (display == "single") {
        return 2376 / 2
    } else {
        return 2376
    }
}

function decodeParams(b) {
    var e = b.split("&"),
        f, c = {};
    for (var a = 0; a < e.length; a++) {
        f = e[a].split("=");
        c[decodeURIComponent(f[0])] = decodeURIComponent(f[1])
    }
    return c
}

function calculateBound(c) {
    var b = {
        width: c.width,
        height: c.height
    };
    if (b.width > c.boundWidth || b.height > c.boundHeight) {
        var a = b.width / b.height;
        if (c.boundWidth / a > c.boundHeight && c.boundHeight * a <= c.boundWidth) {
            b.width = Math.round(c.boundHeight * a);
            b.height = c.boundHeight
        } else {
            b.width = c.boundWidth;
            b.height = Math.round(c.boundWidth / a)
        }
    }
    return b
};