'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper')

var utf8 = require('utf8');

var Constants = require('../constants');

var LoadUser = require('../util/load.user');

var Favorite = require('./favorite');
var Order = require('./order');
var Institutional = require('./institutional');
var Contact = require('./contact');
var Settings = require('./settings');
var About = require('./about');

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
	ScrollView
} = React;

class More extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: require('../util/load.user').user[0]
		};
	}

	componentWillReceiveProps() {
		this.state = {
			user: require('../util/load.user').user[0]
		};
	}

	logout() {
		var nav = this.props.data.nav;
		console.log('nav', nav);
		LoadUser(function (user, userModel) {
			console.log('user', user);
			userModel.destroy().then(function () {
				console.log('destroy');
    			var Login = require('./login');
    			console.log('destroy 2');

    			require('../util/load.user').logout();
    			console.log('destroy 3');

				nav.resetToRoute({
					name: 'Achow',
					component: Login
				});
    		})
		});
	}

	goFavorite() {
		this.props.data.nav.toRoute({
			component: Favorite,
			name: 'Favoritos',
			data: this.state.user
		})
	}

	goOrder() {
		this.props.data.nav.toRoute({
			component: Order,
			name: 'Meus Pedidos',
			data: this.state.user
		})
	}

	goInstitutional() {
		this.props.data.nav.toRoute({
			component: Institutional,
			name: 'Institucional'
		})
	}

	goContact() {
		this.props.data.nav.toRoute({
			component: Contact,
			name: 'Fale Conosco'
		})
	}

	goSettings() {
		this.props.data.nav.toRoute({
			component: Settings,
			name: 'Configurações',
			data: this.state.user
		})
	}

	goAbout() {
		this.props.data.nav.toRoute({
			component: About,
			name: 'Sobre'
		})
	}

	render() {
		var image = this.state.user.image ? (this.state.user.image.indexOf('http') >= 0 ? this.state.user.image : Constants.IMAGE + this.state.user.image) : false;
		var cover = this.state.user.cover ? this.state.user.cover : false;

		return (
			<ScrollView style={ styles.container }>
				{ cover ? 
				<Image style={ styles.cover } source={{ uri: this.state.user.cover }} />
				: <View style={{ height: 150 }} /> }
				{ image ? 
				<View style={ styles.profileArea }>
					<Image style={ styles.profile } source={{ uri: image }} />
				</View>
				: <View /> }

				<Text style={ styles.name }>{ this.state.user.name + ' ' + this.state.user.lastname }</Text>
				<View style={ styles.about }>
					<TouchableOpacity onPress={() => this.goSettings() }>
						<View style={ styles.item }>
							<Icon style={ styles.icon } name="ios-gear" color="#d6013b" size={ 20 } />
							<View style={ styles.text }><Text style={ styles.tColor }>Editar Perfil</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.goAbout() }>
						<View style={ styles.item }>
							<Icon style={ styles.icon } name="code" color="#d6013b" size={ 20 } />
							<View style={ styles.text }><Text style={ styles.tColor }>Sobre o aplicativo</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.logout() }>
						<View style={ styles.item }>
							<Icon style={ styles.icon } name="log-out" color="#d6013b" size={ 20 } />
							<View style={ styles.textLast }><Text style={ styles.tColor }>Sair</Text></View>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#383838'
	},
	cover: {
		height: 150,
		top: 0,
		left: 0,
		right: 0
	},
	profileArea: {
		position: 'absolute',
		top: 20,
		left: 0,
		right: 0,
		justifyContent: 'center',
		backgroundColor: 'transparent'
	},
	profile: {
		alignSelf: 'center',
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: '#fff',
		alignItems: 'center'
	},
	name: {
		textAlign: 'center',
		fontSize: 20,
		margin: 10,
		color: '#d6013b'
	},
	about: {
		borderTopColor: '#424242',
		borderTopWidth: 1,
		borderBottomColor: '#424242',
		borderBottomWidth: 1
	},
	item: {
		flex: 1,
		flexDirection: 'row'
	},
	icon: {
		margin: 10,
	},
	text: {
		flex: 1,
		padding: 10,
		paddingTop: 12,
		borderBottomColor: '#424242',
		borderBottomWidth: 1
	},
	textLast: {
		flex: 1,
		padding: 10,
		paddingTop: 12,
	},
	tColor: {
		color: '#FFF'
	}
});

module.exports = More;
