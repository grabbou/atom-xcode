'use babel';

const { Disposable } = require('atom');
const baseView = require('./base-view');
const child_process = require('child_process');
const parseIOSSimulatorsList = require('../ios/parse-simulators-list');
const SimulatorDropdown = require('./simulator-dropdown');

/**
 * Component displaying selected simulator
 */
class SelectedSimulator extends HTMLElement {

  /** Disposable click subscription **/
  clickSubscription = null;

  /** Selected simulator **/
  selectedItem = null;

  /** <a> with current simulator **/
  simulatorNode = null;

  /** dropdown **/
  dropdown = null;

  /** list of devices **/
  list = null;

  /**
   * Gets available simulators and returns them asynchronously
   */
  getSimulators(cb) {
    child_process.execFile('xcrun', ['simctl', 'list', 'devices'], {encoding: 'utf8'}, (err, stdout) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, parseIOSSimulatorsList(stdout));
      }
    });
  }

  /**
   * Returns selected simulator - which is either the default RN device
   * (when first run), or previously selected device matched by the UUID
   */
  getSelectedItem(list = this.list) {
    return list.find(device => this.selectedItem
      ? device.udid === this.selectedItem.udid
      : device.name === 'iPhone 6'
    );
  }

  /**
   * Sets selected item and updates the markup
   */
  setSelectedItem(item) {
    this.selectedItem = item;
    this.simulatorNode.textContent = item.name;
  }

  /**
   * When this item is created, we asynchronously load
   * available devices and initialize SimulatorDropdown
   */
  createdCallback() {
    this.dropdown = new SimulatorDropdown({
      onSelected: (i) => this.setSelectedItem(i)
    });

    this.simulatorNode = document.createElement('a');

    this.getSimulators((err, list) => {
      if (err) return;

      this.list = list;

      this.setSelectedItem(this.getSelectedItem(list));
    });

    this.appendChild(this.simulatorNode);

    this.setupEvents();
  }

  /**
   * Attach listeners & events, most importantly, display a dropdown
   * on every click
   */
  setupEvents() {
    const handler = () => {
      this.dropdown.setItems(this.list);
      this.dropdown.show();
    }

    this.simulatorNode.addEventListener('click', handler);
    this.clickSubscription = new Disposable(
      () => this.simulatorNode.removeEventListener('click', handler)
    );
  }

  /**
   * Remove subscriptions
   */
  destroy() {
    if (this.clickSubscription) {
      this.clickSubscription.dispose();
    }
  }
};

module.exports = baseView(SelectedSimulator, 'xcatom-selected-simulator');
