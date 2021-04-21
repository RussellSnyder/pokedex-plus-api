import express, { Request, Response } from 'express';
import pokemonController from './controllers/pokemon.controller';
import statsController from './controllers/stats.controller';
import generationService from './services/generation.service';
import pokemonService from './services/pokemon.service';
import statsService from './services/stats.service';
import cors from 'cors';
import { IPokemon } from 'pokedex-plus-isomorphic/lib/types';

const app = express();
app.use(cors());

const port = 3000;

function setupRoutes(): void {
  app.get('/api/v1/pokemon', pokemonController.getAllPokemon);
  app.get('/api/v1/pokemon/:id', async (req: Request, res: Response) => {
    // could be the id or the name of the pokemon
    const idOrName = req.params.id as number | string;

    if (!idOrName) {
      res.sendStatus(404);
    }

    let pokemon: IPokemon;

    try {
      if (isNaN(idOrName as number)) {
        const name = idOrName as string;
        pokemon = await pokemonController.getPokemonByName(name);
      } else {
        const id = idOrName as number;
        pokemon = await pokemonController.getPokemonById(id);
      }

      if (!pokemon) {
        res.sendStatus(404);
        return;
      }

      res.send(JSON.stringify(pokemon));
    } catch (e) {
      console.warn(e);
    }
  });

  app.get('/api/v1/stats', async (req: Request, res: Response) => {
    const stats = await statsController.getAllStats();

    res.send(JSON.stringify(stats));
  });
}

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
  await generationService.createGenerationCache();
  await pokemonService.createPokemonCache();
  await statsService.createStatCache();
  pokemonService.addNormalizedData();

  console.log('API ready for use!');

  setupRoutes();
});
