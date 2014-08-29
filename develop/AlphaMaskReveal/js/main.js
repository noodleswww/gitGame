/**
 * Created by Admin on 2014/8/29.
 */
require.config({
    paths:{
        "jquery":"jquery-1.8.3",
        "game":"game",
        "easel":"easel"
    }
});


require(["jquery","game","easel"],function($,game){
    game.init();
});