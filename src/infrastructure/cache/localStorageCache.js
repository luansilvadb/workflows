class LocalStorageCache {
  constructor() {
    this._prefix = 'pokedex_cache_';
  }

  get(key) {
    const raw = localStorage.getItem(this._prefix + key);
    if (raw === null) return null;
    try {
      const entry = JSON.parse(raw);
      if (entry.ttl && Date.now() > entry.ttl) {
        localStorage.removeItem(this._prefix + key);
        return null;
      }
      return entry.value;
    } catch {
      return null;
    }
  }

  set(key, value, ttlMs) {
    const entry = {
      value,
      ttl: ttlMs ? Date.now() + ttlMs : null,
    };
    localStorage.setItem(this._prefix + key, JSON.stringify(entry));
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey && storageKey.startsWith(this._prefix)) {
        keysToRemove.push(storageKey);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
}

export { LocalStorageCache };
