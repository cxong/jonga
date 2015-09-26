var Dummy = function(game, group, collisionGroup, collidesWith, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'dummy');
  this.anchor.setTo(0.5);
  this.scale.setTo(PLAYER_SCALE);
  this.scale.x *= -1;
  group.add(this);

  // The dummy contains two collidable parts: the arms
  var setupArm = function(_x, _y, sprite) {
    var arm = game.add.sprite(_x, _y, sprite);
    game.physics.p2.enable(arm);
    arm.body.setRectangleFromSprite(arm);
    arm.body.setCollisionGroup(collisionGroup);
    arm.body.collides(collidesWith);
    arm.scale.setTo(PLAYER_SCALE);
    arm.scale.x *= -1;
    arm.body.static = true;
    group.add(arm);
    return arm;
  };
  this.armUpper = setupArm(
    x - 9*PLAYER_SCALE, y - 22*PLAYER_SCALE, 'dummy_arm_upper');
  this.armLower = setupArm(
    x - 8*PLAYER_SCALE, y + 2*PLAYER_SCALE, 'dummy_arm_lower');
};
Dummy.prototype = Object.create(Phaser.Sprite.prototype);
Dummy.prototype.constructor = Dummy;
