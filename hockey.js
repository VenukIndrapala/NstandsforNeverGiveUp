/* Air hockey scene (scoped to #stage-hockey so it can't affect the other scenes) */

#stage-hockey {
  --page-bg: #000;
  --board-bg: #1e4c7f;
  background: var(--page-bg);
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  font-family: Arial, Helvetica, sans-serif;
}

/* Desktop: a centred 1.31:1 board on black. */
#stage-hockey .game-wrap {
  position: relative;
  width: min(92vw, 760px, calc(92vh * 1.31));
  width: min(92vw, 760px, calc(92dvh * 1.31));
  aspect-ratio: 1.31 / 1;
  overflow: hidden;
  background: var(--board-bg);
  touch-action: none;
}

#stage-hockey #gameCanvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  outline: none;
  touch-action: none;
}

/* Phones, tablets and narrow windows: the board fills the whole screen. */
@media (max-width: 700px), (pointer: coarse) {
  #stage-hockey {
    background: var(--board-bg);
  }

  #stage-hockey .game-wrap {
    position: fixed;
    inset: 0;
    width: auto;
    height: auto;
    aspect-ratio: auto;
  }
}

#stage-hockey .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
