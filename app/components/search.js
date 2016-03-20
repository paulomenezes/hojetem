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

var SearchPage = require('../view/search');
var NoneButton = require('./noneButton');

var styles = StyleSheet.create({
	backButton: {
		width: 21,
		height: 21,
		marginTop: 3,
		marginRight: 15
	}
});

var Search = React.createClass({
	openSearch() {
		this.props.toRoute({
			name: 'Busca',
			component: SearchPage,
			rightCorner: NoneButton
		});
	},
	render() {
		return (
			<TouchableOpacity onPress={this.openSearch}>
				<Icon name="ios-search" color="#fff" size={25} style={styles.backButton} />
			</TouchableOpacity>
		)
	}
});

module.exports = Search;