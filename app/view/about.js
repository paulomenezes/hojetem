'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

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
	ScrollView
} = React;

class About extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<Image style={ styles.image } source={ require('../images/logo.png') } />

				<Text style={ styles.text }>Criado por Saulo Henrique Candido</Text>
				<Text style={ styles.text2 }>Contato: contato@achow.com.br</Text>

				<Text style={ styles.text }>Desenvolvido por Paulo Menezes</Text>
				<Text style={ styles.text }>Contato: paulo.hgmenezes@gmail.com</Text>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#03a9f4',
	},
	image: {
		marginTop: 50,
		marginBottom: 80,
		width: 300,
		height: 137,
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

module.exports = About;