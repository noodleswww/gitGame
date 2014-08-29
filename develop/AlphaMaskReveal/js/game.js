/**
 * Created by Admin on 2014/8/29.
 */
define(['easel'], function () {
    var F = {};
    var canvas;
    var stage;
    var image;
    var text;
    var cursor;//鼠标圆球
    var s;//shape
    var oldP;//点击坐标
    var oldMidP;
    var isDraw=false;
    var blur;//过滤图片
    var bitmap;//原始图片
    var maskFilter;


    var init = function () {
        canvas = document.getElementById("gameView");
        stage = new createjs.Stage(canvas);

        text = new createjs.Text("Loading...","20px Arial","red");
        text.set({x:stage.canvas.width/2,y:stage.canvas.height-180});
        text.textAlign="center";

        image = new Image();
        image.src = "images/test.png";
        image.complete = F.handlecomplete();//加载完成


    };

    F.handlecomplete = function () {
        createjs.Touch.enable(stage);
        stage.enableMouseOver();
        s = new createjs.Shape();

        stage.addEventListener("stagemousedown", F.handleMouseDown);
        stage.addEventListener("stagemouseup", F.handleMouseUp);
        stage.addEventListener("stagemousemove", F.handleMouseMove);

        bitmap = new createjs.Bitmap(image);
        blur = new createjs.Bitmap(image);

        blur.filters = [new createjs.BlurFilter(15, 15,2)];
        blur.cache(0, 0, 960, 600);
        blur.alpha = 0.9;

        text.text="Click and Drag to Reveal the Image";
        stage.addChild(blur,text,bitmap);
        F.updateCacheImage(false);


        cursor =new createjs.Shape(new createjs.Graphics().beginFill("#FFFFFF").drawCircle(0,0,20));
        cursor.cursor="pointer";

        stage.addChild(cursor);
    };
    F.handleMouseDown = function (e){
        oldP = new createjs.Point(stage.mouseX,stage.mouseY);
        oldMidP = oldP;
        isDraw=true;
    }
    F.handleMouseUp = function (e){
        F.updateCacheImage(true);
        isDraw=false;
    }
    F.handleMouseMove = function (e){
        text.text="stage.mouseX:"+stage.mouseX+";stage.mouseY"+stage.mouseY;
        cursor.x= stage.mouseX;
        cursor.y= stage.mouseY;

        if(!isDraw) {
            stage.update();
            return;
        }

        var midPoint = new createjs.Point(oldP.x + stage.mouseX >> 1, oldP.y + stage.mouseY >> 1);

        s.graphics.setStrokeStyle(40, "round", "round")
            .beginStroke("rgba(0,0,0,0.15)")
            .moveTo(midPoint.x, midPoint.y)
            .curveTo(oldP.x, oldP.y, oldMidP.x, oldMidP.y);

        oldP.x = stage.mouseX;
        oldP.y = stage.mouseY;

        oldMidP.x = midPoint.x;
        oldMidP.y = midPoint.y;

        F.updateCacheImage(true);
    }

    F.updateCacheImage = function(update){
        if (update) {
            s.updateCache();
        } else {
            s.cache(0, 0, image.width, image.height);
        }

        maskFilter = new createjs.AlphaMaskFilter(s.cacheCanvas);

        bitmap.filters = [maskFilter];
        if (update) {
            bitmap.updateCache(0, 0, image.width, image.height);
        } else {
            bitmap.cache(0, 0, image.width, image.height);
        }

        stage.update();
    }
    return {
        init: init
    }
});






















