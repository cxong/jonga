var Thing = function(
  game, group, collisionGroup, collidesWith, x, y, dx, dy, sprite) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.anchor.setTo(0.5);
  this.scale.setTo(PLAYER_SCALE);
  game.physics.p2.enable(this);
  this.body.setCircle(this.width / 2);
  this.body.setCollisionGroup(collisionGroup);
  this.body.collides(collidesWith);
  this.body.mass = 10;
  group.add(this);

  this.body.velocity.x = dx;
  this.body.velocity.y = dy;
};
Thing.prototype = Object.create(Phaser.Sprite.prototype);
Thing.prototype.constructor = Thing;
