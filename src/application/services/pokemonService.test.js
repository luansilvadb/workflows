import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokemonService } from './pokemonService.js';
import { PokemonError, Pokemon } from '../../domain/entities.js';

describe('PokemonService', () => {
  let mockRepository;
  let mockCache;
  let service;

  beforeEach(() => {
    mockRepository = {
      fetchPage: vi.fn(),
      fetchById: vi.fn(),
      fetchByName: vi.fn(),
      fetchByType: vi.fn(),
      fetchTypeList: vi.fn(),
    };
    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      has: vi.fn(),
      clear: vi.fn(),
    };
    service = new PokemonService(mockRepository, mockCache);
  });

  describe('getPage', () => {
    it('should return cached result if available', async () => {
      const cached = { count: 1, results: [] };
      mockCache.has.mockReturnValue(true);
      mockCache.get.mockReturnValue(cached);
      const result = await service.getPage(0, 20);
      expect(result).toBe(cached);
      expect(mockRepository.fetchPage).not.toHaveBeenCalled();
    });

    it('should fetch and cache on cache miss', async () => {
      const data = { count: 1, results: [new Pokemon(1, 'bulbasaur', [], '', [], [], 0, 0)] };
      mockCache.has.mockReturnValue(false);
      mockRepository.fetchPage.mockResolvedValue(data);
      const result = await service.getPage(0, 20);
      expect(result).toEqual(data);
      expect(mockCache.set).toHaveBeenCalledWith('page_0_20', data, 1800000);
    });

    it('should return isErr on PokemonError', async () => {
      const pokemonError = new PokemonError('FETCH_ERROR', 'fail');
      mockCache.has.mockReturnValue(false);
      mockRepository.fetchPage.mockRejectedValue(pokemonError);
      const result = await service.getPage(0, 20);
      expect(result.isErr).toBe(true);
      expect(result.error).toBe(pokemonError);
    });

    it('should return isErr with SERVICE_ERROR on generic error', async () => {
      mockCache.has.mockReturnValue(false);
      mockRepository.fetchPage.mockRejectedValue(new Error('network error'));
      const result = await service.getPage(0, 20);
      expect(result.isErr).toBe(true);
      expect(result.error.code).toBe('SERVICE_ERROR');
    });
  });

  describe('getDetail', () => {
    it('should return cached pokemon if available', async () => {
      const cached = new Pokemon(25, 'pikachu', [], '', [], [], 0, 0);
      mockCache.has.mockReturnValue(true);
      mockCache.get.mockReturnValue(cached);
      const result = await service.getDetail(25);
      expect(result).toBe(cached);
      expect(mockRepository.fetchById).not.toHaveBeenCalled();
    });

    it('should fetch and cache on cache miss', async () => {
      const pokemon = new Pokemon(4, 'charmander', [], '', [], [], 0, 0);
      mockCache.has.mockReturnValue(false);
      mockRepository.fetchById.mockResolvedValue(pokemon);
      const result = await service.getDetail(4);
      expect(result).toEqual(pokemon);
      expect(mockCache.set).toHaveBeenCalledWith('pokemon_4', pokemon, 1800000);
    });

    it('should return isErr on failure', async () => {
      mockCache.has.mockReturnValue(false);
      mockRepository.fetchById.mockRejectedValue(new PokemonError('NOT_FOUND', 'missing'));
      const result = await service.getDetail(999);
      expect(result.isErr).toBe(true);
    });
  });

  describe('searchByName', () => {
    it('should return array with pokemon on success', async () => {
      const pokemon = new Pokemon(6, 'charizard', [], '', [], [], 0, 0);
      mockRepository.fetchByName.mockResolvedValue(pokemon);
      const result = await service.searchByName('charizard');
      expect(result).toEqual([pokemon]);
    });

    it('should return isErr on failure', async () => {
      mockRepository.fetchByName.mockRejectedValue(new PokemonError('NOT_FOUND', 'unknown'));
      const result = await service.searchByName('unknown');
      expect(result.isErr).toBe(true);
    });
  });

  describe('getByType', () => {
    it('should return cached type list if available', async () => {
      const cached = [new Pokemon(1, 'bulbasaur', [], '', [], [], 0, 0)];
      mockCache.has.mockReturnValue(true);
      mockCache.get.mockReturnValue(cached);
      const result = await service.getByType('grass');
      expect(result).toBe(cached);
      expect(mockRepository.fetchByType).not.toHaveBeenCalled();
    });

    it('should fetch and cache on miss', async () => {
      const list = [new Pokemon(1, 'bulbasaur', [], '', [], [], 0, 0)];
      mockCache.has.mockReturnValue(false);
      mockRepository.fetchByType.mockResolvedValue(list);
      const result = await service.getByType('grass');
      expect(result).toEqual(list);
      expect(mockCache.set).toHaveBeenCalledWith('type_grass', list, 1800000);
    });

    it('should return isErr on failure', async () => {
      mockCache.has.mockReturnValue(false);
      mockRepository.fetchByType.mockRejectedValue(new PokemonError('TYPE_ERROR', 'bad type'));
      const result = await service.getByType('unknown');
      expect(result.isErr).toBe(true);
    });
  });

  describe('getAvailableTypes', () => {
    it('should return cached types if available', async () => {
      const cached = [{ name: 'fire' }, { name: 'water' }];
      mockCache.has.mockReturnValue(true);
      mockCache.get.mockReturnValue(cached);
      const result = await service.getAvailableTypes();
      expect(result).toBe(cached);
      expect(mockRepository.fetchTypeList).not.toHaveBeenCalled();
    });

    it('should fetch and cache on miss', async () => {
      const types = [{ name: 'fire' }];
      mockCache.has.mockReturnValue(false);
      mockRepository.fetchTypeList.mockResolvedValue(types);
      const result = await service.getAvailableTypes();
      expect(result).toEqual(types);
      expect(mockCache.set).toHaveBeenCalledWith('type_list', types, 1800000);
    });

    it('should return isErr on failure', async () => {
      mockCache.has.mockReturnValue(false);
      mockRepository.fetchTypeList.mockRejectedValue(new PokemonError('LIST_ERROR', 'fail'));
      const result = await service.getAvailableTypes();
      expect(result.isErr).toBe(true);
    });
  });
});
