/**
 * Created by Admin on 2014/9/2.
 */

var canvas = document.getElementById('canvas');
var stage = new createjs.Stage(canvas);
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener('tick', stage);

var gameDiv = document.getElementById('game');
var rank = document.getElementById('rank');
var startB = document.getElementById('startGame');
var moreGame = document.getElementById('moreGame');

//常量定义
var screenWidth = 320,//游戏宽度
    screenHeight = 568,//游戏高度
/*  playerSpeed = 0.005,//玩家速度
 cpuSpeed = parseInt(Math.random()) * 5 + 5,//电脑速度*/
//isEnd = false,//游戏是否结束
    roundMsg,//子弹信息
    round = 0,//当前子弹个数，总数，和显示信息
    roundCount = 5,//子弹总数

    scoreAll = 0,//当前得分，得分信息
    maxScore = 0,//射击中的  做大得分
    scoreMsg,//得分信息

    resultScore,
    warnMsg,//过界提示信息


    ball,//白球
    em,//红球

//clickCount = 0,//点击次数
    oneShotScore,//一次射击得分
    mousex,
    mousey,

    miss = false,//是否miss

    lineSide,//分割线

    oneShot, tenLine, sixLine, threeLine;


startB.addEventListener('click', initGame);

function initGame(e) {
    document.getElementById('image').style.display = 'none';
    startB.style.display = 'none';
    moreGame.style.display = 'none';

    //2:子弹和得分
    roundMsg = new createjs.Text("第 " + round + "/" + roundCount + " 弹", "12px Arial", "#ffffff");
    roundMsg.textAlign = 'left';
    roundMsg.x = 45;
    roundMsg.y = 20;
    stage.addChild(roundMsg);

    scoreMsg = new createjs.Text("总分: " + scoreAll + ".0", "12px Arial", "#ffffff");
    scoreMsg.textAlign = 'right';
    scoreMsg.x = 270;
    scoreMsg.y = 20;
    stage.addChild(scoreMsg);

    newShot();
}
function newShot() {
    miss = false;
    round++;
    roundMsg.text = "第 " + round + "/" + roundCount + " 弹";
    lineSide = new createjs.Shape();
    lineSide.graphics.beginStroke("yellow").moveTo(0, 400).lineTo(320, 400).endStroke();
    stage.addChild(lineSide);

    //canvas监听
    buildBall();//绘制白球
    buildem();//绘制红球
    stage.addEventListener("stagemousedown", dowmHandler);
}
function buildBall() {
    ball = new createjs.Shape();
    ball.graphics.beginFill('#FFFFFF').drawCircle(0, 0, 8);
    ball.graphics.endFill();
    ball.x = screenWidth / 2;
    ball.y = screenHeight - 20;
    stage.addChild(ball)
}

function buildem() {
    var emX = 8 + Math.random() * (screenWidth - 8 * 2);
    var emY = -20;
    var emDx = emX;
    var tt = 3000 + Math.random() * 2000;//整个运动持续时间
    em = new createjs.Shape();
    em.graphics.beginFill('#f99').drawCircle(0, 0, 8);
    em.x = emX;
    em.y = emY;
    stage.addChild(em);
    //isEnd = false;
    createjs.Tween.get(em).wait(500).to({
            x: emDx,
            y: screenHeight + 20
        },
        tt).call(missShot, [round]);

    inte = setInterval(checkWarn, 100);
}

//监视  是否过黄线，编程红色
function checkWarn() {
    if (em.y >= 400) {
        stage.removeChild(lineSide);
        lineSide.graphics.beginStroke("red").moveTo(0, 400).lineTo(320, 400).endStroke();
        stage.addChild(lineSide);
        clearInterval(inte);
    }
}

//红球过底部边界
function missShot(rd) {
    if (rd <= roundCount && rd == round) {
        miss = true;
        //bigBall(1);
    }
}

//鼠标按下事件
function dowmHandler(e) {
    // clickCount++;

    stage.removeEventListener("stagemousedown", dowmHandler);//防止再次点击触发
    //记录坐标
    mousex = e.stageX;
    mousey = e.stageY;

    //白球移动到坐标
    createjs.Tween.get(ball).to({
            x: mousex,
            y: mousey
        },
        1000).call(bigBall)
}

