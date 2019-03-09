    // 侧栏动画
    var oA = document.querySelectorAll(".main ul li span");
    var oLi = document.querySelectorAll(".main ul li");

    for(var i = 0; i < oA.length; i++)
    {
        oA[i].index = i;
        oA[i].onclick = function () {
            for(var j = 0; j < oA.length; j++)
            {
                oLi[j].style.height = "75px";
            }
            switch(this.index)
            {
                case 0: oLi[this.index].style.height = "314px"; break;
                case 1: oLi[this.index].style.height = "225px"; break; 
                case 2: oLi[this.index].style.height = "163px"; break; 
            }
        }
    }

    var zw=document.getElementsByClassName('zhengwen')   //获取卡片对象
    var dt=document.getElementsByTagName('dt')           //获取侧边栏对象
    var lo=0     //计数器
    var go=0     //计数器
    var last=document.getElementById('last')        //获取last按钮对象
    if(document.getElementsByClassName('zhengwen')[0].offsetHeight+100>window.innerHeight)     //在卡片高度大于屏幕高度时，通过设置将页面设置为可以滚动
    {
        document.getElementById('content').style.height=document.getElementsByClassName('zhengwen')[0].offsetHeight+100+"px"
        console.log(document.getElementById('content').style.height+"----"+document.getElementsByClassName('zhengwen')[0].offsetHeight+100+"px")
    }

    for(var r=0;r<dt.length;r++)
    {
        console.log(r);
        (function(r) {
            dt[r].onclick=function() {                 //这个函数用来动态设置点击侧栏对应位置对应卡片出来，原本卡片消失
                zw[lo].setAttribute('style',"animation:san 2.4s;top:2500px;")     //设置点击出现下一个卡片之前--当前卡片的消失动画
                dt[lo].setAttribute('style',"background-color: #666;")        //将要消失的卡片对应在侧栏上的栏目背景颜色调回原样
                zw[r].setAttribute('style',"animation:qi 0.8s;top:50px;")      //设置要新出现的卡片的出场动画
                dt[r].setAttribute('style',"background-color:#444;")     //设置将要新出现的卡片的侧栏对应位置的背景颜色
                go=lo     //go计数器跟保持是lo的前一个的状态
                lo=r     //lo更新为当前卡片在数组里的下标
                if(document.getElementsByClassName('zhengwen')[r].offsetHeight+100>window.innerHeight)    //这个判断目的是切换卡片后根据卡片高度实时调整页面可否滚动
                {
                    document.getElementById('content').style.height=document.getElementsByClassName('zhengwen')[r].offsetHeight+100+"px"
                } else {
                document.getElementById('content').style.height=window.innerHeight+"px"
                }
            }
        })(r)
    }

    function ne(){               //这个函数是个快捷按钮，点击后直接跳转下一天的卡片，如没有该功能可不加
        zw[lo].setAttribute('style',"animation:san 2.4s;top:2500px;")
        dt[lo].setAttribute('style',"background:rgba(254,254,254,0.1);")
        go=lo
        lo+=1
        if(lo>15)
        {lo=0}
        zw[lo].setAttribute('style',"animation:qi 0.8s;top:50px;")
        dt[lo].setAttribute('style',"background-color:#444;")
        if(document.getElementsByClassName('zhengwen')[lo].offsetHeight+100>window.innerHeight)
        {
            document.getElementById('content').style.height=document.getElementsByClassName('zhengwen')[lo].offsetHeight+100+"px"
        } else {
            document.getElementById('content').style.height=window.innerHeight+"px"
        }
    }

    function cb(){          //这个函数是last按钮倒退回上一次浏览位置，如没有该功能可不加
        zw[go].setAttribute('style',"animation:ju 0.8s;top:50px;")
        dt[go].setAttribute('style',"background-color:#444;")
        zw[lo].setAttribute('style',"animation:luo 0.8s;top:2500px;")
        dt[lo].setAttribute('style',"background-color:rgba(254,254,254,0.1);")
        lo=go
        if(document.getElementsByClassName('zhengwen')[lo].offsetHeight+100>window.innerHeight)
        {
            document.getElementById('content').style.height=document.getElementsByClassName('zhengwen')[lo].offsetHeight+100+"px"
        } else {
            document.getElementById('content').style.height=window.innerHeight+"px"
        }
    }

    setInterval(function(){if(lo==go){last.setAttribute('style',"cursor: not-allowed;pointer-events: none;")}     //实时设置last按钮是否可以跳转回上次浏览位置，没有last按钮可不加
    else{last.setAttribute('style',"cursor: auto;pointer-events: all;")}},300)

    // 参考资料：https://github.com/sunshine940326/canvas-nest

    class Circle {
    //创建对象
    //以一个圆为对象
    //设置随机的 x，y坐标，r半径，_mx，_my移动的距离
    //this.r是创建圆的半径，参数越大半径越大
    //this._mx,this._my是移动的距离，参数越大移动
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = Math.random() * 1;
        this._mx = Math.random();
        this._my = Math.random();
    }

    //canvas 画圆和画直线
    //画圆就是正常的用canvas画一个圆
    //画直线是两个圆连线，为了避免直线过多，给圆圈距离设置了一个值，距离很远的圆圈，就不做连线处理
    drawCircle(ctx) {
        ctx.beginPath();
        //arc() 方法使用一个中心点和半径，为一个画布的当前子路径添加一条弧。
        ctx.arc(this.x, this.y, this.r, 0, 360)
        ctx.closePath();
        ctx.fillStyle = 'rgba(150, 150, 150, 0.3)';
        ctx.fill();
    }

    drawLine(ctx, _circle) {
        let dx = this.x - _circle.x;
        let dy = this.y - _circle.y;
        let d = Math.sqrt(dx * dx + dy * dy)
        if (d < 150) {
            ctx.beginPath();
            //开始一条路径，移动到位置 this.x,this.y。创建到达位置 _circle.x,_circle.y 的一条线：
            ctx.moveTo(this.x, this.y); //起始点
            ctx.lineTo(_circle.x, _circle.y); //终点
            ctx.closePath();
            ctx.strokeStyle = 'rgba(150, 150, 150, 0.3)';
            ctx.stroke();
        }
    }

    // 圆圈移动
    // 圆圈移动的距离必须在屏幕范围内
    move(w, h) {
        this._mx = (this.x < w && this.x > 0) ? this._mx : (-this._mx);
        this._my = (this.y < h && this.y > 0) ? this._my : (-this._my);
        this.x += this._mx / 2;
        this.y += this._my / 2;
        }
    }

    //鼠标点画圆闪烁变动
    class currentCirle extends Circle {
        constructor(x, y) {
            super(x, y)
        }

    drawCircle(ctx) {
        ctx.beginPath();
        //注释内容为鼠标焦点的地方圆圈半径变化
        //this.r = (this.r < 14 && this.r > 1) ? this.r + (Math.random() * 2 - 1) : 2;
        this.r = 8;
        ctx.arc(this.x, this.y, this.r, 0, 360);
        ctx.closePath();
        //ctx.fillStyle = 'rgba(0,0,0,' + (parseInt(Math.random() * 100) / 100) + ')'
        ctx.fillStyle = 'rgba(255, 77, 54, 0.6)'
        ctx.fill();
        }
    }

    //更新页面用requestAnimationFrame替代setTimeout
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    let circles = [];
    let current_circle = new currentCirle(0, 0)

    let draw = function() {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < circles.length; i++) {
            circles[i].move(w, h);
            circles[i].drawCircle(ctx);
            for (j = i + 1; j < circles.length; j++) {
                circles[i].drawLine(ctx, circles[j])
            }
        }
        if (current_circle.x) {
            current_circle.drawCircle(ctx);
            for (var k = 1; k < circles.length; k++) {
                current_circle.drawLine(ctx, circles[k])
            }
        }  
        requestAnimationFrame(draw)
    }

    let init = function(num) {
        for (var i = 0; i < num; i++) {
            circles.push(new Circle(Math.random() * w, Math.random() * h));
        }
        draw();
    }

    window.addEventListener('load', init(180));

    window.onmousemove = function(e) {
        e = e || window.event;
        current_circle.x = e.clientX;
        current_circle.y = e.clientY;
    }

    window.onmouseout = function() {
        current_circle.x = null;
        current_circle.y = null;
    }
