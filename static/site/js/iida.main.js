// define namespace `iida`
(function () {
  // the `this` means global
  // the `iida` is a object defined here
  this.iida = this.iida || (function () {

    // network diagram data locates under `appdata`
    let appdata = {};

    // this is the `iida` object
    return {
      'appdata': appdata
    };

  })();
})();


// define function iida.main()
(function () {
  iida.main = function () {

    //read json data via network
    /*
    Promise.all([
      fetch('static/json/topology.json', { mode: 'no-cors' })
        .then(function (res) {
          return res.json()
        }),
      fetch('static/json/style.json', { mode: 'no-cors' })
        .then(function (res) {
          return res.json()
        })
    ]).then(function (dataArray) {
      iida.appdata.topology = dataArray[0];
      iida.appdata.style = dataArray[1];
    });
    */

    // see iida.nwdiagram.js
    iida.nwdiagram();

  };
})();
