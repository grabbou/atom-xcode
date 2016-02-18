'use babel';

const { SelectListView } = require('atom-space-pen-views');

class SimulatorDropdown extends SelectListView {
  panel = null;

  constructor(opts) {
    super();
    this.opts = opts;
  }

  show() {
    this.storeFocusedElement();
    this.panel = atom.workspace.addModalPanel({ item: this });
    this.focusFilterEditor();
  }

  getFilterKey(item) {
    return "name";
  }

  viewForItem(item) {
    return `<li>${item.name}</li>`
  }

  getEmptyMessage() {
    return "No Simulators available";
  }

  cancelled() {
    this.panel.destroy();
  }

  confirmed(item) {
    const { onSelected } = this.opts;
    if (onSelected) onSelected(item);
    this.cancel()
  }

}

module.exports = SimulatorDropdown;
