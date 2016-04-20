'use strict';

var React = require('react-native');
var Constants = require('../constants');
var Icon = require('react-native-vector-icons/Ionicons');

var Dimensions = require('Dimensions');
var viewHeight = Dimensions.get('window').height;

var ActionButton = require('react-native-action-button');
var Communications = require('react-native-communications');

import { SegmentedControls } from 'react-native-radio-buttons';

var user;

var Chat = require('./chat');

var Alert = require('../components/alert');

var {
	Text,
	View,
	Image,
	Navigator,
	TouchableOpacity,
	Component,
	StyleSheet,
	SegmentedControlIOS,
	ListView,
	AlertIOS
} = React;

class User extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: props.data,
			menu: 0,
			option: 'Check-ins',
			dataSourceFriend: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			dataSourceCheckins: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			status: 'loading',
			friendship: []
		}

		user = require('../util/load.user').user[0];

		this.loadFriends();
		this.loadCheckins();
		this.loadFriendship();
	}

	loadFriends() {
		var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

		fetch(Constants.URL + 'users/' + id + '/friends2')
			.then((response) => response.json())
			.then((friends) => {
				this.setState({
					dataSourceFriend: this.state.dataSourceFriend.cloneWithRows(friends)
				});
			})
			.catch((error) => {
	    		Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	loadCheckins() {
		var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

		fetch(Constants.URL + 'users/' + id + '/checkins')
			.then((response) => response.json())
			.then((checkins) => {
				this.setState({
					dataSourceCheckins: this.state.dataSourceCheckins.cloneWithRows(checkins)
				});
			})
			.catch((error) => {
	    		Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	loadFriendship() {
		var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

		fetch(Constants.URL + 'users/' + user.id + '/and/' + id)
			.then((response) => response.json())
			.then((friendship) => {
				if (friendship.friends) {
					this.setState({
						status: 'friend',
						friendship: friendship.friends
					});
				} else if (friendship.request) {
					this.setState({
						status: 'request',
						friendship: null
					});
				} else {
					this.setState({
						status: 'nothing',
						friendship: null
					});
				}
			})
			.catch((error) => {
	    		Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	renderFriends(friend) {
		var image = friend.image ? friend.image.indexOf('http') >= 0 ? friend.image : Constants.IMAGE + friend.image : false;

		return (
			<TouchableOpacity onPress={() => this.goUser(friend) }>
				<View style={ styles.item }>
					{ image ? 
					<Image style={ styles.image } source={{ uri: image }} />
					: <View style={ styles.image } /> }
					<View style={ styles.text }>
						<Text style={ styles.nameFriend }>{ friend.name + ' ' + friend.lastname }</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	renderCheckins(row) {
		var image = row.icon ? { uri: Constants.IMAGE + 'images/store/' + row.icon } : require('../images/logoSquare.png');

		return (
			<TouchableOpacity style={ styles.storeRow } onPress={() => this.goStore(row) }>
				<View style={ styles.storeContainer }>
					<Image style={ styles.storeImage } source={image} />
					<View style={ styles.storeTexts }>
						<Text style={ styles.storeTitle }>{ decodeURIComponent(escape(row.name)) }</Text>
						<View>
							<View style={ styles.storeItem }>
								<Icon style={ styles.storeIcon } name="compose" color="#4F8EF7" size={ 20 } />
								<View style={ styles.storeText }><Text style={ styles.size }>{ row.message }</Text></View>
							</View>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	renderPhotos(data) {
		if (data.CImage && data.CImage.length > 0) {
			return (
				<View style={{ marginBottom: 10 }}>
					<View style={ styles.picArea }>
						<Image style={ styles.pic } source={{ uri: Constants.IMAGE + data.CImage }} />
					</View>
				</View>
			);
		} else {
			return (<View />);
		}
	}

	goStore(store) {
		var Store = require('./store');
		var Like = require('../components/like');

		this.props.toRoute({
			name: store.name,
			component: Store,
			data: store,
			rightCorner: Like,
			rightCornerProps: {
				user: user,
				store: store
			}
		});
	}

	goUser(user) {
		var User = require('./user');

		this.props.toRoute({
			name: user.name,
			component: User,
			data: user
		});
	}

	goChat(user) {
		if (this.state.status == 'friend') {
			this.props.toRoute({
				name: user.name,
				component: Chat,
				data: {
					user: user,
					friend: this.state.friendship
				}
			});
		} else {
			Alert('Amigos', 'Adicione ' + this.state.user.name + ' como amigo para enviar mensagens para ele.');
		}
	}

	setSegment(value) {
		this.setState({ 
			option: value 
		});
	}

	render() {
		var image = this.state.user.image ? this.state.user.image.indexOf('http') >= 0 ? this.state.user.image : Constants.IMAGE + this.state.user.image : false;
		var cover = this.state.user.cover ? this.state.user.cover.indexOf('http') >= 0 ? this.state.user.cover : Constants.IMAGE + this.state.user.cover : false;

		var listSize = viewHeight - 295;

		var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

		return (
			<View style={ styles.container }>
				{ cover ? 
				<Image style={ styles.cover } source={{ uri: cover }} />
				: <View style={ styles.noCover } /> }
				<View style={ styles.profileArea }>
					{ image ? 
					<Image style={ styles.profile } source={{ uri: image }} />
					: <View style={ styles.profile } /> }
				</View>

				<Text style={ styles.name }>{ this.state.user.name + ' ' + this.state.user.lastname }</Text>

				<View>
					<View style={ styles.segmented }>
						<SegmentedControls
							tint="#d6013b"
							options={[ 'Check-ins', 'Amigos', 'Fotos' ]}
							onSelection={ this.setSegment.bind(this) }
							selectedOption={ this.state.option } />
					</View>

					{ this.state.option == 'Check-ins' ? 
					<ListView 
						style={{ height: listSize }}
						dataSource={ this.state.dataSourceCheckins }
						renderRow={ this.renderCheckins.bind(this) } />
					: <View /> }

					{ this.state.option == 'Amigos' ? 
					<ListView 
						style={{ height: listSize }}
						dataSource={ this.state.dataSourceFriend }
						renderRow={ this.renderFriends.bind(this) } />
					: <View /> }

					{ this.state.option == 'Fotos' ? 
					<ListView 
						style={{ height: listSize }}
						dataSource={ this.state.dataSourceCheckins }
						renderRow={ this.renderPhotos.bind(this) } />
					: <View /> }
				</View>

				{ id != user.id ?
				<ActionButton buttonColor="rgba(231,76,60,1)">
					<ActionButton.Item buttonColor='#d6013b' title="Enviar mensagem" onPress={() => { this.goChat(this.state.user) }}>
		            	<Icon name="chatboxes" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#d6013b' title="Chamar" onPress={ this.call.bind(this) }>
		            	<Icon name="ios-telephone" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>

		          	{ this.state.status === 'loading' ? 
		          	<ActionButton.Item buttonColor='#d6013b' title="Carregando" onPress={() => console.log('load')}>
		            	<Icon name="refresh" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	: this.state.status === 'friend' ?
		          	<ActionButton.Item buttonColor='#d6013b' title="Remover amigo" onPress={ this.remove.bind(this) }>
		            	<Icon name="minus-circled" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	: this.state.status === 'request' ?
		          	<ActionButton.Item buttonColor='#d6013b' title="Aguardando confirmação" onPress={ this.wait.bind(this) }>
		            	<Icon name="minus-circled" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	: <ActionButton.Item buttonColor='#d6013b' title="Adicionar amigo" onPress={ this.add.bind(this) }>
		            	<Icon name="person-add" style={styles.actionButtonIcon} />
		          	</ActionButton.Item> }
		        </ActionButton>
		        : <View /> }
			</View>
		)
	}

	wait() {
		Alert('Aguarde', 'O pedidode amizade já foi enviado.')
	}

	add() {
		var request = {
			idAccount1: user.id,
			idAccount2: this.state.user.id
		};

		fetch(Constants.URL + 'users/requests',{
				method: "POST",
	    		body: JSON.stringify(request),
	    		headers: Constants.HEADERS
			})
			.then((response) => response.text())
			.then((checkins) => {
				this.setState({
					status: 'request',
					friendship: null
				});
			})
			.catch((error) => {
	    		Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	remove() {
		fetch(Constants.URL + 'users/' + this.state.friendship.id + '/delete/friend')
			.then((response) => response.json())
			.then((checkins) => {
				this.setState({
					status: 'nothing',
					friendship: null
				});
			})
			.catch((error) => {
	    		Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	call() {
		if (this.state.user.phone) {
			Communications.phonecall(this.state.user.phone, true)
		} else {
			Alert('Error', 'Telefone inválido.');
		}
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	cover: {
		height: 150,
		top: 0,
		left: 0,
		right: 0
	},
	noCover: {
		backgroundColor: '#ccc',
		height: 150,
		top: 0,
		left: 0,
		right: 0
	},
	profileArea: {
		position: 'absolute',
		top: 20,
		left: 0,
		right: 0,
		justifyContent: 'center',
		backgroundColor: 'transparent'
	},
	profile: {
		alignSelf: 'center',
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: '#fff',
		alignItems: 'center'
	},
	name: {
		textAlign: 'center',
		fontSize: 20,
		margin: 10,
		color: '#d6013b'
	},
	segmented: {
		margin: 10,
		marginTop: 0
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
	text: {
		height: 70,
		flex: 1,
		padding: 10,
		paddingTop: 12,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	nameFriend: {
		fontSize: 16
	},

	storeRow: {
		marginTop: 10,
		borderTopColor: '#ddd',
		borderTopWidth: 1,
		borderBottomColor: '#ddd',
		borderBottomWidth: 1,
	},
	storeContainer: {
		flex: 1,
		flexDirection: 'row'
	},
	storeTexts: {
		flex: 1,
		padding: 5
	},
	storeImage: {
		width: 100,
		height: 100
	},
	storeTitle: {
		fontSize: 18,
		marginBottom: 5
	},
	storeItem: {
		flex: 1,
		flexDirection: 'row'
	},
	storeIcon: {
		margin: 4,
		marginBottom: 0
	},
	storeText: {
		flex: 1,
		padding: 4,
		paddingBottom: 0
	},
	storeSize: {
		marginTop: 3,
		fontSize: 12
	},
	actionButtonIcon: {
	    fontSize: 20,
	    height: 22,
	    color: 'white',
	},
	picArea: {
		flex: 1,
		alignItems: 'stretch'
	},
	pic: {
		flex: 1,
		height: 300
	}
});

module.exports = User;