// 5 stage clos layout
(function () {

  if (!cytoscape) {
    return;
  }

  function five_stage_clos_layout(arguments) {
    this.options = arguments.options || {};
    this.cy = arguments.cy;
    this.eles = arguments.eles;
  }


  five_stage_clos_layout.prototype.run = function () {
    let options = this.options;
    let cy = this.cy;
    let eles = this.eles;

    let tier1_start_x = options.tier1_start_x || 80;
    let tier2_start_x = options.tier2_start_x || 240;
    let tier3_start_x = options.tier3_start_x || 320;
    let tier1_tier2_min_gap = options.tier1_tier2_min_gap || 50;
    let cluster_gap = options.cluster_gap || 360;

    // extract all router
    let router_nodes = eles.nodes('.router'); //.not(':parent');

    // layout tier1 routers
    let tier1_routers = router_nodes.filter('[tier=1]');
    tier1_routers.forEach(function (node, i) {
      let x = tier1_start_x;
      let y = 100 * (i + 1);
      node.position({ x: x, y: y });
      node.data('initial_position', { x, y });
    });

    // layout routers in cluster
    let cluster_ids = get_cluster_ids(router_nodes);

    cluster_ids.forEach(function (cluster_id, i) {
      let tier2_routers = router_nodes.filter('[tier=2][cluster_id=' + cluster_id + ']');
      tier2_routers.forEach(function (node, j) {
        let x = tier2_start_x;
        let y = cluster_gap * i + 100 * (j + 1);
        node.position({ x: x, y: y });
        node.data('initial_position', { x, y });
      });

      let bb = tier2_routers.boundingBox();
      let max_y = bb.y2;

      let tier3_routers = router_nodes.filter('[tier=3][cluster_id=' + cluster_id + ']');
      tier3_routers.forEach(function (node, j) {
        let x = tier3_start_x + 100 * j;
        let y = max_y + 100;
        node.position({ x: x, y: y });
        node.data('initial_position', { x, y });
      });
    });

    router_nodes.forEach(function (router) {
      let router_position = router.position();
      let ports = eles.nodes('.port').filter(function (n) {
        if (n.data('router_id') === router.id()) {
          return n;
        }
      });
      ports.forEach(port => {
        let offset_x = port.data('offset_x');
        let offset_y = port.data('offset_y');
        port.position({ x: router_position.x + offset_x, y: router_position.y + offset_y });
      });
    });

    eles.nodes().layoutPositions(this, options, function (node, _index) {
      return { x: node.position().x, y: node.position().y };
    });

    cy.nodes('.router').on('grab', function (evt) {
      if (evt.target.parent().grabbed()) {
        // in case of paret is grabbed
        return;
      }

      // save position at the moment of grab
      cy.nodes('.router').forEach(function (node) {
        node.data('grabbed_position', { x: node.position().x, y: node.position().y });
      });

      let tier = evt.target.data('tier');
      if (tier === 1) {
        let tier1_routers = cy.nodes('.router').filter('[tier=1]');
        let tier1_bb = tier1_routers.boundingBox();
        let not_tier1_routers = cy.nodes('.router').filter(function(node) {
          return node.data('tier') === 2 || node.data('tier') === 3;
        });
        let not_tier1_bb = not_tier1_routers.boundingBox();
        let max_dx = not_tier1_bb.x1 - tier1_bb.x2 - tier1_tier2_min_gap;
        evt.target.data('max_dx', max_dx);
      }
      if (tier === 2) {
        let tier1_routers = cy.nodes('.router').filter('[tier=1]');
        let tier1_bb = tier1_routers.boundingBox();
        let cluster_id = evt.target.data('cluster_id');
        let tier2_routers = cy.nodes('.router').filter('[tier=2][cluster_id=' + cluster_id + ']');
        let tier2_bb = tier2_routers.boundingBox();
        let tier3_routers = cy.nodes('.router').filter('[tier=3][cluster_id=' + cluster_id + ']');
        let tier3_bb = tier3_routers.boundingBox();
        let min_dx = tier2_bb.x1 - tier1_bb.x2 - tier1_tier2_min_gap;
        let max_dx = tier3_bb.x1 - tier2_bb.x2;
        let max_dy = tier3_bb.y1 - tier2_bb.y2;
        evt.target.data('min_dx', min_dx);
        evt.target.data('max_dx', max_dx);
        evt.target.data('max_dy', max_dy);
      }
      if (tier === 3) {
        let cluster_id = evt.target.data('cluster_id');
        let tier2_routers = cy.nodes('.router').filter('[tier=2][cluster_id=' + cluster_id + ']');
        let tier2_bb = tier2_routers.boundingBox();
        let tier3_routers = cy.nodes('.router').filter('[tier=3][cluster_id=' + cluster_id + ']');
        let tier3_bb = tier3_routers.boundingBox();
        let min_dx = tier3_bb.x1 - tier2_bb.x2;
        let min_dy = tier3_bb.y1 - tier2_bb.y2;
        evt.target.data('min_dx', -1 * min_dx);
        evt.target.data('min_dy', -1 * min_dy);
      }

    });

    cy.nodes('.router').on('drag', function (evt) {
      if (evt.target.parent().grabbed()) {
        // in case of parent is dragged, all children are also dragged
        return;
      }

      let grabbed_position = evt.target.data('grabbed_position');
      if (!grabbed_position) {
        return;
      }

      let delta_x = evt.target.position().x - grabbed_position.x;
      let delta_y = evt.target.position().y - grabbed_position.y;

      // check if the dragged node is out of the boundary
      let tier = evt.target.data('tier');
      if (tier === 1) {
        if (delta_x > evt.target.data('max_dx')) {
          evt.target.position({ x: grabbed_position.x + evt.target.data('max_dx'), y: evt.target.position().y });
        }
      }
      if (tier === 2) {
        if (delta_x < -1 * evt.target.data('min_dx')) {
          evt.target.position({ x: grabbed_position.x - evt.target.data('min_dx'), y: evt.target.position().y });
        }
        if (delta_x > evt.target.data('max_dx')) {
          evt.target.position({ x: grabbed_position.x + evt.target.data('max_dx'), y: evt.target.position().y });
        }
        if (delta_y > evt.target.data('max_dy')) {
          evt.target.position({ x: evt.target.position().x, y: grabbed_position.y + evt.target.data('max_dy') });
        }
      }
      if (tier === 3) {
        if (delta_x < evt.target.data('min_dx')) {
          evt.target.position({ x: grabbed_position.x + evt.target.data('min_dx'), y: evt.target.position().y });
        }
        if (delta_y < evt.target.data('min_dy')) {
          evt.target.position({ x: evt.target.position().x, y: grabbed_position.y + evt.target.data('min_dy') });
        }
      }

      delta_x = evt.target.position().x - grabbed_position.x;
      delta_y = evt.target.position().y - grabbed_position.y;

      let drag_with_targets = evt.target.data('drag_with') || [];
      drag_with_targets.forEach(function (drag_target) {
        let n = cy.$id(drag_target);
        if (!n || n === evt.target) {
          return;
        }
        n.position({ x: n.data('grabbed_position').x + delta_x, y: n.data('grabbed_position').y + delta_y });
      });

    });

    // on position, fix port position
    cy.nodes('.router').on('position', function (evt) {
      let router = evt.target;
      let router_position = router.position();

      let ports = cy.nodes().filter(function (n) {
        if (n.data('router_id') === router.id()) {
          return n;
        }
      });
      ports.forEach(port => {
        let offset_x = port.data('offset_x');
        let offset_y = port.data('offset_y');
        port.position({ x: router_position.x + offset_x, y: router_position.y + offset_y })
      });
    });

    return this;
  }


  five_stage_clos_layout.prototype.stop = function () {
    return this;
  }


  function get_cluster_ids(nodes) {
    let tier2_routers = nodes.filter('[tier=2]');

    let cluster_ids = tier2_routers.map(function (r) {
      return r.data('cluster_id');
    });

    // remove duplicate cluster_ids
    cluster_ids = Array.from(new Set(cluster_ids));

    return cluster_ids;
  }



  // register layout extension to cytoscape
  cytoscape('layout', 'FiveStageClos', five_stage_clos_layout);

})();