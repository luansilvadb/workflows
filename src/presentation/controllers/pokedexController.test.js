import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokedexController } from './pokedexController.js';
import { Pokemon, PokemonError } from '../../domain/entities.js';

function makePokemon(id, name) {
  return new Pokemon(id, name, [], '', [], [], 0, 0);
}

describe('PokedexController', () => {
  let mockService;
  let mockView;
  let mockRouter;
  let controller;

  beforeEach(() => {
    mockService = {
      getPage: vi.fn(),
      getDetail: vi.fn(),
      searchByName: vi.fn(),
      getByType: vi.fn(),
      getAvailableTypes: vi.fn(),
    };
    mockView = {
      bindSearch: vi.fn(),
      bindFilter: vi.fn(),
      bindLoadMore: vi.fn(),
      bindPokemonSelect: vi.fn(),
      bindBack: vi.fn(),
      renderList: vi.fn(),
      renderDetail: vi.fn(),
      renderLoading: vi.fn(),
      renderError: vi.fn(),
      renderEmpty: vi.fn(),
      renderPagination: vi.fn(),
    };
    mockRouter = {
      navigate: vi.fn(),
      getCurrentState: vi.fn(),
      onStateChange: vi.fn(),
    };
    controller = new PokedexController(mockService, mockView, mockRouter);
  });

  describe('initialize', () => {
    it('should bind event handlers and load initial page', async () => {
      const pageResult = { count: 1, results: [makePokemon(1, 'bulbasaur')] };
      mockService.getPage.mockResolvedValue(pageResult);
      mockService.getAvailableTypes.mockResolvedValue([{ name: 'grass' }]);
      await controller.initialize();
      expect(mockView.bindSearch).toHaveBeenCalled();
      expect(mockView.bindFilter).toHaveBeenCalled();
      expect(mockView.bindLoadMore).toHaveBeenCalled();
      expect(mockView.bindPokemonSelect).toHaveBeenCalled();
      expect(mockView.bindBack).toHaveBeenCalled();
      expect(mockRouter.onStateChange).toHaveBeenCalled();
      expect(mockView.renderList).toHaveBeenCalledWith(pageResult.results, false);
      expect(mockView.renderPagination).toHaveBeenCalledWith(false);
    });

    it('should render error when initial page fails', async () => {
      mockService.getPage.mockResolvedValue({ isErr: true, error: new PokemonError('ERR', 'fail') });
      await controller.initialize();
      expect(mockView.renderError).toHaveBeenCalledWith('fail');
    });
  });

  describe('onSearch', () => {
    it('should search and render results', async () => {
      const results = [makePokemon(25, 'pikachu')];
      mockService.searchByName.mockResolvedValue(results);
      await controller.onSearch('pikachu');
      expect(mockView.renderList).toHaveBeenCalledWith(results, false);
      expect(mockView.renderPagination).toHaveBeenCalledWith(false);
    });

    it('should reload initial page on empty query', async () => {
      const pageResult = { count: 1, results: [makePokemon(1, 'bulbasaur')] };
      mockService.getPage.mockResolvedValue(pageResult);
      mockService.getAvailableTypes.mockResolvedValue([]);
      await controller.onSearch('  ');
      expect(mockService.getPage).toHaveBeenCalledWith(0, 20);
    });

    it('should render error on search failure', async () => {
      mockService.searchByName.mockResolvedValue({ isErr: true, error: new PokemonError('NF', 'not found') });
      await controller.onSearch('unknown');
      expect(mockView.renderError).toHaveBeenCalledWith('not found');
    });
  });

  describe('onFilter', () => {
    it('should filter and render results', async () => {
      const results = [makePokemon(1, 'bulbasaur')];
      mockService.getByType.mockResolvedValue(results);
      await controller.onFilter('grass');
      expect(mockView.renderList).toHaveBeenCalledWith(results, false);
    });

    it('should reload initial page on empty filter', async () => {
      const pageResult = { count: 1, results: [makePokemon(1, 'bulbasaur')] };
      mockService.getPage.mockResolvedValue(pageResult);
      mockService.getAvailableTypes.mockResolvedValue([]);
      await controller.onFilter('');
      expect(mockService.getPage).toHaveBeenCalledWith(0, 20);
    });

    it('should render error on filter failure', async () => {
      mockService.getByType.mockResolvedValue({ isErr: true, error: new PokemonError('ERR', 'bad type') });
      await controller.onFilter('unknown');
      expect(mockView.renderError).toHaveBeenCalledWith('bad type');
    });
  });

  describe('onLoadMore', () => {
    it('should load more and append results', async () => {
      const pageResult = { count: 40, results: [makePokemon(4, 'charmander')] };
      mockService.getPage.mockResolvedValue(pageResult);
      controller._currentOffset = 20;
      await controller.onLoadMore();
      expect(mockService.getPage).toHaveBeenCalledWith(20, 20);
      expect(mockView.renderList).toHaveBeenCalledWith(pageResult.results, true);
      expect(mockView.renderPagination).toHaveBeenCalledWith(true);
    });

    it('should render error on load more failure', async () => {
      mockService.getPage.mockResolvedValue({ isErr: true, error: new PokemonError('ERR', 'fail') });
      await controller.onLoadMore();
      expect(mockView.renderError).toHaveBeenCalledWith('fail');
    });
  });

  describe('onSelectPokemon', () => {
    it('should render detail and navigate', async () => {
      const pokemon = makePokemon(6, 'charizard');
      mockService.getDetail.mockResolvedValue(pokemon);
      await controller.onSelectPokemon(6);
      expect(mockView.renderDetail).toHaveBeenCalledWith(pokemon);
      expect(mockRouter.navigate).toHaveBeenCalledWith({ view: 'detail', pokemonId: 6 });
    });

    it('should render error on detail failure', async () => {
      mockService.getDetail.mockResolvedValue({ isErr: true, error: new PokemonError('ERR', 'not found') });
      await controller.onSelectPokemon(999);
      expect(mockView.renderError).toHaveBeenCalledWith('not found');
    });
  });

  describe('onBackToList', () => {
    it('should navigate to list view', () => {
      controller.onBackToList();
      expect(mockRouter.navigate).toHaveBeenCalledWith({ view: 'list' });
    });
  });

  describe('_handleStateChange', () => {
    it('should reload page on list state', async () => {
      const pageResult = { count: 1, results: [makePokemon(1, 'bulbasaur')] };
      mockService.getPage.mockResolvedValue(pageResult);
      mockService.getAvailableTypes.mockResolvedValue([]);
      await controller._handleStateChange({ view: 'list' });
      expect(mockService.getPage).toHaveBeenCalled();
    });

    it('should ignore non-list states', () => {
      controller._handleStateChange({ view: 'detail' });
      expect(mockService.getPage).not.toHaveBeenCalled();
    });
  });
});
