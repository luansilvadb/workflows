import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppRouter } from './appRouter.js';

describe('AppRouter', () => {
  let router;

  beforeEach(() => {
    router = new AppRouter();
  });

  it('should start with list state', () => {
    expect(router.getCurrentState()).toEqual({ view: 'list' });
  });

  it('should navigate to a new state', () => {
    router.navigate({ view: 'detail', pokemonId: 25 });
    expect(router.getCurrentState()).toEqual({ view: 'detail', pokemonId: 25 });
  });

  it('should notify listeners on navigate', () => {
    const handler = vi.fn();
    router.onStateChange(handler);
    router.navigate({ view: 'detail', pokemonId: 4 });
    expect(handler).toHaveBeenCalledWith({ view: 'detail', pokemonId: 4 });
  });

  it('should notify multiple listeners on navigate', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    router.onStateChange(handler1);
    router.onStateChange(handler2);
    router.navigate({ view: 'list' });
    expect(handler1).toHaveBeenCalledWith({ view: 'list' });
    expect(handler2).toHaveBeenCalledWith({ view: 'list' });
  });

  it('should return a copy of state from getCurrentState', () => {
    const state = router.getCurrentState();
    state.view = 'detail';
    expect(router.getCurrentState()).toEqual({ view: 'list' });
  });

  it('should push state to history on navigate', () => {
    const pushState = vi.spyOn(window.history, 'pushState');
    router.navigate({ view: 'detail', pokemonId: 7 });
    expect(pushState).toHaveBeenCalledWith({ view: 'detail', pokemonId: 7 }, '');
  });

  it('should notify listeners on popstate event', () => {
    const handler = vi.fn();
    router.onStateChange(handler);
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(handler).toHaveBeenCalled();
  });
});
