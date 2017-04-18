var reactStore = require('react-native-store');

var _user = null;
var _userModel = null;

var loadUser = function (callback) {
	if (_user) {
		callback(_user, _userModel);
	} else {
		reactStore.model("activeUser").then(function (userModel) {
			userModel.find().then(function (user) {
				_user = user;
				_userModel = userModel;

				module.exports.user = user;
				module.exports.userModel = userModel;

				callback(user, userModel);
			});
		});
	}
}

var logout = function () {
	_user = null;
	_userModel = null;
}

var update = function (user) {
	_user = user;
	module.exports.user = [user];
}

var login = function (user) {
	_user = [user];
	module.exports.user = _user;
	reactStore.model("activeUser").then(function (userModel) {
		_userModel = userModel;
	});
}

module.exports = loadUser;
module.exports.logout = logout;
module.exports.login = login;
module.exports.update = update;