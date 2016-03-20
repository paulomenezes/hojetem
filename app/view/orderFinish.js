'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper');
var Accordion = require('react-native-accordion');
import SmartScrollView from 'react-native-smart-scroll-view';

var Constants = require('../constants');

var NoneButton = require('../components/noneButton');

var user;

var Alert = require('../components/alert');
import { SegmentedControls } from 'react-native-radio-buttons';

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
	SegmentedControlIOS,
	ScrollView
} = React;

class OrderFinish extends React.Component {
	constructor(props) {
		super(props);
		
		var total = 0;

		for (var i = 0; i < props.data.items.length; i++) {
			total += (props.data.items[i].price * props.data.items[i].quantity);
		};

		total = total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

		this.state = {
			items: props.data.items,
			user: props.data.user,
			store: props.data.store,
			payment: 0,
			option: 'Dinheiro',
			_return: "0",
			obs: "",
			phone: "",
			address: "",
			total: total
		};
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
				</View>
			</View>
		);
	}

	setSegment(value) {
		this.setState({ 
			option: value 
		});
	}

	render() {
		var self = this;
		var items = this.state.items.map(function (item) {
			return self.renderItems(item);
		});

		return (
			<View style={{ flex: 1 }}>
				<SmartScrollView>
					<View style={ styles.group }>
						<Text style={ styles.title }>Valor total:</Text>
						<Text style={ styles.value }>R$ { this.state.total }</Text>
					</View>

					<View style={ styles.group }>
						<Text style={ styles.title }>Forma de pagamento:</Text>
						<SegmentedControls
							tint="#03a9f4"
							options={[ 'Dinheiro', 'Cartão' ]}
							onSelection={ this.setSegment.bind(this) }
							selectedOption={ this.state.option } />

						{ this.state.option == 'Dinheiro' ? 
						<View>
							<Text style={ styles.title }>Troco:</Text>
							<TextInput
								smartScrollOptions={{
									moveToNext: true,
									type:       'text'
								}}
								keyboardType="number-pad"
							    style={ styles.input }
							    onChangeText={(text) => this.setState({ _return: text }) }
							    value={ this.state._return } />
						</View>
						: <View />}
					</View>

					<View style={ styles.group }>
						<Text style={ styles.title }>Observação:</Text>
						<TextInput
							multiline={ true }
						    style={ styles.textArea }
						    onChangeText={(text) => this.setState({ obs: text }) }
						    value={ this.state.obs } />
					</View>

					<View style={ styles.group }>
						<Text style={ styles.title }>Telefone:</Text>
						<TextInput
							smartScrollOptions={{
								moveToNext: true,
								type:       'text'
							}}
							keyboardType="phone-pad"
						    style={ styles.input }
						    onChangeText={(text) => this.setState({ phone: text }) }
						    value={ this.state.phone } />

						<Text style={ styles.title }>Endereço:</Text>
						<TextInput
							smartScrollOptions={{
								moveToNext: false,
								type:       'text'
							}}
						    style={ styles.input }
						    onChangeText={(text) => this.setState({ address: text }) }
						    value={ this.state.address } />
					</View>

					<View style={ styles.group }>
						<Icon.Button name="bag" backgroundColor="#03a9f4" onPress={ this.buy.bind(this) }>
							<Text style={{ color: '#fff' }}>Finalizar</Text>
						</Icon.Button>
					</View>

					<View style={ styles.group }>
						<Text style={ styles.title }>Itens:</Text>
						<View>
							{ items }
						</View>
					</View>
				</SmartScrollView>
			</View>
		);
	}

	buy() {
		if (this.state.phone.length == 0) {
			Alert('Error', 'O campo telefone é obrigatório.');
		} else if (this.state.address.length == 0) {
			Alert('Error', 'O campo endereço é obrigatório.');
		} else {
			var order = {
				idAccount: this.state.user.id,
				idStore: this.state.store.id,
				obs: this.state.obs,
				payment: this.state.option,
				troco: this.state._return,
				phone: this.state.phone,
				address: this.state.address,
				itens: this.state.items
			};

			var props = this.props;
			var state = this.state;

			var Store = require('./store');
			var Like = require('../components/like');

			fetch(Constants.URL + 'order', {
					method: "POST",
		    		body: JSON.stringify(order),
		    		headers: Constants.HEADERS
				})
				.then((response) => response.json())
				.then((order) => {
					Alert('Pedido Realizado', 'Em breve entraremos em contato com você.');
					props.goTimes(3);
				})
				.catch((error) => {
					console.log(error);
					Alert('Error', 'Houve um error ao se conectar ao servidor');
		    	});
		}
	}
}

var styles = StyleSheet.create({
	group: {
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		padding: 10
	},
	title: {
		color: '#03a9f4',
		fontSize: 16,
		marginBottom: 5
	},
	value: {
		fontSize: 14
	},
	input: {
		height: 30,
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 5,
		padding: 5
	},
	textArea: {
		height: 100, 
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 5,
		padding: 5
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
		color: '#03a9f4',
		fontSize: 16
	},
	price: {
		fontSize: 14
	},
	description: {
		fontSize: 12
	},
});

module.exports = OrderFinish;
