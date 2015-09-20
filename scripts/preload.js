var BasicGame = {};
BasicGame.Preload = function (game) {
    this.preloadBar = null;
};

BasicGame.Preload.prototype = {
    preload: function () {
      var barBack = this.add.sprite(SCREEN_WIDTH / 2,
                                    SCREEN_HEIGHT / 2,
                                    'bar_back');
      barBack.anchor.setTo(0.5, 0.5);
      this.preloadBar = this.add.sprite(SCREEN_WIDTH / 2,
                                        SCREEN_HEIGHT / 2,
                                        'bar');
      this.preloadBar.anchor.setTo(0, 0.5);
      this.preloadBar.x -= this.preloadBar.width / 2;
      this.load.setPreloadSprite(this.preloadBar);

      this.game.load.image('title', 'images/title.png');
      this.game.load.image('bg', 'images/bg.png');
      this.game.load.image('player', 'images/player.png');
      this.game.load.image('arm_upper', 'images/arm_upper.png');
      this.game.load.image('arm_lower', 'images/arm_lower.png');
      this.game.load.spritesheet('fist', 'images/fist.png', 9, 9);

      this.game.load.audio('parry', 'sounds/parry.ogg');
      this.game.load.audio('whoosh', 'sounds/whoosh.ogg');
      //this.game.load.audio('music', 'sounds/headinthesand.ogg');

      this.game.load.script('filter-vignette', 'scripts/Vignette.js');
      this.game.load.script('filter-filmgrain', 'scripts/FilmGrain.js');
    },

    create: function () {
        this.state.start('game');
    }
};
