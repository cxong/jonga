var GameState = function(game){};

var move = moveList.roundhousePunch();

GameState.prototype.preload = function() {
};

var DUMMY_HITS_REQUIRED_TO_START = 3;
var PLAYER_Y = GAME_HEIGHT / 2 + 25;

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0xffffff;
  this.game.physics.startSystem(Phaser.Physics.P2JS);
  this.game.physics.p2.restitution = 1.0;
  this.game.physics.p2.setBoundsToWorld();
  this.game.physics.p2.setImpactEvents(true);
  this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  this.sounds = {
    drums: this.game.add.sound('drums'),
    parry: this.game.add.sound('parry'),
    punch: this.game.add.sound('punch'),
    wood: this.game.add.sound('wood'),
    clang: this.game.add.sound('clang'),
    stab: this.game.add.sound('stab'),
    whoosh: this.game.add.sound('whoosh'),
    swish: this.game.add.sound('swish')
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

  this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
  this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
  this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
  this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);

  var bg = this.game.add.sprite(0, 0, 'bg');
  bg.scale.setTo(PLAYER_SCALE);
  this.groups.bg.add(bg);

  this.game.input.gamepad.start();
  this.pad1 = this.game.input.gamepad.pad1;

  this.game.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(function(key) {
    if (this.game.scale.isFullScreen) {
        this.game.scale.stopFullScreen();
    } else {
        this.game.scale.startFullScreen(false);
    }
  }, this);

  this.gameMode = 1;

  this.game.input.keyboard.addKey(Phaser.Keyboard.ONE).onDown.add(function(key) {
    this.gameMode = 1;
    this.setGameMode();
  }, this);
  this.game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.add(function(key) {
    this.gameMode = 2;
    this.setGameMode();
  }, this);
  this.game.input.keyboard.addKey(Phaser.Keyboard.THREE).onDown.add(function(key) {
    this.gameMode = 3;
    this.setGameMode();
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

  this.music = this.game.add.audio('taiko-drums');

  var title = this.game.add.sprite(
    GAME_WIDTH / 2, GAME_HEIGHT / 2, 'title');
  title.anchor.setTo(0.5);
  this.groups.title.add(title);

  var playerControls = this.game.add.sprite(
    GAME_WIDTH * 0.25, GAME_HEIGHT * 0.2, 'keyboard');
  playerControls.anchor.setTo(0.5);
  this.groups.title.add(playerControls);

  this.enemyBotControls = this.game.add.sprite(
    GAME_WIDTH * 0.75, GAME_HEIGHT * 0.2, 'robot');
  this.enemyBotControls.anchor.setTo(0.5);
  this.groups.title.add(this.enemyBotControls);

  this.enemyAnalogControls = this.game.add.sprite(
    GAME_WIDTH * 0.75, GAME_HEIGHT * 0.2, 'analog');
  this.enemyAnalogControls.anchor.setTo(0.5);
  this.groups.title.add(this.enemyAnalogControls);

  var switchPrompt = this.game.add.sprite(
    GAME_WIDTH / 2, GAME_HEIGHT * 0.1, 'switch_prompt');
  switchPrompt.anchor.setTo(0.5);
  this.groups.title.add(switchPrompt);

  this.stop();
};

GameState.prototype.start = function() {
  this.groups.dummy.removeAll(true);

  this.groups.title.forEach(function(s) {
    s.alpha = 0;
  });
  if (this.music.paused) {
    this.music.resume();
  } else {
    this.music.play('', 0, 1, true);
  }
  this.sounds.drums.play();

  // Place players on opposite ends
  this.player.die();
  this.player = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.players,
    this.groups.armsBack, this.groups.armsFront,
    [this.collisionGroups.enemies], this.parry, this,
    80, PLAYER_Y, 'player', 1, this.sounds.whoosh);
  if (this.enemy) {
    this.enemy.die();
  }
  this.enemy = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.enemies,
    this.groups.armsBack, this.groups.armsFront,
    [this.collisionGroups.players], this.parry, this,
    GAME_WIDTH - 80, PLAYER_Y, 'enemy', -1, this.sounds.whoosh);
  this.setGameMode();

  this.started = true;
};

GameState.prototype.stop = function() {
  this.music.pause();
  this.sounds.drums.play();

  this.groups.title.forEach(function(s) {
    s.alpha = 1;
  });

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
    GAME_WIDTH * 0.25, PLAYER_Y, 'player', 1, this.sounds.whoosh);
  if (this.enemy) {
    this.enemy.die();
  }
  this.enemy = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.enemies,
    this.groups.armsBack, this.groups.armsFront,
    [this.collisionGroups.players], this.parry, this,
    GAME_WIDTH * 0.75, PLAYER_Y, 'enemy', -1, this.sounds.whoosh);
  this.gameMode = 1;
  this.setGameMode();

  this.dummy = new Dummy(
    this.game, this.groups.dummy, this.collisionGroups.enemies,
    [this.collisionGroups.players], GAME_WIDTH / 2, PLAYER_Y + 3);
};

