import { Request, Response } from 'express';
import { AllPokemonStats } from 'pokedex-plus-isomorphic/lib/types';
import statsService from '../services/stats.service';

async function getAllStats(req: Request, res: Response): Promise<void> {
  try {
    const allPokemonStats: AllPokemonStats = await statsService.getAllStats();

    res.send(JSON.stringify(allPokemonStats));
  } catch (e) {
    res.sendStatus(500);
  }
}

export default {
  getAllStats,
};
