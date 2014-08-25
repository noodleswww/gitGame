
var stage = new createjs.Stage("gameView");
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick", stage);

var gameView = new createjs.Container();
gameView.x = 30;
gameView.y = 30;

stage.addChild(gameView);

var circleArr = [[], [], [], [], [], [], [], [], []];//存储所有元素
var currCat;//当前猫

//对方向的定义
var LEFT = 0, LEFT_TOP = 1, RIGHT_TOP = 2, RIGHT = 3, RIGHT_DOWN = 4, LEFT_DOWN = 5;

//每个方向的可用步数，以及代表的方向
//{distance:0,direction:"left"}:方向left,步数0
var dirInfo = [{}, {}, {}, {}, {}, {}];

//监听事件
function circleClick(e) {
	if (e.target.getCircleType() != Circle.TYPE_CAT) {
		e.target.setCircleType(Circle.TYPE_SELECTED);
	}
	if (currCat.indexX == 0 || currCat.indexX == 8 || currCat.indexY == 0 || currCat.indexY == 8) {
		alert("游戏结束");
		return;
	}
	//（初始化）对dirInfo初始值
	initDirInfo(currCat);
	//---available
	var max = 0,//可用的最大步数
		index = 0,//最大步数的下表，和方向对应
		nums = [],//存储最大步数 相等的列表
		num = 0,//nums[]下标位置
		resDir = 0;//最终移动的方向
	//---------------

	for (var i = 0; i < dirInfo.length; i++) {
		if (dirInfo[i].distance > max) {
			max = dirInfo[i].distance;
			index = i;
		}
	}
	if (max == 0) {
		alert("you win");
		return;//gameover
	}

	for (var i = 0; i < dirInfo.length; i++) {
		if (dirInfo[i].distance == max) {
			nums[num] = i;
			num++;
		}
	}

	//对最大步数方向设定
	var random = parseInt(Math.random() * nums.length);//随机方向
	resDir = nums[random];//具体方向代号
	//[{distance:0,direction:"left"},{distance:0,direction:"left_top"},{distance:0,direction:"right_top"},
	//{distance:3,direction:"right"},{distance:5,direction:"right_down"},{distance:5,direction:"left_down"}]

	//优先移动判断
	for (var i = 0; i < dirInfo.length; i++) {
		if (dirInfo[i].distance < 4 && dirInfo[i].distance != 0) {
			if (dirInfo[i].distance == currCat.indexX && dirInfo[i].direction == "left") {
				resDir = 0;//left
				break;
			}
			if (dirInfo[i].distance == currCat.indexY && dirInfo[i].direction == "left_top") {
				resDir = 1;//lefttop
				break;
			}
			if (dirInfo[i].distance == currCat.indexY && dirInfo[i].direction == "right_top") {
				resDir = 2;//righttop
				break;
			}
			if (dirInfo[i].distance == 8 - currCat.indexX && dirInfo[i].direction == "right") {
				resDir = 3;//right
				break;
			}
			if (dirInfo[i].distance == 8 - currCat.indexY && dirInfo[i].direction == "right_down") {
				resDir = 4;//rightdown
				break;
			}
			if (dirInfo[i].distance == 8 - currCat.indexY && dirInfo[i].direction == "left_down") {
				resDir = 5;//leftdown
				break;
			}
		}
	}
	//----移动------
	if (resDir == 0) {//left
		if (circleArr[currCat.indexX - 1][currCat.indexY].getCircleType() != Circle.TYPE_SELECTED) {
			currCat.setCircleType(Circle.TYPE_UNSELECTED);
			currCat = circleArr[currCat.indexX - 1][currCat.indexY];
			currCat.setCircleType(Circle.TYPE_CAT);
		}

	} else if (resDir == 1) {//left_top
		currCat.setCircleType(Circle.TYPE_UNSELECTED);
		currCat = circleArr[currCat.indexY % 2 ? currCat.indexX : currCat.indexX - 1][currCat.indexY - 1];
		currCat.setCircleType(Circle.TYPE_CAT);

	} else if (resDir == 2) {//right_top
		currCat.setCircleType(Circle.TYPE_UNSELECTED);
		currCat = circleArr[currCat.indexY % 2 ? currCat.indexX + 1 : currCat.indexX][currCat.indexY - 1];
		currCat.setCircleType(Circle.TYPE_CAT);

	} else if (resDir == 3) {//right
		currCat.setCircleType(Circle.TYPE_UNSELECTED);
		currCat = circleArr[currCat.indexX + 1][currCat.indexY];
		currCat.setCircleType(Circle.TYPE_CAT);

	} else if (resDir == 4) {//right_down
		currCat.setCircleType(Circle.TYPE_UNSELECTED);
		currCat = circleArr[currCat.indexY % 2 ? currCat.indexX + 1 : currCat.indexX][currCat.indexY + 1];
		currCat.setCircleType(Circle.TYPE_CAT);

	} else if (resDir == 5) {//left_down
		currCat.setCircleType(Circle.TYPE_UNSELECTED);
		currCat = circleArr[currCat.indexY % 2 ? currCat.indexX : currCat.indexX - 1][currCat.indexY + 1];
		currCat.setCircleType(Circle.TYPE_CAT);
	}
}

