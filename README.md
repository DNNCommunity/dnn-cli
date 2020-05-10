# @dnncommunity/dnn-cli

[![License: MIT](https://img.shields.io/badge/LICENSE-MIT-informational.svg)](https://opensource.org/licenses/MIT)

![dnn-cli extension type screenshot](https://github.com/DNNCommunity/dnn-cli/raw/master/img/dnn-cli-extension-type.png)

## Installation

...via `yarn`

``` sh
yarn global add @dnncommunity/dnn-cli
```

...via `npm`

``` sh
npm install -g @dnncommunity/dnn-cli
```

## Usage

Once **dnn-cli** is installed, it may be used via Command Prompt, PowerShell, Terminal, etc.

``` sh
dnn [create-extension] [extensionType] [moduleType | customExtensionRepo] [--install | -i]
```

### create-extension
Initially, `dnn-cli` supports `create-extension`.  Over time, the vision is to grow the CLI to support even more great features.  For now, at least, the following two commands are the same:

```
dnn
```

```
dnn create-extension
``` 

It can be used to quickly setup a new local project by cloning any available starter project found within the [DNN Community organization on GitHub](https://github.com/DNNCommunity).  All [available starter project repositories](https://github.com/DNNCommunity?q=starter-&type=&language=) follow the repo naming convention of `starter-<extensionType>-<moduleType>`. 

> It also supports custom git repositories of your chosing.

A new local project can be quickly installed into an empty directory of your choice using the following CLI syntax. Optional `dnn` command arguments are indicated using brackets [ ].

``` sh
dnn [extensionType] [moduleType | customExtensionRepo] [--install | -i]
```

Upon running the command and responding to any applicable prompts, the new project will be cloned in the directory from which the `dnn-cli` command was run.

## Examples

### Using no [optional] arguments:

``` sh
dnn
```

> This will result in being prompted for `extensionType` and `moduleType` (or `customExtensionRepo`) depending on **extensionType** selected.

### Using [extensionType] only:

``` sh
dnn theme
```

> For an `extensionType` that does not have a `moduleType` or `customExtensionRepo`, no prompts will be displayed and the new project will be created. For an `extensionType` that does have a `moduleType` or `customExtensionRepo` (e.g., "Module", "Persona Bar", "*Custom"), a prompt will be displayed to select the desired `moduletype` or enter a valid `customExtensionRepo`.

### Using [extensionType] and [moduleType]:

``` sh
dnn module web-forms
```

### Using [extensionType] and [customExtensionRepo]:

``` sh
dnn *custom https://github.com/<user|org>/<repo>.git
```

### Extension Types & Module Types
None of these are case sensitive. Extension types and module types with spaces in the name can be wrapped in quotes or hyphenated.

* Authentican System (authentication-system)
* Connector (connector)
* Container (container)
* Core Language Pack (core-language-pack)
* Extension Language Pack (extension-language-pack)
* JavaScript Library (javascript-library)
* Library (library)
* Module (module)
    * MVC (mvc)
    * Razor 3 (razor-3)
    * SPA (spa)
    * Web Forms (web-forms)
* Persona Bar (persona-bar)
    * Angular (angular)
    * AngularJS (angularjs)
    * HTML (html)
    * React (react)
    * Vue (vue)
* Provider
* Scheduled Job (scheduled-job)
* Theme Object (theme-object)
* Theme (theme)
* Web API (web-api)
* Widget (widget)
* `*Custom (*custom)`

### Options

#### Install
For front-end projects, including the `--install` or `-i` option will automatically run `yarn` (`yarn install`) or `npm install` once the starter repository is cloned. The use of `yarn` or `npm` will be chosen based on your environment's configuration (`yarn` will take preferrence if installed).

### Features, Tutorials & Labs

Coming soon at [dnndocs.com](https://dnndocs.com)