class ICache {
  get(key) {
    throw new Error('ICache.get not implemented');
  }

  set(key, value, ttlMs) {
    throw new Error('ICache.set not implemented');
  }

  has(key) {
    throw new Error('ICache.has not implemented');
  }

  clear() {
    throw new Error('ICache.clear not implemented');
  }
}

export { ICache };
