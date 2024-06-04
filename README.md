# Network Diagram by cytoscape.js

RFC7938に記載の図（こんな感じの絵↓）をJavaScriptで描画します。

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

## レイアウト方法

cytoscape.jsの拡張機能としてレイアウトを実装しています。

>
> 参照
>
> https://js.cytoscape.org/#extensions/layout-prototype
>

レイアウトの実装で必要な関数は run() と stop() です。

cytoscape.jsが初期化されると、指定したレイアウトのrun()が呼ばれます。

run()の中でlayoutPositions()を呼ぶことでレイアウトを確定させます。

レイアウトを決定するのに必要な情報は引数として渡されるオブジェクトに格納されています。

<br><br>

# Reference

## cytoscape.js

<https://js.cytoscape.org/>

<https://github.com/cytoscape/cytoscape.js>

<br>

## pan-zoom

This requires jquery and font-awesome4.

<https://github.com/cytoscape/cytoscape.js-panzoom>
