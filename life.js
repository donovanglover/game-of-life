;(function() {
  "use strict";
  
  // The underscore is a good convention that enables you to change the name of the function with ease later.
  // By using the keyword "self", JavaScript automatically associates the constructor with the window object.
  var _ = self.Life = function(seed) {
    this.seed = seed;
    this.height = seed.length;
    this.width = seed[0].length;
    
    this.previousBoard = [];
    this.board = cloneArray(seed);
  };
  
  _.prototype = {
    next: function() {
      this.previousBoard = cloneArray(this.board);
      
      for(var y = 0; y < this.height; y++) {
        for(var x = 0; x < this.width; x++) {
          var neighbors = this.aliveNeighbors(this.previousBoard, x, y);
          var alive = !!this.board[y][x];
          if(alive) {
            if(neighbors < 2 || neighbors > 3) {
              this.board[y][x] = 0;
            }
          } else {
            if(neighbors === 3) {
              this.board[y][x] = 1;
            }
          }
        }
      }
    },
    
    oldAliveNeighbors: function(array, x, y) {
      // This is the old version of the aliveNeighbors() method.
      // It works, but it can be simplified (see the fixed version).
      var neighborsStillAlive = 0;
      
      // This is a safeguard for the array values because the previous row
      // and/or next row may not exist. We don't need to do this for the
      // current row because we already know it exists.
      var previousRow = array[y-1] || [];
      var nextRow = array[y+1] || [];
      
      var neighbors = [
        
        // Top 3 neighbors
        previousRow[x-1],
        previousRow[x],
        previousRow[x+1],
        
        // Left and right neighbors
        array[y][x-1],
        array[y][x+1],
        
        // Bottom 3 neighbors
        nextRow[x-1],
        nextRow[x],
        nextRow[x+1]
        
      ].forEach(function(neighbor) {
        // +undefined = NaN, which is not what we need.
        // !!undefined converts undefined to a boolean, which is false
        // +!!undefined will return undefined as 0 (a falsely value)
        neighborsStillAlive += +!!neighbor;
      });
      
      return neighborsStillAlive;
    },
    
    aliveNeighbors: function(array, x, y) {
      var previousRow = array[y-1] || [];
      var nextRow = array[y+1] || [];
      
      return [
        previousRow[x-1], previousRow[x], previousRow[x+1],
        array[y][x-1], array[y][x+1],
        nextRow[x-1], nextRow[x], nextRow[x+1]
      ].reduce(function(previousValue, currentValue) {
        return previousValue += +!!currentValue;
      }, 0);
    },
    
    toString: function() {
      return this.board.map(function(row) {
        return row.join(' ');
      }).join('\n');
    }
  };
  
  // Helper functions
  // Only clones 2D arrays
  // Note to self: Write a function that clones 3D arrays, 4D arrays, etc.
  function cloneArray(array) {
    return array.slice().map(function(row) {
      return row.slice();
    });
  }
  
})();

var game = new Life([
  // The snake
  /*
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0]
  */
  // The toad
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0]
]);

console.log(game + '');

game.next();

console.log(game + '');

game.next();

console.log(game + '');

game.next();

console.log(game + '');
