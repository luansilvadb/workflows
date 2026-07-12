import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokedexView } from './pokedexView.js';
import { Pokemon, PokemonType, PokemonStat, PokemonAbility } from '../../domain/entities.js';

describe('PokedexView', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('should build DOM structure on construction', () => {
    const view = new PokedexView();
    expect(document.querySelector('.pokedex')).not.toBeNull();
    expect(document.querySelector('.search-input')).not.toBeNull();
    expect(document.querySelector('.filter-select')).not.toBeNull();
    expect(document.querySelector('.pokemon-list')).not.toBeNull();
    expect(document.querySelector('.pokemon-detail')).not.toBeNull();
    expect(document.querySelector('.load-more-btn')).not.toBeNull();
    expect(document.querySelector('.back-btn')).not.toBeNull();
  });

  describe('renderList', () => {
    it('should render pokemon cards without append', () => {
      const view = new PokedexView();
      const pokemon = new Pokemon(25, 'pikachu', [], 'pika.png', [], [], 60, 4);
      view.renderList([pokemon], false);
      const cards = document.querySelectorAll('.pokemon-card');
      expect(cards.length).toBe(1);
      expect(cards[0].querySelector('.pokemon-name').textContent).toBe('pikachu');
      expect(cards[0].querySelector('.pokemon-id').textContent).toBe('#025');
    });

    it('should append cards when append is true', () => {
      const view = new PokedexView();
      const p1 = new Pokemon(1, 'bulbasaur', [], 'b.png', [], [], 0, 0);
      const p2 = new Pokemon(4, 'charmander', [], 'c.png', [], [], 0, 0);
      view.renderList([p1], false);
      view.renderList([p2], true);
      expect(document.querySelectorAll('.pokemon-card').length).toBe(2);
    });
  });

  describe('renderDetail', () => {
    it('should render pokemon detail', () => {
      const view = new PokedexView();
      const types = [new PokemonType('fire')];
      const stats = [new PokemonStat('hp', 78)];
      const abilities = [new PokemonAbility('blaze', false)];
      const pokemon = new Pokemon(6, 'charizard', types, 'char.png', stats, abilities, 905, 17);
      view.renderDetail(pokemon);
      const detailCard = document.querySelector('.detail-card');
      expect(detailCard).not.toBeNull();
      expect(detailCard.querySelector('.detail-name').textContent).toContain('charizard');
      expect(detailCard.querySelector('.detail-meta').textContent).toContain('Altura: 1.7m');
      expect(detailCard.querySelector('.detail-meta').textContent).toContain('Peso: 90.5kg');
      expect(detailCard.querySelector('.type-badge').textContent).toBe('fire');
    });
  });

  describe('renderLoading', () => {
    it('should show loading indicator', () => {
      const view = new PokedexView();
      view.renderLoading();
      expect(document.querySelector('.loading')).not.toBeNull();
      expect(document.querySelector('.loading').textContent).toBe('Carregando...');
    });
  });

  describe('renderError', () => {
    it('should show error with retry button', () => {
      const view = new PokedexView();
      view.renderError('Algo deu errado');
      const errorDiv = document.querySelector('.error');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv.querySelector('p').textContent).toBe('Algo deu errado');
      expect(errorDiv.querySelector('.retry-btn')).not.toBeNull();
    });
  });

  describe('renderEmpty', () => {
    it('should show empty state', () => {
      const view = new PokedexView();
      view.renderEmpty();
      expect(document.querySelector('.empty')).not.toBeNull();
      expect(document.querySelector('.empty').textContent).toBe('Nenhum Pokémon encontrado.');
    });
  });

  describe('renderPagination', () => {
    it('should show load more button when hasMore is true', () => {
      const view = new PokedexView();
      view.renderPagination(true);
      expect(view._loadMoreBtn.style.display).toBe('');
    });

    it('should hide load more button when hasMore is false', () => {
      const view = new PokedexView();
      view.renderPagination(false);
      expect(view._loadMoreBtn.style.display).toBe('none');
    });
  });

  describe('bindFilter', () => {
    it('should populate filter options when types are provided', () => {
      const view = new PokedexView();
      const handler = vi.fn();
      const types = [new PokemonType('fire'), new PokemonType('water')];
      view.bindFilter(handler, types);
      const options = view._filterSelect.querySelectorAll('option');
      expect(options.length).toBe(3);
      expect(options[1].value).toBe('fire');
      expect(options[2].value).toBe('water');
    });
  });

  describe('card click', () => {
    it('should trigger pokemon select handler on card click', () => {
      const view = new PokedexView();
      const handler = vi.fn();
      view.bindPokemonSelect(handler);
      const pokemon = new Pokemon(25, 'pikachu', [], 'p.png', [], [], 0, 0);
      view.renderList([pokemon], false);
      document.querySelector('.pokemon-card').click();
      expect(handler).toHaveBeenCalledWith(25);
    });
  });
});
