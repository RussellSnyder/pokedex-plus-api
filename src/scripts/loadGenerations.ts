'use strict';
import axios from 'axios';
import fs from 'fs';
import {
  GenerationResponse,
  GroupNamedAPIResourceResponse,
} from 'pokedex-plus-isomorphic/lib/types';
import util from 'util';

const writeFile = util.promisify(fs.writeFile);

const httpClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 5000,
});

async function _getAllGenerationNamedApiResources(): Promise<
  GroupNamedAPIResourceResponse | undefined
> {
  try {
    const res = await httpClient.get(`generation`);
    return res;
  } catch (e) {
    console.error('couldnt get pokemon name,url list');
    console.error(e);
  }
}

const createGenerationJson = async () => {
  const res = await _getAllGenerationNamedApiResources();

  const urls = res?.data.results.map(d => d.url);

  if (!urls) {
    return;
  }

  const fetchedGenerations: { [key: number]: GenerationResponse } = {};
  let fetchCount = 0;

  for (const url of urls) {
    try {
      const res = await axios.get(url);

      const generation = res.data;

      fetchedGenerations[generation.id] = generation;
    } catch (e) {
      console.log(e);
    } finally {
      fetchCount++;
      console.log('fetched', fetchCount, 'generations');
    }
  }

  console.log(`loaded ${Object.keys(fetchedGenerations).length} generations`);

  const generationData = JSON.stringify(
    {
      lastUpdated: Date.now(),
      generations: fetchedGenerations,
    },
    null,
    2,
  );

  try {
    await writeFile('./src/data/generations.json', generationData);
    const generationCount = Object.keys(fetchedGenerations).length;
    console.log(`${generationCount} generations saved to file`);
  } catch (e) {
    console.log(e);
  }
};

createGenerationJson().then(() => process.exit());
