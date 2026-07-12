import { describe, it, expect } from 'vitest';
import { Pokemon, PokemonType, PokemonStat, PokemonAbility, PokemonError } from './entities.js';

describe('Pokemon', () => {
  it('should create a pokemon with all properties', () => {
    const types = [new PokemonType('fire')];
    const stats = [new PokemonStat('hp', 80)];
    const abilities = [new PokemonAbility('blaze', false)];
    const pokemon = new Pokemon(4, 'charmander', types, 'sprite.png', stats, abilities, 85, 6);
    expect(pokemon.id).toBe(4);
    expect(pokemon.name).toBe('charmander');
    expect(pokemon.types).toEqual(types);
    expect(pokemon.sprite).toBe('sprite.png');
    expect(pokemon.stats).toEqual(stats);
    expect(pokemon.abilities).toEqual(abilities);
    expect(pokemon.weight).toBe(85);
    expect(pokemon.height).toBe(6);
  });
});

describe('PokemonType', () => {
  it('should create a pokemon type', () => {
    const type = new PokemonType('water');
    expect(type.name).toBe('water');
  });
});

describe('PokemonStat', () => {
  it('should create a pokemon stat', () => {
    const stat = new PokemonStat('speed', 120);
    expect(stat.name).toBe('speed');
    expect(stat.baseStat).toBe(120);
  });
});

describe('PokemonAbility', () => {
  it('should create a visible ability', () => {
    const ability = new PokemonAbility('overgrow', false);
    expect(ability.name).toBe('overgrow');
    expect(ability.isHidden).toBe(false);
  });

  it('should create a hidden ability', () => {
    const ability = new PokemonAbility('chlorophyll', true);
    expect(ability.name).toBe('chlorophyll');
    expect(ability.isHidden).toBe(true);
  });
});

describe('PokemonError', () => {
  it('should create an error with code and message', () => {
    const error = new PokemonError('NOT_FOUND', 'Pokemon not found');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Pokemon not found');
  });
});
