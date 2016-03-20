var React = require('react-native');	

const {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
	TouchableHighlight,
} = React;

var Icon = require('react-native-vector-icons/Ionicons');

var styles = StyleSheet.create({
	backButton: {
		width: 21,
		height: 21,
		marginTop: 3,
		marginRight: 15
	}
});

var NoneButton = React.createClass({
	openSearch() {
		
	},
	render() {
		return (
			<View></View>
		)
	}
});

module.exports = NoneButton;