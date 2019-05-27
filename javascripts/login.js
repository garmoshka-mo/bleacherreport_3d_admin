$('#auth-form').submit(function (event) {
  event.preventDefault();
  $('#error').hide();
  $('#enter').hide();
  $('#info').show();

  authenticate(
    $('#login').val(), $('#password').val(),
    onLoginSuccess, showError
  )
})

function onLoginSuccess() {
  isAuthenticated = true
  showMenu()
}

function logout() {
  isAuthenticated = false
  TWEEN.removeAll()
  removeMenu()
  $('#auth-form').show()
  $('#enter').show()
}

function showError(err) {
  $('#info').hide();
  $('#enter').show();
  $('#error').text(err).show();
}


function listAdminPanels(callback) {
  Object.keys(adminPanelsList)
    .forEach(function (key) {
      callback(key, adminPanelsList[key]);
    });
}

function authenticate(login, password, success, failure) {
  adminPanelsList = {
    "AllowDesktopTagAdmin": {
      "url": "https://desktoptagadmin.{ENVIRONMENT_DOMAIN}/",
      "name": "Desktop Tag Admin",
      "icon": "desktop"
    },
    "AllowKeyboardAdmin": {
      "url": "https://keyboard.{ENVIRONMENT_DOMAIN}/admin",
      "name": "Keyboard Admin",
      "icon": "smile-o"
    },
    "AllowScoresAdmin": {
      "url": "https://scoresadmin.{ENVIRONMENT_DOMAIN}/",
      "name": "Scores Admin",
      "icon": "trophy"
    },
    "AllowMobileTagAdmin": {
      "url": "https://mobiletagadmin.{ENVIRONMENT_DOMAIN}/",
      "name": "Mobile Tag Admin",
      "icon": "mobile"
    },
    "AllowPermissionsAdmin": {
      "url": "https://permissions.{ENVIRONMENT_DOMAIN}/",
      "name": "Permissions Admin",
      "icon": "key"
    }
  }
  success()
}
