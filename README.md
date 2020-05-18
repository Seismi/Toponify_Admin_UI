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

Tags:

- `@core` - All core tests are tagged with this tag.

### Unit testing

To run tests individually run:
`.\node_modules\.bin\cypress-tags open -e BRANCH=<user> TAGS=<tags>`

Where <user> is a name to identify yourself (to avoid conflict between test data) and <tags> is one of the tags valid tags. Note that only features associated with the tag will be visible in the cypress interface.

### Full test

To run a full test, run:
`.\node_modules\.bin\cypress-tags run -e BRANCH=<user> TAGS=<tags>`
Where <user> is a name to identify yourself (to avoid conflict between test data) and <tags> is one of the tags valid tags. Note that by using this command, cypress will run all the tests flagged with the selected tag. Results will be summarised in the terminal. Videos will be saved in ./cypress/videos. Screenshots of any error will be saved in ./cypress/screenshots

### Full test reporting to cypress.io dashboard

To run a full test and save results to the cypress.io dashboard, run:
`./node_modules/.bin/cypress-tags run --env BRANCH=jerome.marcq TAGS=@core --record --key e83e55a0-e67b-4fbd-abe4-f33c784c946c`

#TODO - update the key

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
