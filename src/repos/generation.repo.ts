import fs from 'fs';
import { GenerationResponse } from 'pokedex-plus-isomorphic/lib/types';
import util from 'util';

const readfile = util.promisify(fs.readFile);

async function getAllGenerations(): Promise<GenerationResponse[]> {
  try {
    const rawJson = await readfile('./src/data/generations.json');
    const parsed = JSON.parse(rawJson.toString());
    return parsed.generations;
  } catch (e) {
    console.log('could no read generation.json', e);
    return [];
  }
}

export default {
  getAllGenerations,
};
