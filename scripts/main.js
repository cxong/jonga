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
    drums: this.game.add.sound('drums'),
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

  this.game.input.keyboard.addKey(Phaser.Keyboard.ONE).onDown.add(function(key) {
    if (this.game.started) {
      return;
    }
    this.player.equip(null, null, null, null, null, null, true);
    this.player.equip(null, null, null, null, null, null, false);
    this.enemy.equip(null, null, null, null, null, null, true);
    this.enemy.equip(null, null, null, null, null, null, false);
  }, this);
  this.game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.add(function(key) {
    if (this.game.started) {
      return;
    }
    this.player.equip(
      'shield', this.groups.armsBack, this.collisionGroups.players,
      [this.collisionGroups.enemies],
      this.parry, this, true);
    this.player.equip(
      'sword', this.groups.armsFront, this.collisionGroups.players,
      [this.collisionGroups.enemies],
      this.parry, this, false);
    this.enemy.equip(
      'sword', this.groups.armsBack, this.collisionGroups.enemies,
      [this.collisionGroups.players],
      this.parry, this, true);
    this.enemy.equip(
      'shield', this.groups.armsFront, this.collisionGroups.enemies,
      [this.collisionGroups.players],
      this.parry, this, false);
  }, this);
  this.game.input.keyboard.addKey(Phaser.Keyboard.THREE).onDown.add(function(key) {
    if (this.game.started) {
      return;
    }
    this.player.equip2H(
      'spear', this.groups.armsBack, this.collisionGroups.players,
      [this.collisionGroups.enemies], this.parry, this);
    this.enemy.equip2H(
      'spear', this.groups.armsBack, this.collisionGroups.enemies,
      [this.collisionGroups.players], this.parry, this);
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

  var enemyControls = this.game.add.sprite(
    GAME_WIDTH * 0.75, GAME_HEIGHT * 0.2, 'robot');
  enemyControls.anchor.setTo(0.5);
  this.groups.title.add(enemyControls);

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

  this.started = true;

  // Place players on opposite ends
  this.player.die();
  this.player = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.players,
    this.groups.armsBack, this.groups.armsFront,
    [this.collisionGroups.enemies], this.parry, this,
    80, PLAYER_Y, 'player', 1);
  if (this.enemy) {
    this.enemy.die();
  }
  this.enemy = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.enemies,
    this.groups.armsBack, this.groups.armsFront,
    [this.collisionGroups.players], this.parry, this,
    GAME_WIDTH - 80, PLAYER_Y, 'enemy', -1);
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
    GAME_WIDTH * 0.25, PLAYER_Y, 'player', 1);
  if (this.enemy) {
    this.enemy.die();
  }
  this.enemy = new Player(
    this.game,
    this.groups.bodies, this.collisionGroups.enemies,
    this.groups.armsBack, this.groups.armsFront,
    [this.collisionGroups.players], this.parry, this,
    GAME_WIDTH * 0.75, PLAYER_Y, 'enemy', -1);

  this.dummy = new Dummy(
    this.game, this.groups.dummy, this.collisionGroups.enemies,
    [this.collisionGroups.players], GAME_WIDTH / 2, PLAYER_Y + 3);
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
    leftMove.x = 0.3;
    leftMove.y = 0.2;
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
    rightMove.x = 0;
    rightMove.y = -0.4;
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
  }
  if (this.started) {
    // Players move towards each other as long as they are far enough
    var distance = Math.abs(this.player.body.x - this.enemy.body.x);

    var playerDistance = 40*PLAYER_SCALE;
    var playerWeapon = 0;
    if (this.player.leftWeapon) {
      playerWeapon = Math.max(this.player.leftWeapon.width * 0.5, playerWeapon);
    }
    if (this.player.rightWeapon) {
      playerWeapon = Math.max(this.player.rightWeapon.width * 0.5, playerWeapon);
    }
    if (distance > playerDistance + playerWeapon) {
      this.player.approach();
    }

    var enemyDistance = 40*PLAYER_SCALE;
    var enemyWeapon = 0;
    if (this.player.leftWeapon) {
      enemyWeapon = Math.max(this.enemy.leftWeapon.width * 0.5, enemyWeapon);
    }
    if (this.player.rightWeapon) {
      enemyWeapon = Math.max(this.enemy.rightWeapon.width * 0.5, enemyWeapon);
    }
    if (distance > enemyDistance + enemyWeapon) {
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

GameState.prototype.parry = function(b1, b2) {
  if (!b1.sprite || !b2.sprite) {
    return;
  }
  var v1 = new Phaser.Point(b1.velocity.x, b1.velocity.y);
  var v2 = new Phaser.Point(b2.velocity.x, b2.velocity.y);
  var impactForce = v1.getMagnitude() + v2.getMagnitude();
  if (impactForce > IMPACT_SOUND_THRESHOLD || b1.sprite.key == 'sword'
   || b1.sprite.key == 'spear') {
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
