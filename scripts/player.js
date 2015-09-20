var PLAYER_ARM_LENGTH = 0.45;
var PLAYER_FIST_SPEED = PLAYER_SCALE*50;

var Player = function(game, group, fists, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'player');
  this.anchor.setTo(0.5);
  this.scale.setTo(PLAYER_SCALE);
  group.add(this);

  this.leftFist = new Fist(
    game, fists, x - 0.2*this.width, y - 0.27*this.height, 'fist_back',
    PLAYER_ARM_LENGTH*this.height, PLAYER_FIST_SPEED);
  this.rightFist = new Fist(
    game, fists, x + 0.2*this.width, y - 0.27*this.height, 'fist_front',
    PLAYER_ARM_LENGTH*this.height, PLAYER_FIST_SPEED);
};
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  //
};
