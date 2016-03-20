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
		var nav = this.props.nav;
		LoadUser(function (user, userModel) {
			userModel.destroy().then(function () {
    			var Login = require('./login');

    			require('../util/load.user').logout();

				nav.resetToRoute({
					name: 'Achow',
					component: Login
				});
    		})
		});
	}

	goFavorite() {
		this.props.nav.toRoute({
			component: Favorite,
			name: 'Favoritos',
			data: this.state.user
		})
	}

	goOrder() {
		this.props.nav.toRoute({
			component: Order,
			name: 'Meus Pedidos',
			data: this.state.user
		})
	}

	goInstitutional() {
		this.props.nav.toRoute({
			component: Institutional,
			name: 'Institucional'
		})
	}

	goContact() {
		this.props.nav.toRoute({
			component: Contact,
			name: 'Fale Conosco'
		})
	}

	goSettings() {
		this.props.nav.toRoute({
			component: Settings,
			name: 'Configurações',
			data: this.state.user
		})
	}

	goAbout() {
		this.props.nav.toRoute({
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
				: <View /> }
				{ image ? 
				<View style={ styles.profileArea }>
					<Image style={ styles.profile } source={{ uri: image }} />
				</View>
				: <View /> }

				<Text style={ styles.name }>{ this.state.user.name + ' ' + this.state.user.lastname }</Text>
				<View style={ styles.about }>
					<TouchableOpacity onPress={() => this.goFavorite() }>
						<View style={ styles.item }>
							<Icon style={ styles.icon } name="ios-star" color="#4F8EF7" size={ 20 } />
							<View style={ styles.text }><Text>Favoritos</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.goOrder() }>
						<View style={ styles.item }>
							<Icon style={ styles.icon } name="ios-cart" color="#4F8EF7" size={ 20 } />
							<View style={ styles.text }><Text>Meus Pedidos</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.goSettings() }>
						<View style={ styles.item }>
							<Icon style={ styles.icon } name="ios-gear" color="#4F8EF7" size={ 20 } />
							<View style={ styles.text }><Text>Editar Perfil</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.goInstitutional() }>
						<View style={ styles.item }>
							<Icon style={ styles.icon } name="ios-information" color="#4F8EF7" size={ 20 } />
							<View style={ styles.text }><Text>Institucional</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.goContact() }>
						<View style={ styles.item }>
							<Icon style={ styles.icon } name="ios-help" color="#4F8EF7" size={ 20 } />
							<View style={ styles.text }><Text>Fale Conosco</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.goAbout() }>
						<View style={ styles.item }>
							<Icon style={ styles.icon } name="code" color="#4F8EF7" size={ 20 } />
							<View style={ styles.text }><Text>Sobre o aplicativo</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.logout() }>
						<View style={ styles.item }>
							<Icon style={ styles.icon } name="log-out" color="#4F8EF7" size={ 20 } />
							<View style={ styles.textLast }><Text>Sair</Text></View>
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
		color: '#03a9f4'
	},
	about: {
		borderTopColor: '#DDD',
		borderTopWidth: 1,
		borderBottomColor: '#DDD',
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
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	textLast: {
		flex: 1,
		padding: 10,
		paddingTop: 12,
	},
});

module.exports = More;
