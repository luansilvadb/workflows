class Pokemon {
  constructor(id, name, types, sprite, stats, abilities, weight, height) {
    this.id = id;
    this.name = name;
    this.types = types;
    this.sprite = sprite;
    this.stats = stats;
    this.abilities = abilities;
    this.weight = weight;
    this.height = height;
  }
}

class PokemonType {
  constructor(name) {
    this.name = name;
  }
}

class PokemonStat {
  constructor(name, baseStat) {
    this.name = name;
    this.baseStat = baseStat;
  }
}

class PokemonAbility {
  constructor(name, isHidden) {
    this.name = name;
    this.isHidden = isHidden;
  }
}

class PokemonError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}

export { Pokemon, PokemonType, PokemonStat, PokemonAbility, PokemonError };