//初始化
function initDirInfo(cat) {
	//dirInfo.length = 0;
	dirInfo.forEach(function (x) { x = null; })//重置数组
	//left
	for (var x = cat.indexX; x > 0; x--) {
		if (circleArr[x - 1][cat.indexY].getCircleType() == Circle.TYPE_SELECTED) {
			dirInfo[LEFT].distance = cat.indexX - x;
			break;
		}
		dirInfo[LEFT].distance = cat.indexX;
		dirInfo[LEFT].direction = "left";
	}
	//left_top
	var x = cat.indexX, y = cat.indexY;//(2,1)
	while (true) {
		var x_s = y % 2 == 0 ? x - 1 : x;
		if (circleArr[x_s][y - 1].getCircleType() == Circle.TYPE_SELECTED) {
			dirInfo[LEFT_TOP].distance = cat.indexY - y;
			break;
		}
		x--;
		y--;
		dirInfo[LEFT_TOP].distance = cat.indexY;
		dirInfo[LEFT_TOP].direction = "left_top";
		if (y < 1 || x < 1) break;
	}
	//right_top
	x = cat.indexX, y = cat.indexY;//(4，5)
	while (true) {
		var x_s = y % 2 == 1 ? x + 1 : x;
		if (circleArr[x_s][y - 1].getCircleType() == Circle.TYPE_SELECTED) {
			dirInfo[RIGHT_TOP].distance = cat.indexY - y;
			break;
		}
		x++;
		y--;
		dirInfo[RIGHT_TOP].distance = cat.indexY;
		dirInfo[RIGHT_TOP].direction = "right_top";
		if (y <= 1 || x > 8) break;
	}
	//right
	for (var x = cat.indexX; x < 8; x++) {
		if (circleArr[x + 1][cat.indexY].getCircleType() == Circle.TYPE_SELECTED) {
			dirInfo[RIGHT].distance = x - cat.indexX;
			break;
		}
		dirInfo[RIGHT].distance = 8 - cat.indexX;
		dirInfo[RIGHT].direction = "right";
	}
	//right_down
	x = cat.indexX, y = cat.indexY;//(5,7)
	while (true) {
		var x_s = y % 2 == 1 ? x + 1 : x;
		if (circleArr[x_s][y + 1].getCircleType() == Circle.TYPE_SELECTED) {
			dirInfo[RIGHT_DOWN].distance = y - cat.indexY;
			break;
		}
		x++;
		y++;
		dirInfo[RIGHT_DOWN].distance = 8 - cat.indexY;
		dirInfo[RIGHT_DOWN].direction = "right_down";
		if (y >= 7 || x > 8) break;
	}
	//left_down
	x = cat.indexX, y = cat.indexY;//(2,7)
	while (true) {
		var x_s = y % 2 == 0 ? x - 1 : x;
		if (circleArr[x_s][y + 1].getCircleType() == Circle.TYPE_SELECTED) {
			dirInfo[LEFT_DOWN].distance = y - cat.indexY;
			break;
		}
		x--;
		y++;
		dirInfo[LEFT_DOWN].distance = 8 - cat.indexY;
		dirInfo[LEFT_DOWN].direction = "left_down";
		if (y >= 8 || x < 1) break;
	}
	////数组降序排列
	//dirInfo.sort(function (x, y) {
	//	return x - y;
	//});
}

function addCircle() {
	for (var indexY = 0; indexY < 9; indexY++) {
		for (var indexX = 0; indexX < 9; indexX++) {
			var c = new Circle();
			gameView.addChild(c);
			circleArr[indexX][indexY] = c;
			c.indexX = indexX;
			c.indexY = indexY;
			c.x = (indexY + 2) % 2 == 0 ? indexX * 55 : indexX * 55 + 30;
			c.y = indexY * 55;

			//绘制神经猫
			if (indexX == 4 && indexY == 4) {
				c.setCircleType(3);
				currCat = c;
			}

			c.addEventListener("click", circleClick);
		}
	}
}
addCircle();