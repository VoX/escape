import Phaser from "phaser";

import Game from "./scenes/Game";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.FIT,
  },
  physics: {
    default: "matter",
    matter: {
      debug: true,
    },
  },
  scene: [Game],
};

export default new Phaser.Game(config);
