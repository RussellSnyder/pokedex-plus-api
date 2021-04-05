import { GenerationResponse } from '../models/shared';
import generationRepo from '../repos/generation.repo';

export interface GenerationCache {
  [key: string]: number; // pokemon name and generation number
}

let generationCache: GenerationCache;
let generationCacheFilled = false;

async function createGenerationCache() {
  generationCacheFilled = false;

  console.log('--- creating generation cache ---');

  const pokemonGenerationCollection: GenerationResponse[] = await generationRepo.getAllGenerations();

  generationCache = {};

  for (const [id, generation] of Object.entries(pokemonGenerationCollection)) {
    generation.pokemon_species.forEach(pokemon => {
      generationCache[pokemon.name] = parseInt(id);
    });
  }

  generationCacheFilled = true;
  console.log('--- generation cache created ---');
}

async function getGenerationOfPokemon(pokemonName: string): Promise<number> {
  const pokemonCache = await _getGnerationCache();

  return pokemonCache[pokemonName];
}

async function _getGnerationCache(): Promise<GenerationCache> {
  if (generationCacheFilled) {
    return generationCache;
  }

  await createGenerationCache();

  return generationCache;
}

export default {
  createGenerationCache,
  getGenerationOfPokemon,
};
