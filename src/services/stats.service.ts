import { flattenDeep } from 'lodash';
import {
  AllPokemonStats,
  IPokemon,
  PokemonPhysicalCharacteristics,
  PokemonStats,
  AllPokemonStat,
  MathematicalStats,
  NameAndCount,
} from 'pokedex-plus-isomorphic/lib/types';
import stats from 'stats-lite';
import { ServiceCache } from '../models/service-cache';
import pokemonService from '../services/pokemon.service';

const statCache: ServiceCache<AllPokemonStats> = {
  cache: {} as AllPokemonStats,
  isCacheLoaded: false,
};

async function createStatCache(): Promise<void> {
  statCache.isCacheLoaded = false;

  const pokemonList = await pokemonService.getPokemon();
  const pokemon = pokemonList.results as IPokemon[];

  statCache.cache = {
    types: _calculateNameAndCount(flattenDeep(pokemon.map(p => p.types))),
    abilities: _calculateNameAndCount(
      flattenDeep(pokemon.map(p => p.actions.abilities)),
    ),
    moves: _calculateNameAndCount(
      flattenDeep(pokemon.map(p => p.actions.moves)),
    ),
    generations: Array.from(new Set(pokemon.map(p => p.generation))),
    pokemonInGeneration: _calculateNameAndCount(pokemon.map(p => p.generation)),
    pokemonPresentInGame: _calculateNameAndCount(
      flattenDeep(pokemon.map(p => p.gamesWherePresent)),
    ),
    weight: _calculateAllPokemonStat(
      pokemon.map(p => p.physicalCharacteristics.weight),
    ),
    height: _calculateAllPokemonStat(
      pokemon.map(p => p.physicalCharacteristics.height),
    ),
    hp: _calculateAllPokemonStat(
      pokemon.map(p => p.stats.hp).filter(Boolean) as number[],
    ),
    attack: _calculateAllPokemonStat(
      pokemon.map(p => p.stats.attack).filter(Boolean) as number[],
    ),
    defense: _calculateAllPokemonStat(
      pokemon.map(p => p.stats.defense).filter(Boolean) as number[],
    ),
    specialAttack: _calculateAllPokemonStat(
      pokemon.map(p => p.stats.specialAttack).filter(Boolean) as number[],
    ),
    specialDefense: _calculateAllPokemonStat(
      pokemon.map(p => p.stats.specialDefense).filter(Boolean) as number[],
    ),
    speed: _calculateAllPokemonStat(
      pokemon.map(p => p.stats.speed).filter(Boolean) as number[],
    ),
    baseExperience: _calculateAllPokemonStat(
      pokemon.map(p => p.baseExperience),
    ),
    defaultPokemonCount: pokemon
      .map(p => (p.isDefault ? 1 : (0 as number)))
      .reduce((acc, curr) => acc + curr),
  };

  statCache.isCacheLoaded = true;
}

async function getAllStats(): Promise<AllPokemonStats> {
  if (statCache.isCacheLoaded) {
    return statCache.cache;
  }

  await createStatCache();

  return statCache.cache;
}

function calculateNormalizedPhysicalCharacteristics(
  pokemon: IPokemon,
): PokemonPhysicalCharacteristics {
  return {
    height: _normalizeValue(
      pokemon.physicalCharacteristics.height,
      statCache.cache.height.min,
      statCache.cache.height.max,
    ),
    weight: _normalizeValue(
      pokemon.physicalCharacteristics.weight,
      statCache.cache.weight.min,
      statCache.cache.weight.max,
    ),
  };
}

function calculateNormalizedBaseExperience(
  pokemon: IPokemon,
): { baseExperience: number } {
  const baseExperience = _normalizeValue(
    pokemon.baseExperience,
    statCache.cache.baseExperience.min,
    statCache.cache.baseExperience.max,
  );
  return {
    baseExperience,
  };
}

function calculateNormalizedStats(pokemon: IPokemon): PokemonStats {
  return {
    hp: pokemon.stats.hp
      ? _normalizeValue(
          pokemon.stats.hp,
          statCache.cache.hp.min,
          statCache.cache.hp.max,
        )
      : undefined,
    attack: pokemon.stats.attack
      ? _normalizeValue(
          pokemon.stats.attack,
          statCache.cache.attack.min,
          statCache.cache.attack.max,
        )
      : undefined,
    defense: pokemon.stats.defense
      ? _normalizeValue(
          pokemon.stats.defense,
          statCache.cache.defense.min,
          statCache.cache.defense.max,
        )
      : undefined,
    specialAttack: pokemon.stats.specialAttack
      ? _normalizeValue(
          pokemon.stats.specialAttack,
          statCache.cache.specialAttack.min,
          statCache.cache.specialAttack.max,
        )
      : undefined,
    specialDefense: pokemon.stats.specialDefense
      ? _normalizeValue(
          pokemon.stats.specialDefense,
          statCache.cache.specialDefense.min,
          statCache.cache.specialDefense.max,
        )
      : undefined,
    speed: pokemon.stats.speed
      ? _normalizeValue(
          pokemon.stats.speed,
          statCache.cache.speed.min,
          statCache.cache.speed.max,
        )
      : undefined,
  };
}

function _normalizeValue(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

function _calculateAllPokemonStat(values: number[]): AllPokemonStat {
  return {
    nameAndCounts: _calculateNameAndCount(values),
    ..._calculateMathmaticalStats(values),
  };
}

function _calculateMathmaticalStats(values: number[]): MathematicalStats {
  const sorted = values.sort((a, b) => a - b);

  return {
    mean: stats.mean(values),
    median: stats.median(values),
    mode: stats.mode(values),
    variance: stats.variance(values),
    stdev: stats.stdev(values),
    sampleStdev: stats.sampleStdev(values),
    max: sorted[sorted.length - 1],
    min: sorted[0],
  };
}

function _calculateNameAndCount(values: (string | number)[]): NameAndCount {
  const nameAndCount: NameAndCount = {};

  values.forEach(value => {
    if (!nameAndCount[value]) {
      nameAndCount[value] = 0;
    }
    nameAndCount[value]++;
  });

  // order by count
  return Object.entries(nameAndCount)
    .sort(([, a], [, b]) => a - b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
}

export default {
  createStatCache,
  getAllStats,
  calculateNormalizedPhysicalCharacteristics,
  calculateNormalizedStats,
  calculateNormalizedBaseExperience,
};
