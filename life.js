// Mini version of jQuery!
function $(selector, container) {
  return (container || document).querySelector(selector);
}

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

;(function() {
  "use strict";
  
  var _ = self.LifeView = function(table, size) {
    this.grid = table;
    this.size = size;
    this.started = false;
    this.autoplay = false;
    
    this.createGrid();
  };
  
  _.prototype = {
    createGrid: function() {
      var me = this;
      
      var fragment = document.createDocumentFragment();
      this.grid.innerHTML = "";
      this.checkboxes = [];
      
      for(var y = 0; y < this.size; y++) {
        
        var row = document.createElement("tr");
        this.checkboxes[y] = [];
        
        for(var x = 0; x < this.size; x++) {
          var cell = document.createElement("td");
          var checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          this.checkboxes[y][x] = checkbox;
          
          cell.appendChild(checkbox);
          row.appendChild(cell);
        }
        
        fragment.appendChild(row);
        
      }
      
      this.grid.addEventListener("change", function(event) {
        if(event.target.nodeName.toLowerCase() == "input") {
          me.started = false;
        }
      });
      
      this.grid.appendChild(fragment);
      
    },
    
    get boardArray() {
      return this.checkboxes.map(function(row) {
        return row.map(function(checkbox) {
          return +checkbox.checked; // Convert boolean value to number
        });
      });
    },
    
    play: function() {
      this.game = new Life(this.boardArray);
      this.started = true;
    },
    
    next: function() {
      var me = this;
      
      if(!this.started || this.game) {
        this.play();
      }
      this.game.next();
      var board = this.game.board;
      
      for(var y = 0; y < this.size; y++) {
        for(var x = 0; x < this.size; x++) {
          this.checkboxes[y][x].checked = !!board[y][x];
        }
      }
      
      if(this.autoplay) {
        this.timer = setTimeout(function() {
          me.next();
        }, 1000);
      }
    }
  };
  
})();

var lifeView = new LifeView(document.getElementById("grid"), 12);

;(function() {
  
  var buttons = {
    next: $("button.next")
  };
  
  buttons.next.addEventListener("click", function() {
    lifeView.next();
  });

  $("#autoplay").addEventListener("change", function() {
    buttons.next.textContent = this.checked ? "Start" : "Next";
    lifeView.autoplay = this.checked;
    
    if(!this.checked) {
      clearTimeout(lifeView.timer);
    }
    
  });

})();
