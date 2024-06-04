# Network Diagram by cytoscape.js

Draw a figure in [RFC7938](https://datatracker.ietf.org/doc/html/rfc7938) (like this) using cytoscape.js

```text
                                      Tier 1
                                     +-----+
          Cluster                    |     |
 +----------------------------+   +--|     |--+
 |                            |   |  +-----+  |
 |                    Tier 2  |   |           |   Tier 2
 |                   +-----+  |   |  +-----+  |  +-----+
 |     +-------------| DEV |------+--|     |--+--|     |-------------+
 |     |       +-----|  C  |------+  |     |  +--|     |-----+       |
 |     |       |     +-----+  |      +-----+     +-----+     |       |
 |     |       |              |                              |       |
 |     |       |     +-----+  |      +-----+     +-----+     |       |
 |     | +-----------| DEV |------+  |     |  +--|     |-----------+ |
 |     | |     | +---|  D  |------+--|     |--+--|     |---+ |     | |
 |     | |     | |   +-----+  |   |  +-----+  |  +-----+   | |     | |
 |     | |     | |            |   |           |            | |     | |
 |   +-----+ +-----+          |   |  +-----+  |          +-----+ +-----+
 |   | DEV | | DEV |          |   +--|     |--+          |     | |     |
 |   |  A  | |  B  | Tier 3   |      |     |      Tier 3 |     | |     |
 |   +-----+ +-----+          |      +-----+             +-----+ +-----+
 |     | |     | |            |                            | |     | |
 |     O O     O O            |                            O O     O O
 |       Servers              |                              Servers
 +----------------------------+

Figure 3: 5-Stage Clos Topology
```
<br>

[Live Demo](https://takamitsu-iida.github.io/network-diagram3/)


<br><br>

# Reference

<br>

## network-diagram

https://github.com/takamitsu-iida/network-diagram

<br>

## network-diagram2

https://github.com/takamitsu-iida/network-diagram2

<br>

## cytoscape.js

<https://js.cytoscape.org/>

<https://github.com/cytoscape/cytoscape.js>

<br>

## pan-zoom

This requires jquery and font-awesome4.

<https://github.com/cytoscape/cytoscape.js-panzoom>
