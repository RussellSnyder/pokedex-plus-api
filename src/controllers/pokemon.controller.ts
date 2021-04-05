import { PokemonModel } from '../models/pokemon';
import { PokemonListOptions, PokemonListResponse, SortParam } from '../models/shared';
import pokemonService from '../services/pokemon.service';

interface UnTypedQuery {
  filter?: any;
  sort?: any;
  offset?: any;
  limit?: any;
}

async function getPokemonList(
  queryParams: UnTypedQuery,
): Promise<PokemonListResponse> {
  const options = queryParams ? _parseQueryParams(queryParams) : undefined;

  try {
    return await pokemonService.getAllPokemon(options);
  } catch (e) {
    console.log(e);
    throw Error('Oh No!');
  }
}

async function getPokemonById(id: number): Promise<PokemonModel> {
  return await pokemonService.getPokemonById(id);
}

async function getPokemonByName(name: string): Promise<PokemonModel> {
  return await pokemonService.getPokemonByName(name);
}

function _parseQueryParams({
  filter,
  sort,
  offset,
  limit,
}: UnTypedQuery): PokemonListOptions {
  const options: PokemonListOptions = {};

  if (filter) {
    options.filter = {};

    const splitOptions = filter.toString().split(' ');

    splitOptions.forEach((o: string) => {
      const [key, value] = o.split(':');

      if (key === 'type') {
        options.filter!.type = value;
      }
      if (key === 'gen') {
        options.filter!.gen = parseInt(value);
      }
      if (key === 'height') {
        options.filter!.height = _createRange(value);
      }
      if (key === 'weight') {
        options.filter!.weight = _createRange(value);
      }
      if (key === 'hp') {
        options.filter!.hp = _createRange(value);
      }
      if (key === 'attack') {
        options.filter!.attack = _createRange(value);
      }
      if (key === 'defense') {
        options.filter!.defense = _createRange(value);
      }
      if (key === 'specialAttack') {
        options.filter!.specialAttack = _createRange(value);
      }
      if (key === 'specialDefense') {
        options.filter!.specialDefense = _createRange(value);
      }
      if (key === 'speed') {
        options.filter!.speed = _createRange(value);
      }
      if (key === 'ability') {
        options.filter!.ability = value;
      }
      if (key === 'move') {
        options.filter!.move = value;
      }
      if (key === 'isDefault' || key === 'isdefault') {
        let bool;
        const maybeNumber = parseInt(value);
        if (isNaN(maybeNumber)) {
          bool = value === 'true' ? true : false;
        } else {
          bool = maybeNumber === 0 ? false : true;
        }

        options.filter!.isDefault = bool;
      }
      if (key === 'presentInGame') {
        options.filter!.presentInGame = value;
      }
    });
  }

  if (sort) {
    options.sort = sort as SortParam;
  }

  if (offset) {
    options.offset = parseInt(offset);
  }

  if (limit) {
    options.limit = parseInt(limit);
  }

  return options;
}

const _createRange = (lowHigh: string): [number, number] => {
  const result = lowHigh.match(/\d+|,/g)?.map(Number) as [
    unknown,
    unknown,
    unknown,
  ];

  let min = -Infinity;
  let max = Infinity;
  // a comma first means min is -Infinity;
  if (result?.length === 3) {
    min = result[0] as number;
    max = result[2] as number;
  } else if (isNaN(parseInt(result[0] as string, 10))) {
    // starts with comma, so we set the max
    max = result[1] as number;
  } else {
    min = result[0] as number;
  }

  return [min, max];
};

export default {
  getPokemonByName,
  getPokemonList,
  getPokemonById,
};
