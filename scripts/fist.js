var DEADZONE = 5;
var MOVE_DEADZONE = 20;
var FIST_FORCE_MULTIPLIER = 100;
var WHOOSH_SPEED_THRESHOLD = 770;

var Fist = function(
  game, group, collisionGroup, collidesWith, collideFunc, x, y, sprite, frame,
  armLength, arm, speed) {
  Phaser.Sprite.call(this, game, x, y, sprite);
  this.anchor.setTo(0.5);
  this.scale.setTo(PLAYER_SCALE);
  game.physics.p2.enable(this);
  this.body.setCircle(this.width / 2);
  this.body.damping = 0.5;
  this.body.setCollisionGroup(collisionGroup);
  this.body.collides(collidesWith, collideFunc, this);
  this.body.fixedRotation = true;
  group.add(this);

  this.armLength = armLength;
  this.speed = speed;
  this.movePos = new Phaser.Point(0, 0);
  this.shoulderPos = new Phaser.Point(x, y);
  this.arm = arm;

  this.parrySound = game.add.sound('parry');
  this.whooshSound = game.add.sound('whoosh');

  // Choose fist frame based on angle
  this.frameD = frame;
  this.frame = frame;
};
Fist.prototype = Object.create(Phaser.Sprite.prototype);
Fist.prototype.constructor = Fist;

Fist.prototype.move = function(x, y) {
  this.movePos = new Phaser.Point(x, y);
  if (this.movePos.getMagnitude() > 1) {
    this.movePos.setMagnitude(1);
  }
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
    this.body.force.x = 0;
    this.body.force.y = 0;
  } else {
    var angle = Math.atan2(d.y, d.x);
    // Decay the speed half linearly based on distance to target
    var distance = Math.sqrt(d.x*d.x + d.y*d.y);
    var speed = this.speed*(distance/this.armLength*0.5 + 0.5);
    var moveD = new Phaser.Point(Math.cos(angle), Math.sin(angle))
      .multiply(speed, speed);
    if (d.getMagnitude() < MOVE_DEADZONE) {
      this.body.velocity.x = moveD.x;
      this.body.velocity.y = moveD.y;
    } else {
      this.body.force.x += moveD.x*FIST_FORCE_MULTIPLIER;
      this.body.force.y += moveD.y*FIST_FORCE_MULTIPLIER;
    }
    var v = new Phaser.Point(this.body.velocity.x, this.body.velocity.y);
    //console.log(v.getMagnitude());
    //console.log(d.getMagnitude());
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

  // Keep rotation the same as arm
  this.rotation = this.arm.body.rotation;
  while (this.rotation > Math.PI*2) {
    this.rotation -= Math.PI*2;
  }
  while (this.rotation < 0) {
    this.rotation += Math.PI*2;
  }
  // Flip fists based on rotation
  // >7/4pi, <1/4pi = frame 0
  // >3/4pi, <5/4pi = frame 1
  // Otherwise don't bother changing frame - prevent flickering frames
  if (this.rotation > 0.75*Math.PI && this.rotation < 1.25*Math.PI) {
    this.frame = 1 - this.frameD;
  } else if (this.rotation > 1.75*Math.PI || this.rotation < 0.25*Math.PI) {
    this.frame = this.frameD;
  }
};
