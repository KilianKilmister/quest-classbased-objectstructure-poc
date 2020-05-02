# Proof of Concept for Rebasing the Core Object Structure on Prototype Inheritance

![GitHub](https://img.shields.io/github/license/kiliankilmister/quest-classbased-objstructure-poc)
[![Issues](https://img.shields.io/github/issues-raw/kiliankilmister/quest-classbased-objstructure-poc.svg?maxAge=25000)](https://github.com/kiliankilmister/quest-classbased-objstructure-poc/issues)
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
![GitHub contributors](https://img.shields.io/github/contributors/kiliankilmister/quest-classbased-objstructure-poc.svg?style=flat)
![GitHub pull requests](https://img.shields.io/github/issues-pr/kiliankilmister/quest-classbased-objstructure-poc.svg?style=flat)
![node](https://img.shields.io/node/v/@slick_kilmister/quest-classbased-objstructure-poc)<br>
[![standard]][standardl]
[![NPM](https://nodei.co/npm/@slick_kilmister/quest-classbased-objstructure-poc.png?downloads=true)](https://www.npmjs.com/package/@slick_kilmister/quest-classbased-objstructure-poc)


| [Link to QuestJS-Repo][Quest] | [Link to GitHub-Repo][repo] | [Link to GitHub-Pages][pages] | [Link to NPM-Package][NPM] |

[Quest]:<https://github.com/ThePix/QuestJS>
[NPM]:<https://www.npmjs.com/package/@slick_kilmister/quest-classbased-objstructure-poc>
[standard]:<https://cdn.rawgit.com/standard/standard/master/badge.svg>
[standardl]:<https://github.com/standard/standard>
[pages]:<https://kiliankilmister.github.io/quest-classbased-objectstructure-poc/>
[repo]:<https://github.com/KilianKilmister/quest-classbased-objectstructure-poc>


## Main Features

1. [ES6-Class based Inheritance][1]
2. [Game-Skeleton overhaul][2]
3. [Two Basic Scripts Showcasing the PoC][3]
4. [High Degree of Isolation on every Object making Code-Execution Predictable][4]
5. [Use of JavaScript-native Proxys Implemented deep in the Core Code][5]
6. [Fully Dynamic Object Generation Allowing Runtime Creation of Complete Games][6]
7. [Fully Functional Address-Module able to Resolve both Absolute and Relative Addresses][7]
8. [Simple UUID-Creation-Module and Global Index][8]
9. [Basic Caching of Child-Objects allowing Fast Retrieval of Children][9]

[1]:<#es6-class-based-inheritance>
[2]:<#game-skeleton-overhaul>
[3]:<#two-basic-scripts-showcasing-the-poc>
[4]:<#High-Degree-of-Isolation-on-every-Object-helping-against-unpredictable-Code-Execution>
[5]:<#use-of-javascript-native-proxys-implemented-deep-in-the-core-code>
[6]:<#fully-dynamic-object-generation-allowing-runtime-creation-of-complete-games>
[7]:<#fully-functional-address-module-able-to-resolve-both-absolute-and-relative-addresses>
[8]:<#simple-uuid-creation-module-and-global-index>
[9]:<#basic-caching-of-child-objects-allowing-fast-retrieval-of-children>


## ES6-Class based Inheritance

A strict inheritance model to optimise runtime-execution and makes the program act
more predictable. Currently it consists of two branches inheriting from a single
Node. They are currently mostly representational but can easily be expanded
upon. [See the Class-Module for more details][Class-Module]

[Class-Module]:<class-module.md>


## Game-Skeleton overhaul


## Two Basic Scripts Showcasing the PoC

They can be used by running `bin/ex.js` and selecting the respective options when
prompted.


### Unstructured

Soft benchmarking creating up to 20'000 objects representing a massive
world. Number of objects is dictated by random number generation within an
easily adjustable min-max. Depending on available resources i'm able to
generate a world populated with 20k objects in between 0.5 and 2 seconds.
both acceptable for production and 20k is massive and could easily be
generated as needed or at first time setup.


### Structured

Simple showcase of the `addNewChild()`-method present on (as-of-now) every
object. Generates 32 objects in a few milliseconds


Both Tasks write the resulting Root-Object to a `JSON` file (heavily shortened to
a depth of about 5).  
The API is (albeit messy) fully exposed and ready to be experimented upon. This
PoC is also available as an NPM package that can can be downloaded and used as
a dependency.

```sh
npm install @slick_kilmister/quest-classbased-objstructure-poc
```


## High Degree of Isolation on every Object helping against unpredictable Code-Execution

High degrees of isolation were a design focus. Objects know only basic
properties of the world around them. Every property escaping the objects scope
is handled by a super or the `proxy`. This naturally cuts down on glitches and
while source `code` gets more complex, it makes scripting simpler.

- eg. no complex scoping is necessary as objects visible from a game-logic
  standpoint (and only those) are also programmatically visible by default.
- this can be easily fine-tuned by selectively exposing/hiding objects from the
  local scope.


## Use of JavaScript-native Proxys Implemented deep in the Core Code

The base-object-`constructor` (and thus everything that inherits from it)
returns a `Proxy` with a specialized handler object enveloping it.
The `Proxy` serves three main purposes:

1. The `Proxy` enables permission checking and pre/post-processing of data before it reaches
   the target object.
2. It can store information at an easy-to-access place while still isolating the
   actual object from it. eg. it can store the absolute address of an Object
   while still keeping it out of reach of the object itself and of those who can
   read the object.
3. Being Native-`Code`, they are incredibly efficient and with some simple
   `boolean`-pre-triggers they cause close to zero additional processing time and
   (when correctly configured) are basically impossible to circumvent.  
   Case-and-Point: ALL objects in the example scripts are wrapped by a
   `proxy`.
   And the design of the logging-to-console has more effect on execution speed than all
   the `proxies` combined.

They are making source `code` less intuitive, tho. but i think they are well worth
it.


## Fully Dynamic Object Generation Allowing Runtime Creation of Complete Games

Using proper `prototype` inheritance entire sections can be generated and
discarded on the fly with few lines of `code`, making scripting much easier and
runtime smoother.


## Fully Functional Address Module able to Resolve both Absolute and Relative Addresses

this PoC comes with a fully functional Address-module based on the NodeJS
`path`-module. It currently features construction of the Absolute Address of an
Object and resolving of relative addresses by only giving it start- and
target-Object.  
It is designed after IPv6, every parent acting as a DNS for its direct children.
Each parent assigns a in-scope-unique HEX-based ID to each of it's children at their
creation (or relocation). These are then joined by a `:` giving an easy to read
and use address. eg: `:0:4:1:2:50` (leading `:` indicates the absolute root)
Relative addresses are prefixed with a letter representing the scope of the last
common ancestor. eg: `A:1:207` (the `capital A` indicating that both objects are
within the same area) this adds a layer of isolation as a local control-node
(like a room or container) does not need access or knowledge of its own
position to guide scoping within itself.  
Addresses can be accessed by the `.address`-getter/trap or
the `.getRelativeAddress(target)`-method


### Examples Pulled from the Showcase-Script

| ex       |                |                  |                |                |                |
| -------- | -------------: | ---------------: | -------------: | -------------: | -------------: |
| from     |  `:0:2:3:3:a8` |   `:0:2:2:1:22c` | `:0:2:2:2:32e` |  `:0:2:2:4:52` | `:0:2:7:1:1d0` |
| to       | `:0:2:7:2:198` | `:0:2:3:3:16e:0` | `:0:2:2:4:1ff` | `:0:2:9:1:362` | `:0:2:a:2:335` |
| relative |    `W:7:2:198` |  ` W:3:3:16e:0 ` |      `A:4:1ff` |    `W:9:1:362` |    `W:a:2:335` |

NOTE: smaller subdivisions currently all are lead by `lower-case c` for container


## Simple UUID-Creation-Module and Global Index

Every object is assigned a unique UUID at creation and is indexed with it.
contrary to the ID used in the Address-module, the object keeps this one
regardless of location and the UUID won't be given free at object destruction.
This is a simple way to guarantee persistance of object-connections. eg: lock
and key relation.  
The UUID-Creator is simple and can be tweaked if necessary. Currently it
guarantees uniqueness and generates a HEX-base ID of `8+4+4`-digits.
eg: `4e71fff5-1757-1dc0`


## Basic Caching of Child-Objects allowing Fast Retrieval of Children

The ChildCache-Object allows for some basic caching. It's based on an
independent class outside the inheritance tree as a refracturing measure.
It works as a mixin of sort and is created when first needed. So objects without
any children don't try to start caching.  
It's not really supposed to be directly accessed but works as an extension of
the base-class. Its methods being mainly used by the parent object. and serving
as a Node to quickly easily connect (grand-)children to their respective
container.  
It currently features some ultra basic caching working as a data-base for the
getters of the main Object. The caching is bare-bones and needs optimization,
but as-is it could already serve specific data to their matching getters.  
It could keep the matching data ready to serve for various containers of an
object. eg: a table with a hidden compartment (separating on-top, and
compartment) or an (N-)PC inventory (separating held-, worn-, stored- etc. items).  
This makes it easy for programmatic-logic to follow game-logic as it could
easily handle visibility, accessability or unlock-requirements within the parent object directly.
