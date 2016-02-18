atom-xcode 
=======

> Native iOS developers have amazing Xcode - let's bridge the gap and make Atom our to go choice

### Instalation

```bash
$ apm install atom-xcode
```
### Guide

After successful installation, open up your react-native project and check the bottom section (just where the atom-linter is located). Clicking the device name will open up another view allowing you to choose the device to run the app on.

<img height="35px" src="https://cloud.githubusercontent.com/assets/2464966/13157360/baa25440-d687-11e5-930e-6da03e1c02fe.png" />

The terminal will automatically disappear when CLI finishes without issues, otherwise it stays opened and will highlight the error. You can close it with "ESC" key.

### Roadmap

The current version is a proof of concept to demonstrate we can really hack Atom to fit our needs in less than a day. Below is the list of features I've been thinking about implementing so far. 

- [ ] Add ability to select build targets
- [ ] Add `Xcode` menu item with all options available
- [ ] Add build command
- [ ] Improve terminal colors
- [ ] Add settings and make this configureable
- [ ] Decouple from RN cli and ideally ship with own library
- [ ] Support multiple projects opened in Atom (for now we take the first one)

Please feel free to submit your ideas by making a new issue.

### FAQ

#### Command finishes w/o errors, but no Simulator has started

Try choosing different device. This error will be gone when either https://github.com/facebook/react-native/pull/5978 gets merged, or when we move the `run-ios` into this package (or `rnpm`, who knows)
