import { cleanSprite } from '../utils/sprites';
import camelCase from 'lodash.camelcase';
import {
  IPokemon,
  NamedAPIResource,
  PokemonAbility,
  PokemonActions,
  PokemonConstructorArguments,
  PokemonPhysicalCharacteristics,
  PokemonResponseType,
  PokemonSprite,
  PokemonSpriteSet,
  PokemonStats,
  VersionPokemonSprite,
} from 'pokedex-plus-isomorphic/lib/types';

export class PokemonModel implements IPokemon {
  id: number;
  generation: number;
  name: string;
  types: string[];

  forms: string[];

  baseExperience: number;
  normalizedBaseExperience!: number;

  gamesWherePresent: string[];

  isDefault: boolean;
  actions: PokemonActions;

  physicalCharacteristics: PokemonPhysicalCharacteristics;
  normalizedPhysicalCharacteristics!: PokemonPhysicalCharacteristics;

  sprites: PokemonSpriteSet;
  stats: PokemonStats = {};
  normalizedStats!: PokemonStats;

  constructor(data: PokemonConstructorArguments) {
    this.id = data.id;
    this.name = data.name;

    this.physicalCharacteristics = {
      height: data.height,
      weight: data.weight,
    };

    this.types = data.types.map((t: PokemonResponseType) => t.type.name);
    this.forms = data.forms.map((form: NamedAPIResource) => form.name);
    this.baseExperience = data.base_experience;
    this.gamesWherePresent = data.game_indices.map(g => g.version.name);
    this.isDefault = data.is_default;

    this.actions = {
      abilities: data.abilities.map((t: PokemonAbility) => t.ability.name),
      moves: data.moves.map(m => m.name),
    };
    this.sprites = this._filterNullsFromSprites(data.sprites);

    const stats = data.stats.map(({ stat, base_stat }) => ({
      name: camelCase(stat.name) as keyof PokemonStats,
      value: base_stat,
    }));
    stats.forEach(({ name, value }) => {
      if (name && value) {
        this.stats[name] = value;
      }
    });

    this.generation = data.generation;
  }

  _filterNullsFromSprites(sprites: PokemonSpriteSet): PokemonSpriteSet {
    const {
      versions: versionsWithNulls,
      other: otherWithNulls,
      ...mainWithNulls
    } = sprites;

    const main = cleanSprite(mainWithNulls as PokemonSprite) as PokemonSprite;

    const other: { [key: string]: PokemonSprite } = {};
    Object.entries(otherWithNulls).forEach(([key, value]) => {
      other[key] = cleanSprite(value) as PokemonSprite;
    });

    const versions: VersionPokemonSprite = {
      'generation-i': {},
      'generation-ii': {},
      'generation-iii': {},
      'generation-iv': {},
      'generation-v': {},
      'generation-vi': {},
      'generation-vii': {},
      'generation-viii': {},
    };
    Object.entries(versionsWithNulls).forEach(([generation, value]) => {
      const versionSprites = value as { [key: string]: PokemonSprite };
      const generationKey = generation as keyof VersionPokemonSprite;

      Object.entries(versionSprites).forEach(([version, sprite]) => {
        const cleanedSprite = cleanSprite(sprite) as PokemonSprite;
        if (cleanedSprite) {
          versions[generationKey][version] = cleanedSprite;
        }
      });
    });

    return {
      main,
      other,
      versions,
    };
  }
}
