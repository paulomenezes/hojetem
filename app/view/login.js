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
	AlertIOS
} = React;

import SocialAuth from 'react-native-social-auth';

var Main = require('./main');
var LoginEmail = require('./loginEmail');
var Register = require('./register');

var Constants = require('../constants');
var Icon = require('react-native-vector-icons/Ionicons');

var reactStore = require('react-native-store');

var LoadUser = require('../util/load.user');

var UserActiveModel = null;

var BackButton = require('../components/backButton');
var Search = require('../components/search');

var Dimensions = require('Dimensions');
var viewWidth = Dimensions.get('window').width;

var Alert = require('../components/alert');

var GcmAndroid = require('react-native-gcm-android');

var Token;

var loadUser = function (callback) {
	LoadUser(function (user, userModel) {
		UserActiveModel = userModel;
		callback(user);
	});
}

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			error: null,
			credentials: null,
			loading: true
		}

		var nav = this.props;

		loadUser(function (user) {
			if (user) {
    			nav.replaceRoute({
	          		name: 'Achow',
	          		component: Main,
	          		data: user[0],
	          		rightCorner: Search
	          	});
    		} else {
	    		this.setState({
	    			loading: false
	    		});
	    	}
    	});
	}

	componentDidMount() {
		var self = this;

		GcmAndroid.addEventListener('register', function(token){
			Token = token;
		});

		GcmAndroid.requestPermissions();
	}

	_getFBCredentials() {
		SocialAuth.getFacebookCredentials(['email', 'public_profile', 'user_photos'], SocialAuth.facebookPermissionsType.read, (error, credentials) => {
			this.setState({
				error,
				credentials,
			});

			if (credentials) {
				var url = 'https://graph.facebook.com/v2.3/' + credentials.userId +'?access_token=' + credentials.accessToken + '&fields=first_name,last_name,gender,email,cover,picture.type(large)&format=json';
		        
		        var nav = this.props;

		        fetch(url).then((response) => response.json()).then((facebookUser) => {
		        	fetch(Constants.URL + "users/login/facebook", {
		        		method: "POST",
		        		body: JSON.stringify({
		        			facebookID: credentials.userId,
		        			gcmid: Token,
		        			image: facebookUser.picture.data.url ? facebookUser.picture.data.url : false,
			        		cover: facebookUser.cover.source ? facebookUser.cover.source : false,
		        		}),
		        		headers: Constants.HEADERS
		        	})
		        	.then((response) => response.json())
		        	.then((achowUser) => {
		        		console.log('achowUser');
		        		console.log(achowUser);
		        		if (achowUser.length > 0) {
		        			LoadUser.login(achowUser[0]);
			        		UserActiveModel.add(achowUser[0]).then(function (data) {
			        			nav.replaceRoute({
					          		name: 'Achow',
					          		component: Main,
					          		data: achowUser[0],
					          		rightCorner: Search
					          	});
			        		});
			        	} else {
			        		var user = {
			        			name: facebookUser.first_name,
			        			lastname: facebookUser.last_name,
			        			gender: facebookUser.gender ? (facebookUser.gender == 'male' ? 'Masculino' : 'Feminino') : '',
			        			facebook: 1,
			        			facebookID: facebookUser.id,
			        			image: facebookUser.picture.data.url ? facebookUser.picture.data.url : '',
			        			cover: facebookUser.cover.source ? facebookUser.cover.source : '',
			        			email: '',
			        			birth: '',
			        			user: '',
			        			ocupation: '',
			        			password: '',
			        			phone: '',
			        			gcmid: null
			        		};

			        		fetch(Constants.URL + "users", {
					        		method: "POST",
					        		body: JSON.stringify(user),
					        		headers: Constants.HEADERS
					        	})
					        	.then((response) => response.json())
					        	.then((data) => {
					        		if (data && data.msg) {
					        			user.id = data.id;

					        			LoadUser.login(user);
					        			UserActiveModel.add(user).then(function (data) {
					        				nav.replaceRoute({
								          		name: 'Achow',
								          		component: Main,
								          		data: user,
								          		rightCorner: Search
								          	});
					        			});
						        	} else {
						        		Alert('Error', 'Houve um error ao se conectar ao servidor');
						        	}
					        	})
					        	.catch((error) => {
					        		Alert('Error', 'Houve um error ao se conectar ao servidor');
					        	});
			        	}
		        	})
		        	.catch((error) => {
		        		console.log('173');
		        		console.log(error);
		        		Alert('Error', 'Houve um error ao se conectar ao servidor');
		        	});
		        });
			}
		});
	}

	login() {
		this.props.toRoute({
			name: 'Achow',
			component: LoginEmail
		})	
	}

	register() {
		this.props.toRoute({
			name: 'Achow',
			component: Register
		})	
	}

	render() {
		return (
			<View style={styles.container}>
				<Image style={ styles.image } source={ require('../images/logo.png') } />
				<View style={ styles.view }>
					<Icon.Button style={ styles.button } name="social-facebook" backgroundColor="#3b5998" onPress={this._getFBCredentials.bind(this)}>
						Entrar com o Facebook
					</Icon.Button>
				</View>
				<View style={ styles.view }>
					<Icon.Button style={ styles.button } name="email" backgroundColor="#fff" color="#03a9f4" onPress={this.login.bind(this)}>
						Entrar com e-mail
					</Icon.Button>
				</View>
				<View style={ styles.view }>
					<Icon.Button name="compose" backgroundColor="#03a9f4" onPress={this.register.bind(this)}>
						Criar conta
					</Icon.Button>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: '#03a9f4',
	},
	image: {
		marginTop: 50,
		marginBottom: 80,
		width: 300,
		height: 137,
		resizeMode: "stretch"
	},
	view: {
		marginBottom: 10
	},
	button: {
		paddingLeft: 40,
		paddingRight: 40,
		width: 250
	}
});

module.exports = Login;
