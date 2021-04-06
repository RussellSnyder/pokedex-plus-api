"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanSprite = void 0;
function cleanSprite(pokemonSprite) {
    var cleanSprite = {};
    if (!pokemonSprite) {
        return null;
    }
    Object.entries(pokemonSprite).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (value) {
            cleanSprite[key] = value;
        }
    });
    return cleanSprite;
}
exports.cleanSprite = cleanSprite;
