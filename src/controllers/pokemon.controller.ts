import { Request, Response } from 'express';
import pokemonService from '../services/pokemon.service';
import { IPokemon, PokemonListResponse } from 'pokedex-plus-isomorphic/lib/types'
import { filterQueryParamCollection, intervalQueryParamCollection, sortQueryParamCollection } from 'pokedex-plus-isomorphic/lib/query-param-collections/pokemon.query-param-collection'
import { SerializedQueryParam } from 'pokedex-plus-isomorphic/lib/models/query-param';
import clone from 'lodash.clone';

async function getAllPokemon(req: Request, res: Response): Promise<void> {
  // express tries to parse the query which is normally good,
  // but we have our own logic
  // TODO tell express not to parse
  const query = Object.entries(req.query).
    map(([key, value]) => ({ [key]: value!.toString() }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {}) as SerializedQueryParam

  // we want a unique copy for each call
  const queryParamCollections = [
    clone(filterQueryParamCollection),
    clone(sortQueryParamCollection),
    clone(intervalQueryParamCollection)
  ]

  queryParamCollections.forEach(q => q.updateQueryParamsFromSerialized(query));

  const options = queryParamCollections.reduce((prev, curr) => ({
    ...prev,
    ...curr.getActiveQueryParams()
  }), {})

  try {
    const pokemon = await pokemonService.getPokemon(options);
    res.send(JSON.stringify(pokemon, null, 2));
  } catch (e) {
    res.sendStatus(500);
  }
}

async function getPokemonById(id: number): Promise<IPokemon> {
  return await pokemonService.getPokemonById(id);
}

async function getPokemonByName(name: string): Promise<IPokemon> {  
  return await pokemonService.getPokemonByName(name);
}

export default {
  getPokemonByName,
  getAllPokemon: getAllPokemon,
  getPokemonById,
};