//当发射的白球到达 鼠标目的位置时
function bigBall() {


    //2：绘制，更新游戏数据
    //2.1:如果两球相距大于得分距离：红球停止，并编程黄色；以白球为中心绘制圆；更新子弹；更新分数；屏幕显示得分
    //如果超过警告线，则并且显示提示信息（越线环数减半）
    //2.2:如果得分：更新相关数据，绘制圆并将黄色小球显示在圆内部

    //1：判断此时白球 和 红球的距离；指定得分
    var xx = Math.abs(mousex - em.x);
    var yy = Math.abs(mousey - em.y);
    var len = Math.floor(Math.sqrt(xx * xx + yy * yy));
    var score = (56-len) * 1000;

    //1.2:
    if (len > 56) miss = true;

    //2.1:是否过警告线，得分减半
    if (em.y > 400) {
        score = Math.round(score / 2);
    }
    //2.2:是否miss
    if (score <= 0 || miss) {
        score = 0;
        mousex = ball.x;
        mousey = ball.y;
    }
    //2.3:更新最大得分
    if (score > maxScore) {
        maxScore = score;
    }


    scoreAll += score;//更新总分
    scoreMsg.text = "总分: " + Math.floor(scoreAll);//更新屏幕显示总分信息

    stage.removeChild(ball);//移除白球

    //环数信息容器
    oneShot = new createjs.Container();
    stage.addChild(oneShot);

    //添加白球
    ball = new createjs.Shape();
    ball.graphics.beginFill('#6666ff').drawCircle(mousex, mousey, 8).endFill();
    ball.alpha = 0;
    oneShot.addChildAt(ball, 0);

    em.alpha = 0;
    //三环
    threeLine = new createjs.Shape();
    threeLine.graphics.beginStroke("#0094ff").setStrokeStyle(2).beginFill("red").drawCircle(mousex, mousey, 8 * 7).endFill();
    oneShot.addChild(threeLine);

    //六环
    sixLine = new createjs.Shape();
    sixLine.graphics.beginStroke("#0094ff").setStrokeStyle(2).beginFill("red").drawCircle(mousex, mousey, 8 * 4).endFill();
    oneShot.addChild(sixLine);

    //七环
    tenLine = new createjs.Shape();
    tenLine.graphics.beginStroke("#0094ff").setStrokeStyle(2).beginFill("red").drawCircle(mousex, mousey, 8).endFill();
    oneShot.addChild(tenLine);


    //临时被射击的红球
    temp = new createjs.Shape();
    temp.graphics.beginFill("#ffff00").drawCircle(em.x, em.y, 8);
    //移除红球
    stage.removeChild(em);
    temp.alpha = 0;
    stage.addChild(temp);

    //显示得分信息
    oneShotScore = new createjs.Text(Math.floor(score), "18px Arial", "#ff6");
    oneShotScore.textAlign = 'center';
    oneShotScore.textBaseline = 'middle';
    oneShotScore.x = 160;
    oneShotScore.y = 100;

    //过界信息提示
    if (em.y > 400) {
        warnMsg = new createjs.Text("(越线环数减半)", "15px Arial", "#fff");
        warnMsg.textAlign = 'center';
        warnMsg.textBaseline = 'middle';
        warnMsg.x = 160;
        warnMsg.y = 120;
        oneShot.addChild(warnMsg);
        if (miss) {
            oneShotScore.text = "miss";
            warnMsg.text = ""
        }
    }

    createjs.Tween.get(ball).to({
            alpha: 1,
            scaleX: 10,
            scaleY: 10
        },
        50).call(function () {
            oneShot.addChild(oneShotScore);
            temp.alpha = 1;
            createjs.Tween.get(temp).wait(1000).to({alpha: 0}, 600);
            createjs.Tween.get(oneShot).wait(1000).to({alpha: 0}, 600).call(restartBall)
        });
}

