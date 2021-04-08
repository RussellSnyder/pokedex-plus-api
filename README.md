# Pokedex-Plus-Api

### Features

- Scrape PokeApi and save to local json files using build scripts
- Pokemon stats using all pokemon from PokeaApi
- Load pokemon into memory on startup
- Pokemon are returned with normalized data allowing for easy comparison to other pokemon

### /pokemon endpoint

example query param
```
http://localhost:3000/api/v1/pokemon?i-limit=30&f-types-l=fire,water&f-generation-l=4,6,5&f-hp-r=,300&f-isdefault-b=true
```
### Scripts

#### `npm run start:dev`

Starts the application in development using `nodemon` and `ts-node` to do hot reloading.

#### `npm run start`

Starts the app in production by first building the project with `npm run build`, and then executing the compiled JavaScript at `build/index.js`.

#### `npm run build`

Builds the app at `build`, cleaning the folder first.

#### `npm run test`

Runs the `jest` tests once.

#### `npm run test:dev`

Run the `jest` tests in watch mode, waiting for file changes.

#### `npm run prettier-format`

Format your code.

#### `npm run prettier-watch`

Format your code in watch mode, waiting for file changes.

#### `npm run load:pokemon`

Scrapes PokeApi for 1000+ pokemon and saves to src/data/pokemon.json

#### `npm run load:generations`

Scrapes PokeApi for generaiton data in order to enrich pokemon modesl

# TODO

- [ ] Random pokemon endpoint
      Users can get 1-10 random pokemon evenly spaced over the pokemon universe
- [ ] Cache query calls
      If a user calls the pokemon endpoint with speicif query params, the response should be cached to be used the next time a user makes the same call.
- [ ] Create a swagger for endpoints
- [ ] write tests for services