var canvas;
var stage;
var nav;//游戏说明
var score;//得分
var bg;//背景
var lose;//结束
var cry;//哭

var main;//主背景
var startB;//开始
var coin, coin1, coin2, coin3, coin4;//金币
var bomb, bomb1;//炸弹
var money;//红包

var coins = [];
var bombs = [];

var ySpeed = 5;//降落速度
var tkr = new Object;

var preloader;
var manifest;
var totalLoaded = 0;

var TitleView = new Container();


function Main() {
	canvas = document.getElementById('PongStage');
	stage = new Stage(canvas);
	nav = document.getElementById("nav");
	score = document.getElementById("score");
	stage.mouseEventsEnabled = true;

	SoundJS.FlashPlugin.BASE_PATH = "/assets/";
	if (!SoundJS.checkPlugin(true)) {
		alert("Error!");
		return;
	}

	manifest = [
			{ src: "bg.png", id: "bg" },
			{ src: "main.png", id: "main" },
			{ src: "startB.png", id: "startB" },
			{ src: "phoenix.png", id: "phoenix" },
			{ src: "coin.png", id: "coin" },
			{ src: "coin.png", id: "coin1" },
			{ src: "coin.png", id: "coin2" },
			{ src: "coin.png", id: "coin3" },
			{ src: "coin.png", id: "coin4" },
			{ src: "bomb.png", id: "bomb" },
			{ src: "bomb.png", id: "bomb1" },
			{ src: "redpaper.png", id: "money" },
			{ src: "lose.png", id: "lose" },
			{ src: "cry.png", id: "cry" }
	];
	preloader = new PreloadJS();
	preloader.installPlugin(SoundJS);
	preloader.onFileLoad = handleFileLoad;
	preloader.loadManifest(manifest);

	Ticker.setFPS(66);
	Ticker.addListener(stage);
}

