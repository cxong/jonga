var Arm = function(
  game, group, collisionGroup, collidesWith, collideFunc, collideContext,
  x, y, sprite) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  game.physics.p2.enable(this, false);
  this.scale.setTo(PLAYER_SCALE);
  this.body.setRectangle(this.width, this.height);
  this.body.setCollisionGroup(collisionGroup);
  this.body.collides(collidesWith, collideFunc, collideContext);
  this.body.mass = 0.1;
  group.add(this);
};
Arm.prototype = Object.create(Phaser.Sprite.prototype);
Arm.prototype.constructor = Arm;
