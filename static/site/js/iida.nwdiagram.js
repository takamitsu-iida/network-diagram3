(function () {

  iida.nwdiagram = function () {

    let cy_styles = [

      {
        selector: ':parent',
        style: {
          'background-opacity': 0
        }
      },

      {
        selector: "edge",
        style: {
          'width': 1,
          // 'curve-style': "bezier",  // "taxi" "bezier" "segments",
          'curve-style': "straight",
          'line-color': "#a9a9a9",  // darkgray
          // 'target-arrow-color': "#a9a9a9",  // darkgray
          // 'source-arrow-color': "#a9a9a9",  // darkgray
          // 'target-arrow-shape': "circle",
          // 'source-arrow-shape': "circle",
          // 'label': "data(label)",
          'text-wrap': "wrap",  // wrap is needed to work '\n'
          'label': edge => edge.data('label') ? `\u2060${edge.data('label')}\n\n\u2060` : '',
          'font-size': "10px",
          'edge-text-rotation': "autorotate",
          // 'source-text-offset': 10,
          // 'target-text-offset': 10,
        }
      },

      {
        selector: "edge.tier2-tier3",
        style: {
          'width': 1,
          'curve-style': "taxi",
          'taxi-direction': 'horizontal',
          'taxi-turn': Number.MAX_SAFE_INTEGER,
        }
      },

      {
        selector: "edge[redundant_id = 0]",
        style: {
          'width': 1,
          'line-color': "#0000ff",  // blue
        }
      },
      {
        selector: "edge[redundant_id = 1]",
        style: {
          'width': 1,
          'line-color': "#ff0000",  // red
        }
      },

      {
        selector: ".router",
        style: {
          'border-color': "#000",
          'border-width': 1,
          'shape': 'rectangle',
          'background-color': "#ffffff",
          'label': "data(label)",
          'width': "data(width)",
          'height': "data(height)",
          'font-size': "10px",
          'text-wrap': "wrap",
          'text-valign': "center",
          'text-halign': "center",
          'opacity': 1,
          'border-opacity': 1.0,
        }
      },

      {
        selector: ".router.tier1",
        style: {
          'background-color': "#f0f0f0",
        }
      },

      {
        selector: ".router.tier2",
        style: {
          'background-color': "#00f0f0",
        }
      },

      {
        selector: ".router.tier3",
        style: {
          'background-color': "#f0f000",
        }
      },

      {
        selector: ".port",
        style: {
          'border-color': "#f0f0f0",
          'border-width': 0.5,
          'shape': "rectangle",
          'background-color': "#87ceeb",  // skyblue
          'label': "data(label)",
          'width': "data(width)",
          'height': "data(height)",
          'font-size': "10px",
          'text-wrap': "wrap",
          'text-valign': "center",
          'text-halign': "center",
          'opacity': 1,
          'border-opacity': 1.0
        }
      },

      {
        selector: '.port[redundant_id = 0]',
        style: {
          'background-color': "#0000ff",  // blue
        }
      },

      {
        selector: '.port[redundant_id = 1]',
        style: {
          'background-color': "#ff0000",  // red
        }
      }

    ]

    let cy = window.cy = cytoscape({
      container: document.getElementById('cy'),
      minZoom: 0.5,
      maxZoom: 3,
      boxSelectionEnabled: false,
      autounselectify: true,
      // layout: { 'name': "preset" },
      layout: {
        name: "FiveStageClos", // see iida.layout.clos.js
        options: {
          tier1_start_x: 80,
          tier2_start_x: 240,
          tier3_start_x: 320,
          tier1_tier2_min_gap: 50,
          cluster_gap: 360
        }
      },
      style: cy_styles,
      elements: iida.appdata.get_elements()
    });

    // add the panzoom control with default parameter
    // https://github.com/cytoscape/cytoscape.js-panzoom
    cy.panzoom({});

    // the button to revert to initial position
    let initial_position = document.getElementById('idInitialPosition');
    if (initial_position) {
      initial_position.addEventListener('click', function (evt) {
        animate_to_initial_position();
      });
    };

    let get_initial_position = function (node) { return node.data('initial_position'); };

    let animate_to_initial_position = function () {
      Promise.all(cy.nodes('.router').map(node => {
        return node.animation({
          position: get_initial_position(node),
          duration: 1000,
          easing: "ease"
        }).play().promise();
      }));
    };

  };
  //
})();
