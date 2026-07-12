class PokedexController {
  constructor(service, view, router) {
    this.service = service;
    this.view = view;
    this.router = router;
    this._currentOffset = 0;
    this._pageLimit = 20;
    this._currentFilter = null;
    this._currentQuery = null;
  }

  initialize() {
    this.view.bindSearch((query) => this.onSearch(query));
    this.view.bindFilter((type) => this.onFilter(type));
    this.view.bindLoadMore(() => this.onLoadMore());
    this.view.bindPokemonSelect((id) => this.onSelectPokemon(id));
    this.view.bindBack(() => this.onBackToList());
    this.router.onStateChange((state) => this._handleStateChange(state));
    this._loadInitialPage();
  }

  async _loadInitialPage() {
    this.view.renderLoading();
    const result = await this.service.getPage(0, this._pageLimit);
    if (result.isErr) {
      this.view.renderError(result.error.message);
      return;
    }
    this._currentOffset = result.results.length;
    this.view.renderList(result.results, false);
    this.view.renderPagination(result.count > this._currentOffset);
    this._loadAvailableTypes();
  }

  async _loadAvailableTypes() {
    const result = await this.service.getAvailableTypes();
    if (!result.isErr) {
      this.view.bindFilter(this.onFilter.bind(this), result);
    }
  }

  async onSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) {
      this._currentQuery = null;
      this._currentFilter = null;
      this._currentOffset = 0;
      this._loadInitialPage();
      return;
    }
    this._currentQuery = trimmed;
    this._currentFilter = null;
    this.view.renderLoading();
    const result = await this.service.searchByName(trimmed);
    if (result.isErr) {
      this.view.renderError(result.error.message);
      return;
    }
    this.view.renderList(result, false);
    this.view.renderPagination(false);
  }

  async onFilter(typeName) {
    if (!typeName) {
      this._currentFilter = null;
      this._currentOffset = 0;
      this._loadInitialPage();
      return;
    }
    this._currentFilter = typeName;
    this._currentQuery = null;
    this.view.renderLoading();
    const result = await this.service.getByType(typeName);
    if (result.isErr) {
      this.view.renderError(result.error.message);
      return;
    }
    this.view.renderList(result, false);
    this.view.renderPagination(false);
  }

  async onLoadMore() {
    this.view.renderLoading();
    const result = await this.service.getPage(this._currentOffset, this._pageLimit);
    if (result.isErr) {
      this.view.renderError(result.error.message);
      return;
    }
    this._currentOffset += result.results.length;
    this.view.renderList(result.results, true);
    this.view.renderPagination(result.count > this._currentOffset);
  }

  async onSelectPokemon(id) {
    this.view.renderLoading();
    const result = await this.service.getDetail(id);
    if (result.isErr) {
      this.view.renderError(result.error.message);
      return;
    }
    this.view.renderDetail(result);
    this.router.navigate({ view: 'detail', pokemonId: id });
  }

  onBackToList() {
    this.router.navigate({ view: 'list' });
  }

  _handleStateChange(state) {
    if (state.view === 'list') {
      this._currentOffset = 0;
      this._loadInitialPage();
    }
  }
}

export { PokedexController };
