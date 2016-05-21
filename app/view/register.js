'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper');
var Accordion = require('react-native-accordion');
import SmartScrollView from 'react-native-smart-scroll-view';
import { SegmentedControls } from 'react-native-radio-buttons';

var Constants = require('../constants');

var NoneButton = require('../components/noneButton');

var Dimensions = require('Dimensions');
var viewWidth = Dimensions.get('window').width;
var md5 = require("md5");

var user;

var reactStore = require('react-native-store');
var LoadUser = require('../util/load.user');
var UserActiveModel = null;

var Search = require('../components/search');
var Main = require('./main');

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
	SegmentedControlIOS,
	ScrollView,
	DatePickerIOS,
	NativeModules,
	Platform
} = React;

var loadUser = function (callback) {
	LoadUser(function (user, userModel) {
		UserActiveModel = userModel;
		callback(user);
	});
}

class Register extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			gender: '',
			options: '',
			_return: "0",
			name: "",
			lastname: "",
			email: "",
			password: "",
			phone: "",
			date: new Date(),
			timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
			birth: ''
		};

		loadUser(function (user) {
			
		})
	}

	updateBirth() {
		var self = this;
		NativeModules.DateAndroid.showDatepicker(function() {}, function(year, month, day) {
			self.setState({
				birth: day + "/" + month + "/" + year,
				date: day + "/" + month + "/" + year
			});
		});
	}

	setSegment(value) {
		this.setState({ 
			gender: value 
		});
	}

	render() {
		var inputSize = (viewWidth / 2) - 15;

		var header = (
			<View style={ styles.header }>
				<Text>Data de nascimento</Text>
			</View>
		);

		var content = (
			<View>
				<DatePickerIOS
					date={ this.state.date }
					mode="date"
					timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
					onDateChange={(date) => this.setState({ date: date }) } />
			</View>
		);

		return (
			<View style={{ flex: 1, backgroundColor: '#383838' }}>
				<SmartScrollView>
					<View style={ styles.group }>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<TextInput
								placeholder="Nome"
								smartScrollOptions={{
									moveToNext: true,
									type:       'text'
								}}
								style={[ styles.input, { width: inputSize, marginRight: 10 } ]}
							    onChangeText={(text) => this.setState({ name: text }) }
							    value={ this.state.name } />
							<TextInput
								placeholder="Sobrenome"
								smartScrollOptions={{
									moveToNext: true,
									type:       'text'
								}}
								style={[ styles.input, { width: inputSize } ]}
							    onChangeText={(text) => this.setState({ lastname: text }) }
							    value={ this.state.lastname } />
						</View>
					</View>

					<View style={ styles.group }>
						<TextInput
							placeholder="Usuário"
							smartScrollOptions={{
								moveToNext: true,
								type:       'text'
							}}
						    style={ styles.input }
						    onChangeText={(text) => this.setState({ email: text }) }
						    value={ this.state.email } />
					</View>

					<View style={ styles.group }>
						<TextInput
							placeholder="Senha"
							smartScrollOptions={{
								moveToNext: true,
								type:       'text'
							}}
							secureTextEntry={true}
						    style={ styles.input }
						    onChangeText={(text) => this.setState({ password: text }) }
						    value={ this.state.password } />
					</View>

					<View style={ styles.group }>
						<SegmentedControls
							tint="#d6013b"
							options={[ 'Masculino', 'Feminino' ]}
							onSelection={ this.setSegment.bind(this) }
							selectedOption={ this.state.gender } />
					</View>

					<View style={ styles.group }>
						<TextInput
							placeholder="Telefone"
							smartScrollOptions={{
								moveToNext: false,
								type:       'text'
							}}
							keyboardType="phone-pad"
						    style={ styles.input }
						    onChangeText={(text) => this.setState({ phone: text }) }
						    value={ this.state.phone } />
					</View>

					<View style={ styles.group }>
						{ Platform.OS == 'ios' ?
						<Accordion 
							header={ header }
							content={ content }
							easing="easeOutCubic" />
						:
						<Icon.Button name="android-calendar" backgroundColor="#d6013b" onPress={ this.updateBirth.bind(this) }>
							<Text style={{ color: '#fff' }}>Atualizar data de nascimento ({ this.state.birth })</Text>
						</Icon.Button>
						}
					</View>

					<View style={ styles.group }>
						<Icon.Button name="checkmark" backgroundColor="#d6013b" onPress={ this.register.bind(this) }>
							<Text style={{ color: '#fff' }}>Concluído</Text>
						</Icon.Button>
					</View>
				</SmartScrollView>
			</View>
		);
	}

	register() {
		if (this.state.email.length == 0) {
			Alert('Error', 'O campo usuário é obrigatório.');
		} else if (this.state.password.length == 0) {
			Alert('Error', 'O campo senha é obrigatório.');
		} else {
			var user = {
    			name: this.state.name.length > 0 ? this.state.name : this.state.email,
    			lastname: this.state.lastname,
    			gender: this.state.gender,
    			facebook: 0,
    			facebookID: null,
    			image: null,
    			cover: null,
    			email: this.state.email,
    			birth: this.state.birth,
    			user: '',
    			ocupation: '',
    			password: md5(this.state.password),
    			phone: this.state.phone,
    			gcmid: null
    		};

    		var nav = this.props;

    		fetch(Constants.URL + "users", {
	        		method: "POST",
	        		body: JSON.stringify(user),
	        		headers: Constants.HEADERS
	        	})
	        	.then((response) => response.json())
	        	.then((data) => {
	        		console.log(data);
	        		if (data && data.msg) {
	        			user.id = data.id;

		        		console.log('USUÁRIO SALVO NO REGISTRO');
		        		console.log(user);

	        			LoadUser.login(user);
	        			UserActiveModel.add(user).then(function (data) {
	        				nav.resetToRoute({
				          		name: 'Hoje Tem',
				          		component: Main,
				          		data: user,
				          		rightCorner: Search
				          	});
	        			});
		        	} else {
		        		Alert('Error 2', 'Houve um error ao se conectar ao servidor');
		        	}
	        	})
	        	.catch((error) => {
	        		console.log(error);
	        		Alert('Error 1', 'Houve um error ao se conectar ao servidor');
	        	});
		}
	}
}

var styles = StyleSheet.create({
	group: {
		borderBottomWidth: 1,
		borderBottomColor: '#424242',
		padding: 10
	},
	header: {
		padding: 5,
		borderColor: '#DDD',
		borderWidth: 1,
		backgroundColor: '#eee'
	},
	title: {
		color: '#d6013b',
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
		padding: 5,
		fontSize: 12,
		color: '#FFF'
	},
	textArea: {
		height: 100, 
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 5,
		padding: 5,
		color: '#FFF'
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
		borderBottomColor: '#424242',
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
});

module.exports = Register;
