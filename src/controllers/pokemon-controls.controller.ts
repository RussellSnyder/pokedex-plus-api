import { Request, Response } from 'express';
import { } from 'pokedex-plus-isomorphic/lib/query-param-collections/pokemon.query-param-collection';
import { IPokemon, NumberRange, PokemonFilterControls } from 'pokedex-plus-isomorphic/lib/types';
import sortService from '../services/sort.service';
import { flattenDeep, map, property, uniq } from 'lodash';
import pokemonService from '../services/pokemon.service';

const getRangeFromPokemonArray = (pokemon: IPokemon[], prop: string): NumberRange => {
  const arr: number[] = map(pokemon, property(prop));  
  return [arr[0], arr[arr.length - 1]]
};

const getUniqueStringArray = (pokemon: IPokemon[], prop: any): any[] => {
  const arrayOfArrays: any[] = map(pokemon, property(prop));
  return uniq<any>(flattenDeep<any>(arrayOfArrays));
}

async function getPokemonFilters(req: Request, res: Response): Promise<void> {
  try {

    const pokemon = await pokemonService.getPokemon();
    const sortedPokemon = await sortService.getSortedPokemon();
    
    const filterControls: PokemonFilterControls = {
      types: getUniqueStringArray(pokemon.results, 'types'),
      abilities: getUniqueStringArray(pokemon.results, 'actions.abilities'),
      moves: getUniqueStringArray(pokemon.results, 'actions.moves'),
      generations: getUniqueStringArray(pokemon.results, 'generation'),
      games: getUniqueStringArray(pokemon.results, 'gamesWherePresent'),
      height: getRangeFromPokemonArray(sortedPokemon.height, 'physicalCharacteristics.height'),
      weight: getRangeFromPokemonArray(sortedPokemon.weight, 'physicalCharacteristics.weight'),
      hp: getRangeFromPokemonArray(sortedPokemon.hp, 'stats.hp'),
      attack: getRangeFromPokemonArray(sortedPokemon.attack, 'stats.attack'),
      defense: getRangeFromPokemonArray(sortedPokemon.defense, 'stats.defense'),
      specialAttack: getRangeFromPokemonArray(sortedPokemon.specialAttack, 'stats.specialAttack'),
      specialDefense: getRangeFromPokemonArray(sortedPokemon.specialDefense, 'stats.specialDefense'),
      speed: getRangeFromPokemonArray(sortedPokemon.speed, 'stats.speed'),
      baseExperience: getRangeFromPokemonArray(sortedPokemon.baseExperience, 'baseExperience'),
    }

    res.send(JSON.stringify(filterControls));
  } catch (e) {
    res.sendStatus(500);
  }
}

async function getPokemonSorts(req: Request, res: Response): Promise<void> {
  try {
    const sortControls = Object.keys(sortService.getSortedPokemon());

    res.send(JSON.stringify(sortControls, null, 2));
  } catch (e) {
    res.sendStatus(500);
  }
}

export default {
  getPokemonFilters,
  getPokemonSorts,
};
