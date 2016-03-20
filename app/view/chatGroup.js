'use strict';

var React = require('react-native');
var moment = require('moment');
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

class ChatGroup extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			text: '',
			room: props.data,
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
		DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
		DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));

		console.log('mount');
	}

	componentWillUnmount() {
		DeviceEventEmitter.removeAllListeners('keyboardWillShow');
		DeviceEventEmitter.removeAllListeners('keyboardWillHide');

		console.log('unmount');

		clearInterval(interval);
	}

	keyboardWillShow (e) {
		var newSize = Dimensions.get('window').height - e.endCoordinates.height
		this.setState({
			viewHeight: newSize
		});

		console.log('newSize: ' + newSize);
	}

	keyboardWillHide (e) {
		this.setState({
			viewHeight: Dimensions.get('window').height
		});

		console.log('newSize: old');
	}

	loadMessages() {
		fetch(Constants.URL + 'chat/room/' + this.state.room)
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
				idroom: this.state.room,
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
		var image = row.image ? 
						(row.image.indexOf('http') >= 0 ? { uri: row.image } : { uri: Constants.IMAGE + row.image }) : require('../images/logoSquare.png');

		var bigText = row.text && row.text.length > 40 ? true : false; 

		if (row.iduser != user.id) {
			return (
				<View>
					<View style={ styles.container }>
						<Image style={ styles.image } source={ image} />
						<View style={[ styles.chatbox, bigText && styles.bigText ]}>
							<View style={ styles.texts }>
								<Text style={[ row.iduser == user.id && styles.text ]}>{ row.text }</Text>
							</View>
						</View>
					</View>
					<Text style={[ row.iduser != user.id && styles.date1, row.iduser == user.id && styles.date2 ]}>{ date }</Text>
				</View>
			);
		} else {
			return (
				<View>
					<View>
						<View style={[ styles.chatbox2, bigText && styles.bigText ]}>
							<View style={ styles.texts }>
								<Text style={[ row.iduser == user.id && styles.text ]}>{ row.text }</Text>
							</View>
						</View>
					</View>
					<Text style={[ row.iduser != user.id && styles.date1, row.iduser == user.id && styles.date2 ]}>{ date }</Text>
				</View>
			);
		}
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
						onChangeText={(text) => this.setState({text: text})}
						onSubmitEditing={ this.sendMessage.bind(this) }
						value={ this.state.text } />
					<TouchableOpacity style={ styles.send } onPress={ this.sendMessage.bind(this) }>
						<Icon name="android-send" size={20} color="#03a9f4" style={ styles.icon } />
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	type: {
		backgroundColor: '#03a9f4',
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
		marginLeft: 0,
		alignSelf: 'flex-start',
		flexWrap: 'wrap'
	},
	chatbox2: {
		padding: 10,
		backgroundColor: '#03a9f4',
		borderRadius: 5,
		margin: 10,
		marginBottom: 0,
		alignSelf: 'flex-end'
	}, 
	bigText: {
		flex: 1,
	},
	container: {
		flex: 1,
		flexDirection: 'row'
	},
	image: {
		width: 36,
		height: 36,
		margin: 10,
		marginBottom: 0,
		borderRadius: 18
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

module.exports = ChatGroup;
