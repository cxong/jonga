var Fist = function(game, group, x, y, sprite, armLength, speed) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.anchor.setTo(0.5);
  this.scale.setTo(PLAYER_SCALE);
  game.physics.p2.enable(this);
  this.body.setCircle(this.width / 2);
  group.add(this);

  this.armLength = armLength;
  this.speed = speed;
  this.movePos = {x:0, y:0};
  this.shoulderPos = {x:x, y:y};
};
Fist.prototype = Object.create(Phaser.Sprite.prototype);
Fist.prototype.constructor = Fist;

Fist.prototype.move = function(x, y) {
  this.movePos.x = x;
  this.movePos.y = y;
};

Fist.prototype.update = function() {
  // accelerate towards target
  var target = {
    x:this.movePos.x*this.armLength + this.shoulderPos.x,
    y:this.movePos.y*this.armLength + this.shoulderPos.y};
  var angle = Math.atan2(target.y - this.y, target.x - this.x);
  this.body.force.x += Math.cos(angle)*this.speed;
  this.body.force.y = Math.sin(angle)*this.speed;
};
