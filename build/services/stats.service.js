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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_flattendeep_1 = __importDefault(require("lodash.flattendeep"));
var stats_lite_1 = __importDefault(require("stats-lite"));
var pokemon_service_1 = __importDefault(require("../services/pokemon.service"));
var statCache = {
    cache: {},
    isCacheLoaded: false,
};
function createStatCache() {
    return __awaiter(this, void 0, void 0, function () {
        var pokemonList, pokemon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statCache.isCacheLoaded = false;
                    return [4 /*yield*/, pokemon_service_1.default.getAllPokemon()];
                case 1:
                    pokemonList = _a.sent();
                    pokemon = pokemonList.results;
                    statCache.cache = {
                        types: _calculateNameAndCount(lodash_flattendeep_1.default(pokemon.map(function (p) { return p.types; }))),
                        abilities: _calculateNameAndCount(lodash_flattendeep_1.default(pokemon.map(function (p) { return p.actions.abilities; }))),
                        moves: _calculateNameAndCount(lodash_flattendeep_1.default(pokemon.map(function (p) { return p.actions.moves; }))),
                        pokemonInGeneration: _calculateNameAndCount(pokemon.map(function (p) { return p.generation; })),
                        pokemonPresentInGame: _calculateNameAndCount(lodash_flattendeep_1.default(pokemon.map(function (p) { return p.gamesWherePresent; }))),
                        weight: _calculateAllPokemonStat(pokemon.map(function (p) { return p.physicalCharacteristics.weight; })),
                        height: _calculateAllPokemonStat(pokemon.map(function (p) { return p.physicalCharacteristics.height; })),
                        hp: _calculateAllPokemonStat(pokemon.map(function (p) { return p.stats.hp; }).filter(Boolean)),
                        attack: _calculateAllPokemonStat(pokemon.map(function (p) { return p.stats.attack; }).filter(Boolean)),
                        defense: _calculateAllPokemonStat(pokemon.map(function (p) { return p.stats.defense; }).filter(Boolean)),
                        specialAttack: _calculateAllPokemonStat(pokemon.map(function (p) { return p.stats.specialAttack; }).filter(Boolean)),
                        specialDefense: _calculateAllPokemonStat(pokemon.map(function (p) { return p.stats.specialDefense; }).filter(Boolean)),
                        speed: _calculateAllPokemonStat(pokemon.map(function (p) { return p.stats.speed; }).filter(Boolean)),
                        baseExperience: _calculateAllPokemonStat(pokemon.map(function (p) { return p.baseExperience; })),
                        defaultPokemonCount: pokemon.map(function (p) { return p.isDefault ? 1 : 0; }).reduce(function (acc, curr) { return acc + curr; }),
                    };
                    statCache.isCacheLoaded = true;
                    return [2 /*return*/];
            }
        });
    });
}
function getAllStats() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (statCache.isCacheLoaded) {
                        return [2 /*return*/, statCache.cache];
                    }
                    return [4 /*yield*/, createStatCache()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, statCache.cache];
            }
        });
    });
}
function calculateNormalizedPhysicalCharacteristics(pokemon) {
    return {
        height: _normalizeValue(pokemon.physicalCharacteristics.height, statCache.cache.height.min, statCache.cache.height.max),
        weight: _normalizeValue(pokemon.physicalCharacteristics.weight, statCache.cache.weight.min, statCache.cache.weight.max),
    };
}
function calculateNormalizedBaseExperience(pokemon) {
    var baseExperience = _normalizeValue(pokemon.baseExperience, statCache.cache.baseExperience.min, statCache.cache.baseExperience.max);
    return {
        baseExperience: baseExperience
    };
}
function calculatenormalizedStats(pokemon) {
    return {
        hp: pokemon.stats.hp ? _normalizeValue(pokemon.stats.hp, statCache.cache.hp.min, statCache.cache.hp.max) : undefined,
        attack: pokemon.stats.attack ? _normalizeValue(pokemon.stats.attack, statCache.cache.attack.min, statCache.cache.attack.max) : undefined,
        defense: pokemon.stats.defense ? _normalizeValue(pokemon.stats.defense, statCache.cache.defense.min, statCache.cache.defense.max) : undefined,
        specialAttack: pokemon.stats.specialAttack ? _normalizeValue(pokemon.stats.specialAttack, statCache.cache.specialAttack.min, statCache.cache.specialAttack.max) : undefined,
        specialDefense: pokemon.stats.specialDefense ? _normalizeValue(pokemon.stats.specialDefense, statCache.cache.specialDefense.min, statCache.cache.specialDefense.max) : undefined,
        speed: pokemon.stats.speed ? _normalizeValue(pokemon.stats.speed, statCache.cache.speed.min, statCache.cache.speed.max) : undefined,
    };
}
function _normalizeValue(value, min, max) {
    return (value - min) / (max - min);
}
function _calculateAllPokemonStat(values) {
    return __assign({ nameAndCounts: _calculateNameAndCount(values) }, _calculateMathmaticalStats(values));
}
function _calculateMathmaticalStats(values) {
    var sorted = values.sort(function (a, b) { return a - b; });
    return {
        mean: stats_lite_1.default.mean(values),
        median: stats_lite_1.default.median(values),
        mode: stats_lite_1.default.mode(values),
        variance: stats_lite_1.default.variance(values),
        stdev: stats_lite_1.default.stdev(values),
        sampleStdev: stats_lite_1.default.sampleStdev(values),
        max: sorted[sorted.length - 1],
        min: sorted[0],
    };
}
function _calculateNameAndCount(values) {
    var nameAndCount = {};
    values.forEach(function (value) {
        if (!nameAndCount[value]) {
            nameAndCount[value] = 0;
        }
        nameAndCount[value]++;
    });
    // order by count
    return Object.entries(nameAndCount)
        .sort(function (_a, _b) {
        var a = _a[1];
        var b = _b[1];
        return a - b;
    })
        .reduce(function (r, _a) {
        var _b;
        var k = _a[0], v = _a[1];
        return (__assign(__assign({}, r), (_b = {}, _b[k] = v, _b)));
    }, {});
}
exports.default = {
    createStatCache: createStatCache,
    getAllStats: getAllStats,
    calculateNormalizedPhysicalCharacteristics: calculateNormalizedPhysicalCharacteristics,
    calculatenormalizedStats: calculatenormalizedStats,
    calculateNormalizedBaseExperience: calculateNormalizedBaseExperience,
};
