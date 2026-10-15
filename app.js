/* 五子棋对战页面（复古风格）
 * 分层：常量 → 状态 → 规则 → 绘制 → 事件编排
 * 纯前端、零依赖，黑方先行，连五即胜。
 * 交互：鼠标点击落子；键盘聚焦棋盘后可用方向键移动光标、回车/空格落子。
 */
(function () {
  'use strict';

  /* ------------------------------ 常量 ------------------------------ */
  const SIZE = 15;              // 棋盘交叉点数（15×15）
  const CELL = 30;              // 绘制用格距（像素，逻辑尺寸）
  const PADDING = CELL;         // 首尾格留白
  const CANVAS_SIZE = PADDING * 2 + CELL * (SIZE - 1); // 480

  const EMPTY = 0;
  const BLACK = 1;
  const WHITE = 2;

  const STATUS = {
    RUNNING: 'running',
    BLACK_WIN: 'blackWin',
    WHITE_WIN: 'whiteWin',
    DRAW: 'draw'
  };

  // 星位（行 3/11、列 3/11，及天元 7/7）
  const STARS = [[3, 3], [3, 11], [7, 7], [11, 3], [11, 11]];

  // 判胜方向向量：竖、横、主斜、副斜
  const DIRECTIONS = [[1, 0], [0, 1], [1, 1], [1, -1]];

  // 绘制比例/偏移/尺寸常量，消除魔法数字
  const STONE_RADIUS_RATIO = 0.42;       // 棋子半径 = 格距的 42%
  const GRADIENT_HIGHLIGHT_RATIO = 0.35; // 径向渐变高光偏移比例
  const GRADIENT_INNER_RATIO = 0.1;      // 径向渐变内半径比例
  const SHADOW_OFFSET_X = 1.5;           // 落影横向偏移（像素）
  const SHADOW_OFFSET_Y = 2;             // 落影纵向偏移（像素）
  const STAR_RADIUS = 4;                 // 星位/天元圆点半径（像素）
  const LAST_MOVE_MARK_RATIO = 0.32;     // 最近一手标记 = 棋子半径的 32%
  const CURSOR_MARGIN = 2;               // 键盘光标相对棋子外扩像素
  const CURSOR_LINE_WIDTH = 2;           // 键盘光标描边宽度

  // 复古配色常量
  const COLORS = {
    grid: '#5b4636',
    stoneShadow: 'rgba(0, 0, 0, 0.25)',
    blackHighlight: '#5a5a5a',
    blackCore: '#101010',
    whiteHighlight: '#ffffff',
    whiteCore: '#d8cfb6',
    whiteBorder: '#8a7a5c',
    lastMoveBlack: '#e8d5a8',
    lastMoveWhite: '#c0392b',
    cursor: '#8a2b1c'
  };

  // 键盘按键常量
  const KEYS = {
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    ENTER: 'Enter',
    SPACE: ' '
  };

  /* ------------------------------ 状态 ------------------------------ */
  const state = {
    board: null,         // number[][]，EMPTY/BLACK/WHITE
    currentPlayer: BLACK,
    status: STATUS.RUNNING,
    lastMove: null,      // { row, col } | null
    piecesCount: 0,
    cursor: null         // { row, col }，键盘移动的光标
  };

  function createBoard() {
    const board = [];
    for (let r = 0; r < SIZE; r++) {
      const row = [];
      for (let c = 0; c < SIZE; c++) {
        row.push(EMPTY);
      }
      board.push(row);
    }
    return board;
  }

  function resetCursor() {
    const center = Math.floor(SIZE / 2);
    state.cursor = { row: center, col: center };
  }

  function reset() {
    state.board = createBoard();
    state.currentPlayer = BLACK;
    state.status = STATUS.RUNNING;
    state.lastMove = null;
    state.piecesCount = 0;
    resetCursor();
  }

  /* ------------------------------ 规则 ------------------------------ */
  // 数值限定在 [min, max] 区间
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // 合法性校验：越界、占用、终局均判非法
  function isValid(row, col) {
    if (state.status !== STATUS.RUNNING) return false;
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return false;
    return state.board[row][col] === EMPTY;
  }

  // 以最新落子为中心，4 个直线方向双向延伸计数，连五即胜
  function checkWin(board, row, col, player) {
    for (let d = 0; d < DIRECTIONS.length; d++) {
      const dr = DIRECTIONS[d][0];
      const dc = DIRECTIONS[d][1];
      let count = 1;

      // 正向延伸
      let r = row + dr;
      let c = col + dc;
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

    const player = state.currentPlayer;
    state.board[row][col] = player;
    state.lastMove = { row: row, col: col };
    state.piecesCount++;
    state.cursor = { row: row, col: col };

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
  let canvas;
  let ctx;

  function initCanvas() {
    canvas = document.getElementById('board');
    ctx = canvas.getContext('2d');

    // 高分屏适配：逻辑尺寸不变，画布像素按 DPR 放大；CSS 尺寸交由样式表（响应式）
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr);
  }

  // 交点行列 → 逻辑像素坐标
  function gridToPixel(index) {
    return PADDING + index * CELL;
  }

  // 点击像素坐标 → 最近交点行列，超出半格阈值返回 null
  function pixelToGrid(x, y) {
    const col = Math.round((x - PADDING) / CELL);
    const row = Math.round((y - PADDING) / CELL);

    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) return null;

    const px = gridToPixel(col);
    const py = gridToPixel(row);
    const dist = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
    if (dist > CELL / 2) return null;

    return { row: row, col: col };
  }

  function drawGrid() {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;

    for (let i = 0; i < SIZE; i++) {
      const p = gridToPixel(i);
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
    ctx.fillStyle = COLORS.grid;
    for (let s = 0; s < STARS.length; s++) {
      const r = STARS[s][0];
      const c = STARS[s][1];
      ctx.beginPath();
      ctx.arc(gridToPixel(c), gridToPixel(r), STAR_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStone(row, col, player, isLast) {
    const x = gridToPixel(col);
    const y = gridToPixel(row);
    const radius = CELL * STONE_RADIUS_RATIO;

    // 落影，营造立体感
    ctx.beginPath();
    ctx.arc(x + SHADOW_OFFSET_X, y + SHADOW_OFFSET_Y, radius, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.stoneShadow;
    ctx.fill();

    const grad = ctx.createRadialGradient(
      x - radius * GRADIENT_HIGHLIGHT_RATIO,
      y - radius * GRADIENT_HIGHLIGHT_RATIO,
      radius * GRADIENT_INNER_RATIO,
      x, y, radius
    );
    if (player === BLACK) {
      grad.addColorStop(0, COLORS.blackHighlight);
      grad.addColorStop(1, COLORS.blackCore);
    } else {
      grad.addColorStop(0, COLORS.whiteHighlight);
      grad.addColorStop(1, COLORS.whiteCore);
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    if (player === WHITE) {
      ctx.strokeStyle = COLORS.whiteBorder;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    if (isLast) {
      ctx.beginPath();
      ctx.arc(x, y, radius * LAST_MOVE_MARK_RATIO, 0, Math.PI * 2);
      ctx.fillStyle = player === BLACK ? COLORS.lastMoveBlack : COLORS.lastMoveWhite;
      ctx.fill();
    }
  }

  function drawStones() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cell = state.board[r][c];
        if (cell === EMPTY) continue;
        const isLast = state.lastMove !== null && state.lastMove.row === r && state.lastMove.col === c;
        drawStone(r, c, cell, isLast);
      }
    }
  }

  // 键盘移动光标高亮：进行中时在光标交叉点画复古红棕圆环
  function drawCursor() {
    if (state.status !== STATUS.RUNNING || state.cursor === null) return;
    const x = gridToPixel(state.cursor.col);
    const y = gridToPixel(state.cursor.row);
    const radius = CELL * STONE_RADIUS_RATIO + CURSOR_MARGIN;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.cursor;
    ctx.lineWidth = CURSOR_LINE_WIDTH;
    ctx.stroke();
  }

  function updateHud() {
    const hud = document.getElementById('hud');
    let text;
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
    drawCursor();
    updateHud();
  }

  /* ------------------------------ 事件编排 ------------------------------ */
  function onCanvasClick(evt) {
    const rect = canvas.getBoundingClientRect();
    // 按 CSS 尺寸与逻辑尺寸比例还原点击坐标，兼容高分屏与响应式缩放
    const x = (evt.clientX - rect.left) * (CANVAS_SIZE / rect.width);
    const y = (evt.clientY - rect.top) * (CANVAS_SIZE / rect.height);
    const grid = pixelToGrid(x, y);
    if (grid === null) return;
    placeStone(grid.row, grid.col);
  }

  function moveCursor(dRow, dCol) {
    if (state.status !== STATUS.RUNNING) return;
    state.cursor.row = clamp(state.cursor.row + dRow, 0, SIZE - 1);
    state.cursor.col = clamp(state.cursor.col + dCol, 0, SIZE - 1);
    render();
  }

  function onCanvasKeydown(evt) {
    let handled = true;
    switch (evt.key) {
      case KEYS.UP:
        moveCursor(-1, 0);
        break;
      case KEYS.DOWN:
        moveCursor(1, 0);
        break;
      case KEYS.LEFT:
        moveCursor(0, -1);
        break;
      case KEYS.RIGHT:
        moveCursor(0, 1);
        break;
      case KEYS.ENTER:
      case KEYS.SPACE:
        placeStone(state.cursor.row, state.cursor.col);
        break;
      default:
        handled = false;
    }
    if (handled) {
      evt.preventDefault();
    }
  }

  function bindEvents() {
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('keydown', onCanvasKeydown);
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