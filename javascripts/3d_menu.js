if (isAuthenticated)
  showMenu()
else
  $('#auth-form').show()

var MENU_DURATION = 2000
var menuItems = []

function gotoPanel(id) {
  alert(`Panel ${id} isn't available in demo mode`)
}

function showMenu() {

  TWEEN.removeAll()

  drawMenuItems()

  new TWEEN.Tween( camera.position )
    .to( {x: camera.position.x - 500, z: 1500}, 2200)
    .easing( TWEEN.Easing.Sinusoidal.InOut )
    .start();

  new TWEEN.Tween( this )
    .to( {}, MENU_DURATION * 2 )
    .onUpdate( render )
    .start();

  $('#auth-form').hide();
  render();
}

function removeMenu() {
  menuItems.forEach((object) => {
    scene.remove(object)
  })

  var to = mode == 'grid' ?
    { x: 50, y: -50, z: 200 } :
    {x: camera.position.x + 500}

  new TWEEN.Tween( camera.position )
    .to(to, 1000)
    .easing( TWEEN.Easing.Sinusoidal.InOut )
    .start()

  new TWEEN.Tween( this )
    .to( {}, MENU_DURATION * 2 )
    .onUpdate( render )
    .start()
}

function drawMenuItems() {

  var yOffset = 300
  var transparency = 0.5;

  createMenuItem({
    id: 'logout',
    textContent: '[ logout ]',
    className: 'glow-box menu-item'
  }).onclick = logout
  yOffset -= 80;

  listAdminPanels(function (key, _props) {
    var name = key.replace( /([A-Z])/g, " $1" )
    createMenuItem({
      textContent: name,
      className: 'glow-box menu-item',
      href: '/goto/'+key+'/production'
    })
    yOffset -= 120
    transparency -= 0.08
  })

  function createMenuItem(attrs) {
    var element = document.createElement('a')
    element.style.backgroundColor = 'rgba(0,127,127,' + transparency + ')'
    $.extend(element, attrs)
    addToScene(element)
    return element
  }

  function addToScene(element) {
    var object = new THREE.CSS3DObject( element )
    object.position.z = 2000
    scene.add(object)
    menuItems.push(object)

    new TWEEN.Tween( object.position )
      .to( {x: authPanel3dTarget.position.x,
        y: authPanel3dTarget.position.y + yOffset,
        z: authPanel3dTarget.position.z},
        Math.random() * MENU_DURATION + MENU_DURATION / 2 )
      .easing( TWEEN.Easing.Exponential.Out )
      .start()

  }

}

