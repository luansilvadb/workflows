import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LocalStorageCache } from './localStorageCache.js';

describe('LocalStorageCache', () => {
  let cache;

  beforeEach(() => {
    localStorage.clear();
    cache = new LocalStorageCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should store and retrieve a value', () => {
    cache.set('key1', { data: 'hello' });
    expect(cache.get('key1')).toEqual({ data: 'hello' });
  });

  it('should return null for non-existent key', () => {
    expect(cache.get('nonexistent')).toBeNull();
  });

  it('should return null for expired value', () => {
    cache.set('temp', 'value', 1000);
    vi.advanceTimersByTime(1001);
    expect(cache.get('temp')).toBeNull();
  });

  it('should remove expired value from storage', () => {
    cache.set('temp', 'value', 1000);
    vi.advanceTimersByTime(1001);
    cache.get('temp');
    expect(localStorage.getItem('pokedex_cache_temp')).toBeNull();
  });

  it('should return false for has on non-existent key', () => {
    expect(cache.has('missing')).toBe(false);
  });

  it('should return true for has on existing key', () => {
    cache.set('exists', 42);
    expect(cache.has('exists')).toBe(true);
  });

  it('should return false for has on expired key', () => {
    cache.set('temp', 'x', 1000);
    vi.advanceTimersByTime(1001);
    expect(cache.has('temp')).toBe(false);
  });

  it('should clear all prefixed keys', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    localStorage.setItem('other_key', 'should remain');
    cache.clear();
    expect(cache.has('a')).toBe(false);
    expect(cache.has('b')).toBe(false);
    expect(localStorage.getItem('other_key')).toBe('should remain');
  });

  it('should return null for corrupted JSON', () => {
    localStorage.setItem('pokedex_cache_bad', 'not-json');
    expect(cache.get('bad')).toBeNull();
  });

  it('should persist value without TTL', () => {
    cache.set('persist', 'forever');
    expect(cache.get('persist')).toBe('forever');
  });
});
