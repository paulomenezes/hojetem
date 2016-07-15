'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Communications = require('react-native-communications');

const {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
	TouchableHighlight,
	ListView,
	Image,
	AlertIOS,
	ActivityIndicatorIOS,
	ScrollView,
	IntentAndroid
} = React;

class Contact extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<Image style={ styles.image } source={ require('../images/logo.png') } />

				<Text style={ styles.text }>Cadastre seu evento aqui</Text>
				<Text style={ styles.text }>nosso e-mail: sac@apphojetem.com</Text>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#383838',
	},
	image: {
		marginTop: 50,
		marginBottom: 80,
		width: 150,
		height: 150,
		resizeMode: "stretch"
	},
	text: {
		color: '#FFF'
	},
	text2: {
		color: '#FFF',
		marginBottom: 20
	}
});

module.exports = Contact;