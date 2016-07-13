'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper')

var utf8 = require('utf8');

var Constants = require('../constants');

var Store = require('./store');
var User = require('./user');
var SearchResult = require('./searchResult');
var Like = require('../components/like');

var user;

var Dimensions = require('Dimensions');
var viewHeight = Dimensions.get('window').height;

import { SegmentedControls } from 'react-native-radio-buttons';

var Alert = require('../components/alert');
var MultipleChoice = require('react-native-multiple-choice');

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
			sizeStores: 0,
			type: 'Por confirmação',
			selectedTypes: []
		};
	}

	componentWillReceiveProps(props) {
		this.state.selectedTypes = [];
	}

	search() {
		var props = this.props;

		if (this.state.type == 'Por tipo' && this.state.selectedTypes.length == 0) {
			Alert('Error', 'Selecione os tipos de evento que você deseja pesquisar.');
		} else {
			fetch(Constants.URL + 'stores/find', {
				method: 'POST',
				body: JSON.stringify({
					type: this.state.type,
					search: this.state.text,
					selected: JSON.stringify(this.state.selectedTypes).replace('[', '').replace(']', '')
				}),
				headers: Constants.HEADERS
			})
				.then((response) => response.json())
				.then((results) => {
					console.log(results);
					if (results.length > 0) {
						props.toRoute({
							name: 'Resultados',
							component: SearchResult,
							data: results
						})
					} else {
						Alert('Error', 'Nenhum resultado encontrado.');
					}
				})
				.catch((error) => {
					console.log(error);
		    		Alert('Error', 'Houve um error ao se conectar ao servidor');
		    	});
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

	setSegmentType(value) {
		this.setState({ 
			type: value 
		});
	}

	selectType(option) {
		var add = true;
		for (var i = 0; i < this.state.selectedTypes.length; i++) {
			if (this.state.selectedTypes[i] == option) {
				this.state.selectedTypes.splice(i, 1);
				add = false;
			}
		}

		if (add)
			this.state.selectedTypes.push(option)
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
				
				<View style={ styles.segmented }>
					<SegmentedControls
						tint="#d6013b"
						options={[ 'Por confirmação', 'Por data', 'Por tipo' ]}
						onSelection={ this.setSegmentType.bind(this) }
						selectedOption={ this.state.type } />
				</View>

				{ this.state.type == 'Por tipo' ? 
					<View>
						<MultipleChoice
							style={{ height: listSize - 40, margin: 10 }}
							options={[
								'Sertanejo universitário',
								'Brega moderno',
								'Brega antigo',
								'Forró universitário',
								'Forró antigo',
								'Funk',
								'Black',
								'Calourada',
								'Samba',
								'Pagode',
								'Evento cultural',
								'Música eletrônica',
								'Rap e Hip Hop',
								'Gospel',
								'Blues e Jazz',
								'Rock',
								'MPB',
								'Reggae',
								'Axé e Swingueira',
								'Alternativo',
								'Teatro'
							]} 
							selectedOptions={[]}
							onSelection={ this.selectType.bind(this) } />
					</View>
				: <View /> }

				<View style={ styles.buttonArea }>
					<Icon.Button name="ios-search" backgroundColor="#d6013b" onPress={this.search.bind(this)}>
						<Text style={ styles.sendButton }>Procurar</Text>
					</Icon.Button>
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
