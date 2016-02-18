module.exports = function (htmlElement, name) {
  htmlElement.create = (...args) => {
    const el = document.createElement(name);
    if (typeof el.prepare === 'function') {
      el.prepare(...args);
    }
    return el;
  };

  return document.registerElement(name, {
    prototype: htmlElement.prototype
  });
};
