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
			<View style={{ flex: 1 }}>
				<View style={ styles.btn }>
					<Icon.Button name="ios-telephone" backgroundColor="#d6013b" onPress={() => Communications.phonecall('1532615686', true) }>
						(15) 3261-5686
					</Icon.Button>
				</View>

				<View style={ styles.btn }>
					<Icon.Button name="social-facebook" backgroundColor="#d6013b" onPress={() => IntentAndroid.openURL('https://www.facebook.com/Achowpag') }>
						Página do Facebook
					</Icon.Button>
				</View>

				<View style={ styles.btn }>
					<Icon.Button name="social-facebook-outline" backgroundColor="#d6013b" onPress={() => IntentAndroid.openURL('https://www.facebook.com/groups/1655880931318136') }>
						Grupo do Facebook
					</Icon.Button>
				</View>

				<View style={ styles.btn }>
					<Icon.Button name="social-instagram-outline" backgroundColor="#d6013b" onPress={() => IntentAndroid.openURL('https://instagram.com/achowapp/') }>
						Instagram
					</Icon.Button>
				</View>

				<View style={ styles.btn }>
					<Icon.Button name="social-twitter" backgroundColor="#d6013b" onPress={() => IntentAndroid.openURL('https://twitter.com/achowapp/') }>
						Twitter
					</Icon.Button>
				</View>

				<View style={ styles.btn }>
					<Icon.Button name="ios-email" backgroundColor="#d6013b" onPress={() => IntentAndroid.openURL('mailto:contato@achow.com.br') }>
						contato@achow.com.br
					</Icon.Button>
				</View>

				<View style={ styles.btn }>
					<Icon.Button name="social-whatsapp" backgroundColor="#d6013b">
						(15) 99763-6965
					</Icon.Button>
				</View>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	btn: {
		margin: 10,
		marginBottom: 0
	}
});

module.exports = Contact;