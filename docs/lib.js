
<script src="https://cdn.jsdelivr.net/npm/mermaid@8.4.0/dist/mermaid.min.js"></script>
<script>mermaid.initialize({startOnLoad:true});</script>
<div class="mermaid">
classDiagram
  class BaseProxy {
    <<proxy-handler>>
    address
    parent
    id
    get-trap
    set-trap
    checkPermission()
  }

  class ChildCache {
    <<utility>>
    cache <Object>
    parent <Object>
    hasChanged <Boolean>
    childNodes <Array>
    assignID(child) <void>
    (force-)update() <void>
    getCache() <Object>
    add(child) <void>
  }

  class BaseObject {
    <<interface>>
    hidden <Boolean>
    id <String>
    uuid <String>
    plain <IEnum>
    isGlobalRoot <Boolean>
    childCache <ChildCache>
    get hasChildren <Boolean>
    get children <Array>
    getRelativeAddress(target) <String>
    addNewChild(target) <self>
  }

%% world-branch
  class WorldObject
  class Realm {
    globals <object>
  }
  class World
  class Isolate
  class Area
  class Room {
    get exits <Objects[]>
  }

%% object Branch
  class GameObject {

  }

  class Exit {
    <<cross node>>
    isEntranceOnly <Boolean>
    isOneWay <Boolean>
    set destination <Exit>
  }

  class Container {
    <<enumeration>>
  }

%% connections
  Various ..> GameObject : not implemented yet
  Exit --|> GameObject
  GameObject --|> BaseObject : Object-Branch
  Realm --|> WorldObject
  World --|> WorldObject
  Isolate --|> WorldObject
  Area --|> WorldObject
  Room --|> WorldObject
  WorldObject --|> BaseObject : World-Branch
  Container "1" --* "n" ChildCache : not implemented yet
  ChildCache "0" --* "1" BaseObject : sub-module
  BaseObject "1" ..|> BaseProxy : wrapped

%% code
callback GameObject "callbackFunction" "tooltip"
</div>
