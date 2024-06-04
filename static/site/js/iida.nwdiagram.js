/* global iida */

(function () {

  iida.nwdiagram = function () {

    let COLOR_REDUNDANT_0_EDGE = "#009933"; // green
    let COLOR_REDUNDANT_1_EDGE = "#FF9933"; // orange

    let COLOR_TIER_1_ROUTER = "#f0f0f0";  // lightgray
    let COLOR_TIER_1_REDUNDANT_0_ROUTER = "#00CC00"; // green
    let COLOR_TIER_1_REDUNDANT_1_ROUTER = "#FFCC00"; // orange

    let COLOR_TIER_2_ROUTER =  "#f0f0f0";  // lightgray
    let COLOR_TIER_2_REDUNDANT_0_ROUTER = "#00CC00"; // green
    let COLOR_TIER_2_REDUNDANT_1_ROUTER = "#FFCC00"; // orange

    let COLOR_TIER_3_ROUTER = "#f0f0f0";  // lightgray

    let COLOR_PORT_COLOR = "#f0f0f0";  // lightgray
    let COLOR_REDUNDANT_0_PORT = "#009933"; // green
    let COLOR_REDUNDANT_1_PORT = "#FF9933"; // orange


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
          'width': 1.6,
          'curve-style': "straight", // "bezier", "taxi" "bezier" "segments",
          'line-color': "#a9a9a9",  // darkgray
          // 'target-arrow-color': "#a9a9a9",  // darkgray
          // 'source-arrow-color': "#a9a9a9",  // darkgray
          // 'target-arrow-shape': "circle",
          // 'source-arrow-shape': "circle",
          // 'text-wrap': "wrap",  // wrap is needed to work '\n'
          // 'label': "data(label)",
          // 'label': edge => edge.data('label') ? `\u2060${edge.data('label')}\n\n\u2060` : '',
          // 'font-size': "10px",
          // 'edge-text-rotation': "autorotate"
          // 'source-text-offset': 10,
          // 'target-text-offset': 10,
          'z-index': 0
        }
      },

      {
        selector: "edge.tier2-tier3",
        style: {
          'width': 1.0,
          'curve-style': "taxi",
          'taxi-direction': 'horizontal',
          'taxi-turn': Number.MAX_SAFE_INTEGER
        }
      },

      {
        selector: "edge[redundant_id = 0]",
        style: {
          'line-color': COLOR_REDUNDANT_0_EDGE
        }
      },
      {
        selector: "edge[redundant_id = 1]",
        style: {
          'line-color': COLOR_REDUNDANT_1_EDGE
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
          'opacity': 1.0,
          'border-opacity': 1.0,
          'z-index': 1
        }
      },

      {
        selector: ".router.tier1",
        style: {
          'background-color': COLOR_TIER_1_ROUTER
        }
      },
      {
        selector: ".router.tier1[redundant_id = 0]",
        style: {
          'background-color': COLOR_TIER_1_REDUNDANT_0_ROUTER
        }
      },
      {
        selector: ".router.tier1[redundant_id = 1]",
        style: {
          'background-color': COLOR_TIER_1_REDUNDANT_1_ROUTER
        }
      },

      {
        selector: ".router.tier2",
        style: {
          'background-color': COLOR_TIER_2_ROUTER
        }
      },
      {
        selector: ".router.tier2[redundant_id = 0]",
        style: {
          'background-color': COLOR_TIER_2_REDUNDANT_0_ROUTER
        }
      },
      {
        selector: ".router.tier2[redundant_id = 1]",
        style: {
          'background-color': COLOR_TIER_2_REDUNDANT_1_ROUTER
        }
      },

      {
        selector: ".router.tier3",
        style: {
          'background-color': COLOR_TIER_3_ROUTER
        }
      },

      {
        selector: ".port",
        style: {
          'border-color': "#000",
          'border-width': 0.4,
          'shape': "rectangle",
          'background-color': COLOR_PORT_COLOR,
          'label': "data(label)",
          'width': "data(width)",
          'height': "data(height)",
          'font-size': "10px",
          'text-wrap': "wrap",
          'text-valign': "center",
          'text-halign': "center",
          'opacity': 1.0,
          'border-opacity': 1.0,
          'z-index': 0
        }
      },

      {
        selector: '.port[redundant_id = 0]',
        style: {
          'background-color': COLOR_REDUNDANT_0_PORT
        }
      },

      {
        selector: '.port[redundant_id = 1]',
        style: {
          'background-color': COLOR_REDUNDANT_1_PORT
        }
      }

    ]

    let LAYOUT_OPTIONS = {
      tier1_start_x: 80,
      tier2_start_x: 240,
      tier3_start_x: 320,
      tier1_tier2_min_gap: 50,
      cluster_gap: 360
    }

    let cy = window.cy = cytoscape({
      container: document.getElementById('cy'),
      minZoom: 0.5,
      maxZoom: 3,
      boxSelectionEnabled: false,
      autounselectify: true,
      // layout: { 'name': "preset" },
      layout: {
        name: "FiveStageClos", // see iida.layout.clos.js
        options: LAYOUT_OPTIONS
      },
      style: cy_styles,
      elements: iida.appdata.get_elements()
    });

    // add the panzoom control with default parameter
    // https://github.com/cytoscape/cytoscape.js-panzoom
    cy.panzoom({});

    function get_initial_position(node) {
      return node.data('initial_position');
    };

    function animate_to_initial_position() {
      Promise.all(cy.nodes('.router').map(node => {
        return node.animation({
          position: get_initial_position(node),
          duration: 1000,
          easing: "ease"
        }).play().promise();
      }));
    };

    // the button to revert to initial position
    let button_initial_position = document.getElementById('idInitialPosition');
    if (button_initial_position) {
      button_initial_position.addEventListener('click', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        animate_to_initial_position();
      });
    };

    // the button to dump elements JSON data to console
    let button_to_json = document.getElementById('idToJson');
    if (button_to_json) {
      button_to_json.addEventListener('click', function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        let elements_json = cy.elements().jsons();
        let elements_json_str = JSON.stringify(elements_json, null, 2);
        console.log(elements_json_str);
      });
    };


    function data_change_handler(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      let target = evt.target;
      let clos_clusters = iida.appdata.clos_clusters_1;
      if (target.dataset.example === "ex2") {
        clos_clusters = iida.appdata.clos_clusters_2;
      }

      cy.elements().remove();
      cy.add(iida.appdata.get_elements(clos_clusters));
      cy.layout({ name: "FiveStageClos", options: LAYOUT_OPTIONS }).run();

    }

    let button_data1 = document.getElementById('idData1');
    if (button_data1) {
      button_data1.addEventListener('click', data_change_handler);
    }

    let button_data2 = document.getElementById('idData2');
    if (button_data2) {
      button_data2.addEventListener('click', data_change_handler);
    }

  };
  //
})();
