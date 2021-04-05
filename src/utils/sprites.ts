import { PokemonSprite } from '../models/shared';

export function cleanSprite(
  pokemonSprite: PokemonSprite,
): PokemonSprite | null {
  const cleanSprite: { [key: string]: string } = {};

  if (!pokemonSprite) {
    return null;
  }

  Object.entries(pokemonSprite).forEach(([key, value]) => {
    if (value) {
      cleanSprite[key] = value;
    }
  });

  return cleanSprite;
}
