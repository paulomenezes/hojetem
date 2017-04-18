'use strict';

var React = require('react-native');
var Alert = require('../components/alert');
var Icon = require('react-native-vector-icons/Ionicons');
var Constants = require('../constants');

var ChatGroup = require('./chatGroup');
var ChatAddRoom = require('./chatAddRoom');
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


class ChatMembers extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			room: props.data,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			load: false,
			exists: false,
			members: []
		};

		user = require('../util/load.user').user[0];

		this.loadRooms();
	}

	componentWillReceiveProps() {
		this.loadRooms();
	}

	loadRooms() {
		fetch(Constants.URL + 'chat/rooms/' + this.state.room.id + '/members')
			.then((response) => response.json())
			.then((rooms) => {
				var exists = false;

				for (var i = 0; i < rooms.length; i++) {
					if (rooms[i].id == user.id) {
						exists = true;
						break;
					}
				};

				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(rooms),
					exists: exists,
					members: rooms
				});
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	addRoom() {
		var member = {
			idAccount: user.id,
			idRoom: this.state.room.id,
			accept: 0
		};

		fetch(Constants.URL + 'chat/member', {
				method: "POST",
	    		body: JSON.stringify(member),
	    		headers: Constants.HEADERS
			})
			.then((response) => response.json())
			.then((rooms) => {
				console.log(rooms);

				var newData = [];
				newData = this.state.members.slice();

				newData.push({
					id: user.id,
					image: user.image,
					name: user.name,
					lastname: user.lastname,
					accept: 1
				});

				var newDS = this.state.dataSource.cloneWithRows(newData);

				this.setState({
					dataSource: newDS,
					members: newData,
					exists: true
				})
			})
			.catch((error) => {
				console.log(error);
				Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	accept(member) {
		fetch(Constants.URL + 'chat/room/accept/' + member.IDMember)
			.then((response) => response.json())
			.then((rooms) => {
				console.log(rooms);

				var newData = [];
				newData = this.state.members.slice();

				var index = 0;
				for (var i = 0; i < this.state.members.length; i++) {
					if (this.state.members[i].id === member.id) {
						index = i;
						break;
					}
				};

				newData[index] = {
					id: member.id,
					image: member.image,
					name: member.name,
					lastname: member.lastname,
					accept: 1
				};

				var newDS = this.state.dataSource.cloneWithRows(newData);

				this.setState({
					dataSource: newDS,
					members: newData
				})
			})
			.catch((error) => {
				console.log(error);
				Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	remove(member) {
		fetch(Constants.URL + 'chat/room/remove/' + member.IDMember)
			.then((response) => response.json())
			.then((rooms) => {
				console.log(rooms);

				var newData = [];
				newData = this.state.members.slice();

				var index = 0;
				for (var i = 0; i < this.state.members.length; i++) {
					if (this.state.members[i].id === member.id) {
						index = i;
						break;
					}
				};

				newData.splice(index, 1);

				var newDS = this.state.dataSource.cloneWithRows(newData);

				this.setState({
					dataSource: newDS,
					members: newData
				})
			})
			.catch((error) => {
				console.log(error);
				Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	renderRooms(room) {
		var image = room.image ? (room.image.indexOf('http') >= 0 ? room.image : Constants.IMAGE + room.image) : false;

		return (
			<View style={ styles.button3 }>
				<View>
					<View style={ styles.item }>
						<View style={ styles.data }>
							<Text style={ styles.name }>{ room.name + ' ' + room.lastname }</Text>
							{ room.accept == 0 ?
							<Text>Aguardando confirmação</Text>
							: <View /> }
						</View>

						{ image ? 
						<Image style={ styles.image } source={{ uri: image }} />
						: <View /> }
					</View>

					{ this.state.room.idAccount == user.id && room.accept == 0 ?
					<View style={ styles.buttons }>
						<View style={ styles.buttonsAccept }>
							<Icon.Button name="checkmark" backgroundColor="#d6013b" onPress={() => this.accept(room) }>
								<Text style={ styles.addButton }>Aceitar</Text>
							</Icon.Button>
						</View>
						<Icon.Button name="android-cancel" backgroundColor="#ddd" onPress={() => this.remove(room) }>
							<Text style={ styles.addButton }>Recusar</Text>
						</Icon.Button>	
					</View>
					: <View /> }
				</View>
			</View>
		);
	} 

	render() {
		var listHeight = viewHeight - 100;

		return (
			<View>
				{ !this.state.exists && this.state.room.idAccount != user.id ?
				<View style={ styles.add }>
					<Icon.Button name="person-add" backgroundColor="#d6013b" onPress={ this.addRoom.bind(this) }>
						<Text style={ styles.addButton }>Mandar solicitação</Text>
					</Icon.Button>
				</View>
				: <View /> }

				{ !this.state.exists ?
				<ListView 
					style={{ height: listHeight }}
					dataSource={ this.state.dataSource }
					renderRow={ this.renderRooms.bind(this) } />
				: 
				<ListView 
					dataSource={ this.state.dataSource }
					renderRow={ this.renderRooms.bind(this) } /> }
			</View>
		);
	}
}

var styles = StyleSheet.create({
	add: {
		margin: 10,
		marginBottom: 0
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
		marginTop: 10
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
	},
	buttons: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 10
	},
	buttonsAccept: {
		marginRight: 10
	}
});

module.exports = ChatMembers;
