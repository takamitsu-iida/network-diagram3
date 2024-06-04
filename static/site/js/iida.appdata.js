/* global iida */

(function () {

  // public function to get cytoscape.js elements
  iida.appdata.get_elements = function (clos_clusters) {
    if (!clos_clusters) {
      clos_clusters = iida.appdata.clos_clusters_1;
    }
    return create_elements(clos_clusters);
  };

  // example 1
  iida.appdata.clos_clusters_1 = [
    {
      cluster_id: 1,
      num_tier3: 5
    }
  ];

  // example 2
  iida.appdata.clos_clusters_2 = [
    {
      cluster_id: 1,
      num_tier3: 5
    },
    {
      cluster_id: 2,
      num_tier3: 5
    }
  ];

  // example 3
  iida.appdata.clos_clusters_3 = [
    {
      cluster_id: 1,
      num_tier3: 5
    },
    {
      cluster_id: 2,
      num_tier3: 5
    },
    {
      cluster_id: 3,
      num_tier3: 5
    }
  ];

  let DEFAULT_NODE_WIDTH = 60;
  let DEFAULT_NODE_HEIGHT = 40;
  let DEFAULT_PORT_WIDTH = 10;
  let DEFAULT_PORT_HEIGHT = 10;

  let DEFAULT_NUM_TIER1 = 4;

  function create_port(id) {
    // common parameters for router and port
    let _id = id;
    let _label = '';
    let _position = { x: 0, y: 0 };
    let _classes = ['port'];
    let _width = DEFAULT_PORT_WIDTH;
    let _height = DEFAULT_PORT_HEIGHT;
    let _grabbable = false;  // only router is grabbable
    let _drag_with = [];
    let _redundant_id = 0;

    // for port only parameters
    let _router_id = undefined;
    let _offset_x = 0;
    let _offset_y = 0;

    // return this object
    let exports = function () {
      return this;
    };

    exports.get_cy_element = function () {
      let d = {};

      d['id'] = _id;
      d['label'] = _label;
      d['width'] = _width;
      d['height'] = _height;
      d['drag_with'] = _drag_with;
      d['initial_position'] = Object.assign({}, _position);  // store initial position to revert to preset position

      d['router_id'] = _router_id;
      d['offset_x'] = _offset_x;
      d['offset_y'] = _offset_y;
      d['redundant_id'] = _redundant_id;

      return {
        'group': "nodes",
        'data': d,
        'position': _position,
        'classes': _classes,
        'grabbable': _grabbable
      };
    }

    exports.id = function (_) {
      if (!arguments.length) { return _id; }
      _id = _;
      return this;
    };

    exports.label = function (_) {
      if (!arguments.length) { return _label; }
      _label = _;
      return this;
    };

    exports.position = function (_) {
      if (!arguments.length) { return _position; }
      _position = _;
      return this;
    };

    exports.width = function (_) {
      if (!arguments.length) { return _width; }
      _width = _;
      return this;
    };

    exports.height = function (_) {
      if (!arguments.length) { return _height; }
      _height = _;
      return this;
    };

    exports.classes = function (_) {
      if (!arguments.length) { return _classes; }
      if (!_) {
        return this;
      }
      if (typeof (_) === 'string') {
        _ = _.split(",");
      }
      Array.prototype.push.apply(_classes, _);
      _classes = _classes.filter((elem, index, self) => self.indexOf(elem) === index);
      return this;
    };

    exports.router_id = function (_) {
      if (!arguments.length) { return _router_id; }
      _router_id = _;
      return this;
    };

    exports.offset_x = function (_) {
      if (!arguments.length) { return _offset_x; }
      _offset_x = _;
      return this;
    }

    exports.offset_y = function (_) {
      if (!arguments.length) { return _offset_y; }
      _offset_y = _;
      return this;
    }

    exports.redundant_id = function (_) {
      if (!arguments.length) { return _redundant_id; }
      _redundant_id = _;
      return this;
    }

    return exports;
  }


  function create_router(id) {

    let _id = id;
    let _label = id;
    let _position = { x: 0, y: 0 };
    let _classes = ['router'];
    let _width = DEFAULT_NODE_WIDTH;
    let _height = DEFAULT_NODE_HEIGHT;
    let _grabbable = true;  // only router is grabbable
    let _drag_with = [];
    let _parent = undefined;
    let _uplink_port_ids = [];
    let _downlink_port_ids = [];

    let _ports = [];
    let _edges = [];

    // clos parameters
    let _tier = 1; // 1: tier1, 2: tier2, 3: tier3
    let _redundant_id = -1;
    let _cluster_id = 0;

    // return object
    let exports = function () {
      return this;
    };

    // cytoscape.js element data
    exports.get_cy_element = function () {
      let d = {};

      d['id'] = _id;
      d['label'] = _label;
      d['width'] = _width;
      d['height'] = _height;
      d['drag_with'] = _drag_with;
      d['initial_position'] = Object.assign({}, _position);  // store initial position to revert to preset position
      d['cluster_id'] = _cluster_id;  // cluster id for tier2 and tier3 routers
      d['tier'] = _tier;
      d['redundant_id'] = _redundant_id;
      d['uplink_port_ids'] = _uplink_port_ids;
      d['downlink_port_ids'] = _downlink_port_ids;

      if (_parent) {
        d['parent'] = _parent;
      }

      return {
        group: 'nodes',
        data: d,
        position: _position,
        classes: _classes,
        grabbable: _grabbable
      };
    }

    exports.id = function (_) {
      if (!arguments.length) { return _id; }
      _id = _;
      return this;
    };

    exports.label = function (_) {
      if (!arguments.length) { return _label; }
      _label = _;
      return this;
    };

    exports.position = function (_) {
      if (!arguments.length) { return _position; }
      _position = _;
      return this;
    };

    exports.width = function (_) {
      if (!arguments.length) { return _width; }
      _width = _;
      return this;
    };

    exports.height = function (_) {
      if (!arguments.length) { return _height; }
      _height = _;
      return this;
    };

    exports.classes = function (_) {
      if (!arguments.length) { return _classes; }
      if (!_) {
        return this;
      }
      if (typeof (_) === 'string') {
        _ = _.split(",");
      }
      Array.prototype.push.apply(_classes, _);
      _classes = _classes.filter((elem, index, self) => self.indexOf(elem) === index);
      return this;
    };

    exports.parent = function (_) {
      if (!arguments.length) { return _parent; }
      _parent = _;
      return this;
    };

    exports.drag_with = function (_) {
      if (!arguments.length) { return _drag_with; }
      _drag_with = typeof (_) === "string" ? [_] : _;
      return this;
    };

    exports.tier = function (_) {
      if (!arguments.length) { return _tier; }
      _tier = _;
      return this;
    }

    exports.redundant_id = function (_) {
      if (!arguments.length) { return _redundant_id; }
      _redundant_id = _;
      return this;
    }

    exports.cluster_id = function (_) {
      if (!arguments.length) { return _cluster_id; }
      _cluster_id = _;
      return this;
    }

    exports.add_uplink_port_id = function (port_id) {
      if (_tier === 3) {
        _uplink_port_ids.unshift(port_id);
      } else {
        _uplink_port_ids.push(port_id);
      }
    }

    exports.add_downlink_port_id = function (port_id) {
      if (_tier === 2) {
        _downlink_port_ids.unshift(port_id);
      } else {
        _downlink_port_ids.push(port_id);
      }
    }

    exports.get_ports = function () {
      return _ports;
    }

    exports.get_edges = function () {
      return _edges;
    }

    exports.create_ports = function () {
      _uplink_port_ids.forEach((port_id, index) => {
        let port = create_port(port_id);
        port.router_id(_id);
        port.redundant_id(_redundant_id);
        if (_tier === 2) {
          port.offset_x(-1 * _width / 2 - DEFAULT_PORT_WIDTH / 2);
          port.offset_y(-1 * _height / 2 + DEFAULT_PORT_HEIGHT * (index + 1));
        }
        if (_tier === 3) {
          port.offset_x(-1 * _width / 2 + DEFAULT_PORT_WIDTH * (index + 1));
          port.offset_y(-1 * _height / 2 - DEFAULT_PORT_HEIGHT / 2);
        }
        _ports.push(port);

        let edge = create_edge(_id + '-' + port_id);
        edge.source(_id);
        edge.target(port_id);
        edge.classes('router-port');
        _edges.push(edge);

      });

      _downlink_port_ids.forEach((port_id, index) => {
        let port = create_port(port_id);
        port.router_id(_id);
        port.redundant_id(_redundant_id);
        if (_tier === 1) {
          port.offset_x(_width / 2 + DEFAULT_PORT_WIDTH / 2);
          port.offset_y(-1 * _height / 2 + DEFAULT_PORT_HEIGHT * (index + 1));
        }
        if (_tier === 2) {
          port.offset_x(_width / 2 + DEFAULT_PORT_WIDTH / 2);
          port.offset_y(-1 * _height / 2 + DEFAULT_PORT_HEIGHT * (index + 1));
        }
        _ports.push(port);

        let edge = create_edge(_id + '-' + port_id);
        edge.source(_id);
        edge.target(port_id);
        edge.classes('router-port');
        _edges.push(edge);

      });
      return _ports;
    }

    return exports;
  }


  function create_edge(id) {
    let _id = id;
    let _source;
    let _target;
    let _weight = 1;
    let _label = "";
    let _classes = ['autorotate'];
    let _redundant_id = 0;

    function exports() {
      return this;
    }

    exports.get_cy_element = function () {
      return {
        group: 'edges',
        data: {
          id: _id,
          source: _source,
          target: _target,
          weight: _weight,
          label: _label,
          redundant_id: _redundant_id
        },
        classes: _classes
      }
    };

    exports.id = function (_) {
      if (!arguments.length) { return _id; }
      _id = _;
      return this;
    };

    exports.source = function (_) {
      if (!arguments.length) {
        return _source;
      }
      _source = _;
      return this;
    };

    exports.target = function (_) {
      if (!arguments.length) {
        return _target;
      }
      _target = _;
      return this;
    };

    exports.label = function (_) {
      if (!arguments.length) {
        return _label;
      }
      _label = _;
      return this;
    };

    exports.weight = function (_) {
      if (!arguments.length) {
        return _weight;
      }
      _weight = _;
      return this;
    };

    exports.classes = function (_) {
      if (!arguments.length) {
        return _classes;
      }
      if (!_) {
        return this;
      }
      if (typeof (_) === 'string') {
        _ = _.split(",");
      }
      Array.prototype.push.apply(_classes, _);
      _classes = _classes.filter((elem, index, self) => self.indexOf(elem) === index);
      return this;
    };

    exports.redundant_id = function (_) {
      if (!arguments.length) {
        return _redundant_id;
      }
      _redundant_id = _;
      return this;
    }

    return exports;
  }


  function create_tier1_routers() {
    let routers = [];
    let router_ids = [];
    for (let i = 0; i < DEFAULT_NUM_TIER1; i++) {
      let router_id = 'tier1_' + i;
      router_ids.push(router_id);

      let router = create_router(router_id);
      router.label('tier 1\nT1R' + i);
      router.width(DEFAULT_NODE_WIDTH);
      router.height(DEFAULT_NODE_HEIGHT);
      router.classes('tier1')
      router.tier(1);
      router.redundant_id(Math.floor(i / 2));

      routers.push(router);
    }

    // drag with all tier1 routers
    routers.forEach(r => {
      r.drag_with(router_ids);
    });

    return routers;
  }

  function create_tier2_routers(cluster_id) {
    let routers = [];
    let router_ids = [];
    for (let i = 0; i < 2; i++) {
      let router_id = 'cluster_' + cluster_id + '_' + 'tier2_' + i;
      router_ids.push(router_id);

      let router = create_router(router_id);
      router.width(DEFAULT_NODE_WIDTH);
      router.height(DEFAULT_NODE_HEIGHT);
      router.label('cluster ' + cluster_id + '\ntier 2\n' + 'C' + cluster_id + 'T2R' + i);
      router.classes('tier2');
      router.cluster_id(cluster_id);
      router.tier(2);
      router.redundant_id(Math.floor(i % 2));
      router.parent('cluster_' + cluster_id);

      routers.push(router);
    }

    // drag with all tier2 routers in the cluster
    routers.forEach(r => {
      r.drag_with(router_ids);
    });

    return routers;
  }

  function create_tier3_routers(cluster_id, num_tier3) {
    let routers = [];
    let router_ids = [];
    for (let i = 0; i < num_tier3; i++) {
      let router_id = 'cluster_' + cluster_id + '_' + 'tier3_' + i;
      router_ids.push(router_id);

      let router = create_router(router_id);
      router.width(DEFAULT_NODE_WIDTH);
      router.height(DEFAULT_NODE_HEIGHT);
      router.label('cluster ' + cluster_id + '\ntier 3\n' + 'C' + cluster_id + 'T3R' + i);
      router.classes('tier3');
      router.cluster_id(cluster_id);
      router.tier(3);
      router.parent('cluster_' + cluster_id);

      routers.push(router);
    }

    routers.forEach(r => {
      r.drag_with(router_ids);
    });

    return routers;
  }

  function create_tier1_tier2_edges(tier1_routers, tier2_routers) {
    let edges = [];
    tier2_routers.forEach(t2 => {
      let redundant_id = t2.redundant_id();
      let tier1_targets = tier1_routers.filter(r => r.redundant_id() === redundant_id);
      tier1_targets.forEach(t1 => {
        let t1_port_id = t1.id() + '-' + t2.id();
        let t2_port_id = t2.id() + '-' + t1.id();
        t1.add_downlink_port_id(t1_port_id);
        t2.add_uplink_port_id(t2_port_id);
        let edge = create_edge(t1_port_id + '-' + t2_port_id);
        edge.source(t1_port_id);
        edge.target(t2_port_id);
        edge.redundant_id(redundant_id);
        edges.push(edge);
      });
    });

    return edges;
  }

  function create_tier2_tier3_edges(tier2_routers, tier3_routers) {
    let edges = [];
    tier3_routers.forEach(t3 => {
      tier2_routers.forEach(t2 => {
        let t2_port_id = t2.id() + '-' + t3.id();
        let t3_port_id = t3.id() + '-' + t2.id();
        t2.add_downlink_port_id(t2_port_id);
        t3.add_uplink_port_id(t3_port_id);
        let edge = create_edge(t2_port_id + '-' + t3_port_id);
        edge.source(t2_port_id);
        edge.target(t3_port_id);
        edge.redundant_id(t2.redundant_id());
        edge.classes('tier2-tier3');
        edges.push(edge);
      });
    });

    return edges;
  }


  function create_cluster_cy_element(cluster_id) {
    return {
      group: "nodes",
      data: {
        id: 'cluster_' + cluster_id,
      },
      classes: ['cluster']
    }
  }


  // create cytoscape.js elements
  function create_elements(clos_clusters) {

    // array to store cytoscape.js elements
    let eles = []

    // create tier1 routers
    let tier1_routers = [];
    if (clos_clusters.length > 1) {
      tier1_routers = create_tier1_routers();
    }

    // store cytoscape.js elements
    tier1_routers.forEach(r => {
      eles.push(r.get_cy_element());
    });

    // create clusters
    clos_clusters.forEach((cluster, cluster_index) => {
      let cluster_id = cluster.cluster_id || cluster_index;

      // create cluster element and store it
      eles.push(create_cluster_cy_element(cluster_id));

      // create tier2 routers in the cluster
      let tier2_routers = create_tier2_routers(cluster_id);

      // adjust router height
      let num_tier3 = cluster.num_tier3 || 0;
      let tier2_router_height = DEFAULT_PORT_HEIGHT * (num_tier3 + 2);
      tier2_routers.forEach(r => {
        r.height(tier2_router_height);
      });

      // store cytoscape.js elements
      tier2_routers.forEach(r => {
        eles.push(r.get_cy_element());
      });

      let tier1_tier2_edges = create_tier1_tier2_edges(tier1_routers, tier2_routers);
      tier1_tier2_edges.forEach(e => {
        eles.push(e.get_cy_element());
      });

      // create tier3 routers in the cluster
      let tier3_routers = create_tier3_routers(cluster_id, num_tier3);

      tier3_routers.forEach(r => {
        eles.push(r.get_cy_element());
      });

      let tier2_tier3_edges = create_tier2_tier3_edges(tier2_routers, tier3_routers);
      tier2_tier3_edges.forEach(e => {
        eles.push(e.get_cy_element());
      });

      tier2_routers.forEach(r => {
        r.create_ports();
        r.get_ports().forEach(p => {
          eles.push(p.get_cy_element());
        });
        r.get_edges().forEach(e => {
          eles.push(e.get_cy_element());
        });
      });

      tier3_routers.forEach(r => {
        r.create_ports();
        r.get_ports().forEach(p => {
          eles.push(p.get_cy_element());
        });
        r.get_edges().forEach(e => {
          eles.push(e.get_cy_element());
        });
      });

      tier1_routers.forEach(r => {
        r.create_ports();
        r.get_ports().forEach(p => {
          eles.push(p.get_cy_element());
        });
        r.get_edges().forEach(e => {
          eles.push(e.get_cy_element());
        });
      });

    });

    return eles;
  };

})();
