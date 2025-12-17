const games = [
  {
    icon: '🧱',
    title: 'Breakout',
    description: 'Mouse-driven paddle, bouncing ball, colorful bricks, and speed-ups after rows are cleared.',
    path: 'games/Breakout/index.html',
    tags: ['Arcade', 'Reflex'],
    codeOverview: 'Canvas loop keeps ball physics, paddle input, and brick collisions in sync.',
    codeHighlights: [
      'requestAnimationFrame loop updates ball position, speed, and redraws the playfield.',
      'AABB collision checks reflect the ball off the paddle and brick rectangles.',
      'Brick rows track hits and increase ball speed after each cleared row.'
    ]
  },
  {
    icon: '🏓',
    title: 'Pong vs AI',
    description: 'Player paddle on the left (W/S) versus an AI rival on the right with a delayed follow.',
    path: 'games/Pong/index.html',
    tags: ['Classic', 'Versus AI'],
    codeOverview: 'Two paddles, keyboard input, and a simple AI tracker drive a classic Pong loop.',
    codeHighlights: [
      'Player paddle listens for W/S to move within canvas bounds.',
      'AI paddle eases toward the ball with a delay to feel beatable.',
      'Ball bounce logic handles walls, paddles, and score resets.'
    ]
  },
  {
    icon: '🧭',
    title: 'Platformer',
    description: 'Blue square with gravity and jumps, fixed platforms, lava danger, and a coin to win.',
    path: 'games/Platformer/index.html',
    tags: ['Adventure', 'Physics'],
    codeOverview: 'A physics step applies gravity, jump velocity, and platform collisions.',
    codeHighlights: [
      'Gravity and jump velocity update the player each frame.',
      'Platform rectangles use AABB collision to stop falling and allow jumps.',
      'Win/lose checks watch for coin pickup or lava contact.'
    ]
  },
  {
    icon: '💣',
    title: 'Minesweeper',
    description: 'Classic 10x10 mines hunt with flags, flood reveal, and hidden bombs to avoid.',
    path: 'games/Minesweeper/index.html',
    tags: ['Logic', 'Puzzle'],
    codeOverview: 'A grid array stores mines, counts, and reveal state with recursive flood fill.',
    codeHighlights: [
      'Random mine placement sets nearby counts for each cell.',
      'Clicking a blank cell reveals neighbors via flood fill.',
      'Flag state toggles per cell and win check scans for unrevealed mines.'
    ]
  },
  {
    icon: '🔢',
    title: '2048',
    description: 'Slide and merge numbered tiles on a 4x4 grid to reach the 2048 tile.',
    path: 'games/2048/index.html',
    tags: ['Puzzle', 'Strategy'],
    codeOverview: 'Board state is a 4x4 array; moves compress, merge, then spawn a new tile.',
    codeHighlights: [
      'Input triggers a slide-and-merge pass per row or column.',
      'Merge rules prevent double merging in a single move.',
      'A new 2/4 tile spawns after valid moves; game over checks for moves.'
    ]
  },
  {
    icon: '🧩',
    title: 'Maze',
    description: 'DFS-generated labyrinth; move the red dot to the green goal using arrow keys.',
    path: 'games/Maze/index.html',
    tags: ['Maze', 'Keyboard'],
    codeOverview: 'Depth-first search carves a maze grid, then player movement checks wall collisions.',
    codeHighlights: [
      'DFS backtracking removes walls between visited cells.',
      'Player moves with arrow keys constrained by wall data.',
      'Goal detection compares player cell with exit cell.'
    ]
  },
  {
    icon: '⌨️',
    title: 'Falling Words',
    description: 'Typing defense: destroy falling words by typing them correctly before they land.',
    path: 'games/FallingWords/index.html',
    tags: ['Typing', 'Speed'],
    codeOverview: 'Words drop over time; typed input matches active words to clear them.',
    codeHighlights: [
      'Word objects track text, position, and speed.',
      'Key input buffers compare against active word text.',
      'Missed words reduce lives; correct hits increase score.'
    ]
  },
  {
    icon: '🐹',
    title: 'Whack-a-Mole',
    description: 'Tap active holes in a 3x3 grid before time runs out; avoid inactive holes.',
    path: 'games/WhackAMole/index.html',
    tags: ['Arcade', 'Aim'],
    codeOverview: 'A timer-driven loop activates random holes and scores hits within the window.',
    codeHighlights: [
      'Interval toggles the active mole index on a schedule.',
      'Click handler checks active hole and updates score.',
      'Countdown timer ends the round and locks input.'
    ]
  },
  {
    icon: '🍪',
    title: 'Cookie Clicker',
    description: 'Click for gold and invest in Auto-Clickers, Miners, and Factories for passive income.',
    path: 'games/CookieClicker/index.html',
    tags: ['Idle', 'Clicker'],
    codeOverview: 'State tracks cookies, upgrades, and passive income in a tick loop.',
    codeHighlights: [
      'Click handler increments cookies and updates UI.',
      'Upgrade buttons spend cookies and increase CPS.',
      'setInterval applies passive income each second.'
    ]
  },
  {
    icon: '🎵',
    title: 'Simon Says',
    description: 'Memorize and repeat the growing light sequence across four colored pads.',
    path: 'games/SimonSays/index.html',
    tags: ['Memory', 'Audio'],
    codeOverview: 'A sequence array grows each round; playback uses timed flashes and tones.',
    codeHighlights: [
      'Sequence array appends a random color each round.',
      'Playback uses timeouts to flash pads and play tones.',
      'User input compares against sequence and resets on mistake.'
    ]
  },
  {
    icon: '🐍',
    title: 'Snake',
    description: 'Neon snake eats food to grow; avoid walls and tail. Arrow keys to steer.',
    path: 'games/Snake/index.html',
    tags: ['Classic', 'Arcade'],
    codeOverview: 'Grid-based movement shifts segments each tick while checking food and collisions.',
    codeHighlights: [
      'Direction input updates velocity with no reverse moves.',
      'Snake body array shifts forward each tick.',
      'Food spawn avoids the body; collisions end the game.'
    ]
  },
  {
    icon: '🃏',
    title: 'Emoji Memory',
    description: 'Flip cards to find matching emoji pairs; clear all pairs as fast as you can.',
    path: 'games/Emoji/index.html',
    tags: ['Memory', 'Cards'],
    codeOverview: 'A shuffled deck holds pairs; flip logic checks matches with a brief delay.',
    codeHighlights: [
      'Deck duplicates emojis, shuffles, and renders cards.',
      'Two-card selection checks for a match after a timeout.',
      'Matched cards stay open; win check triggers when all matched.'
    ]
  },
  {
    icon: '🚀',
    title: 'Shooter',
    description: 'Auto-firing triangle ship dodges red squares and racks up points with particle hits.',
    path: 'games/Shooter/index.html',
    tags: ['Action', 'Dodging'],
    codeOverview: 'Player ship, bullets, and enemies update each frame with collision detection.',
    codeHighlights: [
      'Auto-fire spawns bullets on a timer.',
      'Enemies spawn at edges and move toward the center.',
      'Collision checks trigger score updates and particle effects.'
    ]
  },
  {
    icon: '🐤',
    title: 'Flappy',
    description: 'Tap to flap a yellow square through scrolling green pipes without crashing.',
    path: 'games/Flappy/index.html',
    tags: ['Arcade', 'Timing'],
    codeOverview: 'Gravity pulls the player down; tap sets upward velocity while pipes scroll by.',
    codeHighlights: [
      'Physics step applies gravity and jump impulse.',
      'Pipe pairs spawn at intervals with randomized gaps.',
      'Collision detection ends the run; score increments per gap.'
    ]
  }
];

export default games;
