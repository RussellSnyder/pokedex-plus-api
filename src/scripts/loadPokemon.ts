'use strict';
import axios from 'axios';
import fs from 'fs';
import util from 'util';
import {
  GroupNamedAPIResourceResponse,
  PokeApiPokemonResponse,
} from '../models/shared';

const writeFile = util.promisify(fs.writeFile);

const httpClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 5000,
});

async function _getPokemonCount(): Promise<number | undefined> {
  try {
    const res: GroupNamedAPIResourceResponse = await httpClient.get('pokemon');
    return res.data.count;
  } catch (e) {
    console.error('couldnt get count');
  }
}

async function _getAllPokemonNamedApiResources(
  count: number,
): Promise<GroupNamedAPIResourceResponse | undefined> {
  try {
    const res = await httpClient.get(`pokemon?limit=${count}`);
    return res;
  } catch (e) {
    console.error('couldnt get pokemon name,url list');
    console.error(e);
  }
}

const createPokemonJson = async () => {
  const count = await _getPokemonCount();
  const res = await _getAllPokemonNamedApiResources(count!);

  const urls = res?.data.results.map(d => d.url);

  const fetchedpokemon: { [key: number]: PokeApiPokemonResponse } = {};
  let fetchCount = 0;

  for (const url of urls!) {
    try {
      const res = await axios.get(url);

      const pokemon = res.data;

      fetchedpokemon[pokemon.id] = pokemon;
    } catch (e) {
      console.log(`failed to fetch ${url}`);
    } finally {
      fetchCount++;
      if (fetchCount % 10 === 0) {
        console.log('fetched', fetchCount, 'pokemon');
      }
    }
  }

  console.log(`loaded ${Object.keys(fetchedpokemon).length} pokemon`);

  // github only allows 100mb files
  // remove version groups from moves bc we dont use it anyway
  const trimmedData = Object.entries(fetchedpokemon).map(([id, p]) => {
    const moves = p.moves.map(move => move.move);
    return {
      ...p,
      moves,
    }
  })

  
  const pokemonData = JSON.stringify(
    {
      lastUpdated: Date.now(),
      pokemon: trimmedData,
    }, null, 2
  );

  try {
    await writeFile('./src/data/pokemon.json', pokemonData);
    const pokemonCount = Object.keys(fetchedpokemon).length;
    console.log(`${pokemonCount} pokemon saved to file`);
  } catch (e) {
    console.log(e);
  }
};

createPokemonJson().then(() => process.exit());
