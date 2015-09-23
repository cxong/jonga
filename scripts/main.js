var GameState = function(game){};

var parrySound;
var woodSound;
var move = moveList.roundhousePunch();

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0xffffff;
  this.game.physics.startSystem(Phaser.Physics.P2JS);
	//this.game.physics.p2.gravity.y = GRAVITY;
  this.game.physics.p2.restitution = 1.0;
  this.game.physics.p2.setBoundsToWorld();
  this.game.physics.p2.setImpactEvents(true);
  this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  this.game.time.slowMotion = 2.0;

  this.sounds = {
    //hit: this.game.add.sound('hit'),
  };
  parrySound = this.game.add.sound('parry');
  woodSound = this.game.add.sound('wood');

  this.groups = {
    bg: this.game.add.group(),
    title: this.game.add.group(),
    armsBack: this.game.add.group(),
    bodies: this.game.add.group(),
    armsFront: this.game.add.group()
  };
  this.collisionGroups = {
    enemies: this.game.physics.p2.createCollisionGroup(),
    player: this.game.physics.p2.createCollisionGroup(),
    enemyFists: this.game.physics.p2.createCollisionGroup(),
    playerFists: this.game.physics.p2.createCollisionGroup()
  };

  var bg = this.game.add.sprite(0, 0, 'bg');
  bg.scale.setTo(PLAYER_SCALE);
  this.groups.bg.add(bg);

  var y = GAME_HEIGHT / 2 + 25;
  this.player = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.player,
    [this.collisionGroups.enemyFists],
    this.groups.armsBack, this.groups.armsFront,
    this.collisionGroups.playerFists,
    [this.collisionGroups.enemies, this.collisionGroups.enemyFists],
    GAME_WIDTH / 2, y, 1);

  this.enemy = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.enemies,
    [this.collisionGroups.playerFists],
    this.groups.armsBack, this.groups.armsFront,
    this.collisionGroups.enemyFists,
    [this.collisionGroups.player, this.collisionGroups.playerFists],
    GAME_WIDTH / 2 + 80, y, -1);

  this.dummy = new Dummy(
    this.game, this.groups.bodies, this.collisionGroups.enemyFists,
    [this.collisionGroups.player, this.collisionGroups.playerFists],
    GAME_WIDTH * 0.3, y + 3);

  this.game.input.onDown.add(function() {
    this.tryStart();
  }, this);

  this.game.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(function(key) {
    if (this.game.scale.isFullScreen) {
        this.game.scale.stopFullScreen();
    } else {
        this.game.scale.startFullScreen(false);
    }
  }, this);

  var filterVignette = this.game.add.filter('Vignette');
  filterVignette.size = 0.3;
  filterVignette.amount = 0.5;
  filterVignette.alpha = 1.0;
  var filterFilmGrain = this.game.add.filter('FilmGrain');
  filterFilmGrain.color = 0.1;
  filterFilmGrain.amount = 0.2;
  filterFilmGrain.luminance = 0.12;
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
    GAME_WIDTH / 2, GAME_HEIGHT / 2, 'title');
  this.title.anchor.setTo(0.5);
  this.groups.title.add(this.title);

  this.started = false;

  this.readyTime = this.game.time.now + 1000;
};

GameState.prototype.start = function() {
  //this.groups.tourists.removeAll();

  this.timeLast = this.game.time.now;
  this.timeLastHalf = this.timeLast;

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
    leftMove.x = 0;
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
    rightMove.x = 0.3;
    rightMove.y = 0.2;
  }
  this.player.rightFist.move(rightMove.x, rightMove.y);

  move.update();
  if (move.isDone()) {
    this.enemy.leftFist.move(0, 0.3);
    this.enemy.rightFist.move(0, 0.3);
    move = randomMove();
  }
  move.apply(this.enemy.leftFist, this.enemy.rightFist);
  
  this.game.stage.filters[1].update();
};

var IMPACT_SOUND_THRESHOLD = 190 * PLAYER_SCALE;

function parry(b1, b2) {
  var v1 = new Phaser.Point(b1.velocity.x, b1.velocity.y);
  var v2 = new Phaser.Point(b2.velocity.x, b2.velocity.y);
  var impactForce = v1.getMagnitude() * b1.mass + v2.getMagnitude() * b2.mass;
  if (impactForce > IMPACT_SOUND_THRESHOLD) {
    if (b2.sprite.key == 'dummy_arm_upper' ||
      b2.sprite.key == 'dummy_arm_lower') {
      woodSound.play();
    } else {
      parrySound.play();
    }
  }
}
