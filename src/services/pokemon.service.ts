import { ServiceCache } from '../models/service-cache';
import { PokemonModel } from '../models/pokemon';
import pokemonRepo from '../repos/pokemon.repo';
import generationService from './generation.service';
import statsService from './stats.service';
import { FilterParam, IPokemon, PokemonJsonFormat, PokemonListOptions, PokemonListResponse } from 'pokedex-plus-isomorphic/lib/types';
import { getKeyAndValueOfObject } from 'pokedex-plus-isomorphic/lib/util';
import { filterQueryParamCollection, SortQueryParam } from 'pokedex-plus-isomorphic/lib/query-param-collections/pokemon.query-param-collection';

export interface PokemonCache {
  [key: number]: IPokemon;
}

const pokemonCache: ServiceCache<PokemonCache> = {
  cache: {},
  isCacheLoaded: false,
};

async function createPokemonCache(): Promise<void> {
  pokemonCache.isCacheLoaded = false;

  console.log('--- creating pokemon cache ---');

  const pokemonCollection: {
    [key: number]: PokemonJsonFormat;
  } = await pokemonRepo.getAllPokemon();

  pokemonCache.cache = {};

  for (const [id, rawValues] of Object.entries(pokemonCollection)) {
    const generation = await generationService.getGenerationOfPokemon(
      rawValues.species.name,
    );

    const pokemon = new PokemonModel({ ...rawValues, generation });

    if (!pokemonCache.cache[parseInt(id)]) {
      pokemonCache.cache[parseInt(id)] = pokemon;
    }
  }

  pokemonCache.isCacheLoaded = true;
}

function addNormalizedData(): void {
  if (pokemonCache.isCacheLoaded === false) {
    console.error('no cache to add normalized data to');
  }
  console.log('--- adding normalization data to pokemon ---');

  const allPokemon = Object.values(pokemonCache.cache).map(
    p => p,
  ) as IPokemon[];

  pokemonCache.cache = {};

  allPokemon.forEach(pokemon => {
    const normalizedBaseExperience = statsService.calculateNormalizedBaseExperience(
      pokemon,
    );
    const normalizedPhysicalCharacteristics = statsService.calculateNormalizedPhysicalCharacteristics(
      pokemon,
    );
    const normalizedStats = statsService.calculateNormalizedStats(pokemon);

    pokemonCache.cache[pokemon.id] = {
      ...pokemon,
      normalizedPhysicalCharacteristics,
      normalizedStats,
      normalizedBaseExperience: normalizedBaseExperience.baseExperience,
    };
  });
}

async function getPokemon(
  options?: { [key: string]: any },
): Promise<PokemonListResponse> {
  const pokemonCache = await _getPokemonCache();

  if (!options) {
    const pokemon = Object.values(pokemonCache);
    return {
      results: pokemon,
      totalResults: pokemon.length,
    };
  }
  
  const filteredCache = _filterPokemonList(pokemonCache, options);
  const sortedCache = _sortPokemonList(filteredCache, options);

  const prePaginationLength = Object.keys(sortedCache).length;

  const { limit, offset } = options;

  if (limit != undefined && limit > prePaginationLength) {
    return {
      results: Object.values(sortedCache),
      totalResults: prePaginationLength,
    };
  }
  const pagedCache = _pagePokemonList(
    sortedCache,
    limit,
    offset,
  );

  const pokemon = Object.values(pagedCache);

  return {
    results: Object.values(pokemon),
    totalResults: Object.values(sortedCache).length,
    offset,
    limit,
  };
}

async function getPokemonById(id: number): Promise<IPokemon> {
  const pokemonCache = await _getPokemonCache();

  return pokemonCache[id];
}

async function getPokemonByName(name: string): Promise<IPokemon> {
  const pokemonCache = await _getPokemonCache();

  return Object.values(pokemonCache).find(p => p.name === name);
}

function _pagePokemonList(
  pokemonCache: PokemonCache,
  limit?: number,
  offset?: number,
): PokemonCache {
  if (!limit && !offset) {
    return pokemonCache;
  }

  let processedPokemon = [...Object.values(pokemonCache)];

  if (limit && offset) {
    processedPokemon = processedPokemon.slice(offset, offset + limit);
  } else if (offset && !limit) {
    processedPokemon = processedPokemon.slice(offset, processedPokemon.length);
  } else if (limit && !offset) {
    processedPokemon = processedPokemon.slice(0, limit);
  }

  return Object.entries(processedPokemon).reduce(
    (r, [id, pokemon]) => ({ ...r, [id]: pokemon }),
    {},
  );
}

