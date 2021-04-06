import { ServiceCache } from '../models/backend';
import { PokemonModel } from '../models/pokemon';
import {
  FilterParam,
  PokemonListOptions,
  PokemonListResponse,
  SortParam,
  PokemonJsonFormat,
  IPokemon,
} from '../models/shared';
import pokemonRepo from '../repos/pokemon.repo';
import generationService from './generation.service';
import statsService from './stats.service';

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
    const normalizedStats = statsService.calculatenormalizedStats(pokemon);

    pokemonCache.cache[pokemon.id] = {
      ...pokemon,
      normalizedPhysicalCharacteristics,
      normalizedStats,
      normalizedBaseExperience: normalizedBaseExperience.baseExperience,
    };
  });
}

async function getAllPokemon(
  options?: PokemonListOptions,
): Promise<PokemonListResponse> {
  const pokemonCache = await _getPokemonCache();

  if (!options) {
    const pokemon = Object.values(pokemonCache);
    return {
      results: pokemon,
      totalResults: pokemon.length,
    };
  }

  const { filter, sort, offset, limit } = options;

  const filteredCache = _filterPokemonList(pokemonCache, filter);
  const sortedCache = _sortPokemonList(filteredCache, sort);

  const prePaginationLength = Object.keys(sortedCache).length;

  if (limit != undefined && limit > prePaginationLength) {
    return {
      results: Object.values(sortedCache),
      totalResults: prePaginationLength,
    };
  }
  const pagedCache = _pagePokemonList(sortedCache, limit, offset);

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

function _filterPokemonList(pokemonCache: PokemonCache, filter?: FilterParam) {
  if (!filter) {
    return pokemonCache;
  }

  let processedPokemon = [...Object.values(pokemonCache)];

  const {
    type,
    generations,
    height,
    weight,
    hp,
    attack,
    defense,
    specialAttack,
    specialDefense,
    speed,
    ability,
    move,
    isDefault,
    presentInGame,
  } = filter;

  if (type != undefined) {
    processedPokemon = processedPokemon.filter((pokemon: IPokemon) =>
      pokemon.types.includes(type),
    );
  }

  if (generations != undefined) {
    processedPokemon = processedPokemon.filter((pokemon: IPokemon) =>
      generations.includes(pokemon.generation),
    );
  }

  if (hp != undefined) {
    const [min, max] = hp;
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.hp && min <= stats.hp && stats.hp <= max,
    );
  }

  if (speed != undefined) {
    const [min, max] = speed;
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) => stats.speed && min <= stats.speed && stats.speed <= max,
    );
  }

  if (attack != undefined) {
    const [min, max] = attack;
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) =>
        stats.attack && min <= stats.attack && stats.attack <= max,
    );
  }

  if (defense != undefined) {
    const [min, max] = defense;
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) =>
        stats.defense && min <= stats.defense && stats.defense <= max,
    );
  }

  if (specialAttack != undefined) {
    const [min, max] = specialAttack;
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) =>
        stats.specialAttack &&
        min <= stats.specialAttack &&
        stats.specialAttack <= max,
    );
  }

  if (specialDefense != undefined) {
    const [min, max] = specialDefense;
    processedPokemon = processedPokemon.filter(
      ({ stats }: IPokemon) =>
        stats.specialDefense &&
        min <= stats.specialDefense &&
        stats.specialDefense <= max,
    );
  }

  if (height != undefined) {
    const [min, max] = height;
    processedPokemon = processedPokemon.filter(
      ({ height }) => min <= height && height <= max,
    );
  }

  if (weight != undefined) {
    const [min, max] = weight;
    processedPokemon = processedPokemon.filter(
      ({ weight }) => min <= weight && weight <= max,
    );
  }

  if (ability != undefined) {
    processedPokemon = processedPokemon.filter((pokemon: PokemonModel) =>
      pokemon.actions.abilities.includes(ability),
    );
  }

  if (move != undefined) {
    processedPokemon = processedPokemon.filter((pokemon: PokemonModel) =>
      pokemon.actions.moves.includes(move),
    );
  }

  if (isDefault != undefined) {
    processedPokemon = processedPokemon.filter(
      (pokemon: PokemonModel) => pokemon.isDefault === isDefault,
    );
  }

  if (presentInGame != undefined) {
    processedPokemon = processedPokemon.filter((pokemon: PokemonModel) =>
      pokemon.gamesWherePresent.includes(presentInGame),
    );
  }

  return Object.entries(processedPokemon).reduce(
    (r, [id, pokemon]) => ({ ...r, [id]: pokemon }),
    {},
  );
}

function _sortPokemonList(pokemonCache: PokemonCache, sort?: SortParam) {
  if (!sort) {
    return pokemonCache;
  }

  const processedPokemon = [...Object.values(pokemonCache)];

  switch (sort) {
    case SortParam.NameAsc:
      processedPokemon.sort((a, b) => a.name - b.name);
      break;
    case SortParam.NameDesc:
      processedPokemon.sort((a, b) => b.name - a.name);
      break;
    case SortParam.HeightDesc:
      processedPokemon.sort((a, b) => a.height - b.height);
      break;
    case 'height-desc':
      processedPokemon.sort((a, b) => b.height - a.height);
      break;
    case 'weight-asc':
      processedPokemon.sort((a, b) => a.weight - b.weight);
      break;
    case 'weight-desc':
      processedPokemon.sort((a, b) => b.weight - a.weight);
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
  getAllPokemon,
  getPokemonById,
  addNormalizedData,
};
