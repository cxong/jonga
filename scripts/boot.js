BasicGame.Boot = function (game) {
};

BasicGame.Boot.prototype = {

    preload: function () {
      this.game.load.image('bar_back', 'images/bar_back.png');
      this.game.load.image('bar', 'images/bar.png');
    },

    create: function () {
        this.game.stage.backgroundColor = 0x00FFF6;
        this.input.maxPointers = 1;

        this.state.start('preload');
    }
};
