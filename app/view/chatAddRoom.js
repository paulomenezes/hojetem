'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper')

var utf8 = require('utf8');

var Constants = require('../constants');
var Alert = require('../components/alert');
var user;

import { SegmentedControls } from 'react-native-radio-buttons';

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
	Switch
} = React;

class ChatAddRoom extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			text: '',
			option: 'Pública',
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			data: []
		};

		user = require('../util/load.user').user[0];

		this.loadFriends();
	}

	setSegment(value) {
		this.setState({ 
			option: value 
		});
	}

	loadFriends() {
		fetch(Constants.URL + 'users/' + user.id + '/friends2')
			.then((response) => response.json())
			.then((friends) => {
				for (var i = 0; i < friends.length; i++) {
					friends[i].selected = false;
				};

				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(friends),
					data: friends
				});
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	sendMeeting() {
		if (this.state.text.length > 0) {
			var users = [];
			var cnt = 0;
			for (var i = 0; i < this.state.data.length; i++) {
				if (this.state.data[i].selected) {
					users.push(this.state.data[i].id);
					cnt++;
				}
			};

			if (this.state.option == 'Privada') {
				if (cnt > 0) {
					var checkin = {
						idAccount: user.id,
						type: this.state.option,
						name: this.state.text,
						users: users
					};

					var props = this.props;

					fetch(Constants.URL + 'chat/room', {
						method: "POST",
			    		body: JSON.stringify(checkin),
			    		headers: Constants.HEADERS
					})
					.then((response) => response.json())
					.then((checkin) => {
						Alert('Criar Sala', 'Sala criada com sucesso.');
						props.toBack();
					})
					.catch((error) => {
			    		Alert('Error', 'Houve um error ao se conectar ao servidor');
			    	});
				} else {
					Alert('Criar Sala', 'Selecione pelo menos um amigo.');	
				}
			} else {
				var checkin = {
					idAccount: user.id,
					type: this.state.option,
					name: this.state.text,
					users: []
				};

				var props = this.props;

				fetch(Constants.URL + 'chat/room', {
					method: "POST",
		    		body: JSON.stringify(checkin),
		    		headers: Constants.HEADERS
				})
				.then((response) => response.json())
				.then((checkin) => {
					Alert('Criar Sala', 'Sala criada com sucesso.');
					props.toBack();
				})
				.catch((error) => {
		    		Alert('Error', 'Houve um error ao se conectar ao servidor');
		    	});
			}
		} else {
			Alert('Criar Sala', 'Digite o nome da sala.');
		}
	}

	selectFriend(friend) {
		var newData = [];
		newData = this.state.data.slice();

		var index = 0;
		for (var i = 0; i < this.state.data.length; i++) {
			if (this.state.data[i].id === friend.id) {
				index = i;
				break;
			}
		};

		newData[index] = {
			id: friend.id,
			image: friend.image,
			name: friend.name,
			selected: !friend.selected
		};

		var newDS = this.state.dataSource.cloneWithRows(newData);

		this.setState({
			dataSource: newDS,
			data: newData
		})
	}

	renderFriends(friend) {
		var image = friend.image.indexOf('http') >= 0 ? friend.image : Constants.IMAGE + friend.image;

		return (
			<TouchableOpacity onPress={() => { this.selectFriend(friend) }}>
				<View style={ styles.item }>
					<View>
						<Image style={ styles.image } source={{ uri: image }} />
						{ friend.selected ? 
						<View style={ styles.marked }>
							<Icon style={ styles.checkmark } name="checkmark" size={20} color="#fff" />
						</View>
						: <View /> }
					</View>
					<View style={ styles.text }>
						<Text style={ styles.name }>{ friend.name }</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<Text style={ styles.title }>Digite o nome da sua sala</Text>

				<TextInput
					autoFocus={ true }
				    style={ styles.textArea }
				    onChangeText={(text) => this.setState({text})}
				    value={this.state.text} />

				<View style={ styles.buttonArea }>
					<Icon.Button name="android-chat" backgroundColor="#03a9f4" onPress={this.sendMeeting.bind(this)}>
						<Text style={ styles.sendButton }>Criar sala</Text>
					</Icon.Button>
				</View>

				<View style={ styles.segmented }>
					<SegmentedControls
						tint="#03a9f4"
						options={[ 'Pública', 'Privada' ]}
						onSelection={ this.setSegment.bind(this) }
						selectedOption={ this.state.option } />
				</View>

				{ this.state.option == 'Privada' ?				
				<ListView 
					dataSource={ this.state.dataSource }
					renderRow={ this.renderFriends.bind(this) } />
				: <View /> }
			</View>
		);
	}
}

var styles = StyleSheet.create({
	title: {
		fontSize: 18,
		margin: 10
	},
	textArea: {
		height: 40, 
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 2,
		margin: 10,
		marginTop: 0,
		padding: 5
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
		borderColor: '#03a9f4',
	},
	item: {
		flex: 1,
		flexDirection: 'row'
	},
	image: {
		width: 50,
		height: 50,
		margin: 10,
		borderRadius: 25
	},
	marked: {
		width: 50,
		height: 50,
		margin: 10,
		borderRadius: 25,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		position: 'absolute',
		top: 0
	},
	checkmark: {
		alignSelf: 'center',
		marginTop: 15
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
		color: '#03a9f4',
		fontSize: 16
	},
	segmented: {
		margin: 10,
		marginTop: 0
	}
});

module.exports = ChatAddRoom;