function shape(canvas,copy,cobj){
    this.canvas=canvas;
    this.cobj=cobj;
    this.copy=copy;
    this.width=canvas.width;
    this.height=canvas.height;
    this.type="line";
    this.style="stroke";
    this.strokeStyle="black";
    this.fillStyle="black";
    this.lineWidth=1;
    this.biannum=5;
    this.jiaonum=5;
    this.history=[];
    this.isback=true;
    this.xpsize=15;
    this.isshowxp=true;
}
shape.prototype={
    init:function(){
        this.cobj.lineWidth=this.lineWidth;
        this.cobj.strokeStyle=this.strokeStyle;
        this.cobj.fillStyle=this.fillStyle;
    },
    draw:function(){
        var that=this;
        that.copy.onmousedown=function(e){
            var startx=e.offsetX;
            var starty=e.offsetY;
            that.copy.onmousemove=function(e){
                that.isback=true;
                that.init();
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var movex=e.offsetX;
                var movey=e.offsetY;
                // that.cobj.beginPath();
                that[that.type](startx,starty,movex,movey);
                that.copy.onmouseup=function(){
                    that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                    that.copy.onmousemove=null;
                    that.copy.onmouseup=null;
                }
            }
        }
    },
    line:function(x,y,x1,y1){
        this.cobj.beginPath();
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();
    },
    rect:function(x,y,x1,y1){
        this.cobj.beginPath();
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj[this.style]();
    },
    arc:function(x,y,x1,y1){
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.arc(x,y,r,0,2*Math.PI);
        this.cobj[this.style]();
    },
    bian:function(x,y,x1,y1){
        this.cobj.beginPath();
        var angle=360/this.biannum*Math.PI/180;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        for(i=0;i<this.biannum;i++){
            this.cobj.lineTo(Math.cos(angle*i)*r+x,Math.sin(angle*i)*r+y);
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    jiao:function(x,y,x1,y1){
        this.cobj.beginPath();
        var angle=360/(this.jiaonum*2)*Math.PI/180;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1=r/3;
        for(i=0;i<this.jiaonum*2;i++){
            if(i%2==0){
                this.cobj.lineTo(Math.cos(angle*i)*r+x,Math.sin(angle*i)*r+y);
            }else{
                this.cobj.lineTo(Math.cos(angle*i)*r1+x,Math.sin(angle*i)*r1+y);
            }
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    pen:function(){
        var that=this;
        this.copy.onmousedown=function(e){
            var startx=e.offsetX;
            var starty=e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function(e){
                that.init();
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var movex=e.offsetX;
                var movey=e.offsetY;
                that.cobj.lineTo(movex,movey);
                that.cobj.stroke();
                that.copy.onmouseup=function(){
                    that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                    that.copy.onmousemove=null;
                    that.copy.onmouseup=null;
                }
            }
        }

    },
    xp:function(xpObj){
        var that=this;
        that.copy.onmousemove=function(e){
            if(!that.isshowxp){
                return false;
            }
            var mx=e.offsetX;
            var my=e.offsetY;
            var lefts=mx-that.xpsize/2;
            var tops=my-that.xpsize/2;
            if(lefts<0){
                lefts=0;
            }else if(lefts>that.width-that.xpsize){
                lefts=that.width-that.xpsize;
            }
            if(tops<0){
                tops=0;
            }else if(tops>that.height-that.xpsize){
                tops=that.height-that.xpsize;
            }
            xpObj.css({display:"block",top:tops,left:lefts,width:that.xpsize,height:that.xpsize});
        };
        that.copy.onmousedown=function(e){
            var sx=e.offsetX;
            var sy=e.offsetY;
            that.copy.onmousemove=function(e){
                var mx=e.offsetX;
                var my=e.offsetY;
                var lefts=mx-that.xpsize/2;
                var tops=my-that.xpsize/2;
                if(lefts<0){
                    lefts=0;
                }else if(lefts>that.width-that.xpsize){
                    lefts=that.width-that.xpsize;
                }
                if(tops<0){
                    tops=0;
                }else if(tops>that.height-that.xpsize){
                    tops=that.height-that.xpsize;
                }
                xpObj.css({display:"block",top:tops,left:lefts,width:that.xpsize,height:that.xpsize});
                that.cobj.clearRect(lefts,tops,that.xpsize,that.xpsize);
                that.copy.onmouseup=function(){
                    that.copy.onmouseup=null;
                    that.copy.onmousemove=null;
                    that.xp(xpObj);
                    that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                }
            }
        }
    },
    //反向
    fx:function(dataobj,x,y){
    for(i=0;i<dataobj.width*dataobj.height;i++){
        dataobj.data[i*4+0]=255-dataobj.data[i*4+0];
        dataobj.data[i*4+1]=255-dataobj.data[i*4+1];
        dataobj.data[i*4+2]=255-dataobj.data[i*4+2];
        dataobj.data[i*4+3]=255;
    }
    this.cobj.putImageData(dataobj,x,y);
},
    //马赛克
//            msk(dataobj,10,200,0);
    msk:function(dataobj,num,x,y) {
    var width=dataobj.width;
    var height=dataobj.height;
    var num=num;
    var w=width/num;
    var h=height/num;
    for(var i=0;i<num;i++){
        for(var j=0;j<num;j++){
            var dataimg=this.cobj.getImageData(j*w,i*h,w,h);
            var r=0,g=0,b=0;
            for(var k=0;k<dataimg.width*dataimg.height;k++){
                r+=dataimg.data[k*4+0];
                g+=dataimg.data[k*4+1];
                b+=dataimg.data[k*4+2];
            }
            r=parseInt(r/(dataimg.width*dataimg.height));
            g=parseInt(g/(dataimg.width*dataimg.height));
            b=parseInt(b/(dataimg.width*dataimg.height));
            for(var k=0;k<dataimg.width*dataimg.height;k++){
                dataimg.data[k*4+0]=r;
                dataimg.data[k*4+1]=g;
                dataimg.data[k*4+2]=b;
            }
            this.cobj.putImageData(dataimg,x+j*w,i*h+y);
        }
    }
},
    //模糊
//            mh(dataobj,10,200,0);
        mh:function(dataobj,num,x,y) {
            var width=dataobj.width;
            var height=dataobj.height;
            var num=num;
            var arr=[];
            for(var i=0;i<height;i++){
                for(var j=0;j<width;j++){
                    var x1=j+num>width?j-num:j;
                    var y1=i+num>height?i-num:i;
                    var dataimg=this.cobj.getImageData(x1,y1,num,num);
                    var r=0,g=0,b=0;
                    for(var k=0;k<dataimg.width*dataimg.height;k++){
                        r+=dataimg.data[k*4+0];
                        g+=dataimg.data[k*4+1];
                        b+=dataimg.data[k*4+2];
                    }
                    r=parseInt(r/(dataimg.width*dataimg.height));
                    g=parseInt(g/(dataimg.width*dataimg.height));
                    b=parseInt(b/(dataimg.width*dataimg.height));
                    arr.push(r,g,b,255);
                }
            }
            for(var i=0;i<dataobj.data.length;i++){
                dataobj.data[i]=arr[i]
            }
            this.cobj.putImageData(dataobj,x,y);
        }

}
