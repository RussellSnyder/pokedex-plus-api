"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanSprite = void 0;
function cleanSprite(pokemonSprite) {
    var cleanSprite = {};
    if (!pokemonSprite) {
        return null;
    }
    Object.entries(pokemonSprite).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        if (value) {
            cleanSprite[key] = value;
        }
    });
    return cleanSprite;
}
exports.cleanSprite = cleanSprite;
