'use strict';

import React from 'react-native';

const {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
	TouchableHighlight,
	Image,
	AlertIOS,
	TextInput
} = React;

import SocialAuth from 'react-native-social-auth';
var md5 = require("md5");

var Main = require('./main');
var Constants = require('../constants');
var Icon = require('react-native-vector-icons/Ionicons');

var reactStore = require('react-native-store');

var LoadUser = require('../util/load.user');

var UserActiveModel = null;

var BackButton = require('../components/backButton');
var Search = require('../components/search');

var Dimensions = require('Dimensions');
var viewWidth = Dimensions.get('window').width;

import SmartScrollView from 'react-native-smart-scroll-view';

var Alert = require('../components/alert');

var loadUser = function (callback) {
	LoadUser(function (user, userModel) {
		UserActiveModel = userModel;
		callback(user);
	});
}

class LoginEmail extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			error: null,
			credentials: null,
			loading: true,
			email: '',
			password: ''
		};

		loadUser(function (user) {
			
		})
	}

	login() {
		var nav = this.props;

		fetch(Constants.URL + "users/login", {
        		method: "POST",
        		body: JSON.stringify({
        			'email': this.state.email,
        			'password': md5(this.state.password),
        			'gcmid': ''
        		}),
        		headers: Constants.HEADERS
        	})
        	.then((response) => response.json())
        	.then((user) => {
        		if (user.length > 0) {
        			LoadUser.login(user[0]);
	        		UserActiveModel.add(user[0]).then(function (data) {
	        			nav.resetToRoute({
			          		name: 'HojeTem',
			          		component: Main,
			          		data: user[0],
			          		rightCorner: Search
			          	});
	        		});
        		} else {
        			Alert('Error', 'Usuário não encontrado');
        		}
        	})
        	.catch((error) => {
        		Alert('Error', 'Houve um error ao se conectar ao servidor');
        	});
	}

	render() {
		return (
			<View style={{ backgroundColor: '#d6013b', flex: 1 }}>
			<SmartScrollView>
				<View style={styles.container}>
					<Image style={ styles.image } source={ require('../images/logo.png') } />
					<View>
						<TextInput
							smartScrollOptions={{
								moveToNext: true,
								type:       'text'
							}}
							keyboardType='email-address'
							placeholder="E-mail"
							autoFocus={ true }
						    style={ styles.textArea }
						    onChangeText={(text) => this.setState({email: text})}
						    value={this.state.email} />
						<TextInput
							smartScrollOptions={{
								moveToNext: false,
								type: 'text'
							}}
							secureTextEntry={true}
							placeholder="Senha"
						    style={ styles.textArea }
						    onChangeText={(text) => this.setState({password: text})}
						    value={this.state.password} />
					</View>
					<View style={ styles.view }>
						<Icon.Button style={ styles.button } name="email" backgroundColor="#fff" color="#d6013b" onPress={this.login.bind(this)}>
							<Text style={{color:'#d6013b'}}>Entrar</Text>
						</Icon.Button>
					</View>
					<View style={ styles.view }>
						<Icon.Button name="compose" backgroundColor="#d6013b" onPress={this.login.bind(this)}>
							<Text style={{color:'#fff'}}>Criar conta</Text>
						</Icon.Button>
					</View>
				</View>
			</SmartScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	scroll: {
		flex: 1,
		backgroundColor: '#d6013b',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#d6013b',
	},
	image: {
		marginTop: 20,
		marginBottom: 40,
		width: 150,
		height: 150,
		resizeMode: "stretch"
	},
	view: {
		marginBottom: 10
	},
	button: {
		paddingLeft: 40,
		paddingRight: 40,
		width: 250
	},
	textArea: {
		width: 250,
		height: 35, 
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 5,
		margin: 10,
		marginTop: 0,
		padding: 5,
		backgroundColor: '#fff'
	},
});

module.exports = LoginEmail;