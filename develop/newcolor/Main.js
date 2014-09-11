
var canvas; //Will be linked to the canvas in the index.html page
var stage; //is the equivalent of stage to add others into
var shape;//the variable stage

//Background
var bg; //The background graphic

//variable
var gap = 13;
var startXY = 5;//between border and rect
var rectPoints = [];//store rect's point
var number = 0;//random rect in rectPoints
var r = 0;//rect's length in current level
var currLevel = 1;
var currUserScore = 0;
var msg;//show gameover message level

//button,link
var main; //The Main Background
var startB; //The Start button in the main menu
var creditsB; //The credits button in the main menu

//Credits
var credits; //The Credits screen

//Game View
var lose; //The losing popup

// Variables:ticker detect code every time,not use this game
var tkr = new Object;

//preloader
var preloader;
var manifest;
var totalLoaded = 0;

//Title View Group
var TitleView = new Container();

// Main Function
function Main() {
	canvas = document.getElementById('canvas');
	stage = new Stage(canvas);

	//enable to use mouse movements and cliks
	stage.mouseEventsEnabled = true;

	// Set The Flash Plugin for browsers that don't support SoundJS 
	SoundJS.FlashPlugin.BASE_PATH = "/assets/";
	if (!SoundJS.checkPlugin(true)) {
		alert("browser unknown error!");
		return;
	}

	manifest = [
			{ src: "bg.png", id: "bg" },
			{ src: "main.png", id: "main" },
			{ src: "startB.png", id: "startB" },
			{ src: "creditsB.png", id: "creditsB" },
			{ src: "credits.png", id: "credits" },
			{ src: "lose.png", id: "lose" },
			{ src: "hitorclick.mp3|hitorclick.ogg", id: "hitorclick" }
	];

	preloader = new PreloadJS();
	preloader.installPlugin(SoundJS);
	preloader.onProgress = handleProgress;
	preloader.onComplete = handleComplete;
	preloader.onFileLoad = handleFileLoad;
	preloader.loadManifest(manifest);

	/* Ticker */
	Ticker.setFPS(30);
	Ticker.addListener(stage);
}

function handleProgress(event) {
	//use event.loaded to get the percentage of the loading
	//we can do something when before game loading,like loading progress
}

function handleComplete(event) {
	//when loading complete do here
}

//Individual file  loading complete do sth
function handleFileLoad(event) {
	switch (event.type) {
		case PreloadJS.IMAGE:
			//image loaded
			var img = new Image();
			img.src = event.src;
			img.onload = handleLoadComplete;
			window[event.id] = new Bitmap(img);
			break;

		case PreloadJS.SOUND:
			//sound loaded
			handleLoadComplete();
			break;
	}
}

function handleLoadComplete(event) {

	totalLoaded++;

	if (manifest.length == totalLoaded) {
		addTitleView();
	}
}


// Add TitleView Function
function addTitleView() {
	//alert("Add Title View");
	startB.x = 285 - 31.5;//startB.png  63*21
	startB.y = 260;
	startB.name = 'startB';

	creditsB.x = 285 - 42;//creditsB.png 84*21
	creditsB.y = 360;

	TitleView.addChild(main, startB, creditsB);
	stage.addChild(bg, TitleView);
	stage.update();

	// Button Listeners
	startB.onPress = tweenTitleView;
	creditsB.onPress = showCredits;
}

// Show Credits
function showCredits() {
	credits.x = 550;
	stage.addChild(credits);
	stage.update();
	Tween.get(credits).to({ x: 0 }, 550);
	credits.onPress = hideCredits;
}

// Hide Credits
function hideCredits(e) {
	Tween.get(credits).to({ x: 550 }, 550).call(rmvCredits);
}

// Remove Credits
function rmvCredits() {
	stage.removeChild(credits);
}

// Tween Title View
function tweenTitleView() {
	// Start Game
	Tween.get(TitleView).to({ y: -320 }, 300).call(addGameView);
}

// Add Game View
function addGameView() {
	// Destroy Menu & Credits screen
	stage.removeChild(TitleView);
	TitleView = null;
	credits = null;

	// Start Listener 
	//bg.onPress = startGame;
	startGame();
}

// Start Game Function
function startGame() {
	//bg.onPress = null;
	stage.removeChild(bg);
	stage.update();
	draw(1);

	//if (tt!="undefined") clearInterval(tt);
	tt = setInterval(divceTime, 1000);

	canvas.addEventListener("click", update);
}

