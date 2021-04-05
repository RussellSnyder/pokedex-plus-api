import { AllPokemonStats } from '../models/shared';
import statsService from '../services/stats.service';

async function getAllStats(): Promise<AllPokemonStats> {
  return await statsService.getAllStats();
}

export default {
  getAllStats,
};
