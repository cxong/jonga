var Arm = function(
  game, group, collisionGroup, collidesWith, collideFunc, x, y, sprite) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.anchor.setTo(0.5);
  this.scale.setTo(PLAYER_SCALE);
  game.physics.p2.enable(this, false);
  this.body.setRectangle(this.width, this.height);
  this.body.setCollisionGroup(collisionGroup);
  this.body.collides(collidesWith, collideFunc, this);
  this.body.mass = 0.1;
  group.add(this);
};
Arm.prototype = Object.create(Phaser.Sprite.prototype);
Arm.prototype.constructor = Arm;
