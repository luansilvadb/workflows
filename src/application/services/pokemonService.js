import { PokemonError } from '../../domain/entities.js';

class PokemonService {
  constructor(repository, cache) {
    this.repository = repository;
    this.cache = cache;
  }

  async getPage(offset, limit) {
    try {
      const cacheKey = `page_${offset}_${limit}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      const result = await this.repository.fetchPage(offset, limit);
      this.cache.set(cacheKey, result, 1800000);
      return result;
    } catch (error) {
      if (error instanceof PokemonError) {
        return { isErr: true, error };
      }
      return { isErr: true, error: new PokemonError('SERVICE_ERROR', error.message) };
    }
  }

  async getDetail(id) {
    try {
      const cacheKey = `pokemon_${id}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      const pokemon = await this.repository.fetchById(id);
      this.cache.set(cacheKey, pokemon, 1800000);
      return pokemon;
    } catch (error) {
      if (error instanceof PokemonError) {
        return { isErr: true, error };
      }
      return { isErr: true, error: new PokemonError('SERVICE_ERROR', error.message) };
    }
  }

  async searchByName(query) {
    try {
      const pokemon = await this.repository.fetchByName(query);
      return [pokemon];
    } catch (error) {
      if (error instanceof PokemonError) {
        return { isErr: true, error };
      }
      return { isErr: true, error: new PokemonError('SERVICE_ERROR', error.message) };
    }
  }

  async getByType(type) {
    try {
      const cacheKey = `type_${type}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      const pokemonList = await this.repository.fetchByType(type);
      this.cache.set(cacheKey, pokemonList, 1800000);
      return pokemonList;
    } catch (error) {
      if (error instanceof PokemonError) {
        return { isErr: true, error };
      }
      return { isErr: true, error: new PokemonError('SERVICE_ERROR', error.message) };
    }
  }

  async getAvailableTypes() {
    try {
      if (this.cache.has('type_list')) {
        return this.cache.get('type_list');
      }
      const types = await this.repository.fetchTypeList();
      this.cache.set('type_list', types, 1800000);
      return types;
    } catch (error) {
      if (error instanceof PokemonError) {
        return { isErr: true, error };
      }
      return { isErr: true, error: new PokemonError('SERVICE_ERROR', error.message) };
    }
  }
}

export { PokemonService };
