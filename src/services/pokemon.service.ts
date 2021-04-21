import {
  ActivePokemonLabelTypeLookup,
  FilterQueryParam,
} from 'pokedex-plus-isomorphic/lib/query-param-collections/pokemon.query-param-collection';
import {
  IPokemon,
  PokemonActions,
  PokemonJsonFormat,
  PokemonListResponse,
  PokemonPhysicalCharacteristics,
  PokemonStats,
  SortValue,
} from 'pokedex-plus-isomorphic/lib/types';
import { ValueOf } from 'pokedex-plus-isomorphic/lib/util';
import { PokemonModel } from '../models/pokemon';
import { ServiceCache } from '../models/service-cache';
import pokemonRepo from '../repos/pokemon.repo';
import generationService from './generation.service';
import statsService from './stats.service';
import sortBy from 'lodash.sortBy';

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
  activeControls?: ActivePokemonLabelTypeLookup,
): Promise<PokemonListResponse> {
  const pokemonCache = await _getPokemonCache();

  if (!activeControls) {
    const pokemon = Object.values(pokemonCache);
    return {
      results: pokemon,
      totalResults: pokemon.length,
    };
  }

  const filteredCache = _filterPokemonList(pokemonCache, activeControls);
  const sortedCache = _sortPokemonList(filteredCache, activeControls);

  const prePaginationLength = Object.keys(sortedCache).length;

  const { limit, offset } = activeControls;

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

function _filterPokemonList(
  pokemonCache: PokemonCache,
  options: ActivePokemonLabelTypeLookup,
) {
  if (!options) {
    return pokemonCache;
  }

  let processedPokemon: IPokemon[] = [...Object.values(pokemonCache)];

  const type = options[FilterQueryParam.Type];
  if (type) {
    processedPokemon = _filterStringList(type, 'types', processedPokemon);
  }

  const ability = options[FilterQueryParam.Ability];
  if (ability) {
    processedPokemon = _filterAction(ability, 'abilities', processedPokemon);
  }

  const move = options[FilterQueryParam.Move];
  if (move) {
    processedPokemon = _filterAction(move, 'moves', processedPokemon);
  }

  const isDefault = options[FilterQueryParam.IsDefault];
  if (isDefault) {
    processedPokemon = processedPokemon.filter(
      pokemon => pokemon.isDefault === isDefault,
    );
  }

  const generation = options[FilterQueryParam.Generation];
  if (generation) {
    processedPokemon = _filterNumberList(
      generation,
      'generation',
      processedPokemon,
    );
  }

  const hpMin = options[FilterQueryParam.HpMin];
  if (hpMin) {
    processedPokemon = _filterByStat(hpMin, 'hp', 'min', processedPokemon);
  }

  const hpMax = options[FilterQueryParam.HpMax];
  if (hpMax) {
    processedPokemon = _filterByStat(hpMax, 'hp', 'max', processedPokemon);
  }

  const speedMin = options[FilterQueryParam.SpeedMin];
  if (speedMin) {
    processedPokemon = _filterByStat(
      speedMin,
      'speed',
      'min',
      processedPokemon,
    );
  }

  const speedMax = options[FilterQueryParam.SpeedMax];
  if (speedMax) {
    processedPokemon = _filterByStat(
      speedMax,
      'speed',
      'max',
      processedPokemon,
    );
  }

  const attackMin = options[FilterQueryParam.AttackMin];
  if (attackMin) {
    processedPokemon = _filterByStat(
      attackMin,
      'attack',
      'min',
      processedPokemon,
    );
  }

  const attackMax = options[FilterQueryParam.AttackMax];
  if (attackMax) {
    processedPokemon = _filterByStat(
      attackMax,
      'attack',
      'max',
      processedPokemon,
    );
  }

  const defenseMin = options[FilterQueryParam.DefenseMin];
  if (defenseMin) {
    processedPokemon = _filterByStat(
      defenseMin,
      'defense',
      'min',
      processedPokemon,
    );
  }

  const defenseMax = options[FilterQueryParam.DefenseMax];
  if (defenseMax) {
    processedPokemon = _filterByStat(
      defenseMax,
      'defense',
      'max',
      processedPokemon,
    );
  }

  const specialAttackMin = options[FilterQueryParam.SpecialAttackMin];
  if (specialAttackMin) {
    processedPokemon = _filterByStat(
      specialAttackMin,
      'specialAttack',
      'min',
      processedPokemon,
    );
  }

  const specialAttackMax = options[FilterQueryParam.SpecialAttackMax];
  if (specialAttackMax) {
    processedPokemon = _filterByStat(
      specialAttackMax,
      'specialAttack',
      'max',
      processedPokemon,
    );
  }

  const specialDefenseMin = options[FilterQueryParam.SpecialDefenseMin];
  if (specialDefenseMin) {
    processedPokemon = _filterByStat(
      specialDefenseMin,
      'specialDefense',
      'min',
      processedPokemon,
    );
  }

  const specialDefenseMax = options[FilterQueryParam.SpecialDefenseMax];
  if (specialDefenseMax) {
    processedPokemon = _filterByStat(
      specialDefenseMax,
      'specialDefense',
      'max',
      processedPokemon,
    );
  }

  const heightMin = options[FilterQueryParam.HeightMin];
  if (heightMin) {
    processedPokemon = _filterByPhysicalCharacteristic(
      heightMin,
      'height',
      'min',
      processedPokemon,
    );
  }

  const heightMax = options[FilterQueryParam.HeightMax];
  if (heightMax) {
    processedPokemon = _filterByPhysicalCharacteristic(
      heightMax,
      'height',
      'max',
      processedPokemon,
    );
  }

  const weightMin = options[FilterQueryParam.WeightMin];
  if (weightMin) {
    processedPokemon = _filterByPhysicalCharacteristic(
      weightMin,
      'weight',
      'min',
      processedPokemon,
    );
  }

  const weightMax = options[FilterQueryParam.WeightMax];
  if (weightMax) {
    processedPokemon = _filterByPhysicalCharacteristic(
      weightMax,
      'weight',
      'max',
      processedPokemon,
    );
  }

  return Object.entries(processedPokemon).reduce(
    (r, [id, pokemon]) => ({ ...r, [id]: pokemon }),
    {},
  );
}

function _sortPokemonList(
  pokemonCache: PokemonCache,
  options?: ActivePokemonLabelTypeLookup,
) {
  if (!options) {
    return pokemonCache;
  }

  let processedPokemon = [...Object.values(pokemonCache)];

  const { name, height, weight } = options;

  if (name) {
    processedPokemon = sortBy(processedPokemon, ['name']);
    if (name === SortValue.Desc) {
      processedPokemon.reverse();
    }
  }
  if (weight) {
    processedPokemon = sortBy(processedPokemon, [
      'physicalCharacteristics.weight',
    ]);
    if (weight === SortValue.Desc) {
      processedPokemon.reverse();
    }
  }
  if (height) {
    processedPokemon = sortBy(processedPokemon, [
      'physicalCharacteristics.height',
    ]);
    if (height === SortValue.Desc) {
      processedPokemon.reverse();
    }
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

const _filterStringList = (
  value: string[],
  property: keyof IPokemon,
  pokemonList: IPokemon[],
): IPokemon[] => {
  return pokemonList.filter(pokemon =>
    value.every(t => (pokemon[property] as string[]).includes(t)),
  );
};

const _filterNumberList = (
  value: number[],
  property: keyof IPokemon,
  pokemonList: IPokemon[],
): IPokemon[] => {
  return pokemonList.filter((pokemon: IPokemon) =>
    value.every(t => (pokemon[property] as number[]).includes(t)),
  );
};

const _filterAction = (
  value: ValueOf<ActivePokemonLabelTypeLookup>,
  property: keyof PokemonActions,
  pokemonList: IPokemon[],
): IPokemon[] => {
  return pokemonList.filter((pokemon: IPokemon) =>
    (value as string[]).every((t: string) =>
      (pokemon.actions[property] as string[]).includes(t),
    ),
  );
};

const _filterByStat = (
  value: number,
  property: keyof PokemonStats,
  minOfMax: 'min' | 'max',
  pokemonList: IPokemon[],
): IPokemon[] => {
  return pokemonList.filter(({ stats }) => {
    if (minOfMax === 'min') {
      return stats[property] && (stats[property] as number) >= value;
    } else if (minOfMax === 'max') {
      return stats[property] && (stats[property] as number) <= value;
    }
  });
};

const _filterByPhysicalCharacteristic = (
  value: number,
  property: keyof PokemonPhysicalCharacteristics,
  minOfMax: 'min' | 'max',
  pokemonList: IPokemon[],
): IPokemon[] => {
  return pokemonList.filter(({ physicalCharacteristics }) => {
    if (minOfMax === 'min') {
      return (
        physicalCharacteristics[property] &&
        (physicalCharacteristics[property] as number) >= value
      );
    } else if (minOfMax === 'max') {
      return (
        physicalCharacteristics[property] &&
        (physicalCharacteristics[property] as number) <= value
      );
    }
  });
};

export default {
  createPokemonCache,
  getPokemonByName,
  getPokemon,
  getPokemonById,
  addNormalizedData,
};
