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
var More = require('../view/more');
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
		/*this.props.toRoute({
			name: 'Busca',
			component: SearchPage,
			rightCorner: NoneButton
		});*/
	},
	openUser() {
		this.props.toRoute({
			name: 'Seu perfil',
			component: More,
			rightCorner: NoneButton,
			data: this.props
		});

		/*<TouchableOpacity onPress={this.openSearch}>
					<Icon name="ios-settings" color="#fff" size={25} style={styles.backButton} />
				</TouchableOpacity>*/
	},
	render() {
		return (
			<View style={{ flexDirection: 'row', marginTop: 4 }}>
				
				<TouchableOpacity onPress={this.openUser}>
					<Icon name="person" color="#fff" size={25} style={styles.backButton} />
				</TouchableOpacity>
			</View>
		)
	}
});

module.exports = Search;