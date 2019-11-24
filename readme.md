# Unide

Unide is

- Universal, as designs produced using it can be exported to many platforms
- Unidirectional, as it is in complete control of its model and is capable of exporting it to other models
- U and I, as it let's the user create pure Java Vaadin projects

To run Unide locally, install it via npm `npm install -g unide` and then
invoke `unide` at the root of your Vaadin project.

[Unide can be accessed online](https://mjvesa.github.io/unide/)

## Goal of the project

Currently: the user is able to produce UIs, add basic navigation and finally export the
result to a project using one of many frameworks, or no framework at all.

Future: the user should be able to create full applications in Unide without programming.

## Some build instructions I nicked from rollup-starter-app

`npm run build` builds the application to `public/bundle.js`, along with a sourcemap file for debugging.

`npm start` launches a server, using [serve](https://github.com/zeit/serve). Navigate to [localhost:3000](http://localhost:3000).

`npm run watch` will continually rebuild the application as your source files change.

`npm run dev` will run `npm start` and `npm run watch` in parallel.
