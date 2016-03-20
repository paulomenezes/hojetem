'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Swiper = require('react-native-swiper')

var Subcategory = require('./subcategory');

var Constants = require('../constants');

var Dimensions = require('Dimensions');
var viewHeight = Dimensions.get('window').height;

import { SegmentedControls } from 'react-native-radio-buttons';

var Alert = require('../components/alert');

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
	SegmentedControlIOS
} = React;

class Contacts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: props.nav.data,
			menu: 0,
			option: props.options ? 'Solicitações' : 'Amigos',
			dataSourceFriend: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			dataSourceRequests: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			requests: [],
			friends: []
		}

		this.loadFriends();
		this.loadRequests();
	}

	loadFriends() {
		var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

		fetch(Constants.URL + 'users/' + id + '/friends2')
			.then((response) => response.json())
			.then((friends) => {
				this.setState({
					friends: friends,
					dataSourceFriend: this.state.dataSourceFriend.cloneWithRows(friends)
				});
			})
			.catch((error) => {
	    		Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	loadRequests() {
		var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

		fetch(Constants.URL + 'users/' + id + '/requests')
			.then((response) => response.json())
			.then((requests) => {
				this.setState({
					requests: requests,
					dataSourceRequests: this.state.dataSourceRequests.cloneWithRows(requests)
				});
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

	renderRequests(friend) {
		var image = friend.image ? friend.image.indexOf('http') >= 0 ? friend.image : Constants.IMAGE + friend.image : false;

		return (
			<TouchableOpacity onPress={() => this.goUser(friend) }>
				<View style={ styles.item }>
					{ image ? 
					<Image style={ styles.image } source={{ uri: image }} />
					: <View style={ styles.image } /> }
					<View style={ styles.text }>
						<Text style={ styles.nameFriend }>{ friend.name }</Text>
						
						<View style={ styles.buttons }>
							<View style={{ marginRight: 10 }}>
								<Icon.Button name="person-add" backgroundColor="#03a9f4" style={ styles.button } onPress={() => this.add(friend)}>
									<Text style={ styles.sendButton }>Aceitar</Text>
								</Icon.Button>
							</View>
							<Icon.Button name="trash-b" color="#03a9f4" backgroundColor="#fff" style={ styles.button } onPress={() => this.remove(friend)}>
								<Text style={ styles.sendButton2 }>Recusar</Text>
							</Icon.Button>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	goUser(user) {
		var User = require('./user');

		this.props.nav.toRoute({
			name: user.name,
			component: User,
			data: user
		});
	}

	add(request) {
		fetch(Constants.URL + 'users/' + request.IDRequest + '/requests/aceitar', {
				method: "POST",
	    		body: JSON.stringify({
	    			idAccount1: request.idAccount1,
	    			idAccount2: request.idAccount2
	    		}),
	    		headers: Constants.HEADERS
			})
			.then((response) => response.json())
			.then((response) => {
				this.state.friends.push(request);

				this.setState({
					friends: this.state.friends,
					dataSourceFriend: this.state.dataSourceRequests.cloneWithRows(this.state.friends)
				});

				for (var i = 0; i < this.state.requests.length; i++) {
					if (this.state.requests[i].IDRequest === request.IDRequest) {
						var r = this.state.requests;
						r.splice(i, 1);

						this.setState({
							requests: r,
							dataSourceRequests: this.state.dataSourceRequests.cloneWithRows(r)
						});
						break;
					}
				};
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
        	});
	}

	remove(request) {
		fetch(Constants.URL + 'users/' + request.IDRequest + '/requests/recusar')
			.then((response) => response.json())
			.then((response) => {
				for (var i = 0; i < this.state.requests.length; i++) {
					if (this.state.requests[i].IDRequest === request.IDRequest) {
						var r = this.state.requests;
						r.splice(i, 1);

						this.setState({
							requests: r,
							dataSourceRequests: this.state.dataSourceRequests.cloneWithRows(r)
						});
						break;
					}
				};
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
        	});
	}

	setSegment(value) {
		this.setState({ 
			option: value 
		});
	}

	render() {
		var listSize = viewHeight - 160;

		return (
			<View style={ styles.view }>
				<View style={ styles.segmented }>
					<SegmentedControls
						tint="#03a9f4"
						options={[ 'Amigos', 'Solicitações' ]}
						onSelection={ this.setSegment.bind(this) }
						selectedOption={ this.state.option } />
				</View>
				{ this.state.option == 'Amigos' ? 
				<View>
					{ this.state.friends.length > 0 ?
					<ListView 
						style={{ height: listSize }}
						dataSource={ this.state.dataSourceFriend }
						renderRow={ this.renderFriends.bind(this) } />
					: <View><Text style={{ textAlign: 'center' }}>Você não adicionou nenhum amigo</Text></View> }
				</View>
				: <View /> }

				{ this.state.option == 'Solicitações' ? 
				<View>
					{ this.state.requests.length > 0 ?
					<ListView 
						style={{ height: listSize }}
						dataSource={ this.state.dataSourceRequests }
						renderRow={ this.renderRequests.bind(this) } />
					: <View><Text style={{ textAlign: 'center' }}>Você não tem nenhuma solicitação de amizade</Text></View> }
				</View>
				: <View /> }
			</View>
		);
	}
}

var styles = StyleSheet.create({
	view: {
		flex: 1,
	},
	segmented: {
		margin: 10
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
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 10,
		paddingTop: 12,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	nameFriend: {
		fontSize: 16
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	button: {
		borderColor: '#03a9f4',
		borderWidth: 1,
	},
	sendButton: {
		color: '#fff'
	},
	sendButton2: {
		color: '#03a9f4'
	},
});

module.exports = Contacts;