'use babel';

const { ACTION_RUN, CLI_PATH, ACTION_STOP } = require('../constants');
const BottomPanelAction = require('./bottom-panel-action');
const baseView = require('./base-view');
const { getPath } = require('consistent-path');
const { getRootFolder, isRNProject } = require('../utils');
const kill = require('tree-kill');
const child_process = require('child_process');
const SelectedSimulator = require('./selected-simulator');
const BuildView = require('./build-view');
const { CompositeDisposable } = require('atom');

/**
 * Bottom panel container
 *
 * Contains 3 components - start/stop actions and an array of
 * available simulators
 */
class BottomPanel extends HTMLElement {
  disposables = null;

  selectedSimulator = null;

  /** Build view with the current stdout stderr **/
  buildView = null;

  /** Current child_process */
  ps = null;

  createdCallback() {
    this.disposables = new CompositeDisposable();

    this.disposables.add(atom.project.onDidChangePaths(() => this.maybeRender()));

    this.maybeRender();
  }

  maybeRender() {
    if (!isRNProject()) {
      return;
    }

    const runProject = BottomPanelAction.create({
      type: ACTION_RUN,
      handler: () => this.runProject()
    });

    const stopProject = BottomPanelAction.create({
      type: ACTION_STOP,
      handler: () => this.stopProject()
    });

    this.buildView = BuildView.create();

    this.selectedSimulator = SelectedSimulator.create();

    this.appendChild(runProject);
    this.appendChild(stopProject);
    this.appendChild(this.selectedSimulator);
  }

  stopProject() {
    if (!this.ps) return;
    kill(this.ps.pid);
  }

  destroy() {
    this.disposables.dispose();
  }

  /**
   * Runs Xcode project
   *
   * Some targets might not be running (e.g. iPhone 6s), see: https://github.com/facebook/react-native/pull/5978
   */
  runProject() {
    if (this.ps) return;

    const simulator = this.selectedSimulator.getSelectedItem();

    const args = ['run-ios', '--simulator', simulator.name];

    const ps = this.ps = child_process.spawn(CLI_PATH, args, {
      encoding: 'utf8',
      stdio: 'pipe',
      env: Object.assign({}, process.env, { PATH: getPath() }),
      cwd: getRootFolder()
    });

    this.buildView.attach();

    ps.stdout.on('data', data => this.buildView.append(data));
    ps.stderr.on('data', data => this.buildView.append(data, true));

    ps.on('close', () => {
      if (this.buildView.hasErrors()) {
        this.buildView.detachOnEsc();
      } else {
        this.buildView.detach();
      }
      this.ps = null;
    });
  }
};

module.exports = baseView(BottomPanel, 'xcatom-bottom-panel');
