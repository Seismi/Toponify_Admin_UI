# MDDiagramUI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4202/`. The app will automatically reload if you change any of the source files.

## JSON Server

`npm install -g json-server`

`json-server --watch db.json --routes routes.json`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Test

Tests use cypress.io. All tests are defined in cucumber files with the extension .feature.

### Tags

Tags are used to filter specific tests. We have currently configured the following tags:

- `@core` - This tag is used to identify core feature files that need to be run before merging branches. Core tests exclude some tests around settings and users.

### Branch Parameter

As tests can run using a common backend, we have introduced a test parameter called BRANCH. The value of this parameter is used as a prefix on all test data to avoid conflicts. For example, if the feature file calls for the creation of a work package named WP1, the tests will actually create a work package called `<BRANCH>`|WP1. Each developer should use a unique value in BRANCH, either his initials or a branch name if he is testing multiple branches in parallel.

It is set when calling the cypress executable and in the package.json scripts. By default, it is set to changeMe when using the npm scripts. Please update this to run tests without conflicts but avoid including updated BRANCH in any PR.

#### TODO - find a way to parameterise the package.json scripts.

### Unit testing

To run tests individually run:

`npm run cypress-open`

or

`.\node_modules\.bin\cypress open -e BRANCH=<user>`

Where <user or branch> is a name to identify yourself (to avoid conflict between test data).

### Run tests

To run a full test of core components, run:

`npm run cypress-test-core`

Note - to avoid conflicts, update the package.json script cypress-test-core BRANCH parameter. By default it is set to changeMe. Please update this to a personal identifier (initials for example).

Or to run on specific tags:

`.\node_modules\.bin\cypress-tags run -e BRANCH=<user> TAGS=<tags>`

Where <user> is a name to identify yourself (to avoid conflict between test data) and <tags> is one of the tags valid tags. Note that by using this command, cypress will run all the tests flagged with the selected tag. Results will be summarised in the terminal. Videos will be saved in ./cypress/videos. Screenshots of any error will be saved in ./cypress/screenshots

####TODO - update project code
####TODO - include a simpler npm script to run code.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
