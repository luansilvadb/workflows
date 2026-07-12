import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokemonRepository } from './pokemonRepository.js';
import { Pokemon, PokemonType, PokemonStat, PokemonAbility, PokemonError } from '../../domain/entities.js';

const MOCK_POKEMON_DATA = {
  id: 25,
  name: 'pikachu',
  sprites: { front_default: 'pikachu.png' },
  types: [{ slot: 1, type: { name: 'electric' } }],
  stats: [{ base_stat: 55, stat: { name: 'hp' } }],
  abilities: [{ ability: { name: 'static' }, is_hidden: false }],
  weight: 60,
  height: 4,
};

const MOCK_PAGE_DATA = {
  count: 1,
  results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
};

const MOCK_TYPE_DATA = {
  name: 'electric',
  pokemon: [{ pokemon: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' } }],
};

const MOCK_TYPE_LIST_DATA = {
  results: [{ name: 'electric' }, { name: 'fire' }],
};

describe('PokemonRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new PokemonRepository();
    globalThis.fetch = vi.fn();
  });

  describe('fetchPage', () => {
    it('should fetch page and return detailed results', async () => {
      globalThis.fetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(MOCK_PAGE_DATA) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(MOCK_POKEMON_DATA) });
      const result = await repository.fetchPage(0, 20);
      expect(result.count).toBe(1);
      expect(result.results[0]).toBeInstanceOf(Pokemon);
      expect(result.results[0].name).toBe('pikachu');
    });

    it('should throw PokemonError on HTTP error', async () => {
      globalThis.fetch.mockResolvedValue({ ok: false, statusText: 'Bad Request' });
      await expect(repository.fetchPage(0, 20)).rejects.toThrow(PokemonError);
    });
  });

  describe('fetchById', () => {
    it('should fetch and map a pokemon by id', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(MOCK_POKEMON_DATA) });
      const pokemon = await repository.fetchById(25);
      expect(pokemon).toBeInstanceOf(Pokemon);
      expect(pokemon.id).toBe(25);
      expect(pokemon.name).toBe('pikachu');
      expect(pokemon.sprite).toBe('pikachu.png');
      expect(pokemon.types[0]).toBeInstanceOf(PokemonType);
      expect(pokemon.types[0].name).toBe('electric');
      expect(pokemon.stats[0]).toBeInstanceOf(PokemonStat);
      expect(pokemon.stats[0].name).toBe('hp');
      expect(pokemon.stats[0].baseStat).toBe(55);
      expect(pokemon.abilities[0]).toBeInstanceOf(PokemonAbility);
      expect(pokemon.abilities[0].name).toBe('static');
      expect(pokemon.abilities[0].isHidden).toBe(false);
      expect(pokemon.weight).toBe(60);
      expect(pokemon.height).toBe(4);
    });

    it('should throw PokemonError on HTTP error', async () => {
      globalThis.fetch.mockResolvedValue({ ok: false, statusText: 'Not Found' });
      await expect(repository.fetchById(999)).rejects.toThrow(PokemonError);
    });
  });

  describe('fetchByName', () => {
    it('should fetch and map a pokemon by name (lowercased)', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(MOCK_POKEMON_DATA) });
      const pokemon = await repository.fetchByName('Pikachu');
      expect(pokemon.name).toBe('pikachu');
      expect(globalThis.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
    });

    it('should throw PokemonError on HTTP error', async () => {
      globalThis.fetch.mockResolvedValue({ ok: false, statusText: 'Not Found' });
      await expect(repository.fetchByName('unknown')).rejects.toThrow(PokemonError);
    });
  });

  describe('fetchByType', () => {
    it('should fetch pokemon by type', async () => {
      globalThis.fetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(MOCK_TYPE_DATA) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(MOCK_POKEMON_DATA) });
      const result = await repository.fetchByType('electric');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('pikachu');
    });

    it('should throw PokemonError on HTTP error', async () => {
      globalThis.fetch.mockResolvedValue({ ok: false, statusText: 'Not Found' });
      await expect(repository.fetchByType('unknown')).rejects.toThrow(PokemonError);
    });
  });

  describe('fetchTypeList', () => {
    it('should fetch and return type list', async () => {
      globalThis.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(MOCK_TYPE_LIST_DATA) });
      const result = await repository.fetchTypeList();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(PokemonType);
      expect(result[0].name).toBe('electric');
      expect(result[1].name).toBe('fire');
    });

    it('should throw PokemonError on HTTP error', async () => {
      globalThis.fetch.mockResolvedValue({ ok: false, statusText: 'Server Error' });
      await expect(repository.fetchTypeList()).rejects.toThrow(PokemonError);
    });
  });
});
