const store = new Map();

const get = (key) => {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
};

const set = (key, data, ttlSeconds = parseInt(process.env.CACHE_TTL_SECONDS) || 300) => {
  store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
};

const del = (key) => store.delete(key);

const flush = () => store.clear();

module.exports = { get, set, del, flush };
