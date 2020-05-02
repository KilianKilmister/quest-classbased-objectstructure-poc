# General Notes on the World-Object/Realms

## Actively Isolate layers from eachother.

This makes ID-Assignments less likely to conflict as each thing from Rooms to
an Object within a container gets a unique address. And addresses can be
assigned by the direct authority independent from the larger scope.


### Analogy to the IPv6

We want every "physical" thing to have a unique address inside every scope.
So each node has to act as a DNS for its subnet.
eg. **ROOT:Realm:World:room:gameObject:content**

```mermaid
  graph LR
  ROOT((Root)) --> R(Realm) --> W(World) & I(Isolate)
  W --> A(Area) --> r(Room) --> P(player) & K(key) & B(Box)
  B --- toy & password & spider
  r -.-> toy & password & spider
```

sfedse

```mermaid
graph LR
  R(Room) --> P(Player) & N(NPC) & T(Table)
  P -.- K(Knife) & Notepad
  N -.- H(fancy Hat)
  T --- B(Book) & C(Cup)
  T -.->|underside| k
  B -.->|inside| p(Password)
  B -.->|under| n(Note)
```

sefsdf

```mermaid
graph LR
  G{{GameInstance}} ==>|Active Mount| R[(Active Realm)]
  subgraph Realm
    R -.->|isolation layer| I
    R ==> W
    subgraph World
      W((World))
      W --- A0{Area}
      W --- A1{Area}
      subgraph Area 1
      A0 -.-R00 & R01 & R02
        R00(Room)
        R01(Room)
        R02(Room)
      end
      subgraph Area 2
      A1 -.-R10 & R11 & R12
        R10(Room)
        R11(Room)
        R12(Room)
      end
    end
    subgraph isolate
      I([Isolate]) -.-> r(Room)
    end
  end
  G -.->|aux-mounts| w[(other Realms)]
```