/*----start    interval time*/
var sumTime = 20;
function divceTime() {
	sumTime--;
	document.getElementById("timer").innerHTML = sumTime;
	if (sumTime == 0) {
		clearInterval(tt);
		gameover();
		getMsgLevel();
		alert("游戏结束，得分为：" + currUserScore+"......"+msg);
		return;
	}
}
/*-----end----*/

//Get message of level
function getMsgLevel() {
	if (currUserScore <= 10) msg = "恭喜你，你是初级色鬼！";
	else if (currUserScore > 10 && currUserScore < 20) msg = "恭喜你，你是中级色鬼！";
	else if (currUserScore >= 20 && currUserScore < 35) msg = "恭喜你，你是高级色鬼";
	else if (currUserScore >= 35 && currUserScore < 50) msg = "恭喜你，你是高级色魔！";
	else msg = "地球不属于你，超神了！";
}

//resetGame
function resetGame() {
	//Reset currLevel,currUserScore and clearInterval tt and the start the timer
	currLevel = 1;
	currUserScore = 0;
	clearInterval(tt);
	tt = setInterval(divceTime, 1000);

	sumTime = 20;//重置时间
	stage.removeChild(bg);
	stage.update();
	draw(1);
	canvas.addEventListener("click", update);
}

// Update Function
function update(e) {
	var randomRect = rectPoints[number - 1];
	//判断点击区域
	if (e.clientX >= randomRect.x && e.clientX <= randomRect.x + r+gap*2 
		&& e.clientY >= randomRect.y && e.clientY <= randomRect.y + r + gap * 2) {
		SoundJS.play('hitorclick');
		//当前得分+1
		currUserScore += 1;
		document.getElementById("currScore").innerHTML = currUserScore;
		//alert("ok");
		//进入下一关
		currLevel += 1;
		draw(currLevel);
		var currScore = document.getElementById("currScore");
		currScore.innerHTML = currUserScore;
	}
}

//show gameover 
function gameover() {
	canvas.removeEventListener("click", update);

	lose.x = 180;
	lose.y = -90;

	stage.addChild(lose);
	Tween.get(lose).to({ y: 230 }, 180);

}


//绘制 主方法
function draw(a) {
	shape = new Shape();
	//the background color for game
	shape.graphics.beginFill('rgb(221,221,221)').drawRect(0, 0, canvas.width, canvas.height);

	//if(a>5)关卡每增加5，方块分割增加1;,a += 1每一关的方块分割数为当前关卡+1
	if (a <= 5) a += 1;
	else a = parseInt(currLevel / 5) + 5;

	if (currLevel > 15) gap = 5;//设置视觉

	//此处对方块颜色的设置
	//a = currLevel / 5 + 5;
	var color1 = Math.floor(Math.random() * 255), color2 = Math.floor(Math.random() * 255),
		color3 = Math.floor(Math.random() * 255);

	r = (canvas.width - gap * (a - 1) - startXY * 2) / a;//当前关卡下，方块的长度
	var rectSum = a * a;//当前关卡，方块总数
	var index = 0;//数组中元素的下表

	//开始绘制
	//绘制算法：每一行（y坐标不变，x坐标递增）;同时每次换行的时候Y坐标都会 递增
	for (var i = 1; i <= a; i++) {
		for (var j = 1; j <= a; j++) {
			shape.graphics.beginFill("rgb(" + color1 + "," + color2 + "," + color3 + ")").drawRoundRect(startXY + (r + gap) * (j - 1), startXY + (r + gap) * (i - 1), r, r, 5);
			//stage.addChild(shape);
			//stage.update();
			//当前方块起始坐标 存入数组
			rectPoints[index] = { x: startXY + (r + gap) * (j - 1), y: startXY + (r + gap) * (i - 1) };
			index++;
		}
	}

	//随机一个方块
	number = Math.floor(Math.random() * rectSum + 1);//随机到第几个方块(1-4)
	//定位到此方块
	var randomRect = rectPoints[number - 1];
	//重新绘制此方块
	//对颜色的处理，前几关颜色较容易分辨
	if (currLevel > 6) {
		color1 += 10;
		color2 += 50;
		color3 += 30;
	} else {
		color1 += 200;
	}
	shape.graphics.beginFill("rgb(" + color1 + "," + color2 + "," + color3 + ")").drawRoundRect(randomRect.x, randomRect.y, r, r,5);
	stage.addChild(shape);
	stage.update();
}