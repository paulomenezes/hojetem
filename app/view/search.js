'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper')

var utf8 = require('utf8');

var Constants = require('../constants');

var Store = require('./store');
var User = require('./user');
var Like = require('../components/like');

var user;

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
	TextInput,
	AlertIOS,
	SegmentedControlIOS
} = React;

class Search extends React.Component {
	constructor(props) {
		super(props);
		
		user = require('../util/load.user').user[0];

		this.state = {
			text: '',
			menu: 0,
			option: 'Estabelecimentos',
			dataSourceUsers: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			dataSourceStores: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			searched: false,
			sizeUsers: 0,
			sizeStores: 0
		};
	}

	search() {
		var props = this.props;

		if (this.state.text.length > 0) {
			fetch(Constants.URL + 'users/find/' + this.state.text + '/' + user.id)
				.then((response) => response.json())
				.then((search) => {
					this.setState({
						dataSourceUsers: this.state.dataSourceUsers.cloneWithRows(search.users),
						dataSourceStores: this.state.dataSourceStores.cloneWithRows(search.stores),
						searched: true,
						sizeUsers: search.users.length,
						sizeStores: search.stores.length
					});
				})
				.catch((error) => {
		    		Alert('Error', 'Houve um error ao se conectar ao servidor');
		    	});
		} else {
			Alert('Error', 'Digite sua pesquisa');
		}
	}

	goStore(row) {
		this.props.toRoute({
			name: row.name,
			component: Store,
			data: row,
			rightCorner: Like,
			rightCornerProps: {
				user: this.state.user,
				store: row
			}
		});
	}

	goUser(row) {
		this.props.toRoute({
			name: row.name,
			component: User,
			data: row
		});
	}

	renderUsers(user) {
		var image = user.image ? 
					(user.image.indexOf('http') >= 0 ? { uri: user.image } : { uri: Constants.IMAGE + user.image }) 
						: require('../images/logoSquare.png');

		return (
			<TouchableOpacity onPress={() => { this.goUser(user) }}>
				<View style={ styles.item }>
					<Image style={ styles.image } source={ image } />
					<View style={ styles.text }>
						<Text style={ styles.name }>{ user.name }</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	renderStores(row) {
		var image = row.icon ? { uri: Constants.IMAGE + 'images/store/' + row.icon } : require('../images/logoSquare.png');

		return (
			<TouchableOpacity style={ styles.storeRow } onPress={() => this.goStore(row) }>
				<View style={ styles.storeContainer }>
					<Image style={ styles.storeImage } source={image} />
					<View style={ styles.storeTexts }>
						<Text style={ styles.storeTitle }>{ decodeURIComponent(escape(row.name)) }</Text>
						<View>
							<View style={ styles.storeItem }>
								<Icon style={ styles.storeIcon } name="map" color="#4F8EF7" size={ 20 } />
								<View style={ styles.storeText }><Text style={ styles.size }>{ decodeURIComponent(escape(row.address)) }</Text></View>
							</View>
							<View style={ styles.storeItem }>
								<Icon style={ styles.storeIcon } name="ios-telephone" color="#4F8EF7" size={ 20 } />
								<View style={ styles.storeText }><Text style={ styles.size }>{ decodeURIComponent(escape(row.phone1)) }</Text></View>
							</View>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	setSegment(value) {
		this.setState({ 
			option: value 
		});
	}

	render() {
		var listSize = viewHeight - 200;

		return (
			<View style={{ flex: 1 }}>
				<TextInput
					autoFocus={ true }
					placeholder="Digite sua busca"
				    style={ styles.textInput }
				    onChangeText={(text) => this.setState({text})}
				    value={this.state.text} />

				<View style={ styles.buttonArea }>
					<Icon.Button name="ios-search" backgroundColor="#d6013b" onPress={this.search.bind(this)}>
						<Text style={ styles.sendButton }>Procurar</Text>
					</Icon.Button>
				</View>

				<View>
					<View style={ styles.segmented }>
						<SegmentedControls
							tint="#d6013b"
							options={[ 'Estabelecimentos', 'Usuários' ]}
							onSelection={ this.setSegment.bind(this) }
							selectedOption={ this.state.option } />
					</View>

					{ this.state.option == 'Usuários' ? 
						<View>
						{ this.state.searched && this.state.sizeUsers == 0 ? <Text style={{ textAlign: 'center' }}>Nenhum usuário encontrado</Text> : <View /> }
						<ListView 
							style={{ height: listSize }}
							dataSource={ this.state.dataSourceUsers }
							renderRow={ this.renderUsers.bind(this) } />
						</View>
					: <View /> }

					{ this.state.option == 'Estabelecimentos' ? 
						<View>
						{ this.state.searched && this.state.sizeStores == 0 ? <Text style={{ textAlign: 'center' }}>Nenhum estabelecimento encontrado</Text> : <View /> }
						<ListView 
							style={{ height: listSize }}
							dataSource={ this.state.dataSourceStores }
							renderRow={ this.renderStores.bind(this) } />
						</View>
					: <View /> }
				</View>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	title: {
		fontSize: 18,
		margin: 10
	},
	textInput: {
		height: 40, 
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 2,
		margin: 10,
		padding: 5
	},
	buttonArea: {
		margin: 10,
		marginTop: 0
	},
	sendButton: {
		color: '#FFF'
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
		flex: 1,
		padding: 10,
		paddingTop: 12,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	name: {
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
});

module.exports = Search;
