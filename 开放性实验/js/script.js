        highLightCode();
        
        document.onkeyup = function() {

            var content = document.getElementById('mark').value;
            var right = document.getElementById('right');
            var hCon = marked(content);
            right.innerHTML = hCon;
            highLightCode();
        }
        
        function highLightCode(){
            var codeBlock =document.querySelectorAll('code');
            for(var i = codeBlock.length-1;i>=0;i--){
                hljs.highlightBlock(codeBlock[i].parentNode);
            }
        }

        var winWidth = document.body.clientWidth;
             
        var oLe = document.getElementById("left");  

        var startChance = function (elem, timer)
        {
            elem.style.width = elem.offsetWidth + Math.floor(winWidth - elem.offsetWidth) + 'px';
            clearInterval(timer);
        }   

        var finishChance = function (elem, timer)
        {
            elem.style.width = elem.offsetWidth - Math.floor(winWidth / 2) + 'px';
            clearInterval(timer);
        }      

        var finishMove = function (elem){
            var timer;
            timer = setInterval(finishChance(elem, timer), 1);
        }

        var startMove = function (elem){
            var timer;
            timer = setInterval(startChance(elem, timer), 1);
        }              
        
        window.onload = function ()
        {
            var oLay = document.getElementById("lay");
            var oCal = document.getElementById("cancel");
            var oAll = document.getElementById("all");
            var oEssy = document.getElementById("eassy");
            var oPu = document.getElementById("publish");
            var oLone = document.getElementById("lay-1");
            var oCone = document.getElementById("cancel-1");
            var oAone = document.getElementById("all-1");
            var oLeft = document.getElementById("right-left");
            var aDd = document.getElementById("addtion");
            var oLe = document.getElementById("left");
            var bAr = document.getElementById("rightbar");
            var rGh = document.getElementById("right-right");
            var oBtn = document.getElementsByClassName("cls");

            oBtn[0].onclick = function ()
            {
                oAll.style.display = "none";
                oLeft.style.display = "block";                            
            }

            oLeft.onclick = function ()
            {
                startMove(oLe);
                aDd.style.display = "none";
                bAr.style.display = "none";
                rGh.style.display = "block";
            }

            rGh.onclick = function ()
            {
                this.style.display = "none";
                finishMove(oLe);
                aDd.style.display = "block";
                bAr.style.display = "block";
            }

            oEssy.onclick = function ()
            {
                oAll.style.display = "block";
                oLeft.style.display = "none";
            }

            oCal.onclick = function ()
            {
                oAll.style.display = "none";
                oLeft.style.display = "block";
            }                 

            oCone.onclick = function ()
            {
                oAone.style.display = "none";
                oLeft.style.display = "block";
            }

            oPu.onclick = function ()
            {
                oAone.style.display = "block";
                oLeft.style.display = "none";
            }
        }        

        function bindResize (el)
        {
            var els = document.getElementById('left').style;
            x = 0;
            $(el).mousedown(function (e)
            {
                x = e.clientX - el.offsetWidth - $("#left").width();
                el.setCapture ? (el.setCapture(), el.onmousemove = function (ev){mouseMove(ev || event);}, el.onmouseup = mouseUp) : ($(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp));
                e.preventDefault();
        });
            function mouseMove(e) 
            {
                els.width = e.clientX - x + 'px';
            }
            function mouseUp()
            {
                el.releaseCapture ? (el.releaseCapture(), el.onmousemove = el.onmouseup = null) : ($(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp));}
        }
        var divResize = function () {
            var totalHeight=$("html").height();
            console.log(totalHeight);
            var topHeight=$("#ti").height();
            $("#left").height(totalHeight-topHeight);
            $("#rightbar").height(totalHeight-topHeight);
        }
        $(function() {
            divResize();
            $(window).resize(divResize);
            bindResize(document.getElementById('rightbar'));
        });   