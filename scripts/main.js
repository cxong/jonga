var GameState = function(game){};

var move = moveList.roundhousePunch();

GameState.prototype.preload = function() {
};

var DUMMY_HITS_REQUIRED_TO_START = 3;
var PLAYER_Y = GAME_HEIGHT / 2 + 25;

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0xffffff;
  this.game.physics.startSystem(Phaser.Physics.P2JS);
	//this.game.physics.p2.gravity.y = GRAVITY;
  this.game.physics.p2.restitution = 1.0;
  this.game.physics.p2.setBoundsToWorld();
  this.game.physics.p2.setImpactEvents(true);
  this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  this.sounds = {
    parry: this.game.add.sound('parry'),
    punch: this.game.add.sound('punch'),
    wood: this.game.add.sound('wood'),
  };

  this.groups = {
    bg: this.game.add.group(),
    title: this.game.add.group(),
    dummy: this.game.add.group(),
    armsBack: this.game.add.group(),
    bodies: this.game.add.group(),
    armsFront: this.game.add.group()
  };
  this.collisionGroups = {
    enemies: this.game.physics.p2.createCollisionGroup(),
    players: this.game.physics.p2.createCollisionGroup()
  };

  var bg = this.game.add.sprite(0, 0, 'bg');
  bg.scale.setTo(PLAYER_SCALE);
  this.groups.bg.add(bg);

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
  filterFilmGrain.amount = 0.1;
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

  this.music = this.game.add.audio('taiko-drums');

  this.title = this.game.add.sprite(
    GAME_WIDTH / 2, GAME_HEIGHT / 2, 'title');
  this.title.anchor.setTo(0.5);
  this.groups.title.add(this.title);

  this.stop();
};

GameState.prototype.start = function() {
  this.groups.dummy.removeAll(true);

  this.title.alpha = 0;
  this.music.play('', 0, 1, true);

  this.started = true;

  // Place players on opposite ends
  this.player.die();
  this.player = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.players,
    this.groups.armsBack, this.groups.armsFront,
    [this.collisionGroups.enemies], this.parry, this,
    80, PLAYER_Y, 1);
  this.enemy = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.enemies,
    this.groups.armsBack, this.groups.armsFront,
    [this.collisionGroups.players], this.parry, this,
    GAME_WIDTH - 80, PLAYER_Y, -1);
};

GameState.prototype.stop = function() {
  this.music.stop();

  this.title.alpha = 1;

  this.started = false;
  this.dummyHits = 0;

  this.game.time.slowMotion = 1.0;

  if (this.player) {
    this.player.die();
  }
  this.player = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.players,
    this.groups.armsBack, this.groups.armsFront,
    [this.collisionGroups.enemies], this.parry, this,
    GAME_WIDTH / 2, PLAYER_Y, 1);
  if (this.enemy) {
    this.enemy.die();
  }
  this.enemy = null;

  this.dummy = new Dummy(
    this.game, this.groups.dummy, this.collisionGroups.enemies,
    [this.collisionGroups.players], GAME_WIDTH * 0.3, PLAYER_Y + 3);
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

  // Random kung fu moves for enemy
  if (this.enemy) {
    move.update();
    if (move.isDone()) {
      this.enemy.leftFist.move(0, 0.3);
      this.enemy.rightFist.move(0, 0.3);
      move = randomMove();
    }
    move.apply(this.enemy.leftFist, this.enemy.rightFist);

    // Players move towards each other as long as they are far enough
    var distance = Math.abs(this.player.body.x - this.enemy.body.x);
    if (distance > 40*PLAYER_SCALE) {
      this.player.approach();
      this.enemy.approach();
    }
  }

  this.game.stage.filters[1].update();
};

var IMPACT_SOUND_THRESHOLD = 190 * PLAYER_SCALE;

GameState.prototype.parry = function(b1, b2) {
  if (!b1.sprite || !b2.sprite) {
    return;
  }
  var v1 = new Phaser.Point(b1.velocity.x, b1.velocity.y);
  var v2 = new Phaser.Point(b2.velocity.x, b2.velocity.y);
  var impactForce = v1.getMagnitude() + v2.getMagnitude();
  if (impactForce > IMPACT_SOUND_THRESHOLD) {
    if (b2.sprite.key == 'dummy_arm_upper' ||
      b2.sprite.key == 'dummy_arm_lower') {
      this.sounds.wood.play('', 0, 0.3);
      this.dummyHits++;
      if (this.dummyHits >= DUMMY_HITS_REQUIRED_TO_START) {
        this.start();
      }
    } else if (b2.sprite.key == 'torso' ||
      b2.sprite.key == 'head') {
      this.sounds.punch.play('', 0, 0.3);
      // Being punched pushes the player back
      if (b2.sprite == this.player.torso ||
        b2.sprite == this.player.head) {
        this.player.impulse(impactForce);
      } else {
        this.enemy.impulse(impactForce);
      }
    } else {
      this.sounds.parry.play('', 0, 0.3);
    }
  }
}
