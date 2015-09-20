var GameState = function(game){};

var parrySound;

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0xffffff;
  this.game.physics.startSystem(Phaser.Physics.P2JS);
	//this.game.physics.p2.gravity.y = GRAVITY;
  this.game.physics.p2.restitution = 2.0;
  this.game.physics.p2.setBoundsToWorld();
  this.game.physics.p2.setImpactEvents(true);

  this.sounds = {
    //hit: this.game.add.sound('hit'),
  };
  parrySound = this.game.add.sound('parry');

  this.groups = {
    bg: this.game.add.group(),
    title: this.game.add.group(),
    enemies: this.game.add.group(),
    player: this.game.add.group(),
    enemyFists: this.game.add.group(),
    playerFists: this.game.add.group()
  };
  this.collisionGroups = {
    enemies: this.game.physics.p2.createCollisionGroup(),
    player: this.game.physics.p2.createCollisionGroup(),
    enemyFists: this.game.physics.p2.createCollisionGroup(),
    playerFists: this.game.physics.p2.createCollisionGroup()
  };

  var bg = this.game.add.sprite(0, 0, 'bg');
  bg.scale.setTo(4);
  this.groups.bg.add(bg);
  //var sand = this.game.add.sprite(0, SCREEN_HEIGHT, 'sand');
  //sand.anchor.y = 1;
  //this.groups.sand.add(sand);

  this.fist_generator = new FistGenerator(
    this.game, this.groups.enemyFists, this.collisionGroups.enemyFists,
    [this.collisionGroups.player, this.collisionGroups.playerFists]);

  this.player = new Player(
    this.game,
    this.groups.player, this.collisionGroups.player,
    [this.collisionGroups.enemyFists],
    this.groups.playerFists, this.collisionGroups.playerFists,
    [this.collisionGroups.enemies, this.collisionGroups.enemyFists],
    SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50);

  this.game.input.onDown.add(function() {
    this.tryStart();
  }, this);

  var filterVignette = this.game.add.filter('Vignette');
  filterVignette.size = 0.3;
  filterVignette.amount = 0.5;
  filterVignette.alpha = 1.0;
  var filterFilmGrain = this.game.add.filter('FilmGrain');
  filterFilmGrain.color = 0.1;
  filterFilmGrain.amount = 0.1;
  filterFilmGrain.luminance = 0.3;
  this.game.stage.filters = [filterVignette, filterFilmGrain];
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
  this.groups.title.add(this.title);

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

GameState.prototype.tryStart = function() {
  if (!this.started) {
    if (this.readyTime < this.game.time.now) {
      this.start();
    }
  }
};

GameState.prototype.update = function() {
  // Punch using keyboard
  // WSAD = left arm
  // cursors = right arm
  var leftMoved = false;
  var leftMove = {x:0, y:0};
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
    leftMove.x = -1;
    leftMoved = true;
  } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
    leftMove.x = 1;
    leftMoved = true;
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
    leftMove.y = -1;
    leftMoved = true;
  } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
    leftMove.y = 1;
    leftMoved = true;
  }
  // Default pose position
  if (!leftMoved) {
    leftMove.x = 0.1;
    leftMove.y = -0.4;
  }
  this.player.leftFist.move(leftMove.x, leftMove.y);
  var rightMoved = false;
  var rightMove = {x:0, y:0};
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    rightMove.x = -1;
    rightMoved = true;
  } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    rightMove.x = 1;
    rightMoved = true;
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    rightMove.y = -1;
    rightMoved = true;
  } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
    rightMove.y = 1;
    rightMoved = true;
  }
  // Default pose position
  if (!rightMoved) {
    rightMove.x = 0.2;
    rightMove.y = 0.2;
  }
  this.player.rightFist.move(rightMove.x, rightMove.y);
  /*this.game.physics.arcade.overlap(
    this.groups.coconuts, this.groups.tourists, function(coconut, tourist) {
  }, null, this);*/

  this.fist_generator.update();

  this.game.stage.filters[1].update();
};

function parry(armature, body2) {
  parrySound.play();
}
