/* 五子棋对战页面（复古风格）
 * 分层：常量 → 状态 → 规则 → 绘制 → 事件编排
 * 纯前端、零依赖，黑方先行，连五即胜。
 */
(function () {
  'use strict';

  /* ------------------------------ 常量 ------------------------------ */
  var SIZE = 15;              // 棋盘交叉点数（15×15）
  var CELL = 30;              // 绘制用格距（像素，逻辑尺寸）
  var PADDING = CELL;         // 首尾格留白
  var CANVAS_SIZE = PADDING * 2 + CELL * (SIZE - 1); // 480

  var EMPTY = 0;
  var BLACK = 1;
  var WHITE = 2;

  var STATUS = {
    RUNNING: 'running',
    BLACK_WIN: 'blackWin',
    WHITE_WIN: 'whiteWin',
    DRAW: 'draw'
  };

  // 星位（行 3/11、列 3/11，及天元 7/7）
  var STARS = [[3, 3], [3, 11], [7, 7], [11, 3], [11, 11]];

  // 判胜方向向量：竖、横、主斜、副斜
  var DIRECTIONS = [[1, 0], [0, 1], [1, 1], [1, -1]];

  /* ------------------------------ 状态 ------------------------------ */
  var state = {
    board: null,         // number[][]，EMPTY/BLACK/WHITE
    currentPlayer: BLACK,
    status: STATUS.RUNNING,
    lastMove: null,      // { row, col } | null
    piecesCount: 0
  };

  function createBoard() {
    var board = [];
    for (var r = 0; r < SIZE; r++) {
      var row = [];
      for (var c = 0; c < SIZE; c++) {
        row.push(EMPTY);
      }
      board.push(row);
    }
    return board;
  }

  function reset() {
    state.board = createBoard();
    state.currentPlayer = BLACK;
    state.status = STATUS.RUNNING;
    state.lastMove = null;
    state.piecesCount = 0;
  }

  /* ------------------------------ 规则 ------------------------------ */
  // 合法性校验：越界、占用、终局均判非法
  function isValid(row, col) {
    if (state.status !== STATUS.RUNNING) return false;
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return false;
    return state.board[row][col] === EMPTY;
  }

  // 以最新落子为中心，4 个直线方向计数，连五即胜
  function checkWin(board, row, col, player) {
    for (var d = 0; d < DIRECTIONS.length; d++) {
      var dr = DIRECTIONS[d][0];
      var dc = DIRECTIONS[d][1];
      var count = 1;

      // 正向延伸
      var r = row + dr;
      var c = col + dc;
      while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === player) {
        count++;
        r += dr;
        c += dc;
      }
      // 反向延伸
      r = row - dr;
      c = col - dc;
      while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === player) {
        count++;
        r -= dr;
        c -= dc;
      }

      if (count >= 5) return true;
    }
    return false;
  }

  function isDraw() {
    return state.piecesCount >= SIZE * SIZE;
  }

  // 落子主流程：合法 → 写入 → 判胜/平 → 切换轮次，返回是否成功落子
  function placeStone(row, col) {
    if (!isValid(row, col)) return false;

    var player = state.currentPlayer;
    state.board[row][col] = player;
    state.lastMove = { row: row, col: col };
    state.piecesCount++;

    if (checkWin(state.board, row, col, player)) {
      state.status = player === BLACK ? STATUS.BLACK_WIN : STATUS.WHITE_WIN;
    } else if (isDraw()) {
      state.status = STATUS.DRAW;
    } else {
      state.currentPlayer = player === BLACK ? WHITE : BLACK;
    }

    render();
    return true;
  }

  /* ------------------------------ 绘制 ------------------------------ */
  var canvas;
  var ctx;

  function initCanvas() {
    canvas = document.getElementById('board');
    ctx = canvas.getContext('2d');

    // 高分屏适配：逻辑尺寸不变，画布像素按 DPR 放大
    var dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = CANVAS_SIZE + 'px';
    canvas.style.height = CANVAS_SIZE + 'px';
    ctx.scale(dpr, dpr);
  }

  // 交点行列 → 逻辑像素坐标
  function gridToPixel(index) {
    return PADDING + index * CELL;
  }

  // 点击像素坐标 → 最近交点行列，超出半格阈值返回 null
  function pixelToGrid(x, y) {
    var col = Math.round((x - PADDING) / CELL);
    var row = Math.round((y - PADDING) / CELL);

    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return null;

    var px = gridToPixel(col);
    var py = gridToPixel(row);
    var dist = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
    if (dist > CELL / 2) return null;

    return { row: row, col: col };
  }

  function drawGrid() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = '#5b4636';
    ctx.lineWidth = 1;

    for (var i = 0; i < SIZE; i++) {
      var p = gridToPixel(i);
      ctx.beginPath();
      ctx.moveTo(gridToPixel(0), p);
      ctx.lineTo(gridToPixel(SIZE - 1), p);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(p, gridToPixel(0));
      ctx.lineTo(p, gridToPixel(SIZE - 1));
      ctx.stroke();
    }

    // 星位 / 天元
    ctx.fillStyle = '#5b4636';
    for (var s = 0; s < STARS.length; s++) {
      var r = STARS[s][0];
      var c = STARS[s][1];
      ctx.beginPath();
      ctx.arc(gridToPixel(c), gridToPixel(r), 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStone(row, col, player, isLast) {
    var x = gridToPixel(col);
    var y = gridToPixel(row);
    var radius = CELL * 0.42;

    // 落影，营造立体感
    ctx.beginPath();
    ctx.arc(x + 1.5, y + 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fill();

    var grad = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.35, radius * 0.1, x, y, radius);
    if (player === BLACK) {
      grad.addColorStop(0, '#5a5a5a');
      grad.addColorStop(1, '#101010');
    } else {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, '#d8cfb6');
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    if (player === WHITE) {
      ctx.strokeStyle = '#8a7a5c';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (isLast) {
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = player === BLACK ? '#e8d5a8' : '#c0392b';
      ctx.fill();
    }
  }

  function drawStones() {
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var cell = state.board[r][c];
        if (cell === EMPTY) continue;
        var isLast = state.lastMove !== null && state.lastMove.row === r && state.lastMove.col === c;
        drawStone(r, c, cell, isLast);
      }
    }
  }

  function updateHud() {
    var hud = document.getElementById('hud');
    var text;
    switch (state.status) {
      case STATUS.BLACK_WIN:
        text = '黑方胜利！';
        break;
      case STATUS.WHITE_WIN:
        text = '白方胜利！';
        break;
      case STATUS.DRAW:
        text = '平局';
        break;
      default:
        text = state.currentPlayer === BLACK ? '轮到黑方落子' : '轮到白方落子';
    }
    hud.textContent = text;
  }

  function render() {
    drawGrid();
    drawStones();
    updateHud();
  }

  /* ------------------------------ 事件编排 ------------------------------ */
  function onCanvasClick(evt) {
    var rect = canvas.getBoundingClientRect();
    // 按 CSS 尺寸与逻辑尺寸比例还原点击坐标，兼容高分屏缩放
    var x = (evt.clientX - rect.left) * (CANVAS_SIZE / rect.width);
    var y = (evt.clientY - rect.top) * (CANVAS_SIZE / rect.height);
    var grid = pixelToGrid(x, y);
    if (grid === null) return;
    placeStone(grid.row, grid.col);
  }

  function bindEvents() {
    canvas.addEventListener('click', onCanvasClick);
    document.getElementById('restart').addEventListener('click', function () {
      reset();
      render();
    });
  }

  /* ------------------------------ 启动 ------------------------------ */
  reset();
  initCanvas();
  bindEvents();
  render();
})();