'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper');

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
import { SegmentedControls } from 'react-native-radio-buttons';

var utf8 = require('utf8');

var Constants = require('../constants');
var Alert = require('../components/alert');
var user;

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
	TextInput,
	AlertIOS,
	Switch,
	Platform
} = React;

class Checkin extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			text: '',
			user: props.data.user,
			store: props.data.store,
			image: null,
			change: false,
			newImage: null,
			share: 'Não Compartilhar no Facebook'
		};
	}

	sendMeeting() {
		if (this.state.text.length > 0) {
			var checkinSend = {
				idAccount: this.state.user.id,
				idStore: this.state.store.id,
				message: this.state.text,
				image: this.state.change ? this.state.image : false,
				change: this.state.change
			};

			var props = this.props;
			var stats = this.state;

			fetch(Constants.URL + 'stores/checkin', {
				method: "POST",
	    		body: JSON.stringify(checkinSend),
	    		headers: Constants.HEADERS
			})
			.then((response) => response.json())
			.then((checkin) => {
				if (stats.share == 'Compartilhar no Facebook') {
	 				fetch('https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=737958636263870&client_secret=8f007d3772ce0479479f70722c04bef7')
					.then((response) => response.text())
					.then((accessToken) => {
						console.log('TOKEN SUCCESS', accessToken);
						if (accessToken.indexOf('access_token') >= 0) {
							var token = accessToken.substr(13);

							fetch('https://graph.facebook.com/' + this.state.user.facebookID + '/feed?message=' + checkinSend.message + '&access_token=' + token, {
								method: 'POST',
								body: null
							})
							.then((response) => response.json())
							.then((checkin) => {
								console.log('POST SUCCESS', checkin);
							})
							.catch((error) => {
								console.log('POST ERROR::');
								console.log(error);
					    	});
						}
					})
					.catch((error) => {
						console.log('TOKEN ERROR', error);
			    	});
				}

				console.log('CHECKIN SUCCESS', checkin);
				Alert('Check-in', 'Check-in compartilhado.');
				props.toBack();
			})
			.catch((error) => {
				console.log('CHECKIN', error);
	    		Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
		} else {
			Alert('Check-in', 'Digite uma mensagem.');
		}
	}

	setSegment(value) {
		this.setState({ 
			share: value 
		});
	}

	render() {
		var image = this.state.change ? this.state.newImage : false;

		/*<View style={{ margin: 10 }}>
					<SegmentedControls
						tint="#d6013b"
						options={[ 'Compartilhar no Facebook', 'Não compartilhar' ]}
						onSelection={ this.setSegment.bind(this) }
						selectedOption={ this.state.share } />
				</View>*/

		return (
			<View style={{ flex: 1, backgroundColor: '#383838' }}>
				<Text style={ styles.title }>O que você está fazendo?</Text>

				<TextInput
					autoFocus={ true }
					multiline={ true }
				    style={ styles.textArea }
				    onChangeText={(text) => this.setState({text})}
				    value={this.state.text} />

				

				<View style={ styles.buttonArea }>
					<Icon.Button name="android-share-alt" backgroundColor="#d6013b" onPress={this.sendMeeting.bind(this)}>
						<Text style={ styles.sendButton }>Compartilhar com seus amigos</Text>
					</Icon.Button>
				</View>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	title: {
		fontSize: 18,
		margin: 10,
		color: '#FFF'
	},
	textArea: {
		height: 100, 
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 2,
		margin: 10,
		marginTop: 0,
		padding: 5,
		color: '#FFF'
	},
	buttonArea: {
		margin: 10,
		marginTop: 0
	},
	sendButton: {
		color: '#FFF'
	},
	selected: {
		borderWidth: 1,
		borderColor: '#d6013b',
	},
	item: {
		flex: 1,
		flexDirection: 'row'
	},
	profileArea: {
		flex: 1,
		alignItems: 'stretch'
	},
	image: {
		flex: 1,
		margin: 10,
		marginTop: 0
	},
	text: {
		flex: 1,
		padding: 10,
		paddingTop: 12,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	name: {
		fontSize: 16
	},
	nameSelected: {
		color: '#d6013b',
		fontSize: 16
	}
});

module.exports = Checkin;
