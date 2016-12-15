var Tetris = new Vue({
	data: {
		grid: [
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false],
			[false, false, false, false, false, false, false, false, false, false]
		],
		cycle: 0,
		timer: 0,
		delay: 750,
		interval: null,
		timeout: null,
		currentPiece: null,
		nextPiece: null,
		position: null,
		score: 0,
		isShiftable: false,
		pieces: {
			I: {
				data: [],
				color: 'red'
			},
			L: {
				data: [],
				color: 'blue'
			},
			J: {
				data: [],
				color: 'orange'
			},
			O: {
				data: [],
				color: 'yellow'
			},
			S: {
				data: [],
				color: 'magenta'
			},
			T: {
				data: [],
				color: 'cyan'
			},
			Z: {
				data: [],
				color: 'green'
			}
		},
	},
	el: '#tetris',
	created: function() {
		this.createPieces();
		console.log(this.pieces);
		this.start();
	},
	methods: {
		initializeEmptyGrid: function() {
			if (this.grid.length === 0) {
				var emptyRow = [];
				for (var j = 0; j < 10; j++) {
					emptyRow.push(false);
				}

				for (var i = 0; i < 20; i++) {
					this.grid[i] = emptyRow;
				}
			}
		},
		start: function() {
			var self = this;
			this.currentPiece = this.generateRandomTetrimino();
			this.nextPiece = this.generateRandomTetrimino();
			this.insert();
			this.interval = setInterval(this.move, this.delay);
		},
		restart: function() {
			clearInterval(this.interval);
			this.interval = setInterval(this.move, this.delay);
		},
		createPieces: function() {
			this.$set(this.pieces.I, 'data', [
						[false, false, false, this.pieces.I, this.pieces.I, this.pieces.I, this.pieces.I, false, false, false]
					]);

			this.$set(this.pieces.L, 'data', [
						[false, false, false, false, this.pieces.L, this.pieces.L, this.pieces.L, false, false, false],
						[false, false, false, false, this.pieces.L, false, false, false, false, false]
				]);

			this.$set(this.pieces.J, 'data', [
						[false, false, false, false, this.pieces.J, this.pieces.J, this.pieces.J, false, false, false],
						[false, false, false, false, false, false, this.pieces.J, false, false, false]
				]);

			this.$set(this.pieces.O, 'data', [
					[false, false, false, false, this.pieces.O, this.pieces.O, false, false, false, false],
					[false, false, false, false, this.pieces.O, this.pieces.O, false, false, false, false],
				]);

			this.$set(this.pieces.S, 'data', [
					[false, false, false, false, false, this.pieces.S, this.pieces.S, false, false, false],
					[false, false, false, false, this.pieces.S, this.pieces.S, false, false, false, false]
				]);

			this.$set(this.pieces.T, 'data', [
					[false, false, false, this.pieces.T, this.pieces.T, this.pieces.T, false, false, false, false],
					[false, false, false, false, this.pieces.T, false, false, false, false, false]
				]);

			this.$set(this.pieces.Z, 'data', [
					[false, false, false, false, this.pieces.Z, this.pieces.Z, false, false, false, false],
					[false, false, false, false, false, this.pieces.Z, this.pieces.Z, false, false, false]
				]);
		},
		generateRandomTetrimino: function() {
			var random = Math.random();
			var tetrimino = null;

			if (random <= 1/7) {
				tetrimino = this.pieces.I;
			} else if (random <= 2/7) {
				tetrimino = this.pieces.L;
			} else if (random <= 3/7) {
				tetrimino = this.pieces.J;
			} else if (random <= 4/7) {
				tetrimino = this.pieces.O;
			} else if (random <= 5/7) {
				tetrimino = this.pieces.S;
			} else if (random <= 6/7) {
				tetrimino = this.pieces.T;
			} else {
				tetrimino = this.pieces.Z;
			}

			return tetrimino;
		},
		insert: function() {
			console.log('inserting current piece ', this.currentPiece.color);
			console.log('data before ', this.currentPiece.data);
			for (var i = 0; i < this.currentPiece.data.length; i++) {
				this.grid[i] = this.currentPiece.data[i];
			}
			console.log('data after ', this.currentPiece.data);
		},
		calculatePosition: function() {
			var position = []; // array of tuples
			for (var row = 0; row < this.grid.length; row++) {
				for (var col = 0; col < this.grid[row].length; col++) {
					if (this.grid[row][col] !== false && !this.grid[row][col].isCemented) { // && this.grid[row][col].isCurrentPiece
						position.unshift([row, col]);
					}
				}
			}

			this.position = position;
		},
		move: function() {
			// get current position,
			// substract one from row coordinate on each cell
			console.log('moving ', this.currentPiece.color);
			if (!this.canMove()) {
				console.log('cant move');
				this.createPieces();
				this.cementCurrentPiece();
				this.currentPiece = this.nextPiece;
				this.nextPiece = this.generateRandomTetrimino();
				console.log('next: ', this.nextPiece.color, 'current: ', this.currentPiece.color);
				this.clearFullRows();
				this.insert();
				this.$forceUpdate();
				return;
			}

			for (var i = 0; i < this.position.length; i++) {
				var rowIndex = this.position[i][0];
				var colIndex  = this.position[i][1];
				var row = this.grid[rowIndex];
				var cell = this.grid[rowIndex][colIndex];
				this.$set(this.grid[rowIndex], colIndex, false);
				this.$set(this.grid[rowIndex + 1], colIndex, cell);
			}
		},
		canMove: function() {

			this.calculatePosition();

			for (var i = 0; i < this.position.length; i++) {
				var rowIndex = this.position[i][0];
				var colIndex = this.position[i][1];
				if (this.grid.length == (rowIndex + 1)) {
					return false;
				}

				if(this.grid[rowIndex + 1][colIndex] !== false && this.grid[rowIndex + 1][colIndex] != this.grid[rowIndex][colIndex]) {
					return false;
				}
			}
			return true;
		},
		stop: function() {
			clearInterval(this.interval);
		},
		cementCurrentPiece: function() {
			for (var i = 0; i < this.position.length; i++) {
				var row = this.position[i][0];
				var col = this.position[i][1];

				this.grid[row][col] = {
					color: this.currentPiece.color,
					isCemented: true
				};
			}
		},
		shiftLeft: function() {
			this.shift(-1);
		},
		shiftRight: function () {
			this.shift(1);
		},
		shift: function(n) {
			this.stop();
			this.calculatePosition();
			for (var i = 0; i < this.position.length; i++) {
				var row = this.position[i][0];
				var col = this.position[i][1];

				this.grid[row][col] = false;
			}

			for (var i = 0; i < this.position.length; i++) {
				var row = this.position[i][0];
				var col = this.position[i][1];

				this.grid[row][col + n] = this.currentPiece;
			}

			this.$forceUpdate();
			this.restart();
		},
		rotate: function() {
			this.stop();
			this.calculatePosition();

			var longestRow = null;

			var axisIndex = Math.round(this.position.length / 2);
			var axisCoordinate = this.position[axisIndex];

			for (var i = 0; i < this.position.length; i++) {

				if (i < axisIndex) {
					
				} else {
					
				}
				var row = this.position[i][0];
				var col = this.position[i][1];

				this.grid[col][row] = this.currentPiece;
				this.grid[row][col] = false;
			}

			this.restart();
		},
		clearFullRows: function() {
			var clearedRows = 0;
			for (var row = this.grid.length - 1; row >= 0; row--) {
				var isRowFull = true;
				var isRowEmpty = true;
				for (var col = 0; col < this.grid[row].length; col++) {
					if (this.grid[row][col] == false) {
						isRowFull = false;
					} else {
						isRowEmpty = false;
					}
				}

				// row is empty; no need to search further for full rows
				if (isRowEmpty) {
					break;
				}

				// row is full, splice it off the grid, insert empty row atop the grid
				if (isRowFull) {
					this.grid.splice(row, 1);
					this.grid.unshift([false, false, false, false, false, false, false, false, false, false]);
				}
			}
		}
	},
	watchers: {
	}
});
