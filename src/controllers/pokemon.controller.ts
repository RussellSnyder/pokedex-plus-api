import { Request, Response } from 'express';
import { clone } from 'lodash';
import { SerializedQueryParam } from 'pokedex-plus-isomorphic/lib/models/query-param';
import {
  ActivePokemonLabelTypeLookup,
  filterQueryParamCollection,
  intervalQueryParamCollection,
  sortQueryParamCollection,
} from 'pokedex-plus-isomorphic/lib/query-param-collections/pokemon.query-param-collection';

import { IPokemon } from 'pokedex-plus-isomorphic/lib/types';

import pokemonService from '../services/pokemon.service';

async function getAllPokemon(req: Request, res: Response): Promise<void> {
  // express tries to parse the query which is normally good,
  // but we have our own logic
  // TODO tell express not to parse
  const query = Object.entries(req.query)
    .map(([key, value]) => ({ [key]: value!.toString() }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {}) as SerializedQueryParam;

  // we want a unique copy for each call
  const queryParamCollections = [
    clone(filterQueryParamCollection),
    clone(sortQueryParamCollection),
    clone(intervalQueryParamCollection),
  ];

  // each collection will grab the data that it can processes
  queryParamCollections.forEach(q => q.updateQueryParamsFromSerialized(query));

  const options: ActivePokemonLabelTypeLookup = queryParamCollections.reduce(
    (prev, curr) => ({
      ...prev,
      ...curr.getActiveQueryParams(),
    }),
    {},
  );

  try {
    const pokemon = await pokemonService.getPokemon(options);
    res.send(JSON.stringify(pokemon, null, 2));
  } catch (e) {
    res.sendStatus(500);
  }
}

async function getPokemon(req: Request, res: Response): Promise<void> {
  // could be the id or the name of the pokemon
  const idOrName = req.params.id as number | string;

  if (!idOrName) {
    res.sendStatus(404);
    return;
  }

  let pokemon: IPokemon;

  try {
    if (isNaN(idOrName as number)) {
      const name = idOrName as string;
      pokemon = await pokemonService.getPokemonByName(name);
    } else {
      const id = idOrName as number;
      pokemon = await pokemonService.getPokemonById(id);
    }

    if (!pokemon) {
      res.sendStatus(404);
      return;
    }

    res.send(JSON.stringify(pokemon));
  } catch (e) {
    res.sendStatus(500);
  }
}

export default {
  getAllPokemon,
  getPokemon,
};