// TODO interpret type from collection
function _filterPokemonList(pokemonCache: PokemonCache, options: { [key: string]: any }) {
  let processedPokemon = [...Object.values(pokemonCache)];

  // String Lists
  const type: string[] | undefined = options.type;
  if (type) {
    processedPokemon = processedPokemon.filter((pokemon: IPokemon) =>
    type.every((t: string) => pokemon.types.includes(t)),
    );
  }

  const ability: string[] | undefined = options.ability;
  if (ability) {
    processedPokemon = processedPokemon.filter((pokemon: IPokemon) =>
    ability.every((t: string) => pokemon.actions.abilities.includes(t)),
    );
  }

  const move: string[] | undefined = options.move;
  if (move) {
    processedPokemon = processedPokemon.filter((pokemon: IPokemon) =>
    move.every((t: string) => pokemon.actions.moves.includes(t)),
    );
  }

  // Booleans
  const isDefault: boolean | undefined = options.isDefault;
  if (isDefault) {
    processedPokemon = processedPokemon.filter(
      (pokemon: PokemonModel) => pokemon.isDefault === isDefault,
    );
  }

  // Number Lists
  const generation: number[] | undefined = options.generation;
  if (generation != undefined) {
    processedPokemon = processedPokemon.filter((pokemon: IPokemon) =>
      generation.includes(pokemon.generation),
    );
  }

  // Stat Numbers
  const hpMin: number | undefined = options.hpMin;
  if (hpMin) {
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.hp && stats.hp >= hpMin,
    );
  }

  const hpMax: number | undefined = options.hpMax;
  if (hpMax) {
  processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.hp && stats.hp <= hpMax,
    );
  }

  const speedMin: number | undefined = options.speedMin;
  if (speedMin) {
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.speed && stats.speed >= speedMin,
    );
  }

  const speedMax: number | undefined = options.speedMax;
  if (speedMax) {
  processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.speed && stats.speed <= speedMax,
    );
  }

  const attackMin: number | undefined = options.attackMin;
  if (attackMin) {
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.attack && stats.attack >= attackMin,
    );
  }

  const attackMax: number | undefined = options.attackMax;
  if (attackMax) {
  processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.attack && stats.attack <= attackMax,
    );
  }

  const defenseMin: number | undefined = options.defenseMin;
  if (defenseMin) {
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.defense && stats.defense >= defenseMin,
    );
  }

  const defenseMax: number | undefined = options.defenseMax;
  if (defenseMax) {
  processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.defense && stats.defense <= defenseMax,
    );
  }

  const specialAttackMin: number | undefined = options.specialAttackMin;
  if (specialAttackMin) {
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.specialAttack && stats.specialAttack >= specialAttackMin,
    );
  }

  const specialAttackMax: number | undefined = options.specialAttackMax;
  if (specialAttackMax) {
  processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.specialAttack && stats.specialAttack <= specialAttackMax,
    );
  }

  const specialDefenseMin: number | undefined = options.specialDefenseMin;
  if (specialDefenseMin) {
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.specialDefense && stats.specialDefense >= specialDefenseMin,
    );
  }

  const specialDefenseMax: number | undefined = options.specialDefenseMax;
  if (specialDefenseMax) {
  processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.specialDefense && stats.specialDefense <= specialDefenseMax,
    );
  }

  // Numbers
  const heightMin: number | undefined = options.heightMin;
  if (heightMin) {
    processedPokemon = processedPokemon.filter(({ height }) => height >= heightMin);
  }

  const heightMax: number | undefined = options.heightMax;
  if (heightMax) {
    processedPokemon = processedPokemon.filter(({ height }) => height <= heightMax);
  }

  const weightMin: number | undefined = options.weightMin;
  if (weightMin) {
    processedPokemon = processedPokemon.filter(({ weight }) => weight >= weightMin);
  }

  const weightMax: number | undefined = options.weightMax;
  if (weightMax) {
    processedPokemon = processedPokemon.filter(({ weight }) => weight <= weightMax);
  }


  return Object.entries(processedPokemon).reduce(
    (r, [id, pokemon]) => ({ ...r, [id]: pokemon }),
    {},
  );
}

function _sortPokemonList(pokemonCache: PokemonCache, sort?: { [key: string]: string }) {
  if (!sort) {
    return pokemonCache;
  }

  const processedPokemon = [...Object.values(pokemonCache)];

  // only one sort
  const [key, value] = getKeyAndValueOfObject(sort);

  switch (key) {
    case SortQueryParam.Name:
      if (value === 'asc') {
        processedPokemon.sort((a, b) => a.name - b.name);
      } else if (value === 'desc') {
        processedPokemon.sort((a, b) => b.name - a.name);
      }
      break;
    case SortQueryParam.Height:
      if (value === 'asc') {
        processedPokemon.sort((a, b) => a.height - b.height);
      } else if (value === 'desc') {
        processedPokemon.sort((a, b) => b.height - a.height);
      }
      break;
    case SortQueryParam.Weight:
      if (value === 'asc') {
        processedPokemon.sort((a, b) => a.weight - b.weight);
      } else if (value === 'desc') {
        processedPokemon.sort((a, b) => b.weight - a.weight);
      }
      break;
  }

  return Object.entries(processedPokemon).reduce(
    (r, [id, pokemon]) => ({ ...r, [id]: pokemon }),
    {},
  );
}

async function _getPokemonCache(): Promise<PokemonCache> {
  if (pokemonCache.isCacheLoaded) {
    return pokemonCache.cache;
  }

  await createPokemonCache();

  return pokemonCache.cache;
}

export default {
  createPokemonCache,
  getPokemonByName,
  getPokemon,
  getPokemonById,
  addNormalizedData,
};
