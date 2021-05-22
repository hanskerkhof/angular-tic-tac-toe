# AngularTicTacToe

[https://saperium.com/articles/tic-tac-toe-with-angular-and-socket-io](https://saperium.com/articles/tic-tac-toe-with-angular-and-socket-io)


Create the express app

    mkdir backend
    cd backend
    npx express-generator
    npm install

Install socket io

    npm install socket.io @types/socket.io --save
    npm install shortid

Start the server

    npm start

> TODO: https://www.npmjs.com/package/shortid is deprecated, use NANO Id instead

Create Angular app

    (cd ../)
    npm i ngx-socket-io --save
    ng g c game-list
    ng g c game
    ng g s game

TODO

    Handle winning conditions in backend

> Inspiration: https://dev.to/bornasepic/pure-and-simple-tic-tac-toe-with-javascript-4pgn 
> https://www.thatsoftwaredude.com/content/6189/coding-tic-tac-toe-in-javascript

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
