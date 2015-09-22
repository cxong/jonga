var PLAYER_ARM_LENGTH = 0.35;
var PLAYER_FIST_SPEED = PLAYER_SCALE*20;
var ARM_FORCE = 1000;

var Player = function(
  game, group, collisionGroup, collidesWith,
  fists_back, fists, fistsCollisionGroup, fistsCollidesWith, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'player');
  this.anchor.setTo(0.5);
  this.scale.setTo(PLAYER_SCALE);
  // TODO: player body
  game.physics.p2.enable(this, false);
  this.body.static = true;
  group.add(this);

  // Shoulder positions
  var sx = 0.05*this.width;
  var sy = -0.27*this.height;
  var leftShoulder = new Phaser.Point(x - sx, y + sy);
  var rightShoulder = new Phaser.Point(x + sx, y + sy);

  // Add some arms and fists
  var addArm = function(player, layer, shoulder, _sx, frame) {
    var upper = new Arm(
      game, layer, fistsCollisionGroup, fistsCollidesWith, parry,
      shoulder.x, shoulder.y, 'arm_upper');
    game.physics.p2.createRevoluteConstraint(
      player, [_sx, sy], upper, [-upper.width / 2 + upper.height / 2, 0],
      ARM_FORCE);
    var lower = new Arm(
      game, layer, fistsCollisionGroup, fistsCollidesWith, parry,
      shoulder.x, shoulder.y, 'arm_lower');
    game.physics.p2.createRevoluteConstraint(
      upper, [upper.width / 2, 0], lower, [-lower.width*0.4, 0], ARM_FORCE);
    var fist = new Fist(
      game, layer, fistsCollisionGroup, fistsCollidesWith, parry,
      shoulder.x, shoulder.y, 'fist', frame,
      PLAYER_ARM_LENGTH*player.height, lower, PLAYER_FIST_SPEED);
    game.physics.p2.createRevoluteConstraint(
      lower, [lower.width / 2 + fist.width / 3, 0], fist, [0, 0], ARM_FORCE);
    return [upper, lower, fist];
  };
  var right = addArm(this, fists_back, rightShoulder, sx, 1);
  this.rightArmUpper = right[0];
  this.rightArmLower = right[1];
  this.rightFist = right[2];
  var left = addArm(this, fists, leftShoulder, -sx, 0);
  this.leftArmUpper = left[0];
  this.leftArmLower = left[1];
  this.leftFist = left[2];
};
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  //
};
