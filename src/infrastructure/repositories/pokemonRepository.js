import {
  Pokemon,
  PokemonType,
  PokemonStat,
  PokemonAbility,
  PokemonError,
} from '../../domain/entities.js';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

class PokemonRepository {
  async fetchPage(offset, limit) {
    const url = `${POKEAPI_BASE}/pokemon?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new PokemonError('FETCH_PAGE_ERROR', `Failed to fetch page: ${response.statusText}`);
    }
    const data = await response.json();
    const detailedResults = await Promise.all(
      data.results.map((item) => this.fetchByName(item.name))
    );
    return { count: data.count, results: detailedResults };
  }

  async fetchById(id) {
    const url = `${POKEAPI_BASE}/pokemon/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new PokemonError('FETCH_BY_ID_ERROR', `Failed to fetch pokemon ${id}: ${response.statusText}`);
    }
    const data = await response.json();
    return this._mapPokemon(data);
  }

  async fetchByName(name) {
    const url = `${POKEAPI_BASE}/pokemon/${name.toLowerCase()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new PokemonError('FETCH_BY_NAME_ERROR', `Failed to fetch pokemon ${name}: ${response.statusText}`);
    }
    const data = await response.json();
    return this._mapPokemon(data);
  }

  async fetchByType(typeName) {
    const url = `${POKEAPI_BASE}/type/${typeName}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new PokemonError('FETCH_BY_TYPE_ERROR', `Failed to fetch type ${typeName}: ${response.statusText}`);
    }
    const data = await response.json();
    const pokemonEntries = data.pokemon.map((p) => p.pokemon);
    const detailedResults = await Promise.all(
      pokemonEntries.map((entry) => this.fetchByName(entry.name))
    );
    return detailedResults;
  }

  async fetchTypeList() {
    const url = `${POKEAPI_BASE}/type`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new PokemonError('FETCH_TYPE_LIST_ERROR', `Failed to fetch type list: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results.map((t) => new PokemonType(t.name));
  }

  _mapPokemon(data) {
    const types = data.types.map(
      (t) => new PokemonType(t.type.name)
    );
    const stats = data.stats.map(
      (s) => new PokemonStat(s.stat.name, s.base_stat)
    );
    const abilities = data.abilities.map(
      (a) => new PokemonAbility(a.ability.name, a.is_hidden)
    );
    return new Pokemon(
      data.id,
      data.name,
      types,
      data.sprites.front_default,
      stats,
      abilities,
      data.weight,
      data.height
    );
  }
}

export { PokemonRepository };
