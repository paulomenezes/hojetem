var React = require('react-native');	
var SimpleAlert = require('react-native-simpledialog-android');

const {
	AlertIOS,
	Platform
} = React;

var Alert = function (title, message) {
	if (Platform.OS == 'ios') {
		AlertIOS.alert(title, message);
	} else {
		SimpleAlert.alert(title, message);
	}
}

module.exports = Alert;