'use strict';
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
var writeFile = util_1.default.promisify(fs_1.default.writeFile);
var httpClient = axios_1.default.create({
    baseURL: 'https://pokeapi.co/api/v2/',
    timeout: 5000,
});
function _getPokemonCount() {
    return __awaiter(this, void 0, void 0, function () {
        var res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, httpClient.get('pokemon')];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.data.count];
                case 2:
                    e_1 = _a.sent();
                    console.error('couldnt get count');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function _getAllPokemonNamedApiResources(count) {
    return __awaiter(this, void 0, void 0, function () {
        var res, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, httpClient.get("pokemon?limit=" + count)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res];
                case 2:
                    e_2 = _a.sent();
                    console.error('couldnt get pokemon name,url list');
                    console.error(e_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var createPokemonJson = function () { return __awaiter(void 0, void 0, void 0, function () {
    var count, res, urls, fetchedpokemon, fetchCount, urls_1, urls_1_1, url, res_1, pokemon, e_3, e_4_1, trimmedData, pokemonData, pokemonCount, e_5;
    var e_4, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, _getPokemonCount()];
            case 1:
                count = _b.sent();
                if (!count) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, _getAllPokemonNamedApiResources(count)];
            case 2:
                res = _b.sent();
                urls = res === null || res === void 0 ? void 0 : res.data.results.map(function (d) { return d.url; });
                if (!urls) {
                    return [2 /*return*/];
                }
                fetchedpokemon = {};
                fetchCount = 0;
                _b.label = 3;
            case 3:
                _b.trys.push([3, 11, 12, 13]);
                urls_1 = __values(urls), urls_1_1 = urls_1.next();
                _b.label = 4;
            case 4:
                if (!!urls_1_1.done) return [3 /*break*/, 10];
                url = urls_1_1.value;
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, 8, 9]);
                return [4 /*yield*/, axios_1.default.get(url)];
            case 6:
                res_1 = _b.sent();
                pokemon = res_1.data;
                fetchedpokemon[pokemon.id] = pokemon;
                return [3 /*break*/, 9];
            case 7:
                e_3 = _b.sent();
                console.log("failed to fetch " + url);
                return [3 /*break*/, 9];
            case 8:
                fetchCount++;
                if (fetchCount % 10 === 0) {
                    console.log('fetched', fetchCount, 'pokemon');
                }
                return [7 /*endfinally*/];
            case 9:
                urls_1_1 = urls_1.next();
                return [3 /*break*/, 4];
            case 10: return [3 /*break*/, 13];
            case 11:
                e_4_1 = _b.sent();
                e_4 = { error: e_4_1 };
                return [3 /*break*/, 13];
            case 12:
                try {
                    if (urls_1_1 && !urls_1_1.done && (_a = urls_1.return)) _a.call(urls_1);
                }
                finally { if (e_4) throw e_4.error; }
                return [7 /*endfinally*/];
            case 13:
                console.log("loaded " + Object.keys(fetchedpokemon).length + " pokemon");
                trimmedData = Object.entries(fetchedpokemon).map(function (_a) {
                    var _b = __read(_a, 2), _ = _b[0], p = _b[1];
                    var moves = p.moves.map(function (move) { return move.move; });
                    return __assign(__assign({}, p), { moves: moves });
                });
                pokemonData = JSON.stringify({
                    lastUpdated: Date.now(),
                    pokemon: trimmedData,
                }, null, 2);
                _b.label = 14;
            case 14:
                _b.trys.push([14, 16, , 17]);
                return [4 /*yield*/, writeFile('./src/data/pokemon.json', pokemonData)];
            case 15:
                _b.sent();
                pokemonCount = Object.keys(fetchedpokemon).length;
                console.log(pokemonCount + " pokemon saved to file");
                return [3 /*break*/, 17];
            case 16:
                e_5 = _b.sent();
                console.log(e_5);
                return [3 /*break*/, 17];
            case 17: return [2 /*return*/];
        }
    });
}); };
createPokemonJson().then(function () { return process.exit(); });
