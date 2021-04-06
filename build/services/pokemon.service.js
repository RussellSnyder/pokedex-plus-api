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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pokemon_1 = require("../models/pokemon");
var shared_1 = require("../models/shared");
var pokemon_repo_1 = __importDefault(require("../repos/pokemon.repo"));
var generation_service_1 = __importDefault(require("./generation.service"));
var stats_service_1 = __importDefault(require("./stats.service"));
var pokemonCache = {
    cache: {},
    isCacheLoaded: false,
};
function createPokemonCache() {
    return __awaiter(this, void 0, void 0, function () {
        var pokemonCollection, _i, _a, _b, id, rawValues, generation, pokemon;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    pokemonCache.isCacheLoaded = false;
                    console.log('--- creating pokemon cache ---');
                    return [4 /*yield*/, pokemon_repo_1.default.getAllPokemon()];
                case 1:
                    pokemonCollection = _c.sent();
                    pokemonCache.cache = {};
                    _i = 0, _a = Object.entries(pokemonCollection);
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    _b = _a[_i], id = _b[0], rawValues = _b[1];
                    return [4 /*yield*/, generation_service_1.default.getGenerationOfPokemon(rawValues.species.name)];
                case 3:
                    generation = _c.sent();
                    pokemon = new pokemon_1.PokemonModel(__assign(__assign({}, rawValues), { generation: generation }));
                    if (!pokemonCache.cache[parseInt(id)]) {
                        pokemonCache.cache[parseInt(id)] = pokemon;
                    }
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
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
        var normalizedStats = stats_service_1.default.calculatenormalizedStats(pokemon);
        pokemonCache.cache[pokemon.id] = __assign(__assign({}, pokemon), { normalizedPhysicalCharacteristics: normalizedPhysicalCharacteristics,
            normalizedStats: normalizedStats, normalizedBaseExperience: normalizedBaseExperience.baseExperience });
    });
}
function getAllPokemon(options) {
    return __awaiter(this, void 0, void 0, function () {
        var pokemonCache, pokemon_2, filter, sort, offset, limit, filteredCache, sortedCache, prePaginationLength, pagedCache, pokemon;
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
                    filter = options.filter, sort = options.sort, offset = options.offset, limit = options.limit;
                    filteredCache = _filterPokemonList(pokemonCache, filter);
                    sortedCache = _sortPokemonList(filteredCache, sort);
                    prePaginationLength = Object.keys(sortedCache).length;
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
    var processedPokemon = __spreadArrays(Object.values(pokemonCache));
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
        var id = _a[0], pokemon = _a[1];
        return (__assign(__assign({}, r), (_b = {}, _b[id] = pokemon, _b)));
    }, {});
}
function _filterPokemonList(pokemonCache, filter) {
    if (!filter) {
        return pokemonCache;
    }
    var processedPokemon = __spreadArrays(Object.values(pokemonCache));
    var type = filter.type, generations = filter.generations, height = filter.height, weight = filter.weight, hp = filter.hp, attack = filter.attack, defense = filter.defense, specialAttack = filter.specialAttack, specialDefense = filter.specialDefense, speed = filter.speed, ability = filter.ability, move = filter.move, isDefault = filter.isDefault, presentInGame = filter.presentInGame;
    if (type != undefined) {
        processedPokemon = processedPokemon.filter(function (pokemon) {
            return pokemon.types.includes(type);
        });
    }
    if (generations != undefined) {
        processedPokemon = processedPokemon.filter(function (pokemon) { return generations.includes(pokemon.generation); });
    }
    if (hp != undefined) {
        var min_1 = hp[0], max_1 = hp[1];
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.hp && min_1 <= stats.hp && stats.hp <= max_1;
        });
    }
    if (attack != undefined) {
        var min_2 = attack[0], max_2 = attack[1];
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.attack && min_2 <= stats.attack && stats.attack <= max_2;
        });
    }
    if (defense != undefined) {
        var min_3 = defense[0], max_3 = defense[1];
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.defense && min_3 <= stats.defense && stats.defense <= max_3;
        });
    }
    if (specialAttack != undefined) {
        var min_4 = specialAttack[0], max_4 = specialAttack[1];
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.specialAttack && min_4 <= stats.specialAttack && stats.specialAttack <= max_4;
        });
    }
    if (specialDefense != undefined) {
        var min_5 = specialDefense[0], max_5 = specialDefense[1];
        processedPokemon = processedPokemon.filter(function (_a) {
            var stats = _a.stats;
            return stats.specialDefense && min_5 <= stats.specialDefense && stats.specialDefense <= max_5;
        });
    }
    if (height != undefined) {
        var min_6 = height[0], max_6 = height[1];
        processedPokemon = processedPokemon.filter(function (_a) {
            var height = _a.height;
            return min_6 <= height && height <= max_6;
        });
    }
    if (weight != undefined) {
        var min_7 = weight[0], max_7 = weight[1];
        processedPokemon = processedPokemon.filter(function (_a) {
            var weight = _a.weight;
            return min_7 <= weight && weight <= max_7;
        });
    }
    if (ability != undefined) {
        processedPokemon = processedPokemon.filter(function (pokemon) {
            return pokemon.actions.abilities.includes(ability);
        });
    }
    if (move != undefined) {
        processedPokemon = processedPokemon.filter(function (pokemon) {
            return pokemon.actions.moves.includes(move);
        });
    }
    if (isDefault != undefined) {
        processedPokemon = processedPokemon.filter(function (pokemon) { return pokemon.isDefault === isDefault; });
    }
    if (presentInGame != undefined) {
        processedPokemon = processedPokemon.filter(function (pokemon) {
            return pokemon.gamesWherePresent.includes(presentInGame);
        });
    }
    return Object.entries(processedPokemon).reduce(function (r, _a) {
        var _b;
        var id = _a[0], pokemon = _a[1];
        return (__assign(__assign({}, r), (_b = {}, _b[id] = pokemon, _b)));
    }, {});
}
function _sortPokemonList(pokemonCache, sort) {
    if (!sort) {
        return pokemonCache;
    }
    var processedPokemon = __spreadArrays(Object.values(pokemonCache));
    switch (sort) {
        case shared_1.SortParam.NameAsc:
            processedPokemon.sort(function (a, b) { return a.name - b.name; });
            break;
        case shared_1.SortParam.NameDesc:
            processedPokemon.sort(function (a, b) { return b.name - a.name; });
            break;
        case shared_1.SortParam.HeightDesc:
            processedPokemon.sort(function (a, b) { return a.height - b.height; });
            break;
        case 'height-desc':
            processedPokemon.sort(function (a, b) { return b.height - a.height; });
            break;
        case 'weight-asc':
            processedPokemon.sort(function (a, b) { return a.weight - b.weight; });
            break;
        case 'weight-desc':
            processedPokemon.sort(function (a, b) { return b.weight - a.weight; });
            break;
    }
    return Object.entries(processedPokemon).reduce(function (r, _a) {
        var _b;
        var id = _a[0], pokemon = _a[1];
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
    getAllPokemon: getAllPokemon,
    getPokemonById: getPokemonById,
    addNormalizedData: addNormalizedData,
};
