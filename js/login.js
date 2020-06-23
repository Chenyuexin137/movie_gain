// $(function () {
//     //首先判断是否有Cookie，记录登录if ($.cookie("chkRemember") == "true") {
//     $("#chkRemember").attr("checked", true);
//     var name = $.cookie("al_phone");
//     var pwd = $.cookie("al_pwd");
//     $("#phone").val($.cookie("al_phone"));
//     $("#pwd").val($.cookie("al_pwd"));
//     $.ajax({
//         type: "POST",
//         url: url,
//         dataType: "json",
//         data: {
//             "phone": $("#phone").val(),
//             "userpsw": $("#pwd").val()
//         },
//         cache: false,
//         async: false, //设置同步
//         success: function (data) {
//             window.location.href = "/main.html";
//         },
//         error: function (XMLHttpRequest, textStatus, errorThrown) {
//             alert(XMLHttpRequest.status);
//             alert("登陆失败，请重新登录！");
//         }
//     });

//     $("#phone").focus();

//     //按enter提交输入
//     document.onkeydown = function (e) {
//         var ev = document.all ? window.event : e;
//         if (ev.keyCode == 13) {
//             loginSubmit();
//         }
//     }
// });

// function ReloadCheckCode() {
//     var checkCode = document.getElementById("img_code");
//     var rand = Math.random();
//     checkCode.src = "/ValidateCode.aspx?randnum=" + rand;
// }

function loginSubmit() {
    var phone = $("#phone").val();
    var pwd = $("#pwd").val();
    // var code = $("#val").val();

    if (phone == "") {
        alert("请输入手机号!")
        // $("#msg").html("请输入手机号!")
        $("#phone").focus();
        return false;
    }
    if (pwd == "") {
        alert("请输入密码!")
        // $("#msg").html("请输入密码!")
        $("#pwd").focus();
        return false;
    }
    // if (code == "") {
    //     alert("请输入验证码！")
    //     // $("#msg").html("请输入验证码！!")
    //     $("#val").focus();
    //     return false;
    // }

    $.ajax({
        type: "POST",
        url: url,
        dataType: "json", //返回string格式数据
        cache: false,
        data: {
            "phone": phone,
            "userpwd": pwd
        },
        async: false, //设置同步
        success: function (data) {
            if (data == "0") {
                alert("您输入的用户名或密码有误!");
                // $("#msg").html("您输入的用户名或密码有误!")
                $("#phone").focus();
            }
            if (XMLHttpRequest.status == 200) {
                if ($("#chkRemember").attr("checked")) {
                    if (!($.cookie("chkRemember") == "true")) {
                        $.cookie("chkRemember", "true", {
                            expires: 30
                        }); // 存储一个带30天期限的 cookie
                        $.cookie("al_phone", phone, {
                            expires: 30
                        });
                        $.cookie("al_pwd", pwd, {
                            expires: 30
                        });
                        $.cookie("al_avatar_url", avatar_url, {
                            expires: 30
                        });
                        $.cookie("al_shop_id", shop_id, {
                            expires: 30
                        });
                        alert($.cookie("al_phone") + $.cookie("al_pwd"));
                    }
                } else {
                    if ($.cookie("chkRemember") == "true") {
                        $.cookie("chkRemember", "true", {
                            expires: -1
                        }); //清除
                        $.cookie("sp001_userName", phone, {
                            expires: -1
                        });
                        $.cookie("sp001_passWord", pwd, {
                            expires: -1
                        });
                        $.cookie("al_avatar_url", avatar_url, {
                            expires: -1
                        });
                        $.cookie("al_shop_id", shop_id, {
                            expires: -1
                        });
                    }
                }
                window.location.href = "/main.html";
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert("登陆失败，请重新登录！");
        }
    });
}