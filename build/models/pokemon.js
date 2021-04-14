"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonModel = void 0;
var sprites_1 = require("../utils/sprites");
var lodash_camelcase_1 = __importDefault(require("lodash.camelcase"));
var PokemonModel = /** @class */ (function () {
    function PokemonModel(data) {
        var _this = this;
        this.stats = {};
        this.id = data.id;
        this.name = data.name;
        this.physicalCharacteristics = {
            height: data.height,
            weight: data.weight,
        };
        this.types = data.types.map(function (t) { return t.type.name; });
        this.forms = data.forms.map(function (form) { return form.name; });
        this.baseExperience = data.base_experience;
        this.gamesWherePresent = data.game_indices.map(function (g) { return g.version.name; });
        this.isDefault = data.is_default;
        this.actions = {
            abilities: data.abilities.map(function (t) { return t.ability.name; }),
            moves: data.moves.map(function (m) { return m.name; }),
        };
        this.sprites = this._filterNullsFromSprites(data.sprites);
        var stats = data.stats.map(function (_a) {
            var stat = _a.stat, base_stat = _a.base_stat;
            return ({
                name: lodash_camelcase_1.default(stat.name),
                value: base_stat,
            });
        });
        stats.forEach(function (_a) {
            var name = _a.name, value = _a.value;
            if (name && value) {
                _this.stats[name] = value;
            }
        });
        this.generation = data.generation;
    }
    PokemonModel.prototype._filterNullsFromSprites = function (sprites) {
        var versionsWithNulls = sprites.versions, otherWithNulls = sprites.other, mainWithNulls = __rest(sprites, ["versions", "other"]);
        var main = sprites_1.cleanSprite(mainWithNulls);
        var other = {};
        Object.entries(otherWithNulls).forEach(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            other[key] = sprites_1.cleanSprite(value);
        });
        var versions = {
            'generation-i': {},
            'generation-ii': {},
            'generation-iii': {},
            'generation-iv': {},
            'generation-v': {},
            'generation-vi': {},
            'generation-vii': {},
            'generation-viii': {},
        };
        Object.entries(versionsWithNulls).forEach(function (_a) {
            var _b = __read(_a, 2), generation = _b[0], value = _b[1];
            var versionSprites = value;
            var generationKey = generation;
            Object.entries(versionSprites).forEach(function (_a) {
                var _b = __read(_a, 2), version = _b[0], sprite = _b[1];
                var cleanedSprite = sprites_1.cleanSprite(sprite);
                if (cleanedSprite) {
                    versions[generationKey][version] = cleanedSprite;
                }
            });
        });
        return {
            main: main,
            other: other,
            versions: versions,
        };
    };
    return PokemonModel;
}());
exports.PokemonModel = PokemonModel;
