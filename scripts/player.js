var PLAYER_ARM_LENGTH = 45*PLAYER_SCALE;
var PLAYER_FIST_SPEED = PLAYER_SCALE*20;
var ARM_FORCE = 1000;
var TORSO_ROTATE_SPEED = 0.06;

var Player = function(
  game, group, collisionGroup,
  fists_back, fists, fistsCollidesWith, collideFunc, collideContext,
  x, y, sprite, xscale, whooshSound) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.anchor.setTo(0.5);
  // TODO: player body
  game.physics.p2.enable(this, false);
  this.scale.setTo(PLAYER_SCALE);
  this.scale.x *= xscale;
  this.body.static = true;
  group.add(this);

  this.game = game;
  this.constraints = [];

  this.torso = game.add.sprite(x - 2*xscale, y - 8, 'torso');
  game.physics.p2.enable(this.torso, false);
  this.torso.scale.setTo(PLAYER_SCALE);
  this.torso.anchor.setTo(0.5, 0.9);
  this.torso.body.setRectangle(this.torso.width, this.torso.height);
  this.torso.scale.x *= xscale;
  this.torso.body.setCollisionGroup(collisionGroup);
  this.torso.body.collides(fistsCollidesWith, collideFunc, collideContext);
  this.torso.body.static = true;
  this.torso.body.rotation = 0.3;
  group.add(this.torso);

  this.head = game.add.sprite(
    this.torso.x + 3*xscale, this.torso.y - 60, 'head');
  game.physics.p2.enable(this.head, false);
  this.head.scale.setTo(PLAYER_SCALE);
  this.head.body.setCircle(this.head.width / 2);
  this.head.scale.x *= xscale;
  this.constraints.push(game.physics.p2.createRevoluteConstraint(
    this.torso, [3*xscale, -1.05*this.torso.height], this.head, [0, 0],
    ARM_FORCE));
  this.head.body.setCollisionGroup(collisionGroup);
  this.head.body.collides(fistsCollidesWith, collideFunc, collideContext);
  this.head.body.fixedRotation = true;
  group.add(this.head);

  // Shoulder positions
  var sx = 0.2*this.torso.width;
  var sy = -0.7*this.torso.height;
  var leftShoulder = new Phaser.Point(this.torso.x + sx, this.torso.y + sy);
  var rightShoulder = new Phaser.Point(this.torso.x - sx, this.torso.y + sy);

  // Add some arms and fists
  var addArm = function(player, layer, shoulder, _sx, frame) {
    var upper = new Arm(
      game, layer,
      collisionGroup, fistsCollidesWith, collideFunc, collideContext,
      shoulder.x, shoulder.y, 'arm_upper');
    player.constraints.push(game.physics.p2.createRevoluteConstraint(
      player.torso, [_sx, sy],
      upper, [-upper.width / 2 + upper.height / 2, 0],
      ARM_FORCE));
    var lower = new Arm(
      game, layer,
      collisionGroup, fistsCollidesWith, collideFunc, collideContext,
      shoulder.x, shoulder.y, 'arm_lower');
    player.constraints.push(game.physics.p2.createRevoluteConstraint(
      upper, [upper.width / 2, 0], lower, [-lower.width*0.4, 0], ARM_FORCE));
    var fist = new Fist(
      game, layer,
      collisionGroup, fistsCollidesWith, collideFunc, collideContext,
      shoulder.x - player.x, shoulder.y - player.y, player,
      'fist', frame,
      PLAYER_ARM_LENGTH, lower, PLAYER_FIST_SPEED, whooshSound);
    player.constraints.push(game.physics.p2.createRevoluteConstraint(
      lower, [lower.width / 2 + fist.width / 3, 0], fist, [0, 0], ARM_FORCE));
    return [upper, lower, fist];
  };
  var left = addArm(this, fists_back, rightShoulder, sx, 1);
  var right = addArm(this, fists, leftShoulder, -sx, 0);
  this.rightArmUpper = right[0];
  this.rightArmLower = right[1];
  this.rightFist = right[2];
  this.leftArmUpper = left[0];
  this.leftArmLower = left[1];
  this.leftFist = left[2];
};
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.equip = function(
  sprite, group, collisionGroup, fistsCollidesWith,
  collideFunc, collideContext, isLeft) {
  this.unequip(isLeft);
  if (isLeft) {
    if (sprite) {
      this.leftWeapon = new FixedWeapon(
        this.game, group,
        collisionGroup, fistsCollidesWith, collideFunc, collideContext,
        this.leftFist, this.leftFist.x, this.leftFist.y, sprite);
      this.leftWeaponConstraint = this.game.physics.p2.createRevoluteConstraint(
        this.leftFist, [0, 0], this.leftWeapon, [0, 0],
        ARM_FORCE);
    }
  } else {
    if (sprite) {
      this.rightWeapon = new FixedWeapon(
        this.game, group,
        collisionGroup, fistsCollidesWith, collideFunc, collideContext,
        this.rightFist, this.rightFist.x, this.rightFist.y, sprite);
      this.rightWeaponConstraint = this.game.physics.p2.createRevoluteConstraint(
        this.rightFist, [0, 0], this.rightWeapon, [0, 0],
        ARM_FORCE);
    }
  }
};

