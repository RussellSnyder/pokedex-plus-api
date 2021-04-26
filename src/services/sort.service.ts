import { sortBy } from 'lodash';
import {
  IPokemon
} from 'pokedex-plus-isomorphic/lib/types';
import { ServiceCache } from '../models/service-cache';
import pokemonService from './pokemon.service';

export interface SortServiceCache {
  numberOfTypes: IPokemon[];
  numberOfAbilities: IPokemon[];
  numberOfMoves: IPokemon[];
  generation: IPokemon[];
  numberOfGamesPresent: IPokemon[];
  height: IPokemon[];
  weight: IPokemon[];
  hp: IPokemon[];
  attack: IPokemon[];
  defense: IPokemon[];
  specialAttack: IPokemon[];
  specialDefense: IPokemon[];
  speed: IPokemon[];
  baseExperience: IPokemon[];
}

const sortCache: ServiceCache<SortServiceCache> = {
  cache: {} as SortServiceCache,
  isCacheLoaded: false,
};

async function createSortCache(): Promise<void> {
  sortCache.isCacheLoaded = false;

  const pokemonList = await pokemonService.getPokemon();
  const pokemon = pokemonList.results as IPokemon[];

  sortCache.cache = {
    numberOfTypes: sortBy(pokemon, 'types.length'),
    numberOfAbilities: sortBy(pokemon, 'actions.abilities.length'),
    numberOfMoves: sortBy(pokemon, 'actions.moves.length'),
    generation: sortBy(pokemon, 'generation'),
    numberOfGamesPresent: sortBy(pokemon, 'gamesWherePresent.length'),
    height: sortBy(pokemon, 'physicalCharacteristics.height'),
    weight: sortBy(pokemon, 'physicalCharacteristics.weight'),
    hp: sortBy(pokemon, 'stats.hp'),
    attack: sortBy(pokemon, 'stats.attack'),
    defense: sortBy(pokemon, 'stats.defense'),
    specialAttack: sortBy(pokemon, 'stats.specialAttack'),
    specialDefense: sortBy(pokemon, 'stats.specialDefense'),
    speed: sortBy(pokemon, 'stats.speed'),
    baseExperience: sortBy(pokemon, 'baseExperience'),
  }  

  sortCache.isCacheLoaded = true;
}

async function getSortedPokemon(): Promise<SortServiceCache> {
  if (sortCache.isCacheLoaded) {
    return sortCache.cache;
  }

  await createSortCache();

  return sortCache.cache;
}

export default {
  createSortCache,
  getSortedPokemon,
};
