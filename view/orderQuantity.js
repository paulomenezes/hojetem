'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper');
var Accordion = require('react-native-accordion');
var Slider = require('react-native-slider');

var Constants = require('../constants');
var OrderFinish = require('./orderFinish');

var NoneButton = require('../components/noneButton');

var user;

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
	Switch,
	SliderIOS
} = React;

class OrderQuantity extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			text: '',
			user: props.data.user,
			store: props.data.store,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}).cloneWithRows(props.data.items),
			data: props.data.items
		};
	}

	setValue(value, item) {
		var newData = [];
		newData = this.state.data.slice();

		var index = 0;
		for (var i = 0; i < this.state.data.length; i++) {
			if (this.state.data[i].id === item.id) {
				index = i;
				break;
			}
		};

		newData[index] = {
			id: item.id,
			image: item.image,
			name: item.name,
			price: item.price,
			description: item.description,
			quantity: Math.round(value)
		};

		var newDS = this.state.dataSource.cloneWithRows(newData);

		this.setState({
			dataSource: newDS,
			data: newData,
		});
	}

	renderItems(item) {
		return (
			<View style={ styles.item } key={ item.id }>
				<View>
					<Image style={ styles.image } source={{ uri: Constants.IMAGE + 'images/menu/' + item.image }} />
				</View>
				<View style={ styles.text }>
					<Text style={ styles.name }>{ item.name }</Text>
					<Text style={ styles.price }>R$ { item.price }</Text>
					<Text style={ styles.description }>{ item.description }</Text>

					<Text style={ styles.description }>Quantidade: { item.quantity }</Text>
					<Slider style={ styles.slider } minimumValue={1} maximumValue={10} step={1} value={item.quantity} 
						onValueChange={(value) => this.setValue(value, item) } />
				</View>
			</View>
		);
	}

	buy() {
		this.props.toRoute({
			component: OrderFinish,
			name: 'Finalizar Pedido',
			rightCorner: NoneButton,
			data: {
				user: this.state.user,
				store: this.state.store,
				items: this.state.data
			}
		});
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<View style={ styles.buy }>
					<Icon.Button name="bag" backgroundColor="#d6013b" onPress={ this.buy.bind(this) }>
						<Text style={{ color: '#fff' }}>Finalizar pedido</Text>
					</Icon.Button>
				</View>
				<ListView 
					dataSource={ this.state.dataSource }
					renderRow={ this.renderItems.bind(this) } />
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
		color: '#d6013b',
		fontSize: 16
	},
	price: {
		fontSize: 14
	},
	description: {
		fontSize: 12
	},
	slider: {
		height: 10,
		margin: 10
	}
});

module.exports = OrderQuantity;