Player.prototype.equip2H = function(
  sprite, group, collisionGroup, fistsCollidesWith,
  collideFunc, collideContext) {
  this.unequip(true);
  this.unequip(false);
  if (sprite) {
    this.rightWeapon = new HandedWeapon(
      this.game, group,
      collisionGroup, fistsCollidesWith, collideFunc, collideContext,
      this.leftFist.x, this.leftFist.y, sprite);
    this.leftWeaponConstraint = this.game.physics.p2.createRevoluteConstraint(
      this.leftFist, [0, 0], this.rightWeapon, [0, 0],
      ARM_FORCE);
    this.rightWeaponConstraint = this.game.physics.p2.createRevoluteConstraint(
      this.rightFist, [0, 0], this.rightWeapon,
      [-this.rightWeapon.width / 2 + this.rightFist.width * 2, 0],
      ARM_FORCE);
  }
};

Player.prototype.unequip = function(isLeft) {
  if (isLeft) {
    if (this.leftWeaponConstraint) {
      this.game.physics.p2.removeConstraint(this.leftWeaponConstraint);
      this.leftWeaponConstraint = null;
    }
    if (this.leftWeapon) {
      this.leftWeapon.destroy();
      this.leftWeapon = null;
    }
  } else {
    if (this.rightWeaponConstraint) {
      this.game.physics.p2.removeConstraint(this.rightWeaponConstraint);
      this.rightWeaponConstraint = null;
    }
    if (this.rightWeapon) {
      this.rightWeapon.destroy();
      this.rightWeapon = null;
    }
  }
};

Player.prototype.update = function() {
  // Update torso rotation based on the two fists' move pos
  var averageFists = (this.leftFist.movePos.x + this.rightFist.movePos.x) / 2;
  var torsoRotation = averageFists * 0.6;
  if (this.torso.body.rotation + TORSO_ROTATE_SPEED < torsoRotation) {
    this.torso.body.rotation += TORSO_ROTATE_SPEED;
  } else if (this.torso.body.rotation - TORSO_ROTATE_SPEED > torsoRotation) {
    this.torso.body.rotation -= TORSO_ROTATE_SPEED;
  } else {
    this.torso.body.rotation = torsoRotation;
  }
};

var IMPACT_PUSHBACK_FACTOR = 0.02;

Player.prototype.impulse = function(x) {
  var dx = -this.scale.x * x * IMPACT_PUSHBACK_FACTOR;
  this.body.x += dx;
  this.torso.body.x += dx;
  this.head.body.x += dx;
};

var APPROACH_SPEED = 0.3;

Player.prototype.approach = function() {
  var dx = this.scale.x * APPROACH_SPEED;
  this.body.x += dx;
  this.torso.body.x += dx;
  this.head.body.x += dx;
};

Player.prototype.die = function() {
  for (var i = 0; i < this.constraints.length; i++) {
    this.game.physics.p2.removeConstraint(this.constraints[i]);
  }
  this.unequip(true);
  this.unequip(false);
  this.rightFist.destroy();
  this.rightArmLower.destroy();
  this.rightArmUpper.destroy();
  this.leftFist.destroy();
  this.leftArmLower.destroy();
  this.leftArmUpper.destroy();
  this.head.destroy();
  this.torso.destroy();
  this.destroy();
};
