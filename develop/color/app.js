var canvas = document.getElementById("canvas");
var stage = new createjs.Stage(canvas);

createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("click", stage);

var gameView = new createjs.Container();
stage.addChild(gameView);

var n = 2,
	radius = 5,
	gap = 6,
	currLevel = 1;

function addRect() {
	//var cl = parseInt(Math.random() * 1000000);
	//var rcl = cl - 3000000>0?cl-3000000:cl+3000000;
	//var color = "#" + cl;
	//var rcolor = "#" + rcl;
	var color1 = Math.floor(Math.random() * 255), color2 = Math.floor(Math.random() * 255),
			color3 = Math.floor(Math.random() * 255);
	var color = "rgb(" + color1 + "," + color2 + "," + color3 + ")";

	//对颜色的处理，前几关颜色较容易分辨
	if (currLevel > 6) {
		color1 += 10;
		color2 += 50;
		color3 += 30;
	} else {
		color1 += 200;
	}
	var rcolor = "rgb(" + color1 + "," + color2 + "," + color3 + ")";

	var x = parseInt(Math.random() * n);
	var y = parseInt(Math.random() * n);

	for (var indexX = 0; indexX < n; indexX++) {
		for (var indexY = 0; indexY < n; indexY++) {
			var rect = new Rect(n, color, rcolor, radius,gap);
			gameView.addChild(rect);

			rect.x = indexX;
			rect.y = indexY;
			if (rect.x == x && rect.y == y) {
				rect.setRectType(2);
			}
			//设置坐标
			rect.x = indexX * ((400 - (n - 1) * gap) / n) + gap * indexX;
			rect.y = indexY * ((400 - (n - 1) * gap) / n) + gap * indexY;

			if (rect.getRectType() == 2) {
				rect.addEventListener("click", function () {
					if (n <= 8) {
						n += 1;
					} else {
						n = parseInt(currLevel / 8) + 8;
					}
					if (gap > 1 && n>10) gap -= 0.2;
					gameView.removeAllChildren();
					currLevel += 1;
					addRect();
				});
			}
		}
	}
	stage.update();
}
addRect();