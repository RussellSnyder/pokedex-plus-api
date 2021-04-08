import { Request } from 'express';
import util from 'util';
import {
  IPokemon,
  PokemonListOptions,
  PokemonListResponse
} from '../isomorphic/types';
import { decodePokemonListQueryParams } from '../isomorphic/url-functions';
import pokemonService from '../services/pokemon.service';

async function getPokemonList(
  req: Request,
): Promise<PokemonListResponse> {

  const options = req.query ? decodePokemonListQueryParams(req.query as { [key: string]: string }) : undefined;

  console.log('parsed', util.inspect(options, true, 100));

  try {
    const pokemon = await pokemonService.getAllPokemon(options);
    return pokemon;
  } catch (e) {
    console.log(e);
    throw Error('Oh No!');
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
  getPokemonList,
  getPokemonById,
};
