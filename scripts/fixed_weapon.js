var FixedWeapon = function(
  game, group, collisionGroup, collidesWith, collideFunc, collideContext, fist,
  x, y, sprite) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  game.physics.p2.enable(this, false);
  this.scale.setTo(PLAYER_SCALE);
  this.body.setRectangle(this.width, this.height, this.width / 2 - fist.width / 2, 0);
  this.body.setCollisionGroup(collisionGroup);
  this.body.collides(collidesWith, collideFunc, collideContext);
  this.body.mass = 1;
  this.anchor.x = fist.width / this.width / 2;
  this.body.fixedRotation = true;
  group.add(this);

  this.fist = fist;
};
FixedWeapon.prototype = Object.create(Phaser.Sprite.prototype);
FixedWeapon.prototype.constructor = FixedWeapon;

FixedWeapon.prototype.update = function() {
  // Keep weapon fixed rotation in relation to fist
  this.rotation = this.fist.rotation;
  while (this.rotation > Math.PI*2) {
    this.rotation -= Math.PI*2;
  }
  while (this.rotation < 0) {
    this.rotation += Math.PI*2;
  }
  this.body.rotation = this.rotation;
};
