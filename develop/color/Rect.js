/*
*n:当前加载的 方块数目
*color:默认方块颜色
*rectColor:点击的方块颜色
*radius:圆角矩形弧度
*
*/

function Rect(n, color, rectColor,radius,gap) {
	createjs.Shape.call(this);

	this.setRectType = function (type) {
		this._RectType = type;
		switch (type) {
			case 1:
				this.setColor(color);
				break;
			case 2:
				this.setColor(rectColor);
				break;
		}
	}

	this.setColor = function (colorString) {
		this.graphics.beginFill(colorString);
		this.graphics.drawRoundRect(0, 0, (400 - (n - 1) * gap) / n, (400 - (n - 1) * gap) / n, radius);
		this.graphics.endFill();
	}

	this.getRectType = function () {
		return this._RectType;
	}

	this.setRectType(1);
}
Rect.prototype = new createjs.Shape();