'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper');
var Accordion = require('react-native-accordion');

var Constants = require('../constants');
var OrderQuantity = require('./orderQuantity');

var NoneButton = require('../components/noneButton');

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

class Menu extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			text: '',
			user: props.data.user,
			store: props.data.store,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			quantity: 0,
			data: []
		};

		this.loadMenu();
	}

	loadMenu() {
		fetch(Constants.URL + 'stores/' + this.state.store.id + '/menu')
			.then((response) => response.json())
			.then((menu) => {
				var newMenu = [];
				var lastType = '';
				var lastTypeIndex = 0;

				for (var i = 0; i < menu.length; i++) {
					menu[i].selected = false;
					menu[i].quantity = 1;

					if (i == 0) {
						newMenu.push({
							type: menu[0].type,
							items: []
						});

						newMenu[0].items.push(menu[0]);

						lastType = menu[0].type;
						lastTypeIndex = 0;
					} else {
						if (lastType === menu[i].type) {
							newMenu[lastTypeIndex].items.push(menu[i]);
						} else {
							newMenu.push({
								type: menu[i].type,
								items: []
							});

							newMenu[i].items.push(menu[i]);

							lastType = menu[i].type;
							lastTypeIndex = i;
						}
					}
				};

				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(newMenu),
					data: newMenu
				});
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
			});
	}

	selectItem(item) {
		var newData = [];
		newData = this.state.data.slice();

		var indexI = 0;
		var indexJ = 0;
		for (var i = 0; i < this.state.data.length; i++) {
			for (var j = 0; j < this.state.data[i].items.length; j++) {
				if (this.state.data[i].items[j].id === item.id) {
					indexI = i;
					indexJ = j;
					break;
				}
			};
		};

		var section = newData[indexI];
		section.items[indexJ] = {
			id: item.id,
			image: item.image,
			name: item.name,
			price: item.price,
			description: item.description,
			selected: !item.selected,
			quantity: item.quantity
		};

		newData[indexI] = {
			type: section.type,
			items: section.items
		}

		var q = this.state.quantity;

		if (newData[indexI].items[indexJ].selected) {
			q++;
		} else {
			q--;
		}

		var newDS = this.state.dataSource.cloneWithRows(newData);

		this.setState({
			dataSource: newDS,
			data: newData,
			quantity: q
		});
	}

	renderMenu(menu) {
		var header = (
			<View style={ styles.header }>
				<Text style={ styles.title }>{ menu.type }</Text>
				<Icon style={ styles.icon } name="chevron-right" color="#ddd" size={ 20 } />
			</View>
		);

		var self = this;

		var items = menu.items.map(function (item) {
			return (
				<TouchableOpacity style={ styles.item } key={ item.id } onPress={() => { self.selectItem(item) }}>
					<View>
						<Image style={ styles.image } source={{ uri: Constants.IMAGE + 'images/menu/' + item.image }} />
						{ item.selected ? 
						<View style={ styles.marked }>
							<Icon style={ styles.checkmark } name="checkmark" size={20} color="#fff" />
						</View>
						: <View /> }
					</View>
					<View style={ styles.text }>
						<Text style={ styles.name }>{ item.name }</Text>
						<Text style={ styles.price }>R$ { item.price }</Text>
						<Text style={ styles.description }>{ item.description }</Text>
					</View>
				</TouchableOpacity>
			);
		});

		var content = (
			<View>
				{ items }
			</View>
		);

		return (
			<Accordion 
				header={ header }
				content={ content }
				easing="easeOutCubic" />
		);
	}

	buy() {
		var items = [];
		for (var i = 0; i < this.state.data.length; i++) {
			for (var j = 0; j < this.state.data[i].items.length; j++) {
				if (this.state.data[i].items[j].selected) {
					items.push(this.state.data[i].items[j]);
				}
			};
		};

		if (items.length == 0) {
			Alert('Error', 'Selecione pelo menos um item.');
		} else {
			this.props.toRoute({
				component: OrderQuantity,
				name: 'Selecionar quantidade',
				rightCorner: NoneButton,
				data: {
					user: this.state.user,
					store: this.state.store,
					items: items
				}
			});
		}
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<View style={ styles.buy }>
					<Icon.Button name="ios-cart-outline" backgroundColor="#03a9f4" onPress={ this.buy.bind(this) }>
						<Text style={{ color: '#fff' }}>Comprar selecionados ({ this.state.quantity })</Text>
					</Icon.Button>
				</View>
				<ListView 
					dataSource={ this.state.dataSource }
					renderRow={ this.renderMenu.bind(this) } />
			</View>
		);
	}
}

var styles = StyleSheet.create({
	buy: {
		margin: 10,
	},
	header: {
		padding: 15,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1,
		backgroundColor: '#eee',
		flex: 1,
		flexDirection: 'row'
	},
	icon: {
		position: 'absolute',
		right: 10
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
		padding: 5,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	name: {
		color: '#03a9f4',
		fontSize: 16
	},
	price: {
		fontSize: 14
	},
	description: {
		fontSize: 12
	}
});

module.exports = Menu;