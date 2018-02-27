# Gherk it off

Convert a gherkin feature into a JEST Test.

[![npm version](https://badge.fury.io/js/gherk-it-off.svg)](http://badge.fury.io/js/gherk-it-off)



## Installation

```sh
npm install --save-dev gherk-it-off
```



## Usage

Add a new npm script and execute the following command.

```sh
gherk-it-off --src ./**/*.feature --out ./dist/jest --converter jest
```

__Options:__
+ `--src` glob to define feature files to convert
+ `--out` output directory
+ `--converter` define a converter to use - `jest` or `json`
