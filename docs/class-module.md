# Class Module

The class module composes the main body of the PoC. Besides offering the base
structure of a game world it also contains some enums (sparsely implemented) and
exports the main game instance (stand-in for a properly configurable one).
But the Focus points are the prototype-inheritance, the Child-Cache module and
the Base-Proxy template.


## Highlights

- [Class Module](#class-module)
  - [Highlights](#highlights)
  - [Class Diagram](#class-diagram)
  - [Base Proxy](#base-proxy)
  - [Child Cache](#child-cache)
  - [Skeleton](#skeleton)
  - [Game Instance](#game-instance)
  - [Enums](#enums)


## Class Diagram

<object type="image/svg+xml" data="/media/mermaid-class-diagram.svg"></object>


## Base Proxy

```mermaid
graph LR
a((Source)) ==> I
Target
I{{in}}
p{Permission?}
h{Hide from Target?}
O{{out}}
H -->|return|O
subgraph Handler
  p -.->|deny|O
  I --> p
  p -->|approve| h
  H[(own properties)]
end
h -.->|intercept| H
h -->|relay| Target
Target -->|record| H
O ==> b((return))
```


## Child Cache

```mermaid
{
  "er": {
    "stroke": "#202099",
    "fill": "#ddf"
  }
}
erDiagram
  NODE ||--o| CACHE : "owns"
  CACHE ||..o{ NODE : "stores children"
```


## Skeleton

```mermaid
erDiagram
GAME ||--|{ REALM : "mounts"
REALM ||--|{ WORLD : "controls"
REALM ||--|| ISOLATE : "controls"

WORLD ||--|{ AREA : "is devided into"


ISOLATE |o--o{ ROOM : "connects to"
ISOLATE ||--|| ISOLATE : "reset and re-connect to"
ROOM-OBJECT }|--|| ROOM : "controls"
ITEM }o--|| ROOM-OBJECT : "contains"

AREA }|..|{ ROOM : "collects"
ROOM }o..o{ ROOM : "inter-room connection"

ROOM }o..o{ REALM-BRIDGE : " "
```


## Game Instance


## Enums