GameState.prototype.setGameMode = function() {
  if (this.started) {
    return;
  }
  switch (this.gameMode) {
    case 1:
      this.player.equip(null, null, null, null, null, null, true);
      this.player.equip(null, null, null, null, null, null, false);
      this.player.rightFist.whooshSound = this.sounds.whoosh;
      this.enemy.equip(null, null, null, null, null, null, true);
      this.enemy.equip(null, null, null, null, null, null, false);
      this.enemy.leftFist.whooshSound = this.sounds.whoosh;
      break;
    case 2:
      this.player.equip(
        'shield', this.groups.armsBack, this.collisionGroups.players,
        [this.collisionGroups.enemies],
        this.parry, this, true);
      this.player.equip(
        'sword', this.groups.armsFront, this.collisionGroups.players,
        [this.collisionGroups.enemies],
        this.parry, this, false);
      this.player.rightFist.whooshSound = this.sounds.swish;
      this.enemy.equip(
        'sword', this.groups.armsBack, this.collisionGroups.enemies,
        [this.collisionGroups.players],
        this.parry, this, true);
      this.enemy.equip(
        'shield', this.groups.armsFront, this.collisionGroups.enemies,
        [this.collisionGroups.players],
        this.parry, this, false);
      this.enemy.leftFist.whooshSound = this.sounds.swish;
      break;
    case 3:
      this.player.equip2H(
        'spear', this.groups.armsFront, this.collisionGroups.players,
        [this.collisionGroups.enemies], this.parry, this);
      this.player.rightFist.whooshSound = this.sounds.whoosh;
      this.enemy.equip2H(
        'spear', this.groups.armsFront, this.collisionGroups.enemies,
        [this.collisionGroups.players], this.parry, this);
      this.enemy.leftFist.whooshSound = this.sounds.whoosh;
      break;
  }
};

GameState.prototype.update = function() {
  // Punch using keyboard
  // WSAD = right arm
  // cursors = left arm
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
    leftMove.x = 0.4;
    leftMove.y = 0.1;
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
    rightMove.x = -0.3;
    rightMove.y = 0.2;
  }
  this.player.rightFist.move(rightMove.x, rightMove.y);

  if (this.enemy) {
    // Check if controller connected
    if (this.game.input.gamepad.supported && this.game.input.gamepad.active &&
      this.pad1.connected) {
      if (!this.started) {
        this.enemyAnalogControls.alpha = 1;
        this.enemyBotControls.alpha = 0;
      }
      this.enemy.leftFist.move(
        this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X),
        this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y));
      this.enemy.rightFist.move(
        this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X),
        this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y));
    } else {
      if (!this.started) {
        this.enemyAnalogControls.alpha = 0;
        this.enemyBotControls.alpha = 1;
      }
      // Random kung fu moves for enemy
      move.update();
      if (move.isDone()) {
        this.enemy.leftFist.move(0, 0.3);
        this.enemy.rightFist.move(0, 0.3);
        move = randomMove();
      }
      move.apply(this.enemy.leftFist, this.enemy.rightFist);
    }
  }
  if (this.started) {
    // Players move towards each other as long as they are far enough
    var distance = Math.abs(this.player.body.x - this.enemy.body.x);

    var d = 40;
    switch (this.gameMode) {
      case 1:
        break;
      case 2:
        d += 20;
        break;
      case 3:
        d += 40;
        break;
    }
    if (distance > d*PLAYER_SCALE) {
      this.player.approach();
      this.enemy.approach();
    }

    // If any player is off the edge, stop the game
    if (this.player.x < 0 || this.enemy.x > GAME_WIDTH) {
      this.stop();
    }
  }

  this.game.stage.filters[1].update();
};

var IMPACT_SOUND_THRESHOLD = 190 * PLAYER_SCALE;
var IMPACT_SOUND_WEAPON_THRESHOLD = 140 * PLAYER_SCALE;

GameState.prototype.parry = function(b1, b2) {
  if (!b1.sprite || !b2.sprite) {
    return;
  }
  var v1 = new Phaser.Point(b1.velocity.x, b1.velocity.y);
  var v2 = new Phaser.Point(b2.velocity.x, b2.velocity.y);
  var impactForce = v1.getMagnitude() + v2.getMagnitude();
  if (impactForce > IMPACT_SOUND_THRESHOLD ||
    (impactForce > IMPACT_SOUND_WEAPON_THRESHOLD &&
      (b1.sprite.key == 'sword' || b1.sprite.key == 'spear'))) {
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
    } else if (b2.sprite.key == 'sword') {
      this.sounds.clang.play('', 0, 0.3);
    } else if (b2.sprite.key == 'spear') {
      this.sounds.wood.play('', 0, 0.3);
    } else {
      this.sounds.parry.play('', 0, 0.3);
    }
  }
}
