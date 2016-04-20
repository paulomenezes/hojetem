'use strict';

var React = require('react-native');
var moment = require('moment');
moment.locale('pt');

var Icon = require('react-native-vector-icons/Ionicons');

import InvertibleScrollView from 'react-native-invertible-scroll-view';

var Constants = require('../constants');

var Dimensions = require('Dimensions');
var Alert = require('../components/alert');

var user;
var interval;

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
	DeviceEventEmitter
} = React;

class Chat extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: '',
			user: props.data.user,
			friend: props.data.friend,
			viewHeight: Dimensions.get('window').height,
			viewWidth: Dimensions.get('window').width,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			messages: []
		};

		user = require('../util/load.user').user[0];

		this.loadMessages();
		interval = setInterval(this.loadMessages.bind(this), 10000);
	}

	componentWillMount () {
		DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
		DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
	}

	componentWillUnmount() {
		DeviceEventEmitter.removeAllListeners('keyboardWillShow');
		DeviceEventEmitter.removeAllListeners('keyboardWillHide');

		clearInterval(interval);
	}

	keyboardWillShow (e) {
		var newSize = Dimensions.get('window').height - e.endCoordinates.height
		this.setState({
			viewHeight: newSize
		})
	}

	keyboardWillHide (e) {
		this.setState({
			viewHeight: Dimensions.get('window').height
		})
	}

	loadMessages() {
		fetch(Constants.URL + 'chat/' + this.state.friend.id)
			.then((response) => response.json())
			.then((chat) => {
				chat = chat.reverse();
				chat.reverse();

				var chatIds = chat.map((row, index) => index).reverse();

				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(chat, chatIds),
					messages: chat
				});
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
			});
	}

	sendMessage() {
		if (this.state.text.length > 0) {
			var message = {
				idchat: this.state.friend.id,
				iduser: user.id,
				text: this.state.text
			};

			var props = this.props;
			var data = this.state.messages;

			fetch(Constants.URL + 'chat', {
					method: "POST",
		    		body: JSON.stringify(message),
		    		headers: Constants.HEADERS
				})
				.then((response) => response.json())
				.then((msg) => {
					message.id = msg.id;

					data.push(message);

					var dataIds = data.map((row, index) => index).reverse();

					this.setState({
						text: '',
						dataSource: this.state.dataSource.cloneWithRows(data, dataIds),
						messages: data
					});
				})
				.catch((error) => {
		    		Alert('Error', 'Houve um error ao se conectar ao servidor');
		    	});
		}
	}

	renderMessages(row) {
		var date = row.date ? moment(row.date, "YYYY-MM-DD HH:mm:ss").fromNow() : 'agora';

		return (
			<View>
				<View style={[ row.iduser != user.id && styles.chatbox, row.iduser == user.id && styles.chatbox2 ]}>
					<View style={ styles.texts }>
						<Text style={[ row.iduser == user.id && styles.text ]}>{ row.text }</Text>
					</View>
				</View>
				<Text style={[ row.iduser != user.id && styles.date1, row.iduser == user.id && styles.date2 ]}>{ date }</Text>
			</View>
		);
	}

	setText(text) {
		this.setState({
			text: text
		});
	}

	render() {
		var width = this.state.viewWidth - 50;
		var height = this.state.viewHeight - 64;

		return (
			<View style={{ height: height, flexDirection: 'column' }}>
				<ListView 
					renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
					style={{ marginBottom: 45, paddingTop: 10 }}
					dataSource={ this.state.dataSource }
					renderRow={ this.renderMessages.bind(this) } />

				<View style={ styles.type }>
					<TextInput
						placeholder="Digite sua mensagem..."
						style={[ styles.input, { width: width }]}
						onChangeText={(text) => this.setText(text) }
						onSubmitEditing={ this.sendMessage.bind(this) }
						value={ this.state.text } />
					<TouchableOpacity style={ styles.send } onPress={ this.sendMessage.bind(this) }>
						<Icon name="android-send" size={20} color="#d6013b" style={ styles.icon } />
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	type: {
		backgroundColor: '#d6013b',
		padding: 5,
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0
	},
	input: {
		height: 35,
	},
	send: {
		backgroundColor: '#fff',
		width: 30,
		height: 30,
		borderRadius: 15,
		marginLeft: 5,
		marginTop: 2
	},
	icon: {
		backgroundColor: 'transparent',
		marginTop: 5,
		marginLeft: 8
	},
	chatbox: {
		padding: 10,
		backgroundColor: '#dfdfdf',
		borderRadius: 5,
		margin: 10,
		marginBottom: 0,
		alignSelf: 'flex-start',
		flex: 1,
		flexWrap: 'wrap'
	},
	chatbox2: {
		padding: 10,
		backgroundColor: '#d6013b',
		borderRadius: 5,
		margin: 10,
		marginBottom: 0,
		alignSelf: 'flex-end'
	},
	text: {
		color: '#fff'
	},
	date1: {
		textAlign: 'left',
		marginLeft: 10,
		fontSize: 12
	},
	date2: {
		textAlign: 'right',
		marginRight: 10,
		fontSize: 12
	}
});

module.exports = Chat;
