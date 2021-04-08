import { ServiceCache } from '../models/backend';
import { GenerationResponse } from '../isomorphic/types';
import generationRepo from '../repos/generation.repo';

export interface GenerationCache {
  [key: string]: number; // pokemon name and generation number
}

const generationCache: ServiceCache<GenerationCache> = {
  cache: {} as GenerationCache,
  isCacheLoaded: false,
};

async function createGenerationCache(): Promise<void> {
  generationCache.isCacheLoaded = false;

  console.log('--- creating generation cache ---');

  const pokemonGenerationCollection: GenerationResponse[] = await generationRepo.getAllGenerations();

  generationCache.cache = {};

  for (const [id, generation] of Object.entries(pokemonGenerationCollection)) {
    generation.pokemon_species.forEach(pokemon => {
      generationCache.cache[pokemon.name] = parseInt(id);
    });
  }

  generationCache.isCacheLoaded = true;
  console.log('--- generation cache created ---');
}

async function getGenerationOfPokemon(pokemonName: string): Promise<number> {
  const pokemonCache = await _getGnerationCache();

  return pokemonCache[pokemonName];
}

async function _getGnerationCache(): Promise<GenerationCache> {
  if (generationCache.isCacheLoaded) {
    return generationCache.cache;
  }

  await createGenerationCache();

  return generationCache.cache;
}

export default {
  createGenerationCache,
  getGenerationOfPokemon,
};
