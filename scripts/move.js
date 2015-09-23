var Move = function() {
  // Moves are arrays of: [countUntil, movePos]
  this.movesLeft = [];
  this.movesRight = [];
  this.counter = 0;
};

Move.prototype.add = function(leftPos, leftCount, rightPos, rightCount) {
  if (leftCount > 0) {
    var count = leftCount;
    if (this.movesLeft.length > 0) {
      count += this.movesLeft[this.movesLeft.length - 1][0];
    }
    this.movesLeft.push([count, leftPos]);
  }
  if (rightCount > 0) {
    var count = rightCount;
    if (this.movesRight.length > 0) {
      count += this.movesRight[this.movesRight.length - 1][0];
    }
    this.movesRight.push([count, rightPos]);
  }
  return this;
};

Move.prototype.update = function() {
  this.counter++;
};

// Return current position of left and right arms
Move.prototype.getMoves = function() {
  var left = null;
  for (var i = 0; i < this.movesLeft.length; i++) {
    if (this.counter < this.movesLeft[i][0]) {
      left = this.movesLeft[i][1];
      break;
    }
  }
  var right = null;
  for (var i = 0; i < this.movesRight.length; i++) {
    if (this.counter < this.movesRight[i][0]) {
      right = this.movesRight[i][1];
      break;
    }
  }
  return [left, right];
};

Move.prototype.apply = function(fistLeft, fistRight) {
  var moves = this.getMoves();
  if (moves[0]) {
    fistLeft.move(moves[0][0], moves[0][1]);
  }
  if (moves[1]) {
    fistRight.move(moves[1][0], moves[1][1]);
  }
};

Move.prototype.isDone = function() {
  var moves = this.getMoves();
  return moves[0] == null && moves[1] == null;
};

var moveList = {
  rollPunch: function() {
    return new Move()
      .add([-1, 0], 30, [0, 0.2], 30)
      .add([0, 0.2], 30, [-1, 0], 30);
  },
  upperCut: function() {
    return new Move()
      .add([-0.2, 1], 30, null, 0)
      .add([-0.5, 0.5], 5, null, 0)
      .add([-1, 0.3], 5, null, 0)
      .add([-1, 0], 3, null, 0)
      .add([-1, -1], 5, null, 0)
      .add([-0.3, -1], 30, null, 0);
  },
  haymaker: function() {
    return new Move()
      .add([1, 0], 30, null, 0)
      .add([-1, 0], 20, null, 0);
  },
  jab: function() {
    return new Move()
      .add([0, 0], 20, null, 0)
      .add([-1, 0], 20, null, 0);
  },
  jabHigh: function() {
    return new Move()
      .add([0, 0], 20, null, 0)
      .add([-1, -0.3], 20, null, 0);
  },
  jabLow: function() {
    return new Move()
      .add([0, 0], 20, null, 0)
      .add([-1, 0.5], 20, null, 0);
  },
  karateChop: function() {
    return new Move()
      .add([0.2, -0.5], 20, null, 0)
      .add([-0.5, -0.3], 5, null, 0)
      .add([-1, 0], 5, null, 0)
      .add([-0.5, 0.3], 20, null, 0);
  },
  palmStrike: function() {
    return new Move()
      .add([0, 0], 20, null, 0)
      .add([-1, -0.3], 20, null, 0);
  },
  castingPunch: function() {
    return new Move()
      .add([0.2, 0.2], 30, [0.2, 0.2], 30)
      .add([-0.7, 0.1], 5, [-0.3, 0.2], 35)
      .add([-1, -0.1], 5, null, 0)
      .add([-0.7, -0.3], 20, null, 0);
  },
  supermanPunch: function() {
    return new Move()
      .add([0.2, -0.2], 30, [0.2, 0.3], 30)
      .add([-1, 0], 30, [-0.5, -0.2], 30);
  },
  windmillPunch: function() {
    return new Move()
      .add([-1, 0], 5, [1, 0], 5)
      .add([-0.7, 0.7], 5, [0.7, -0.7], 5)
      .add([0, 1], 5, [0, -1], 5)
      .add([0.7, 0.7], 5, [-0.7, -0.7], 5)
      .add([1, 0], 5, [-1, 0], 5)
      .add([0.7, -0.7], 5, [-0.7, 0.7], 5)
      .add([0, -1], 5, [0, 1], 5)
      .add([-0.7, -0.7], 5, [0.7, 0.7], 5);
  },
  windmillPunchReverse: function() {
    return new Move()
      .add([-1, 0], 5, [1, 0], 5)
      .add([-0.7, -0.7], 5, [0.7, 0.7], 5)
      .add([0, -1], 5, [0, 1], 5)
      .add([0.7, -0.7], 5, [-0.7, 0.7], 5)
      .add([1, 0], 5, [-1, 0], 5)
      .add([0.7, 0.7], 5, [-0.7, -0.7], 5)
      .add([0, 1], 5, [0, -1], 5)
      .add([-0.7, 0.7], 5, [0.7, -0.7], 5);
  },
  uPunch: function() {
    return new Move()
      .add([0, 0], 20, [0, 0], 20)
      .add([-1, 0.5], 20, [-1, -0.3], 20);
  },
  doublePunch: function() {
    return new Move()
      .add([0, 0], 20, [0, 0], 20)
      .add([-1, 0], 20, [-1, 0], 20);
  },
  roundhousePunch: function() {
    return new Move()
      .add([1, 0], 20, null, 0)
      .add([0.7, -0.7], 5, null, 0)
      .add([0, -1], 5, null, 0)
      .add([-0.7, -0.7], 5, null, 0)
      .add([-1, 0], 5, null, 0);
  }
};
var randomMove = function() {
  var keys = Object.keys(moveList);
  return moveList[keys[keys.length * Math.random() << 0]]();
};