function restartBall() {
    stage.removeChild(oneShot);
    stage.removeChild(temp);
    stage.removeChild(lineSide);
    checkGame()
}


function checkGame() {
    if (round < roundCount) {//射击未完成  继续
        newShot();
        return;
    }
    stage.removeAllChildren();//清理界面

    //最终得分信息
    resultScore = new createjs.Text("总分: " + Math.floor(scoreAll) + " , 最准: " + Math.floor(maxScore), "25px Arial", "#ff0");
    resultScore.textAlign = 'center';
    resultScore.x = screenWidth / 2;
    resultScore.y = 0.5 * screenHeight;
    stage.addChild(resultScore);


    //得分记录
//    resultMax = new createjs.Text("纪录:  " + Math.floor(hisMax / cancount) + "25px Arial", "#fff");
//    resultMax.textAlign = 'center';
//    resultMax.x = screenWidth / 2;
//    resultMax.y = 0.6 * screenHeight;
//    stage.addChild(resultMax);


    //向服务器提交得分
    $.ajax({
        type:"get",
        url:"test.com",
        data:'[{"telephone": "12222222222", "maxscore": '+maxScore+', "sumscore": '+scoreAll+'}]',
        dataType:"json",
        success:function(msg){
            if(msg) console.log("ok");
            else alert("你的分数不够哦！");
        }
    });
    //重新开始和更多游戏
    startB.style.display = "block";
    startB.innerHTML = "重新开始";
    moreGame.style.display = "block";
    stage.update();
    createjs.Ticker.setPaused(true);
    console.log('[{"telephone": "12222222222", "maxscore": '+maxScore+', "sumscore": '+scoreAll+'}]');
}

moreGame.addEventListener('click', showAllScores);

function showAllScores() {
//    $.ajax({
//        type:"get",
//        url:"http://192.168.199.99/web/index.php/Game/items",
//        dataType:"json",
//        success:function(msg){
//            console.log(msg);
//            var msgObj = JSON.parse(msg);
//            var ul = document.createElement('ul');
//            var li = document.createElement('li');
//            li.innerHTML="&nbsp;手机号码&nbsp;&nbsp;&nbsp;单次最高&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总分";
//            ul.appendChild(li);
//            for(var i=0;i<msgObj.length;i++){
//                var item = msgObj[i];
//                li = document.createElement('li');
//                li.innerHTML=item.telephone+"&nbsp;&nbsp;&nbsp;"+item.maxscore+"&nbsp;&nbsp;&nbsp;&nbsp;"+item.sumscore;
//                ul.appendChild(li);
//            }
//            rank.appendChild(ul);
//            rank.style.display="block";
//        }
//    });
    rank.style.display="none";
    var ull = document.getElementsByTagName('ul')[0];
    if(ull!=undefined) {
        rank.style.display="block";
        return;
    }
    var str = '[{"telephone": "12222222222", "maxscore": 5444, "sumscore": 5555555},' +
        '{"telephone": "13333333333", "maxscore": 4444, "sumscore": 4555555},' +
        '{"telephone": "14444444444", "maxscore": 3444, "sumscore": 3555555},' +
        '{"telephone": "15555555555", "maxscore": 2444, "sumscore": 2555555},' +
        '{"telephone": "16666666666", "maxscore": 1444, "sumscore": 1555555}]';
    var msgObj = JSON.parse(str);
    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.innerHTML="&nbsp;手机号码&nbsp;&nbsp;&nbsp;单次最高&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总分";
    ul.appendChild(li);
    for(var i=0;i<msgObj.length;i++){
        var item = msgObj[i];
        li = document.createElement('li');
        li.innerHTML=item.telephone+"&nbsp;&nbsp;&nbsp;"+item.maxscore+"&nbsp;&nbsp;&nbsp;&nbsp;"+item.sumscore;
        ul.appendChild(li);
    }
    rank.appendChild(ul);
    rank.style.display="block";
//console.log(msgObj);
}
document.getElementById('close').addEventListener("click", function () {
    rank.style.display="none";
    var ul = document.getElementsByTagName('ul')[0];
    rank.removeChild(ul);
});