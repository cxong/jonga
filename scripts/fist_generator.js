var FistGenerator = function(game, group, collisionGroup, collidesWith) {
  this.counter = 100;
  this.game = game;
  this.group = group;
  this.collisionGroup = collisionGroup;
  this.collidesWith = collidesWith;
};

FistGenerator.prototype.update = function() {
  this.counter--;
  if (this.counter <= 0) {
    this.counter = 100;
    var x, dx;
    if (Math.random() < 0.5) {
      x = -30;
      dx = SCREEN_WIDTH / 2;
    } else {
      x = SCREEN_WIDTH + 30;
      dx = -SCREEN_WIDTH / 2;
    }
    y = Math.random() * SCREEN_HEIGHT;
    dy = SCREEN_HEIGHT / 2 - y;
    dx *= 0.2;
    dy *= 0.2;
    new Thing(
      this.game, this.group, this.collisionGroup, this.collidesWith,
      x, y, dx, dy, 'fist_front');
    console.log("new thing at", x, y, dx, dy);
  }
};
