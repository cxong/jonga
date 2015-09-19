var GameState = function(game){};

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x00FFF6;
	this.game.physics.arcade.gravity.y = GRAVITY;

  this.sounds = {
    //hit: this.game.add.sound('hit'),
  };

  this.groups = {
    bg: this.game.add.group(),
    enemies: this.game.add.group(),
    player: this.game.add.group(),
    enemyFists: this.game.add.group(),
    playerFists: this.game.add.group(),
    title: this.game.add.group()
  };

  this.groups.bg.add(this.game.add.sprite(0, 0, 'bg'));
  //var sand = this.game.add.sprite(0, SCREEN_HEIGHT, 'sand');
  //sand.anchor.y = 1;
  //this.groups.sand.add(sand);

/*
  this.player = new Player(
    this.game, this.groups.tree, this.groups.coconuts, this.sounds,
    SCREEN_WIDTH / 2, SAND_Y, 'tree');
  this.game.input.onDown.add(function() {
    this.attack();
  }, this);
  this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function() {
    this.attack();
  }, this);
*/

  //this.music = this.game.add.audio('music');
/*
  this.bigTextStyle = {
    font: "36px Courier New, monospace",
    fill: "#000",
    fontWeight: "bold"
  };
  this.highStyle = {
    font: "36px Courier New, monospace",
    fill: "#f00",
    fontWeight: "bold"
  };
  */

  this.title = this.game.add.sprite(
    SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'title');
  this.title.anchor.setTo(0.5);

  this.started = false;

  this.readyTime = this.game.time.now + 1000;
};

GameState.prototype.start = function() {
  //this.groups.tourists.removeAll();

  this.timeLast = this.game.time.now;
  this.timeLastHalf = this.timeLast;
  //this.music.play('', 0, 1, true);

  this.title.alpha = 0;

  this.started = true;
};

GameState.prototype.stop = function() {
  this.music.stop();

  this.title.alpha = 1;

  this.started = false;

  this.readyTime = this.game.time.now + 1000;
};

GameState.prototype.attack = function() {
  if (!this.started) {
    if (this.readyTime < this.game.time.now) {
      this.start();
    }
  } else {
    //this.tree.attack();
  }
};

GameState.prototype.update = function() {
  /*this.game.physics.arcade.overlap(
    this.groups.coconuts, this.groups.tourists, function(coconut, tourist) {
  }, null, this);*/
};
