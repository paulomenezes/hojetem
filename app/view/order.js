'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Swiper = require('react-native-swiper')

var Subcategory = require('./subcategory');

var Constants = require('../constants');

var Dimensions = require('Dimensions');
var viewHeight = Dimensions.get('window').height;

var Store = require('./store');
var Like = require('../components/like');

var Accordion = require('react-native-accordion');

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

class Order extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			user: props.data,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
		}

		this.loadNotifications();
	}

	loadNotifications() {
		var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

		fetch(Constants.URL + 'order/' + id)
			.then((response) => response.json())
			.then((order) => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(order)
				});
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	onClick(row) {
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

	renderStores(row) {
		var total = 0;
		for (var i = 0; i < row.itens.length; i++) {
			total += (row.itens[i].price * row.itens[i].quantity);
		};

		total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

		var dExp = row.date ? row.date.split(' ')[0].split('-') : false;

		var date = dExp ? new Date(dExp[0], dExp[1] - 1, dExp[2]) : new Date();
		var d = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

		return (
			<View style={ styles.container }>
				<Text style={ styles.date }>Pedido dia { d }</Text>
				<Text style={ styles.price }>R$ { total }</Text>
				<Text style={ styles.status }>Status: { row.status }</Text>

				{ this.renderItens(row.itens) }
			</View>
		);
	}

	renderItens(items) {
		var header = (
			<View style={ styles.header }>
				<Text>Items do pedido</Text>
			</View>
		);

		var self = this;

		var items = items.map(function (item) {
			return (
				<View style={ styles.item } key={ item.idItem }>
					<View>
						<Image style={ styles.image } source={{ uri: Constants.IMAGE + 'images/menu/' + item.image }} />
					</View>
					<View style={ styles.text }>
						<Text style={ styles.name }>{ item.name }</Text>
						<Text style={ styles.price }>R$ { item.price }</Text>
						<Text style={ styles.description }>{ item.description }</Text>
					</View>
				</View>
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

	render() {
		return (
			<ListView 
				style={{ flex: 1 }}
				dataSource={ this.state.dataSource }
				renderRow={ this.renderStores.bind(this) } />
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		padding: 10,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	date: {
		fontSize: 14,
		color: '#d6013b'
	},
	status: {
		marginBottom: 10
	},
	header: {
		padding: 10,
		borderColor: '#DDD',
		borderWidth: 1,
		backgroundColor: '#eee',
		flex: 1,
		flexDirection: 'row'
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
		padding: 5,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	name: {
		color: '#d6013b',
		fontSize: 16
	},
	price: {
		fontSize: 14
	},
	description: {
		fontSize: 12
	}
});

module.exports = Order;