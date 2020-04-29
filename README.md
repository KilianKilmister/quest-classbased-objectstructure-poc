# Proof of Concept for Rebasing the Core Object Structure on Prototype Inheritance

## Main Features

1. ES6 class based inheritance.
2. Two basic scripts showcasing the PoC
3. High degree of isolation on every object making code-execution predictable.
4. Use of JavaScript-native `Proxys` implemented deep in the core code.
5. Fully dynamic Object generation allowing runtime generation of complete
   games.
6. Fully functional Address module able to resolve both absolute and relative
   addresses.
7. Simple UID creation module and global index allowing easy scoping to objects
   until a more elegant way is implemented.
8. Basic Caching of child objects allowing fast retrieval of children.


## ES6-Class based Inheritance

A strict inheritance model to optimise runtime-execution and makes the program run
more predictable. Currently it consists of two branches inheriting from a single
node.  
The two branches are: (names are subject to change)

1. World-Objects
   - Forming the Super-Structure of the world and grouping programmatic
     environments.
2. Game-Objects
   - Forming the intractable and manipulatable world

They are currently mostly representational but can easily be expanded upon.


## Two Basic Scripts Showcasing the PoC

They can be used by running `bin/ex.js` and selecting one of the options when
prompted.

1. Unstructured
   - soft benchmarking creating up to 20'000 objects representing a massive
     world. Number of objects is dictated by random number generation within an
     easily adjustable min-max. Depending on available resources i'm able to
     generate a world populated with 20k objects in between 0.5 and 2 seconds.
     both acceptable for production and 20k is massive and could easily be
     generated as needed or at first time setup.
2. Structured
   - simple showcase of the `addNewChild`-method present on (as-of-now) every
     object. Generates 32 objects in a few milliseconds

Both Tasks write the resulting Root-Object to a JSON file (heavily shortened to
a depth of about 5).  
The API is (albeit messy) fully exposed and ready to be experimented with. This
PoC is also available as an NPM package that can can be downloaded and used as
a dependency.


## High Degree of Isolation on every Object making Code-Execution Predictable

High degrees of isolation were a design focus. Objects know only basic
properties of the world around them. Every property escaping the objects scope
is handled by a super or the proxy. This naturally cuts down on glitches and
while source code gets more complex, it makes scripting simpler.

- eg. no complex scoping is necessary as objects visible from a game-logic
  standpoint (and only those) are also programmatically visible by default.
- this can be easily fine-tuned by selectively exposing/hiding objects from the
  local scope.


## Use of JavaScript-native `Proxys` Implemented deep in the Core Code

The base-object (and thus everything that inherits from it) return a Proxy with
a specialized handler object enveloping it.
The proxy serves three main purposes:

1. It enables permission checking and pre-processing of data before it reaches
   the target object.
2. It can store information at an easy-to-access place while still isolating the
   actual object from it. eg. it can store the absolute address of an Object
   while still keeping it out of reach of the object itself and of those who can
   read the object.
3. Being Native-Code, they are incredibly efficient and with some simple
   boolean-pre-triggers they cause close to zero additional processing time and
   (when correctly configured) are basically impossible to circumvent. Case and
   point: ALL objects in the example scripts are wrapped by a proxy. And the
   design of the logging-to-console has more effect on execution speed than all
   the proxies combined.

They are making source code less intuitive, tho. but i think they are well worth
it.


## Fully Dynamic Object Generation Allowing Runtime Creation of Complete Games

Using proper prototype inheritance entire sections can be generated and
discarded on the fly with few lines of code, making scripting much easier and
runtime smoother.


## Fully Functional Address Module able to Resolve both Absolute and Relative Addresses

this PoC comes with a fully functional Address module based on the NodeJS
`path`- module. It currently feature construction of the Absolute Address of an
Object and resolving of relative addresses by only giving it start- and
target-Object.  
It is designed after IPv6, every parent acting as a DNS for its direct children.
each parent assigns a unique HEX-based ID to each of it's children at their
creation (or relocation). these are then joined by a `:` giving an easy to read
and use address. eg: `:0:4:1:2:50` (leading `:` indicates the absolute root)  
Relative addresses are prefixed with a letter representing the scope of the last
common ancestor. eg: `A:1:207` (the capital `A` indicating that the last common
ancestor is an area)  
this adds a layer of isolation as a local control node (a room or container)
does not need access or knowledge of it's own position to guide scoping within
it.  
Addresses can be accessed by the `.address`-trap or the `.getRelativeAddress(target)`-method


### Examples Pulled from the Showcase-Script

| leading    |       `:`       |       `R`        |       `W`       |      `A`       |      `r`       |
|------------|:---------------:|:----------------:|:---------------:|:--------------:|:--------------:|
| represents |      ROOT       |      Realm       |      World      |      Area      |      room      |
| ---------  | -------x------- | -------x-------- | -------x------- | -------x------ | -------x------ |
| point-a    |  `:0:2:3:3:a8`  |  `:0:2:2:1:22c`  | `:0:2:2:2:32e`  | `:0:2:2:4:52`  | `:0:2:7:1:1d0` |
| point-b    | `:0:2:7:2:198`  | `:0:2:3:3:16e:0` | `:0:2:2:4:1ff`  | `:0:2:9:1:362` | `:0:2:a:2:335` |
| relative   |   `W:7:2:198`   | ` W:3:3:16e:0 `  |    `A:4:1ff`    |  `W:9:1:362`   |  `W:a:2:335`   |
| ---------  | -------x------- | -------x-------- | -------x------  | -------x------ | -------x------ |
| point-a    | `:0:2:2:1:372`  |  `:0:2:2:4:24c`  | `:0:2:2:4:2c4`  | `:0:2:2:3:114` | `:0:2:2:3:1bb` |
| point-b    | `:0:2:8:2:2a2`  |  `:0:2:9:2:341`  |  `:0:2:8:2:9f`  | `:0:2:a:1:36f` | `:0:2:8:2:fb`  |
| relative   |   `W:8:2:2a2`   |   `W:9:2:341`    |   `W:8:2:9f`    |  `W:a:1:36f`   |   `W:8:2:fb`   |


## Simple UID-Creation-Module and Global Index

Every object is assigned a unique UID at creation and is indexed with it.
contrary to the ID used in the Address-module, the object keeps this one
regardless of location and the UID won't be given free at object destruction.
This is a simple way to guarantee persistance of object-connections. eg: lock
and key relation.  
the UID Creator is simple and can be tweaked if necessary. Currently it
guarantees uniqueness and generates a HEX-base ID of 8+4+4-digits. eg: `4e71fff5-1757-1dc0`


## Basic Caching of Child-Objects allowing Fast Retrieval of Children

The ChildCache-Object created as a property as-needed allows for some basic
caching. It's based on an independent class outside the inheritance tree as a
refracturing measure. It works as a mixin and that is created when first needed.
It's not really supposed to be directly accessed but works as an extension of
the base-class its methods being mainly used by the parent object. and serving
as a Node to quickly easily connect (grand-)children to their respective
container.  
It currently features some ultra basic caching working as a data-base for the
getters of the main Object. The caching is bare-bones and needs optimization,
but as-is it could already serve specific data to their matching getters.  
It could keep the matching data ready to serve for various containers of an
object. eg: a table with a hidden compartment (separating on-top, and
compartment) or a diary with a key in it's wrapper (separating diary pages and
key).  
This makes it easy for programmatic-logic to follow game-logic as it could
easily handle visibility or unlock-requirements within the parent object directly.
