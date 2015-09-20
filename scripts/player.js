var PLAYER_ARM_LENGTH = 0.43;
var PLAYER_FIST_SPEED = PLAYER_SCALE*20;
var ARM_FORCE = 1000;

var Player = function(
  game, group, collisionGroup, collidesWith,
  fists, fistsCollisionGroup, fistsCollidesWith, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'player');
  this.anchor.setTo(0.5);
  this.scale.setTo(PLAYER_SCALE);
  // TODO: player body
  game.physics.p2.enable(this, false);
  this.body.static = true;
  group.add(this);

  // Shoulder positions
  var sx = 0.18*this.width;
  var sy = -0.27*this.height;
  var leftShoulder = new Phaser.Point(x - sx, y + sy);
  var rightShoulder = new Phaser.Point(x + sx, y + sy);

  // Add some arms and fists
  this.rightArmUpper = new Arm(
    game, fists, fistsCollisionGroup, fistsCollidesWith, parry, this, null,
    rightShoulder.x, rightShoulder.y, 'arm_upper');
  this.leftArmUpper = new Arm(
    game, fists, fistsCollisionGroup, fistsCollidesWith, parry, this, null,
    leftShoulder.x, leftShoulder.y, 'arm_upper');

  game.physics.p2.createRevoluteConstraint(
    this, [sx, sy],
    this.rightArmUpper,
    [-this.rightArmUpper.width / 2 + this.rightArmUpper.height / 2, 0],
    ARM_FORCE);
  game.physics.p2.createRevoluteConstraint(
    this, [-sx, sy],
    this.leftArmUpper,
    [-this.leftArmUpper.width / 2 + this.leftArmUpper.height / 2, 0],
    ARM_FORCE);

  this.rightArmLower = new Arm(
    game, fists, fistsCollisionGroup, fistsCollidesWith, parry,
    this.rightArmUpper, this.rightFist,
    rightShoulder.x, rightShoulder.y, 'arm_lower');
  this.leftArmLower = new Arm(
    game, fists, fistsCollisionGroup, fistsCollidesWith, parry,
    this.leftArmUpper, this.leftFist,
    leftShoulder.x, leftShoulder.y, 'arm_lower');

  game.physics.p2.createRevoluteConstraint(
    this.rightArmUpper, [this.rightArmUpper.width / 2, 0],
    this.rightArmLower, [-this.rightArmLower.width*0.4, 0], ARM_FORCE);
  game.physics.p2.createRevoluteConstraint(
    this.leftArmUpper, [this.leftArmUpper.width / 2, 0],
    this.leftArmLower, [-this.leftArmLower.width*0.4, 0], ARM_FORCE);

  this.rightFist = new Fist(
    game, fists, fistsCollisionGroup, fistsCollidesWith, parry,
    rightShoulder.x, rightShoulder.y, 'fist', 1,
    PLAYER_ARM_LENGTH*this.height, this.rightArmLower, PLAYER_FIST_SPEED);
  this.leftFist = new Fist(
    game, fists, fistsCollisionGroup, fistsCollidesWith, parry,
    leftShoulder.x, leftShoulder.y, 'fist', 0,
    PLAYER_ARM_LENGTH*this.height, this.leftArmLower, PLAYER_FIST_SPEED);

  game.physics.p2.createRevoluteConstraint(
    this.rightArmLower,
    [this.rightArmLower.width / 2 + this.rightFist.width / 3, 0],
    this.rightFist, [0, 0], ARM_FORCE);
  game.physics.p2.createRevoluteConstraint(
    this.leftArmLower,
    [this.leftArmLower.width / 2 + this.rightFist.width / 3, 0],
    this.leftFist, [0, 0], ARM_FORCE);
};
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  //
};
