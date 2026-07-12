import { PokemonService } from './application/services/pokemonService.js';
import { PokemonRepository } from './infrastructure/repositories/pokemonRepository.js';
import { LocalStorageCache } from './infrastructure/cache/localStorageCache.js';
import { PokedexController } from './presentation/controllers/pokedexController.js';
import { PokedexView } from './presentation/views/pokedexView.js';
import { AppRouter } from './presentation/router/appRouter.js';

document.addEventListener('DOMContentLoaded', () => {
  const repository = new PokemonRepository();
  const cache = new LocalStorageCache();
  const service = new PokemonService(repository, cache);
  const view = new PokedexView();
  const router = new AppRouter();
  const controller = new PokedexController(service, view, router);
  controller.initialize();
});
