'use babel';

const { Disposable } = require('atom');
const baseView = require('./base-view');

/** Xcode build errors always contain BUILD FAILED string **/
const ERROR_MARKER = 'BUILD FAILED';

/**
 * BuildView showing real-time progress of any build task
 */
class BuildView extends HTMLElement {
  /** Key press subscription - set only when build contains errors **/
  keyPressSubscription = null;

  /** Current panel **/
  panel = null;

  createdCallback() {
    this.classList.add('tool-panel', 'panel-bottom');

    this.stdout = document.createElement('div');
    this.stdout.classList.add('output', 'panel-body');

    this.appendChild(this.stdout);
  }

  /**
   * Attaches view to current panel and cleans up stdout
   */
  attach() {
    if (this.panel) {
      this.panel.destroy();
    }

    this.stdout.innerHTML = '';

    this.panel = atom.workspace.addBottomPanel({ item: this });

    this.focus();
  }

  hasErrors() {
    return this.stdout.innerHTML.indexOf(`<span style="color: red">`) !== -1;
  }

  highlightError(line) {
    return `<span style="color: red">${line}</span>`;
  }

  convertLineBreakes(line) {
    return line.replace(/\r?\n/g, '<br />');
  }

  /**
   * Appends buffer to stdout
   */
  append(buffer, isError) {
    const line = this.convertLineBreakes(buffer.toString('utf8'));
    this.stdout.innerHTML += isError ? this.highlightError(line) : line;
    this.stdout.scrollTop = this.stdout.scrollHeight;
  }

  /**
   * Attaches keyUp listener that will detach the preview on ESC press
   */
  detachOnEsc() {
    if (this.keyPressSubscription) return;

    const handler = this.onKeyUp.bind(this);
    document.addEventListener('keyup', handler);
    this.keyPressSubscription = new Disposable(() => document.removeEventListener('keyup', handler));
  }

  onKeyUp({ keyCode }) {
    if (keyCode === 27) {
      this.detach();
    }
  }

  /**
   * Detaches the window
   */
  detach() {
    const currentView = atom.views.getView(atom.workspace);

    if (currentView) {
      currentView.focus();
    }

    this.panel.destroy();
    this.panel = null;

    if (this.keyPressSubscription) {
      this.keyPressSubscription.dispose();
    }
  }

}

module.exports = baseView(BuildView, 'xcatom-build-view');