function handleFileLoad(event) {
	switch (event.type) {
		case PreloadJS.IMAGE:
			var img = new Image();
			img.src = event.src;
			img.onload = handleLoadComplete;
			window[event.id] = new Bitmap(img);
			break;
		case PreloadJS.SOUND:
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

//开始界面
function addTitleView() {
	startB.x = 530 - 80.5;
	startB.y = 260;
	startB.name = 'startB';

	phoenix.x = 550;
	phoenix.y = 300;
	TitleView.addChild(main, startB, phoenix);
	stage.addChild(bg, TitleView);
	stage.update();

	startB.onPress = tweenTitleView;
}

function tweenTitleView() {
	Tween.get(TitleView).to({ y: -640 }, 300).call(addGameView);
}

function addGameView() {
	nav.style.display = "none";
	stage.removeChild(TitleView);
	TitleView = null;
	
	coins[0] = coin;
	coins[1] = coin1;
	coins[2] = coin2;
	coins[3] = coin3;
	coins[4] = coin4;
	bombs[0] = bomb1;
	bombs[1] = bomb;

	for (var i = 0; i < coins.length; i++) {
		coins[i].x = parseInt(Math.random() * 1000);
		coins[i].y = -1 * parseInt(Math.random() * 100);
		stage.addChild(coins[i]);
		if (i <= 1) {
			bombs[i].x = parseInt(Math.random() * canvas.width);
			bombs[i].x = parseInt(Math.random() * 1000);
			stage.addChild(bombs[i]);
		}
		if (i == 0) {
			money.x = 0;
			money.y = 0;
			stage.addChild(money);
		}
	}
	phoenix.x = 700;
	phoenix.y = 330;

	msg = new Text('点击屏幕开始游戏。。。。。。', 'bold 20px Arial', '#A3FF24');
	msg.x = 450;
	msg.y = 300
	stage.addChild(msg);
	//stage.update();
	stage.addChild(phoenix);
	stage.update();

	bg.onPress = startGame;
}

var msg;
function startGame(e) {
	bg.onPress = null;
	stage.onMouseMove = movePhoenix;
	Ticker.addListener(tkr, false);
	tkr.tick = update;
	stage.removeChild(msg);
}

function movePhoenix(e) {
	phoenix.x = e.stageX;
}

var coll = 0;
function update() {
	// coin Movement 
	//for (var i = 0; i < coinArr.length; i++) {
	coin.y = coin.y + parseInt(Math.random() * ySpeed) + 3;
	coin1.y = coin1.y + parseInt(Math.random() * ySpeed) + 4;
	coin2.y = coin2.y + parseInt(Math.random() * ySpeed) + 3;
	coin3.y = coin3.y + parseInt(Math.random() * ySpeed) + 4;
	coin4.y = coin4.y + parseInt(Math.random() * ySpeed) + 5;

	bomb.y = bomb.y + parseInt(Math.random() * ySpeed) + ySpeed * 2;
	bomb1.y = bomb1.y + parseInt(Math.random() * ySpeed) + ySpeed * 2;

	money.y = money.y + ySpeed * 3;
	// coin Collision 
	if ((coin.y + coin.image.height) > phoenix.y
			&& (coin.x + coin.image.width) > phoenix.x
			&& (phoenix.x + phoenix.image.width) > coin.x
			&& coin.y < (phoenix.y + phoenix.image.height)) {
		//接到金币
		score.innerHTML = parseInt(score.innerHTML) + 100;
		stage.removeChild(coin);
		coin.y = 0;
		coin.x = parseInt(Math.random() * 500);
		stage.addChild(coin);
		//coinArr.splice(i, i + 1);
		stage.update();
	} else if (coin.y > canvas.height) {
		coin.y = 0;
		coin.x = parseInt(Math.random() * 500);
		stage.addChild(coin);
		//coinArr.splice(i, i + 1);
		stage.update();
	}
	if ((coin1.y + coin1.image.height) > phoenix.y
			&& (coin1.x + coin1.image.width) > phoenix.x
			&& (phoenix.x + phoenix.image.width) > coin1.x
			&& coin1.y < (phoenix.y + phoenix.image.height)) {
		//接到金币
		score.innerHTML = parseInt(score.innerHTML) + 100;
		stage.removeChild(coin1);
		coin1.y = 0;
		coin1.x = parseInt(Math.random() * 500) + 400;
		stage.addChild(coin1);
		//coinArr.splice(i, i + 1);
		stage.update();
	} else if (coin1.y > canvas.height) {
		coin1.y = 0;
		coin1.x = parseInt(Math.random() * 500) + 400;
		stage.addChild(coin1);
		//coinArr.splice(i, i + 1);
		stage.update();
	}

	if ((coin2.y + coin2.image.height) > phoenix.y
			&& (coin2.x + coin2.image.width) > phoenix.x
			&& (phoenix.x + phoenix.image.width) > coin2.x
			&& coin2.y < (phoenix.y + phoenix.image.height)) {
		//接到金币
		score.innerHTML = parseInt(score.innerHTML) + 100;
		stage.removeChild(coin2);
		coin2.y = 0;
		coin2.x = parseInt(Math.random() * 500);
		stage.addChild(coin2);
		//coinArr.splice(i, i + 1);
		stage.update();
	} else if (coin2.y > canvas.height) {
		coin2.y = 0;
		coin2.x = parseInt(Math.random() * 500);
		stage.addChild(coin2);
		//coinArr.splice(i, i + 1);
		stage.update();
	}

	if ((coin3.y + coin3.image.height) > phoenix.y
			&& (coin3.x + coin3.image.width) > phoenix.x
			&& (phoenix.x + phoenix.image.width) > coin3.x
			&& coin3.y < (phoenix.y + phoenix.image.height)) {
		//接到金币
		score.innerHTML = parseInt(score.innerHTML) + 100;
		stage.removeChild(coin3);
		coin3.y = 0;
		coin3.x = parseInt(Math.random() * 500) + 400;
		stage.addChild(coin3);
		//coinArr.splice(i, i + 1);
		stage.update();
	} else if (coin3.y > canvas.height) {
		coin3.y = 0;
		coin3.x = parseInt(Math.random() * 500) + 400;
		stage.addChild(coin3);
		//coinArr.splice(i, i + 1);
		stage.update();
	}

	if ((coin4.y + coin4.image.height) > phoenix.y
			&& (coin4.x + coin4.image.width) > phoenix.x
			&& (phoenix.x + phoenix.image.width) > coin4.x
			&& coin4.y < (phoenix.y + phoenix.image.height)) {
		//接到金币
		score.innerHTML = parseInt(score.innerHTML) + 100;
		stage.removeChild(coin4);
		coin4.y = 0;
		coin4.x = parseInt(Math.random() * 500);
		stage.addChild(coin4);
		//coinArr.splice(i, i + 1);
		stage.update();
	} else if (coin4.y > canvas.height) {
		coin4.y = 0;
		coin4.x = parseInt(Math.random() * 500);
		stage.addChild(coin4);
		//coinArr.splice(i, i + 1);
		stage.update();
	}

	/* bomb collision */
	if ((bomb.y + bomb.image.height) > phoenix.y
		&& (bomb.x + bomb.image.width) > phoenix.x
		&& (phoenix.x + phoenix.image.width) > bomb.x
		&& bomb.y < (phoenix.y + phoenix.image.height)) {
		//接到炸弹
		stage.removeChild(bomb);
		bomb.y = 0;
		bomb.x = parseInt(Math.random() * canvas.height) + 22;
		stage.addChild(bomb);
		stage.update();
		coll += 1;
		if (coll == 3) {
			alert("游戏结束得分" + score.innerHTML);
			gameover();
			return;
		}
	} else if (bomb.y > canvas.height) {
		bomb.y = 0;
		bomb.x = parseInt(Math.random() * canvas.height) + 22;
		stage.addChild(bomb);
		stage.update();
	}
	if ((bomb1.y + bomb1.image.height) > phoenix.y
		&& (bomb1.x + bomb1.image.width) > phoenix.x
		&& (phoenix.x + phoenix.image.width) > bomb1.x
		&& bomb1.y < (phoenix.y + phoenix.image.height)) {
		//接到炸弹
		stage.removeChild(bomb1);
		bomb1.y = 0;
		bomb1.x = parseInt(Math.random() * canvas.width);
		stage.addChild(bomb1);
		stage.update();
		coll += 1;
		if (coll == 3) {
			alert("游戏结束得分" + score.innerHTML);
			gameover();
			return;
		}
	} else if (bomb1.y > canvas.height) {
		bomb1.y = 0;
		bomb1.x = parseInt(Math.random() * canvas.width) ;
		stage.addChild(bomb1);
		stage.update();
	}
	

	if ((money.y + money.image.height) > phoenix.y
			&& (money.x + money.image.width) > phoenix.x
			&& (phoenix.x + phoenix.image.width) > money.x
			&& money.y < (phoenix.y + phoenix.image.height)) {
		//接到金币
		score.innerHTML = parseInt(score.innerHTML) + 100;
		stage.removeChild(money);
		money.y = 0;
		money.x = parseInt(Math.random() * 3000);
		stage.addChild(money);
		//coinArr.splice(i, i + 1);
		stage.update();
	} else if (money.y > canvas.height) {
		money.y = 0;
		money.x = parseInt(Math.random() * 3000);
		stage.addChild(money);
		//coinArr.splice(i, i + 1);
		stage.update();
	}

	if (phoenix.x >= 1137 - 235) {
		phoenix.x = 1137 - 235;
	}


}

function gameover() {
	//stage = null;
	tkr.tick = null;
	lose.x = 500;
	lose.y = -90;
	cry.x = 500;
	cry.y = -200;
	stage.addChild(lose);
	stage.addChild(cry);
	Tween.get(lose).to({ y: 300 }, 500);
	Tween.get(cry).to({ y: 300 }, 500);
	nav.style.display = "block";
	stage.onMouseMove = null;
}

//resetGame
function resetGame() {
	score.innerHTML = 0;
	stage.removeChild(lose);
	stage.removeChild(cry);
	coll = 0;
	stage.update();
	nav.style.display = "none";
	addGameView();
}