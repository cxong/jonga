var DEADZONE = 10;
var WHOOSH_SPEED_THRESHOLD = 800;

var Fist = function(game, group, x, y, sprite, armLength, speed) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.anchor.setTo(0.5);
  this.scale.setTo(PLAYER_SCALE);
  game.physics.p2.enable(this);
  this.body.setCircle(this.width / 2);
  this.body.damping = 0.3;
  group.add(this);

  this.armLength = armLength;
  this.speed = speed;
  this.movePos = new Phaser.Point();
  this.shoulderPos = new Phaser.Point(x, y);

  this.whooshSound = game.add.sound('whoosh');
};
Fist.prototype = Object.create(Phaser.Sprite.prototype);
Fist.prototype.constructor = Fist;

Fist.prototype.move = function(x, y) {
  this.movePos = new Phaser.Point(x, y);
};

Fist.prototype.update = function() {
  // accelerate towards target
  var target = this.movePos
    .multiply(this.armLength, this.armLength)
    .add(this.shoulderPos.x, this.shoulderPos.y);
  var d = target.subtract(this.x, this.y);
  // Deadzone
  if (d.getMagnitude() < DEADZONE) {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  } else {
    var angle = Math.atan2(d.y, d.x);
    // Decay the speed half linearly based on distance to target
    var distance = Math.sqrt(d.x*d.x + d.y*d.y);
    var speed = this.speed*(distance/this.armLength*0.5 + 0.5);
    var moveD = new Phaser.Point(Math.cos(angle), Math.sin(angle))
      .multiply(speed, speed);
    this.body.velocity.x = moveD.x;
    this.body.velocity.y = moveD.y;
    var v = new Phaser.Point(this.body.velocity.x, this.body.velocity.y);
    console.log(v.getMagnitude());
    if (v.getMagnitude() > WHOOSH_SPEED_THRESHOLD &&
      !this.whooshSound.isPlaying) {
      this.whooshSound.play();
    }
  }
  // Don't let fists exceed arm length
  var armPos = new Phaser.Point(this.x, this.y)
    .subtract(this.shoulderPos.x, this.shoulderPos.y);
  if (armPos.getMagnitude() > this.armLength) {
    armPos = armPos.setMagnitude(this.armLength);
    this.body.x = this.shoulderPos.x + armPos.x;
    this.body.y = this.shoulderPos.y + armPos.y;
  }
};
