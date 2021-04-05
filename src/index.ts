import { Request, Response } from 'express';
import pokemonController from './controllers/pokemon.controller';
import statsController from './controllers/stats.controller';
import { PokemonModel } from './models/pokemon';
import generationService from './services/generation.service';
import pokemonService from './services/pokemon.service';
import express from 'express';
import statsService from './services/stats.service';

const app = express();
const port = 3000;

function setupRoutes(): void {
  app.get('/pokemon', async (req: Request, res: Response) => {
    try {
      const pokemon = await pokemonController.getPokemonList(req.query);
      res.send(JSON.stringify(pokemon, null, 2));
    } catch {
      res.sendStatus(500);
    }
  });

  app.get('/pokemon/:id', async (req: Request, res: Response) => {
    // could be the id or the name of the pokemon
    const idOrName = req.params.id as number | string;

    if (!idOrName) {
      res.sendStatus(404);
    }

    let pokemon: PokemonModel;

    if (isNaN(idOrName as number)) {
      const name = idOrName as string;
      pokemon = await pokemonController.getPokemonByName(name);
    } else {
      const id = idOrName as number;
      pokemon = await pokemonController.getPokemonById(id);
    }

    res.send(JSON.stringify(pokemon));
  });

  app.get('/stats', async (req: Request, res: Response) => {
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
