class AppRouter {
  constructor() {
    this._state = { view: 'list' };
    this._listeners = [];
    window.addEventListener('popstate', () => {
      this._notifyListeners(this._state);
    });
  }

  navigate(state) {
    this._state = state;
    window.history.pushState(state, '');
    this._notifyListeners(state);
  }

  getCurrentState() {
    return { ...this._state };
  }

  onStateChange(handler) {
    this._listeners.push(handler);
  }

  _notifyListeners(state) {
    this._listeners.forEach((handler) => handler({ ...state }));
  }
}

export { AppRouter };
