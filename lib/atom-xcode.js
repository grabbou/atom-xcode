'use babel';

const BottomPanel = require('./ui/bottom-panel');
const { isRNProject } = require('./utils');
const { CompositeDisposable } = require('atom');

class AtomXcode {
  bottomPanel = null;
  subscriptions = null;

  activate = (state) => {
    this.bottomPanel = BottomPanel.create(state);
    this.subscriptions = new CompositeDisposable();
  };

  deactivate = () => {
    this.subscriptions.destroy();
  };

  consumeStatusBar = (statusBar) => {
    if (!isRNProject()) {
      return;
    }

    statusBar.addLeftTile({
      item: this.bottomPanel,
      priority: -1000,
    });
  };

};

module.exports = new AtomXcode();
