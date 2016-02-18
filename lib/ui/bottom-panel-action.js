'use babel';

const { Disposable } = require('atom');
const { ACTION_RUN, ACTION_STOP } = require('../constants');
const baseView = require('./base-view');

/**
 * Bottom panel action
 */
class BottomPanelAction extends HTMLElement {

  /** Click subscription **/
  clickSubscription = null;

  prepare({ type, handler }) {
    this.classList.add('btn', 'btn-sm', 'icon', type);

    this.addEventListener('click', handler);
    this.clickSubscription = new Disposable(() => this.removeEventListener('click', handler));
  }

  destroy() {
    if (this.clickSubscription) {
      this.clickSubscription.dispose();
    }
  }
};

module.exports = baseView(BottomPanelAction, 'xcatom-bottom-panel-action');
