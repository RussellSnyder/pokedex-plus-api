import express, { Request, Response } from 'express';
import pokemonController from './controllers/pokemon.controller';
import statsController from './controllers/stats.controller';
import generationService from './services/generation.service';
import pokemonService from './services/pokemon.service';
import statsService from './services/stats.service';
import cors from 'cors';
import { IPokemon } from 'pokedex-plus-isomorphic/lib/types';
import sortService from './services/sort.service';
import pokemonControlsController from './controllers/pokemon-controls.controller';

const app = express();
app.use(cors());

const port = 3000;

function setupRoutes(): void {
  app.get('/api/v1/pokemon', pokemonController.getAllPokemon);
  // could be the id or the name of the pokemon
  app.get('/api/v1/pokemon/:id', pokemonController.getPokemon);

  app.get('/api/v1/stats', statsController.getAllStats);

  app.get('/api/v1/pokemon-controls/filters', pokemonControlsController.getPokemonFilters)
  app.get('/api/v1/pokemon-controls/sorts', pokemonControlsController.getPokemonSorts)
}

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
  await generationService.createGenerationCache();
  await pokemonService.createPokemonCache();
  await sortService.createSortCache();
  await statsService.createStatCache();
  pokemonService.addNormalizedData();

  console.log('API ready for use!');

  setupRoutes();
});
