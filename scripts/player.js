var Player = function(game, group, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'player');
  this.scale.setTo(3);
  group.add(this);
};
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  //
};
