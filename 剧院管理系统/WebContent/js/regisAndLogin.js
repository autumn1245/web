
var printArr=new Array();//打印错误
var errElement=document.querySelectorAll(".errPrint");
var checkFlag=[0,0,0];//注册判断，前端正则验证时要用
var invitation=document.getElementById("invitation");//验证码提示错误框
var verification=document.getElementById("verification");//邀请码提示错误框
printArr=[
    "",
    "用户名由数字或字母或下划线组成的6到20位的字符串",
    "密码为8-16位字母,数字,下划线或特殊字符!@#$%^&*组成",
    "两次密码输入不一致",
    "邀请码输入有误",
    "这么简单的你都不会算吗"
];
//验证表单是否满足提交的条件
function submitOrNot(){
    for(var i=0;i<checkFlag.length;i++){
        if(checkFlag[i]==0||checkFlag[i]==1)
        {
            alert('请填写正确的信息');
            return false;
        }
    }
    return true;
}
function getImgUrl(){
  return "aaa";
}

//获取登录时的验证码
function getVeriLog(){
    $.ajax({
        url:'http://xiyounet.org:8089/captcha-login',
        type:'GET',
        data:{},
        dataType:'JSON',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){
            var getLog=document.getElementById('displayLoginVer');
            getLog.innerHTML=data.data;
        },
        error:function(err){
            console.log(err);
        }
    })
}

//获取注册的验证码
function getVeriReg(){
    $.ajax({
        url:'http://xiyounet.org:8089/captcha-signup',
        type:'GET',
        data:{},
        dataType:'JSON',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){
            var getReg=document.getElementById('displayRegVer');
            getReg.innerHTML=data.data;
        },
        error:function(err){
            console.log(err);
        }
    })
}


window.onload = function ()
{
    getVeriLog();
    var oA = document.getElementById("denglu");
    var oB = document.getElementById("zhuce");
    var oC = document.getElementById("first");
    var oD = document.getElementById("second");
    oA.onclick = function ()
    {
        oC.style.display = "block";
        oD.style.display = "none";
    }
    oB.onclick = function ()
    {
        oC.style.display = "none";
        oD.style.display = "block";
        getVeriReg();
    }
    $('#displayLoginVer').on('click',function(){
        getVeriLog();
    })
    $('#displayRegVer').on('click',function(){
        getVeriReg();
    })
    //表单验证函数，在失去焦点的时候匹配正则表达式
$('#username').on('blur',function(){
    var myreg=/^\w{6,20}$/
    if(!myreg.test(this.value)){
        checkFlag[0]=1;//错误
        errElement[0].innerHTML=printArr[1];
    }
    else{
        checkFlag[0]=2;//正确
        errElement[0].innerHTML=printArr[0];
    }
});
$('#password').on('blur',function(){
    var passwordReg=/^[A-Za-z0-9_!@#$%^&*]{8,16}$/;
    if(!passwordReg.test(this.value)){
        checkFlag[1]=1;
        errElement[1].innerHTML=printArr[2];
    }
    else{
        checkFlag[1]=2;
        errElement[1].innerHTML=printArr[0];
    }
});
$('#rePassword').on('blur',function(){
        var password=document.getElementById("password").value;
        if(this.value!=password){
            checkFlag[2]=1;
            errElement[2].innerHTML=printArr[3];
        }
        else{
            checkFlag[2]=2;
            errElement[2].innerHTML=printArr[0];
        }
})


//发起注册请求
function login(){
    var name = document.getElementById("username");
    var pass = document.getElementById("password");
    if (name!=null && name.value.length>0 && pass!=null && pass.value.length>0) {
        req = new XMLHttpRequest();
           //采用POST方式，异步传输
           req.open("post", "UserSearch", true);
           //POST方式，必须加入如下头信息设定
           req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.onreadystatechange = loginComplete;
        req.send("username="+name.value+"&password="+pass.value);
    } else
        alert("账号和密码不能为空");
}

function loginComplete() {
    if (req.readyState == 4 && req.status == 200) {
        //alert(req.responseText);
        if(req.responseText=='0')
            alert("登录失败，请检查账号和密码");
        else
            window.location="studio.html";
    }
    }
}


