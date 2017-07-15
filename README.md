# Work in progress!!

# Getting started
- Clone the repository
```
git clone https://github.com/mdunhem/repair-link-api.git
```
- Install dependencies
```
cd repair-link-api
npm install
```
- Start your mongoDB server (you'll probably want another terminal)
```
mongod
```
- Build and run the project
```
npm start-watch
```
Navigate to `http://localhost:3000`

## Getting TypeScript
TypeScript itself is simple to add to any project with `npm`.
```
npm install -D typescript
```
If you're using VS Code then you're good to go!
VS Code will detect and use the TypeScript version you have installed in your `node_modules` folder. 
For other editors, make sure you have the corresponding [TypeScript plugin](http://www.typescriptlang.org/index.html#download-links). 

## Project Structure
In a TypeScript project, it's best to have separate _source_  and _distributable_ files.
TypeScript (`.ts`) files live in your `src` folder and after compilation are output as JavaScript (`.js`) in the `dist` folder.

The full folder structure of this app is explained below:

> **Note!** Make sure you have already built the app using `npm run build`

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **.vscode**              | Contains VS Code specific settings                                                            |
| **dist**                 | Contains the distributable (or output) from your TypeScript build. This is the code you ship  |
| **node_modules**         | Contains all your npm dependencies                                                            |
| **src**                  | Contains your source code that will be compiled to the dist dir                               |
| **src/config**           | Passport authentication strategies and login middleware. Add other complex config code here   |
| **src/controllers**      | Controllers define functions that respond to various http requests                            |
| **src/models**           | Models define Mongoose schemas that will be used in storing and retrieving data from MongoDB  |
| **src/types**            | Holds .d.ts files not found on DefinitelyTyped. Covered more in this [section](#)             |
| **src**/server.ts        | Entry point to your express app                                                               |
| **test**                 | Contains your tests. Seperate from source because there is a different build process.         |
| .travis.yml              | Used to configure Travis CI build                                                             |
| package.json             | File that contains npm dependencies                                                           |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                               |
| tsconfig.tests.json      | Config settings for compiling tests written in TypeScript                                     |
| tslint.json              | Config settings for TSLint code style checking                                                |

## Building the project
It is rare for JavaScript projects not to have some kind of build pipeline these days, however Node projects typically have the least amount build configuration. 
Because of this I've tried to keep the build as simple as possible.
If you're concerned about compile time, the main watch task takes ~2s to refresh.

### Configuring TypeScript compilation
TypeScript uses the file `tsconfig.json` to adjust project compile options.
Let's dissect this project's `tsconfig.json`, starting with the `compilerOptions` which details how your project is compiled. 

```json
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6",
        "noImplicitAny": true,
        "moduleResolution": "node",
        "sourceMap": true,
        "outDir": "dist",
        "baseUrl": ".",
        "paths": {
            "*": [
                "node_modules/*",
                "src/types/*"
            ]
        }
    },
```

| `compilerOptions` | Description |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `"module": "commonjs"`             | The **output** module type (in your `.js` files). Node uses commonjs, so that is what we use           |
| `"target": "es6"`                  | The output language level. Node supports ES6, so we can target that here                               |
| `"noImplicitAny": true`            | Enables a stricter setting which throws errors when something has a default `any` value                |
| `"moduleResolution": "node"`       | TypeScript attempts to mimic Node's module resolution strategy. Read more [here](https://www.typescriptlang.org/docs/handbook/module-resolution.html#node)                                                                    |
| `"sourceMap": true`                | We want source maps to be output along side our JavaScript. See the [debugging](#debugging) section          |
| `"outDir": "dist"`                 | Location to output `.js` files after compilation                                                       |
| `"baseUrl": "."`                   | Part of configuring module resolution. See [path mapping section](#installing-dts-files-from-definitelytyped) |
| `paths: {...}`                     | Part of configuring module resolution. See [path mapping section](#installing-dts-files-from-definitelytyped) |



The rest of the file define the TypeScript project context.
The project context is basically a set of options that determine which files are compiled when the compiler is invoked with a specific `tsconfig.json`.
In this case, we use the following to define our project context: 
```json
    "include": [
        "src/**/*"
    ]
```
`include` takes an array of glob patterns of files to include in the compilation.
This project is fairly simple and all of our .ts files are under the `src` folder.
For more complex setups, you can include an `exclude` array of glob patterns that removes specific files from the set defined with `include`.
There is also a `files` option which takes an array of individual file names which overrides both `include` and `exclude`.


### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.
This is nice because most JavaScript tools have easy to use command line utilities allowing us to not need grunt or gulp to manage our builds.
If you open `package.json`, you will see a `scripts` section with all the different scripts you can call.
To call a script, simply run `npm run <script-name>` (or `yarn run <script-name` if using yarn) from the command line.
You'll notice that npm scripts can call each other which makes it easy to compose complex builds out of simple individual build scripts.
Below is a list of all the scripts this template has available:


| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build before starting the node server. Can be invoked with `npm start`                  |
| `start-watch`             | Runs full build before starting all watch tasks.                                                  |
| `build`                   | Full build. Runs ALL build tasks (`build-ts`, `tslint`)                                           |
| `serve`                   | Runs node on `dist/server.js` which is the apps entry point                                       |
| `watch`                   | Runs all watch tasks (TypeScript, Node). Use this if you're not touching static assets.           |
| `test`                    | Runs tests using Jest test runner                                                                 |
| `build-ts`                | Compiles all source `.ts` files to `.js` files in the `dist` folder                               |
| `watch-ts`                | Same as `build-ts` but continuously watches `.ts` files and re-compiles when needed               |
| `tslint`                  | Runs TSLint on project files                                                                      |

## Debugging
Debugging TypeScript is exactly like debugging JavaScript with one caveat, you need source maps.

### Source maps
Source maps allow you to drop break points in your TypeScript source code and have that break point be hit by the JavaScript that is being executed at runtime. 

> **Note!** - Source maps aren't specific to TypeScript.
Anytime JavaScript is transformed (transpiled, compiled, optimized, minified, etc) you need source maps so that the code that is executed at runtime can be _mapped_ back to the source that generated it.

The best part of source maps is when configured correctly, you don't even know they exist! So let's take a look at how we do that in this project.

#### Configuring source maps
First you need to make sure your `tsconfig.json` has source map generation enabled:
```json
"compilerOptions" {
    "sourceMaps": true
} 
```
With this option enabled, next to every `.js` file that the TypeScript compiler outputs there will be a `.map.js` file as well.
This `.map.js` file provides the information necessary to map back to the source `.ts` file while debugging.

> **Note!** - It is also possible to generate "inline" source maps using `"inlineSourceMap": true`.
This is more common when writing client side code because some bundlers need inline source maps to preserve the mapping through the bundle.
Because we are writing Node.js code, we don't have to worry about this. 

### Using the debugger in VS Code
Debugging is one of the places where VS Code really shines over other editors.
Node.js debugging in VS Code is easy to setup and even easier to use. 
This project comes pre-configured with everything you need to get started.

When you hit `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.
In this file, you can tell VS Code exactly what you want to do:

```json
{
    "type": "node",
    "request": "launch",
    "name": "Debug",
    "program": "${workspaceRoot}/dist/server.js",
    "smartStep": true,
    "outFiles": [
        "../dist/**/*.js"
    ],
    "protocol": "inspector"
}
```
This is mostly identical to the "Node.js: Launch Program" template with a couple minor changes:

| `launch.json` Options | Description |
| ----------------------------------------------- | --------------------------------------------------------------- |
| `"program": "${workspaceRoot}/dist/server.js",` | Modified to point to our entry point in `dist`                  |
| `"smartStep": true,`                            | Won't step into code that doesn't have a source map             |
| `"outFiles": [...]`                             | Specify where output files are dropped. Use with source maps    |
| `"protocol": inspector,`                        | Use the new Node debug protocal because we're on the latest node|

With this file in place, you can hit `F5` to serve the project with the debugger already attached.
Now just set your breakpoints and go!

> Warning! Make sure you don't have the project already running from another command line. 
VS Code will try to launch on the same port and error out.
Likewise be sure to stop the debugger before returning to your normal `npm start` process.

## Testing
For this project, I chose [Jest](https://facebook.github.io/jest/) as our test framework.
While Mocha is probably more common, Mocha seems to be looking for a new maintainer and setting up TypeScript testing in Jest is wicked simple.

### Install the components
To add TypeScript + Jest support, first install a few npm packages:
```
npm install -D jest ts-jest
```
`jest` is the testing framework itself, and `ts-jest` is just a simple function to make running TypeScript tests a little easier.

### Configure Jest
Jest's configuration lives in `package.json`, so let's open it up and add the following code:
```json
"jest": {
    "globals": {
      "__TS_CONFIG__": "tsconfig.json"
    },
    "moduleFileExtensions": [
      "ts",
      "js"
    ],
    "transform": {
      "^.+\\.(ts)$": "./node_modules/ts-jest/preprocessor.js"
    },
    "testMatch": [
      "**/test/**/*.test.(ts|js)"
    ],
    "testEnvironment": "node"
  },
```
Basically we are telling Jest that we want it to consume all files that match the pattern `"**/test/**/*.test.(ts|js)"` (all `.test.ts`/`.test.js` files in the `test` folder), but we want to preprocess the `.ts` files first. 
This preprocess step is very flexible, but in our case, we just want to compile our TypeScript to JavaScript using our `tsconfig.json`.
This all happens in memory when you run the tests, so there are no output `.js` test files for you to manage.   

### Running tests


### Writing tests
Writing tests for web apps has entire books dedicated to it and best practices are strongly influenced by personal style, so I'm deliberately avoiding discussing how or when to write tests in this guide.
However, if prescriptive guidance on testing is something that you're interested in, [let me know](TODO-survey-link), I'll do some homework and get back to you.

## TSLint
TSLint is a code linter which mainly helps catch minor code quality and style issues.
TSLint is very similar to ESLint or JSLint but is built with TypeScript in mind.

### TSLint rules
Like most linters, TSLint has a wide set of configurable rules as well as support for custom rule sets.
All rules are configured through `tslint.json`.
In this project, we are using a fairly basic set of rules with no additional custom rules.
The settings are largely based off the TSLint settings that we use to develop TypeScript itself.

### Running TSLint
Like the rest of our build steps, we use npm scripts to invoke TSLint.
To run TSLint you can call the main build script or just the TSLint task.
```
npm run build   // runs full build including TSLint
npm run tslint  // runs only TSLint
```
Notice that TSLint is not a part of the main watch task.
It can be annoying for TSLint to clutter the output window while in the middle of writing a function, so I elected to only run it only during the full build.
If you are interesting in seeing TSLint feedback as soon as possible, I strongly recommend the [TSLint extension in VS Code]().

# Dependencies
Dependencies are managed through `package.json`.
In that file you'll find two sections:
## `dependencies`

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| async                           | Utility library that provides asynchronous control flow.              |
| body-parser                     | Express 4 middleware.                                                 |
| compression                     | Express 4 middleware.                                                 |
| connect-mongo                   | MongoDB session store for Express.                                    |
| errorhandler                    | Express 4 middleware.                                                 |
| express                         | Node.js web framework.                                                |
| express-session                 | Express 4 middleware.                                                 |
| mongoose                        | MongoDB ODM.                                                          |
| morgan                          | Express 4 middleware.                                                 |
| tslint                          | Linter (similar to ESLint) for TypeScript files.                      |
| typescript                      | JavaScript compiler/type checker that boosts JavaScript productivity. |

## `devDependencies`

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| concurrently                    | Utility that manages multiple concurrent tasks. Used with npm scripts.|
| jest                            | Testing utility.                                                      |
| supertest                       | HTTP assertion library.                                               |
| ts-jest                         | A preprocessor with sourcemap support to help use Typescript with Jest|

To install or update these dependencies you can use `npm`.
