# Unide

Unide is a visual designer for Vaadin. It exports to plain Java.

To run Unide locally, install it via npm `npm install -g mjvesa/unide-src` and then
invoke `unide` at the root of your Vaadin project.

To try it out without installing anything [Unide can be used online](https://mjvesa.github.io/unide/)

There is a VSCode extension, but it is currently not kept up to date.

## Goal of the project

Currently: the user is able to produce UIs, add basic navigation and finally export the
result to a project using one of many frameworks, or no framework at all.

Future: the user should be able to create full applications in Unide without programming.

## Some build instructions I nicked from rollup-starter-app

`npm run build` builds the application to `public/bundle.js`, along with a sourcemap file for debugging.

`npm start` launches a server, using [serve](https://github.com/zeit/serve). Navigate to [localhost:3000](http://localhost:3000).

`npm run watch` will continually rebuild the application as your source files change.

`npm run dev` will run `npm start` and `npm run watch` in parallel.
