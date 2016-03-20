'use strict';

var React = require('react-native');

var Alert = require('../components/alert');
var ChatInfo = require('../components/chatInfo');

var Icon = require('react-native-vector-icons/Ionicons');
var Constants = require('../constants');

var ChatGroup = require('./chatGroup');
var ChatAddRoom = require('./chatAddRoom');
var ChatMembers = require('./chatMembers');

var user;

var Dimensions = require('Dimensions');
var viewHeight = Dimensions.get('window').height;

const {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ListView,
	Image
} = React;


class ChatRooms extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			load: false,
			members: []
		};

		user = require('../util/load.user').user[0];

		this.loadRooms();
	}

	componentWillReceiveProps() {
		this.loadRooms();
	}

	loadRooms() {
		fetch(Constants.URL + 'chat/rooms/' + user.id)
			.then((response) => response.json())
			.then((rooms) => {
				var exists = false;

				for (var i = 0; i < rooms.rooms.length; i++) {
					if (rooms.rooms[i].idAccount == user.id) {
						exists = true;
						break;
					}
				};

				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(rooms.rooms),
					members: rooms.members,
					exists: exists,
					load: true
				});
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	onClick(room) {
		if (!room.type || room.type == 'Pública') {
			this.props.nav.toRoute({
				name: room.id ? room.name : 'Sala ' + room,
				component: ChatGroup,
				data: room.id || room
			});
		} else {
			if (room.idAccount == user.id) {
				this.props.nav.toRoute({
					name: room.name,
					component: ChatGroup,
					data: room.id,
					rightCorner: ChatInfo,
					rightCornerProps: {
						room: room,
						nav: this.props.nav
					}
				});
			} else {
				var allow = false;

				for (var i = 0; i < this.state.members.length; i++) {
					if (this.state.members[i].idRoom == room.id) {
						allow = true;
						break;
					}
				};

				if (!allow) {
					this.props.nav.toRoute({
						name: room.name,
						component: ChatMembers,
						data: room
					});
				} else {
					this.props.nav.toRoute({
						name: room.name,
						component: ChatGroup,
						rightCorner: ChatInfo,
						rightCornerProps: room.id,
						data: room.id
					});
				}
			}
		}
	}

	addRoom() {
		if (this.state.load) {
			this.props.nav.toRoute({
				name: 'Criar sala',
				component: ChatAddRoom
			});
		} else {
			Alert('Aguarde', 'Estamos carregando as salas.');
		}
	}

	renderRooms(room) {
		var image = room.image ? (room.image.indexOf('http') >= 0 ? room.image : Constants.IMAGE + room.image) : false;

		return (
			<TouchableOpacity style={ styles.button3 } onPress={() => this.onClick(room) }>
				<View style={ styles.item }>
					<View style={ styles.data }>
						<Text style={ styles.name }>{ room.name }</Text>
						<Text>{ room.type }{ room.type == 'Privada' ? ', ' + room.members + ' participantes' : ''}</Text>
					</View>

					{ image ? 
					<Image style={ styles.image } source={{ uri: image }} />
					: <View /> }
				</View>
			</TouchableOpacity>
		);
	} 

	render() {
		var listHeight = viewHeight - 348;
		var listHeightBtn = listHeight + 48;

		return (
			<View>
				<TouchableOpacity style={ styles.button } onPress={() => this.onClick(1) }>
					<Text style={ styles.text }>Achow 01</Text>
				</TouchableOpacity>
				<TouchableOpacity style={ styles.button } onPress={() => this.onClick(2) }>
					<Text style={ styles.text }>Achow 02</Text>
				</TouchableOpacity>

				<View style={ styles.button2 }>
					<Text style={ styles.text2 }>Sala dos Usuários</Text>
				</View>

				{ !this.state.exists ?
				<View style={ styles.add }>
					<Icon.Button name="plus" backgroundColor="#03a9f4" onPress={ this.addRoom.bind(this) }>
						<Text style={ styles.addButton }>Criar minha sala</Text>
					</Icon.Button>
				</View>
				: <View /> }

				<ListView 
					style={{ height:  !this.state.exists ? listHeight : listHeightBtn }}
					dataSource={ this.state.dataSource }
					renderRow={ this.renderRooms.bind(this) } />
			</View>
		);
	}
}

var styles = StyleSheet.create({
	button: {
		padding: 15,
		borderLeftWidth: 5,
		borderLeftColor: '#03a9f4',
		borderTopWidth: 1,
		borderTopColor: '#ddd',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		marginTop: 10
	},
	text: {
		fontSize: 18
	},
	button2: {
		padding: 10,
		paddingLeft: 20,
		borderTopWidth: 1,
		borderTopColor: '#ddd',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		marginTop: 10,
		marginBottom: 10
	},
	text2: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	add: {
		margin: 10,
		marginTop: 0
	},
	addButton: {
		color: '#fff'
	},
	button3: {
		padding: 10,
		paddingLeft: 15,
		borderLeftWidth: 5,
		borderLeftColor: '#000',
		borderTopWidth: 1,
		borderTopColor: '#ddd',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		marginBottom: 10
	},
	item: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	name: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	image: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignSelf: 'flex-end'
	}
});

module.exports = ChatRooms;
