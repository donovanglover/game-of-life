// My retake at life.js, with some refactoring and minification...
;(function() {
  "use strict";
  
  var cloneArray = function(array) {
    return array.slice().map(function(row) {
      return row.slice();
    });
    
    // This function gets how many dimensions are in the array.
    // TODO: Perform array operations based on the number of dimensions returned.
    var i = 1, getDimensions = function(array) {
      if(Array.isArray(array[0])) {
        i++;
        return getDimensions(array[0]);
      } else {
        return i;
      }
    };
    var x = getDimensions(array);
  };
  
  var _ = self.Life = function(seed) {
    this.seed = seed;
    this.height = seed.length;
    this.width = seed[0].length;
    
    this.prevBoard = [];
    this.board = cloneArray(seed);
  };
  
  _.prototype = {
    next: function() {
      this.prevBoard = cloneArray(this.board);
      
      var neighbors, alive;
      for(var y = 0; y < this.height; y++) {
        for(var x = 0; x < this.width; x++) {
          neighbors = this.aliveNeighbors(this.prevBoard, x, y);
          alive = !!this.board[y][x];
          
          if(alive) {
            if(neighbors < 2 || neighbors > 3) this.board[y][x] = 0;
          } else {
            if(neighbors === 3) this.board[y][x] = 1;
          }
          
        }
      }
      
    },
    
    aliveNeighbors: function(array, x, y) {
      var prevRow = array[y-1] || [],
          nextRow = array[y+1] || [];
      
      return [
        prevRow[x-1], prevRow[x], prevRow[x+1],
        array[y][x-1], array[y][x+1],
        nextRow[x-1], nextRow[x], nextRow[x+1]
      ].reduce(function(prev, current) {
        return prev += +!!current;
      }, 0);
      
    }
  };
  
})();

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
      this.grid.innerHTML = "";
      this.checkboxes = [];
      var size = this.size;
      
      var row, cell, checkbox,
          fragment = document.createDocumentFragment();
      for(var y = 0; y < size; y++) {
        
        row = document.createElement("tr");
        this.checkboxes[y] = [];
        
        for(var x = 0; x < size; x++) {
          cell = document.createElement("td");
          checkbox = document.createElement("input");
          
          checkbox.type = "checkbox";
          this.checkboxes[y][x] = checkbox;
          checkbox.coords = [y, x];
          
          cell.appendChild(checkbox);
          row.appendChild(cell);
        }
        
        fragment.appendChild(row);
        
      }
      
      var me = this;
      this.grid.addEventListener("change", function(e) {
        if(e.target.nodeName.toLowerCase() === "input") {
          me.started = false;
        }
      });
      
      this.grid.addEventListener("keyup", function(e) {
        var checkbox = e.target;
        if(checkbox.nodeName.toLowerCase() === "input") {
          var coords = checkbox.coords, y = coords[0], x = coords[1];
          switch(e.keyCode) {
            case 37: return (x > 0) ? me.checkboxes[y][x-1].focus() : me.checkboxes[y][size-1].focus();
            case 38: return (y > 0) ? me.checkboxes[y-1][x].focus() : me.checkboxes[size-1][x].focus();
            case 39: return (x < size - 1) ? me.checkboxes[y][x+1].focus() : me.checkboxes[y][0].focus();
            case 40: return (y < size - 1) ? me.checkboxes[y+1][x].focus() : me.checkboxes[0][x].focus();
          }
        }
      });
      
      this.grid.appendChild(fragment);
      
    },
    
    get boardArray() {
      return this.checkboxes.map(function(row) {
        return row.map(function(checkbox) {
          return +checkbox.checked;
        });
      });
    },
    
    play: function() {
      this.game = new Life(this.boardArray);
      this.started = true;
    },
    
    next: function() {
      if(!this.started || this.game) {
        this.play();
      }
      
      this.game.next();
      
      var board = this.game.board, size = this.size;
      for(var y = 0; y < size; y++) {
        for(var x = 0; x < size; x++) {
          this.checkboxes[y][x].checked = !!board[y][x];
        }
      }
      
      var me = this;
      if(this.autoplay) {
        this.timer = setTimeout(function() {
          me.next();
        }, 1000);
      }
    }
    
  };
  
})();

var lifeView = new LifeView(document.getElementById("grid"), 15);

;(function() {
  var buttons = {
    next: document.getElementsByClassName("next")[0],
    autoplay: document.getElementById("autoplay")
  };
  
  buttons.next.addEventListener("click", function() {
    lifeView.next();
  });
  
  buttons.autoplay.addEventListener("change", function() {
    var x = this.checked;
    buttons.next.disabled = x;
    lifeView.autoplay = x;
    return x ? lifeView.next() : clearTimeout(lifeView.timer);
  });
  
})();
