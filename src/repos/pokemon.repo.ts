import fs from 'fs';
import { PokemonJsonFormat } from 'pokedex-plus-isomorphic/lib/types';
import util from 'util';
const readfile = util.promisify(fs.readFile);

async function getAllPokemon(): Promise<PokemonJsonFormat[]> {
  try {
    const rawJson = await readfile('./src/data/pokemon.json');
    const parsed = JSON.parse(rawJson.toString());
    return parsed.pokemon;
  } catch (e) {
    console.log('could not read pokemon.json', e);
    return [];
  }
}

export default {
  getAllPokemon,
};
