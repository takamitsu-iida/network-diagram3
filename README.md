# Network Diagram by cytoscape.js

RFC7938に記載の図をJavaScriptで描画します。

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

## レイアウト方法

cytoscape.jsの拡張機能としてレイアウトを実装します。

https://js.cytoscape.org/#extensions/layout-prototype

必要な関数は run() と stop() です。

エレメント情報(eles)はコンストラクタで渡されるoptionsの中に入ってます。

run()の中でlayoutPositions()を呼ぶことでレイアウトを確定させます。


<br>

# Reference

## cytoscape.js

<https://js.cytoscape.org/>

<https://github.com/cytoscape/cytoscape.js>

<br>

## pan-zoom

This requires jquery and font-awesome4.

<https://github.com/cytoscape/cytoscape.js-panzoom>
