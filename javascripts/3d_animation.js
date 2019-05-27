//= require 'libs/three'
//= require 'libs/tween.min'
//= require 'libs/TrackballControls'
//= require 'libs/CSS3DRenderer'

var table = [
  "NFL", "Fermium", "(257)", 1, 1,
  "NBA", "Fermium", "(257)", 9, 6,
  "MLB", "Fermium", "(257)", 2, 6,
  "CFB", "Mendelevium", "(258)", 9, 2,
  "MMA", "Nobelium", "(259)", 3, 2,
  "WWE", "Rutherfordium", "(267)", 4, 7,
  "CBB", "Dubnium", "(268)", 5, 1,
  "CFL", "Seaborgium", "(271)", 6, 7,
  "Golf", "Bohrium", "(272)", 2, 3,
  "Soccer", "Hassium", "(270)", 3, 4,
  "WNBA", "Meitnerium", "(276)", 9, 7,
  "F1", "Darmstadium", "(281)", 10, 6,
  "Tennis", "Roentgenium", "(280)", 11, 4,
  $('#auth-form'), "Ununoctium", "(294)", 6, 4,
  "Boxing", "Copernicium", "(285)", 12, 6,
  "NHL", "Lawrencium", "(262)", 10, 1,
];

var authPanel3dObject, authPanel3dTarget;

var camera, scene, renderer, mode
var controls

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 2000;

  scene = new THREE.Scene();

  // table

  for ( var i = 0; i < table.length; i += 5 ) {

    var element = document.createElement( 'div' );
    element.className = 'element glow-box';


    var data = table[i];
    if (typeof data == 'string') {

      element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

      var number = document.createElement( 'div' );
      number.className = 'number';
      number.textContent = (i/5) + 1;
      element.appendChild( number );

      var symbol = document.createElement( 'div' );
      symbol.className = 'symbol';
      symbol.textContent = data;
      element.appendChild( symbol );

      var details = document.createElement( 'div' );
      details.className = 'details';
      details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
      element.appendChild( details );

    }
    else {

      element.style.backgroundColor = 'rgba(0,127,127,0.3)';
      element.className = 'glow-box control';
      $(element).append(data);

    }

    var object = new THREE.CSS3DObject( element );
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    scene.add( object );

    objects.push( object );

    // Target
    var targetObject = new THREE.Object3D();
    targetObject.position.x = ( table[ i + 3 ] * 140 ) - 830;
    targetObject.position.y = - ( table[ i + 4 ] * 180 ) + 700;

    targets.table.push( targetObject )

    if (typeof data !== 'string') {
      authPanel3dObject = object
      authPanel3dTarget = targetObject
    }

  }

  // sphere

  var vector = new THREE.Vector3();

  for ( var i = 0, l = objects.length; i < l; i ++ ) {

    var phi = Math.acos( -1 + ( 2 * i ) / l );
    var theta = Math.sqrt( l * Math.PI ) * phi;

    var object = new THREE.Object3D();

    object.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
    object.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
    object.position.z = 800 * Math.cos( phi );

    vector.copy( object.position ).multiplyScalar( 2 );

    object.lookAt( vector );

    targets.sphere.push( object );

  }

  // helix

  var vector = new THREE.Vector3();

  for ( var i = 0, l = objects.length; i < l; i ++ ) {

    var phi = i * 0.175 + Math.PI;

    var object = new THREE.Object3D();

    object.position.x = 900 * Math.sin( phi );
    object.position.y = - ( i * 8 ) + 450;
    object.position.z = 900 * Math.cos( phi );

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;

    object.lookAt( vector );

    targets.helix.push( object );

  }

  // grid

  var grid_size = 3;

  for ( var i = 0; i < objects.length; i ++ ) {

    var object = new THREE.Object3D();

    object.position.x = ( ( i % grid_size ) * 400 ) - 800;
    object.position.y = ( - ( Math.floor( i / grid_size ) % grid_size ) * 400 ) + 800;
    object.position.z = ( Math.floor( i / (grid_size * grid_size) ) ) * 1000 - 2000;

    targets.grid.push( object );

  }

  //

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.style.position = 'absolute';
  document.getElementById( 'container' ).appendChild( renderer.domElement );

  //

  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.rotateSpeed = 0.5;
  controls.minDistance = 300;
  controls.maxDistance = 6000;
  controls.addEventListener( 'change', render );

  var button = document.getElementById( 'table' );
  button.addEventListener( 'click', function ( event ) {
    mode = 'table'
    transform( targets.table, 2000, { x: 500, y: 500, z: 1500 } );

  }, false );

  button = document.getElementById( 'sphere' );
  button.addEventListener( 'click', sphere, false );
  function sphere() {
    mode = 'sphere'
    transform( targets.sphere, 2000, { x: 1500, y: 100, z: 1000 } )
  }
  sphere();

  button = document.getElementById( 'helix' );
  button.addEventListener( 'click', function ( event ) {
    mode = 'helix'
    transform( targets.helix, 2000, { x: 0, y: 1000, z: 3000 } );

  }, false );

  button = document.getElementById( 'grid' );
  button.addEventListener( 'click', function ( event ) {
    mode = 'grid'
    transform( targets.grid, 2000,
      isAuthenticated ?
        { x: -450, y: -50, z: 1500 } :
        { x: 50, y: -50, z: 200 }
    )

  }, false );


  window.addEventListener( 'resize', onWindowResize, false );

}

function transform( targets, duration, cameraPos ) {

  TWEEN.removeAll();

  for ( var i = 0; i < objects.length; i ++ ) {

    var object = objects[ i ];
    var target = targets[ i ];

    new TWEEN.Tween( object.position )
      .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();

    new TWEEN.Tween( object.rotation )
      .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();

  }

  new TWEEN.Tween( camera.position )
    .to( cameraPos, 3000)
    .easing( TWEEN.Easing.Sinusoidal.InOut )
    .start();


  new TWEEN.Tween( this )
    .to( {}, duration * 2 )
    .onUpdate( render )
    .start();

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}

function animate() {

  requestAnimationFrame( animate );

  TWEEN.update();

  controls.update();

}

function render() {

  renderer.render( scene, camera );

}

