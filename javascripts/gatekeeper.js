
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
  return


  $.post('login', {
      login: login,
      password: password
    },
    function (result) {

    }, "json")
  .fail(function (err) {
    console.error(err.responseJSON);
    failure(err.responseJSON.error);
  });
}
