'use babel';

const BottomPanel = require('./ui/bottom-panel');

class AtomXcode {
  bottomPanel = null;

  activate = (state) => {
    this.bottomPanel = BottomPanel.create(state);
  };

  consumeStatusBar = (statusBar) => {
    statusBar.addLeftTile({
      item: this.bottomPanel,
      priority: -1000,
    });
  };

};

module.exports = new AtomXcode();
