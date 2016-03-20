'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper')

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
	Switch
} = React;

class MarkMeeting extends React.Component {
	constructor(props) {
		super(props);
		
		if (props.data.store) {
			this.state = {
				text: '',
				user: props.data.user,
				store: props.data.store,
				dataSource: new ListView.DataSource({
					rowHasChanged: (row1, row2) => row1 !== row2
				}),
				data: []
			};
		} else {
			this.state = {
				text: '',
				user: props.data.user,
				show: props.data.show,
				dataSource: new ListView.DataSource({
					rowHasChanged: (row1, row2) => row1 !== row2
				}),
				data: []
			};
		}

		this.loadFriends();
	}

	loadFriends() {
		fetch(Constants.URL + 'users/' + this.state.user.id + '/friends2')
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
			var users = '';
			var cnt = 0;
			for (var i = 0; i < this.state.data.length; i++) {
				if (this.state.data[i].selected) {
					users += this.state.data[i].id + ', ';
					cnt++;
				}
			};

			if (cnt > 0) {
				var checkin = {};

				if (this.state.store) {
					checkin = {
						idAccount: this.state.user.id,
						idStore: this.state.store.id,
						message: this.state.text,
						users: users
					};
				} else {
					checkin = {
						idAccount: this.state.user.id,
						idShows: this.state.show.id,
						message: this.state.text,
						users: users
					};
				}

				var props = this.props;

				fetch(Constants.URL + 'stores/checkin', {
						method: "POST",
			    		body: JSON.stringify(checkin),
			    		headers: Constants.HEADERS
					})
					.then((response) => response.text())
					.then((checkin) => {
						Alert('Marcar Encontro', 'Encontro marcado com sucesso.');
						props.toBack();
					})
					.catch((error) => {
			    		Alert('Error', 'Houve um error ao se conectar ao servidor');
			    	});
			} else {
				Alert('Marcar Encontro', 'Selecione pelo menos um amigo.');
			}
		} else {
			Alert('Marcar Encontro', 'Digite uma mensagem.');
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
		var image = friend.image ? (friend.image.indexOf('http') >= 0 ? friend.image : Constants.IMAGE + friend.image) : false;

		return (
			<TouchableOpacity onPress={() => { this.selectFriend(friend) }}>
				<View style={ styles.item }>
					<View>
						{ image ?
						<Image style={ styles.image } source={{ uri: image }} />
						: <View style={ styles.noImage } /> }
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
				<Text style={ styles.title }>Mande uma mensagem para eles</Text>

				<TextInput
					autoFocus={ true }
					multiline={ true }
				    style={ styles.textArea }
				    onChangeText={(text) => this.setState({text})}
				    value={this.state.text} />

				<View style={ styles.buttonArea }>
					<Icon.Button name="android-share-alt" backgroundColor="#03a9f4" onPress={this.sendMeeting.bind(this)}>
						<Text style={ styles.sendButton }>Compartilhar com seus amigos</Text>
					</Icon.Button>
				</View>

				<ListView 
					dataSource={ this.state.dataSource }
					renderRow={ this.renderFriends.bind(this) } />
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
		height: 100, 
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
	noImage: {
		width: 50,
		height: 50,
		margin: 10,
		borderRadius: 25,
		backgroundColor: '#DDD'
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
	}
});

module.exports = MarkMeeting;
