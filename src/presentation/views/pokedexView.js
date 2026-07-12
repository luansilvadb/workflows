class PokedexView {
  constructor() {
    this._appRoot = document.getElementById('app');
    this._listContainer = null;
    this._detailContainer = null;
    this._searchHandler = null;
    this._filterHandler = null;
    this._loadMoreHandler = null;
    this._pokemonSelectHandler = null;
    this._backHandler = null;
    this._buildStructure();
  }

  _buildStructure() {
    this._appRoot.innerHTML = `
      <div class="pokedex">
        <header class="pokedex-header">
          <input type="text" class="search-input" placeholder="Buscar por nome..." />
          <select class="filter-select">
            <option value="">Todos os tipos</option>
          </select>
        </header>
        <main class="pokedex-content">
          <div class="pokemon-list"></div>
          <div class="pokemon-detail" style="display:none"></div>
        </main>
        <footer class="pokedex-footer">
          <button class="load-more-btn" style="display:none">Carregar mais</button>
        </footer>
      </div>
    `;
    this._listContainer = this._appRoot.querySelector('.pokemon-list');
    this._detailContainer = this._appRoot.querySelector('.pokemon-detail');
    this._searchInput = this._appRoot.querySelector('.search-input');
    this._filterSelect = this._appRoot.querySelector('.filter-select');
    this._loadMoreBtn = this._appRoot.querySelector('.load-more-btn');
    this._backBtn = document.createElement('button');
    this._backBtn.className = 'back-btn';
    this._backBtn.textContent = 'Voltar';
    this._backBtn.style.display = 'none';
    this._appRoot.querySelector('.pokedex-header').appendChild(this._backBtn);
    this._bindEvents();
  }

  _bindEvents() {
    let searchTimeout;
    this._searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (this._searchHandler) this._searchHandler(e.target.value);
      }, 300);
    });
    this._filterSelect.addEventListener('change', (e) => {
      if (this._filterHandler) this._filterHandler(e.target.value);
    });
    this._loadMoreBtn.addEventListener('click', () => {
      if (this._loadMoreHandler) this._loadMoreHandler();
    });
    this._backBtn.addEventListener('click', () => {
      if (this._backHandler) this._backHandler();
    });
  }

  renderList(pokemonList, append) {
    if (!append) {
      this._listContainer.innerHTML = '';
    }
    this._detailContainer.style.display = 'none';
    this._listContainer.style.display = '';
    this._backBtn.style.display = 'none';
    const fragment = document.createDocumentFragment();
    pokemonList.forEach((pokemon) => {
      const card = this._createCard(pokemon);
      fragment.appendChild(card);
    });
    this._listContainer.appendChild(fragment);
  }

  _createCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
      <img src="${pokemon.sprite}" alt="${pokemon.name}" />
      <span class="pokemon-name">${pokemon.name}</span>
      <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
    `;
    card.addEventListener('click', () => {
      if (this._pokemonSelectHandler) this._pokemonSelectHandler(pokemon.id);
    });
    return card;
  }

  renderDetail(pokemon) {
    this._listContainer.style.display = 'none';
    this._detailContainer.style.display = '';
    this._backBtn.style.display = '';
    this._loadMoreBtn.style.display = 'none';
    const typesHtml = pokemon.types.map((t) => `<span class="type-badge type-${t.name}">${t.name}</span>`).join('');
    const statsHtml = pokemon.stats
      .map((s) => `<div class="stat-row"><span class="stat-name">${s.name}</span><progress value="${s.baseStat}" max="255"></progress><span class="stat-value">${s.baseStat}</span></div>`)
      .join('');
    const abilitiesHtml = pokemon.abilities
      .map((a) => `<span class="ability${a.isHidden ? ' hidden-ability' : ''}">${a.name}${a.isHidden ? ' (oculta)' : ''}</span>`)
      .join('');
    this._detailContainer.innerHTML = `
      <div class="detail-card">
        <img src="${pokemon.sprite}" alt="${pokemon.name}" class="detail-sprite" />
        <h2 class="detail-name">${pokemon.name} <span class="detail-id">#${String(pokemon.id).padStart(3, '0')}</span></h2>
        <div class="detail-types">${typesHtml}</div>
        <div class="detail-meta"><span>Altura: ${pokemon.height / 10}m</span><span>Peso: ${pokemon.weight / 10}kg</span></div>
        <div class="detail-section"><h3>Estatísticas</h3>${statsHtml}</div>
        <div class="detail-section"><h3>Habilidades</h3><div class="abilities-list">${abilitiesHtml}</div></div>
      </div>
    `;
  }

  renderLoading() {
    this._listContainer.innerHTML = '<div class="loading">Carregando...</div>';
    this._detailContainer.innerHTML = '';
  }

  renderError(message) {
    this._listContainer.innerHTML = `<div class="error"><p>${message}</p><button class="retry-btn">Tentar novamente</button></div>`;
    const retryBtn = this._listContainer.querySelector('.retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        if (this._searchHandler && this._searchInput.value.trim()) {
          this._searchHandler(this._searchInput.value);
        } else {
          this._loadInitialPage();
        }
      });
    }
  }

  renderEmpty() {
    this._listContainer.innerHTML = '<div class="empty">Nenhum Pokémon encontrado.</div>';
  }

  renderPagination(hasMore) {
    this._loadMoreBtn.style.display = hasMore ? '' : 'none';
  }

  bindSearch(handler) {
    this._searchHandler = handler;
  }

  bindFilter(handler, types) {
    this._filterHandler = handler;
    if (types) {
      const currentValue = this._filterSelect.value;
      this._filterSelect.innerHTML = '<option value="">Todos os tipos</option>';
      types.forEach((t) => {
        const opt = document.createElement('option');
        opt.value = t.name;
        opt.textContent = t.name;
        this._filterSelect.appendChild(opt);
      });
      this._filterSelect.value = currentValue;
    }
  }

  bindLoadMore(handler) {
    this._loadMoreHandler = handler;
  }

  bindPokemonSelect(handler) {
    this._pokemonSelectHandler = handler;
  }

  bindBack(handler) {
    this._backHandler = handler;
  }
}

export { PokedexView };
