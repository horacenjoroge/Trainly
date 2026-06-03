function stubMethods(target, overrides) {
  const originals = new Map();

  for (const [key, value] of Object.entries(overrides)) {
    originals.set(key, target[key]);
    target[key] = value;
  }

  return () => {
    for (const [key, value] of originals.entries()) {
      target[key] = value;
    }
  };
}

module.exports = {
  stubMethods,
};
