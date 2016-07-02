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

//var GcmAndroid = require('react-native-gcm-android');

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
	          		name: 'HOJE TEM',
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

		/*GcmAndroid.addEventListener('register', function(token){
			Token = token;
		});

		GcmAndroid.requestPermissions();*/
	}

	_getFBCredentials() {
		// 'email', 'public_profile', 'user_photos', 
		SocialAuth.getFacebookCredentials(['email', 'public_profile', 'user_photos'], SocialAuth.facebookPermissionsType.read, (error, credentials) => {
			this.setState({
				error,
				credentials,
			});

			Constants.CREDENTIALS = credentials;
			console.log(credentials);

			if (credentials) {
				var url = 'https://graph.facebook.com/v2.3/' + credentials.userId +'?access_token=' + credentials.accessToken + '&fields=first_name,last_name,gender,email,cover,picture.type(large)&format=json';
		        
		        var nav = this.props;

		        var face = false;
		        var cover = false;

		        fetch(url).then((response) => response.json()).then((facebookUser) => {

			        if (facebookUser && facebookUser.picture && facebookUser.picture.data && facebookUser.picture.data.url) {
			        	face = facebookUser.picture.data.url;
			        }		        
			        if (facebookUser && facebookUser.cover && facebookUser.cover.source) {
			        	cover = facebookUser.cover.source;
			        }
			        
		        	fetch(Constants.URL + "users/login/facebook", {
		        		method: "POST",
		        		body: JSON.stringify({
		        			facebookID: credentials.userId,
		        			gcmid: Token,
		        			image: face,
			        		cover: cover,
		        		}),
		        		headers: Constants.HEADERS
		        	})
		        	.then((response) => response.json())
		        	.then((hojeTemUser) => {
		        		if (hojeTemUser.length > 0) {
		        			LoadUser.login(hojeTemUser[0]);
			        		UserActiveModel.add(hojeTemUser[0]).then(function (data) {
			        			nav.replaceRoute({
					          		name: 'HOJE TEM',
					          		component: Main,
					          		data: hojeTemUser[0],
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
			        			image: face,
			        			cover: cover,
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
								          		name: 'HOJE TEM',
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
		        		Alert('Error', 'Houve um error ao se conectar ao servidor');
		        	});
		        });
			}
		});
	}

	login() {
		this.props.toRoute({
			name: 'HOJE TEM',
			component: LoginEmail
		})	
	}

	register() {
		this.props.toRoute({
			name: 'HOJE TEM',
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
					<Icon.Button style={ styles.button } name="email" backgroundColor="#fff" color="#d6013b" onPress={this.login.bind(this)}>
						Entrar com e-mail
					</Icon.Button>
				</View>
				<View style={ styles.view }>
					<Icon.Button name="compose" backgroundColor="#383838" onPress={this.register.bind(this)}>
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
		backgroundColor: '#383838',
	},
	image: {
		marginTop: 50,
		marginBottom: 80,
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
	}
});

module.exports = Login;
