import {
  FilterParam,
  IPokemon,
  PokemonListOptions,
  PokemonListResponse,
  SortParam,
} from '../models/isomphic';
import pokemonService from '../services/pokemon.service';

interface UnTypedQuery {
  filter?: string;
  sort?: string;
  offset?: string;
  limit?: string;
}

async function getPokemonList(
  queryParams: UnTypedQuery,
): Promise<PokemonListResponse> {
  const options = queryParams ? _parseQueryParams(queryParams) : undefined;

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

function _parseQueryParams({
  filter,
  sort,
  offset,
  limit,
}: UnTypedQuery): PokemonListOptions {
  const options: PokemonListOptions = {};

  if (filter) {
    options.filter = {} as FilterParam;

    const splitOptions = filter.toString().split(' ');

    splitOptions.forEach((o: string) => {
      const [key, value] = o.split(':');

      if (!options.filter) {
        return;
      }

      switch (key) {
        case 'type':
          options.filter.type = value;
          break;
        case 'generations':
          options.filter.generations = _parseGenerationString(value);
          break;
        case 'height':
          options.filter.height = _createRange(value);
          break;
        case 'weight':
          options.filter.weight = _createRange(value);
          break;
        case 'hp':
          options.filter.hp = _createRange(value);
          break;
        case 'attack':
          options.filter.attack = _createRange(value);
          break;
        case 'defense':
          options.filter.defense = _createRange(value);
          break;
        case 'specialAttack':
          options.filter.specialAttack = _createRange(value);
          break;
        case 'specialDefense':
          options.filter.specialDefense = _createRange(value);
          break;
        case 'speed':
          options.filter.speed = _createRange(value);
          break;
        case 'ability':
          options.filter.ability = value;
          break;
        case 'move':
          options.filter.move = value;
          break;
        case 'isDefault':
          options.filter.isDefault = _parseStringBool(value);
          break;
        case 'isdefault':
          options.filter.isDefault = _parseStringBool(value);
          break;
        case 'presentInGame':
          options.filter.presentInGame = value;
          break;
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

const _parseGenerationString = (value: string): number[] | undefined => {
  const explode = value.match(/\d+|,/g)?.map(Number);

  if (explode) {
    return explode.filter(Number);
  }

  return;
};

const _parseStringBool = (value: string): boolean => {
  let bool;
  const maybeNumber = parseInt(value);
  if (isNaN(maybeNumber)) {
    bool = value === 'true' ? true : false;
  } else {
    bool = maybeNumber === 0 ? false : true;
  }

  return bool;
};
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
