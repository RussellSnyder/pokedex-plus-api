"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pokemon_1 = require("../models/pokemon");
var pokemon_repo_1 = __importDefault(require("../repos/pokemon.repo"));
var generation_service_1 = __importDefault(require("./generation.service"));
var stats_service_1 = __importDefault(require("./stats.service"));
var util_1 = require("pokedex-plus-isomorphic/lib/util");
var pokemon_query_param_collection_1 = require("pokedex-plus-isomorphic/lib/query-param-collections/pokemon.query-param-collection");
var pokemonCache = {
    cache: {},
    isCacheLoaded: false,
};
function createPokemonCache() {
    return __awaiter(this, void 0, void 0, function () {
        var pokemonCollection, _a, _b, _c, id, rawValues, generation, pokemon, e_1_1;
        var e_1, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    pokemonCache.isCacheLoaded = false;
                    console.log('--- creating pokemon cache ---');
                    return [4 /*yield*/, pokemon_repo_1.default.getAllPokemon()];
                case 1:
                    pokemonCollection = _e.sent();
                    pokemonCache.cache = {};
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 7, 8, 9]);
                    _a = __values(Object.entries(pokemonCollection)), _b = _a.next();
                    _e.label = 3;
                case 3:
                    if (!!_b.done) return [3 /*break*/, 6];
                    _c = __read(_b.value, 2), id = _c[0], rawValues = _c[1];
                    return [4 /*yield*/, generation_service_1.default.getGenerationOfPokemon(rawValues.species.name)];
                case 4:
                    generation = _e.sent();
                    pokemon = new pokemon_1.PokemonModel(__assign(__assign({}, rawValues), { generation: generation }));
                    if (!pokemonCache.cache[parseInt(id)]) {
                        pokemonCache.cache[parseInt(id)] = pokemon;
                    }
                    _e.label = 5;
                case 5:
                    _b = _a.next();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 9:
                    pokemonCache.isCacheLoaded = true;
                    return [2 /*return*/];
            }
        });
    });
}
function addNormalizedData() {
    if (pokemonCache.isCacheLoaded === false) {
        console.error('no cache to add normalized data to');
    }
    console.log('--- adding normalization data to pokemon ---');
    var allPokemon = Object.values(pokemonCache.cache).map(function (p) { return p; });
    pokemonCache.cache = {};
    allPokemon.forEach(function (pokemon) {
        var normalizedBaseExperience = stats_service_1.default.calculateNormalizedBaseExperience(pokemon);
        var normalizedPhysicalCharacteristics = stats_service_1.default.calculateNormalizedPhysicalCharacteristics(pokemon);
        var normalizedStats = stats_service_1.default.calculateNormalizedStats(pokemon);
        pokemonCache.cache[pokemon.id] = __assign(__assign({}, pokemon), { normalizedPhysicalCharacteristics: normalizedPhysicalCharacteristics,
            normalizedStats: normalizedStats, normalizedBaseExperience: normalizedBaseExperience.baseExperience });
    });
}
function getPokemon(options) {
    return __awaiter(this, void 0, void 0, function () {
        var pokemonCache, pokemon_2, filteredCache, sortedCache, prePaginationLength, limit, offset, pagedCache, pokemon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _getPokemonCache()];
                case 1:
                    pokemonCache = _a.sent();
                    if (!options) {
                        pokemon_2 = Object.values(pokemonCache);
                        return [2 /*return*/, {
                                results: pokemon_2,
                                totalResults: pokemon_2.length,
                            }];
                    }
                    filteredCache = _filterPokemonList(pokemonCache, options);
                    sortedCache = _sortPokemonList(filteredCache, options);
                    prePaginationLength = Object.keys(sortedCache).length;
                    limit = options.limit, offset = options.offset;
                    if (limit != undefined && limit > prePaginationLength) {
                        return [2 /*return*/, {
                                results: Object.values(sortedCache),
                                totalResults: prePaginationLength,
                            }];
                    }
                    pagedCache = _pagePokemonList(sortedCache, limit, offset);
                    pokemon = Object.values(pagedCache);
                    return [2 /*return*/, {
                            results: Object.values(pokemon),
                            totalResults: Object.values(sortedCache).length,
                            offset: offset,
                            limit: limit,
                        }];
            }
        });
    });
}
function getPokemonById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var pokemonCache;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _getPokemonCache()];
                case 1:
                    pokemonCache = _a.sent();
                    return [2 /*return*/, pokemonCache[id]];
            }
        });
    });
}
function getPokemonByName(name) {
    return __awaiter(this, void 0, void 0, function () {
        var pokemonCache;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _getPokemonCache()];
                case 1:
                    pokemonCache = _a.sent();
                    return [2 /*return*/, Object.values(pokemonCache).find(function (p) { return p.name === name; })];
            }
        });
    });
}
function _pagePokemonList(pokemonCache, limit, offset) {
    if (!limit && !offset) {
        return pokemonCache;
    }
    var processedPokemon = __spread(Object.values(pokemonCache));
    if (limit && offset) {
        processedPokemon = processedPokemon.slice(offset, offset + limit);
    }
    else if (offset && !limit) {
        processedPokemon = processedPokemon.slice(offset, processedPokemon.length);
    }
    else if (limit && !offset) {
        processedPokemon = processedPokemon.slice(0, limit);
    }
    return Object.entries(processedPokemon).reduce(function (r, _a) {
        var _b;
        var _c = __read(_a, 2), id = _c[0], pokemon = _c[1];
        return (__assign(__assign({}, r), (_b = {}, _b[id] = pokemon, _b)));
    }, {});
}
// TODO interpret type from collection
function _filterPokemonList(pokemonCache, options) {
    var processedPokemon = __spread(Object.values(pokemonCache));
    // String Lists
    var type = options.type;
    if (type) {
        processedPokemon = processedPokemon.filter(function (pokemon) {
            return type.every(function (t) { return pokemon.types.includes(t); });
        });
    }
    var ability = options.ability;
    if (ability) {
        processedPokemon = processedPokemon.filter(function (pokemon) {
            return ability.every(function (t) { return pokemon.actions.abilities.includes(t); });
        });
    }
    var move = options.move;
    if (move) {
        processedPokemon = processedPokemon.filter(function (pokemon) {
            return move.every(function (t) { return pokemon.actions.moves.includes(t); });
        });
    }
    // Booleans
    var isDefault = options.isDefault;
    if (isDefault) {
        processedPokemon = processedPokemon.filter(function (pokemon) { return pokemon.isDefault === isDefault; });
    }
    // Number Lists
    var generation = options.generation;
    if (generation != undefined) {
        processedPokemon = processedPokemon.filter(function (pokemon) {
            return generation.includes(pokemon.generation);
        });
    }
    // Stat Numbers
    var hpMin = options.hpMin;
    if (hpMin) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.hp && stats.hp >= hpMin;
        });
    }
    var hpMax = options.hpMax;
    if (hpMax) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.hp && stats.hp <= hpMax;
        });
    }
    var speedMin = options.speedMin;
    if (speedMin) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.speed && stats.speed >= speedMin;
        });
    }
    var speedMax = options.speedMax;
    if (speedMax) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.speed && stats.speed <= speedMax;
        });
    }
    var attackMin = options.attackMin;
    if (attackMin) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.attack && stats.attack >= attackMin;
        });
    }
    var attackMax = options.attackMax;
    if (attackMax) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.attack && stats.attack <= attackMax;
        });
    }
    var defenseMin = options.defenseMin;
    if (defenseMin) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.defense && stats.defense >= defenseMin;
        });
    }
    var defenseMax = options.defenseMax;
    if (defenseMax) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.defense && stats.defense <= defenseMax;
        });
    }
    var specialAttackMin = options.specialAttackMin;
    if (specialAttackMin) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.specialAttack && stats.specialAttack >= specialAttackMin;
        });
    }
    var specialAttackMax = options.specialAttackMax;
    if (specialAttackMax) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.specialAttack && stats.specialAttack <= specialAttackMax;
        });
    }
    var specialDefenseMin = options.specialDefenseMin;
    if (specialDefenseMin) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.specialDefense && stats.specialDefense >= specialDefenseMin;
        });
    }
    var specialDefenseMax = options.specialDefenseMax;
    if (specialDefenseMax) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.specialDefense && stats.specialDefense <= specialDefenseMax;
        });
    }
    // Numbers
    var heightMin = options.heightMin;
    if (heightMin) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var height = _a.height;
            return height >= heightMin;
        });
    }
    var heightMax = options.heightMax;
    if (heightMax) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var height = _a.height;
            return height <= heightMax;
        });
    }
    var weightMin = options.weightMin;
    if (weightMin) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var weight = _a.weight;
            return weight >= weightMin;
        });
    }
    var weightMax = options.weightMax;
    if (weightMax) {
        processedPokemon = processedPokemon.filter(function (_a) {
            var weight = _a.weight;
            return weight <= weightMax;
        });
    }
    return Object.entries(processedPokemon).reduce(function (r, _a) {
        var _b;
        var _c = __read(_a, 2), id = _c[0], pokemon = _c[1];
        return (__assign(__assign({}, r), (_b = {}, _b[id] = pokemon, _b)));
    }, {});
}
function _sortPokemonList(pokemonCache, sort) {
    if (!sort) {
        return pokemonCache;
    }
    var processedPokemon = __spread(Object.values(pokemonCache));
    // only one sort
    var _a = __read(util_1.getKeyAndValueOfObject(sort), 2), key = _a[0], value = _a[1];
    switch (key) {
        case pokemon_query_param_collection_1.SortQueryParam.Name:
            if (value === 'asc') {
                processedPokemon.sort(function (a, b) { return a.name - b.name; });
            }
            else if (value === 'desc') {
                processedPokemon.sort(function (a, b) { return b.name - a.name; });
            }
            break;
        case pokemon_query_param_collection_1.SortQueryParam.Height:
            if (value === 'asc') {
                processedPokemon.sort(function (a, b) { return a.height - b.height; });
            }
            else if (value === 'desc') {
                processedPokemon.sort(function (a, b) { return b.height - a.height; });
            }
            break;
        case pokemon_query_param_collection_1.SortQueryParam.Weight:
            if (value === 'asc') {
                processedPokemon.sort(function (a, b) { return a.weight - b.weight; });
            }
            else if (value === 'desc') {
                processedPokemon.sort(function (a, b) { return b.weight - a.weight; });
            }
            break;
    }
    return Object.entries(processedPokemon).reduce(function (r, _a) {
        var _b;
        var _c = __read(_a, 2), id = _c[0], pokemon = _c[1];
        return (__assign(__assign({}, r), (_b = {}, _b[id] = pokemon, _b)));
    }, {});
}
function _getPokemonCache() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (pokemonCache.isCacheLoaded) {
                        return [2 /*return*/, pokemonCache.cache];
                    }
                    return [4 /*yield*/, createPokemonCache()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, pokemonCache.cache];
            }
        });
    });
}
exports.default = {
    createPokemonCache: createPokemonCache,
    getPokemonByName: getPokemonByName,
    getPokemon: getPokemon,
    getPokemonById: getPokemonById,
    addNormalizedData: addNormalizedData,
};
