/**
 * Created by Admin on 2014/8/22.
 */
function Circle(){
    createjs.Shape.call(this);

    this.setCircleType = function(type){
        this._CircleType=type;
        switch(type){
            case 1:
                this.setColor("#cccccc");
                break;
            case 2:
                this.setColor("#ff6600");
                break;
            case 3:
                this.setColor("#0000ff");
                break;
        }
    }

    this.setColor = function (colorString) {
        this.graphics.beginFill(colorString);
        this.graphics.drawCircle(0,0,25);
        this.graphics.endFill();
    }

    this.getCircleType = function () {
        return this._CircleType;
    }

    this.setCircleType(1);
}

Circle.prototype = new createjs.Shape();
Circle.TYPE_UNSELECTED = 1;
Circle.TYPE_SELECTED = 2;
Circle.TYPE_CAT = 3;