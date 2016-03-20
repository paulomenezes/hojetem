'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Swiper = require('react-native-swiper')
var ViewPager = require('react-native-viewpager');

var Subcategory = require('./subcategory');
var Show = require('./show');

var Constants = require('../constants');

var Dimensions = require('Dimensions');
var viewWidth = Dimensions.get('window').width;

var Alert = require('../components/alert');
var Like = require('../components/like');

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
	Platform
} = React;

var categories = [
	{
		icon: null
	}, {
		id: 1,
		title: 'Onde Comer',
		image: require('../images/ondecomer.jpg'),
		icon: 'android-restaurant',
		subcategories: []
	}, {
		id: 2,
		title: 'Onde Comprar',
		image: require('../images/ondecomprar.jpg'),
		icon: 'bag',
		subcategories: []
	}, {
		id: 3,
		title: 'Onde Curtir',
		image: require('../images/ondecurtir.jpg'),
		icon: 'beer',
		subcategories: []
	}, {
		id: 4,
		title: 'Onde Ficar',
		image: require('../images/diversos.jpg'),
		icon: 'home',
		subcategories: []
	}, {
		id: 5,
		title: 'Saúde',
		image: require('../images/saude.jpg'),
		icon: 'medkit',
		subcategories: []
	}, {
		id: 6,
		title: 'Estética e Beleza',
		image: require('../images/esteticasebeleza.jpg'),
		icon: 'tshirt',
		subcategories: []
	}, {
		id: 7,
		title: 'Animais',
		image: require('../images/animais.jpg'),
		icon: 'ios-paw',
		subcategories: []
	}, {
		id: 9,
		title: 'Autos e Transportes',
		image: require('../images/autosetransportes.jpg'),
		icon: 'android-car',
		subcategories: []
	}, {
		id: 10,
		title: 'Serviços Públicos e Telefones Úteis',
		image: require('../images/servicospublicosetelefonesuteis.jpg'),
		icon: 'ios-telephone',
		subcategories: []
	}, {
		id: 11,
		title: 'Prestadores de Serviços',
		image: require('../images/prestadoresdeservicos.jpg'),
		icon: 'wrench',
		subcategories: []
	}, {
		id: 12,
		title: 'Shopping',
		image: require('../images/shopping.jpg'),
		icon: 'ios-cart',
		subcategories: []
	}, {
		id: 13,
		title: 'Educação',
		image: require('../images/educacao.jpg'),
		icon: 'university',
		subcategories: []
	}, {
		id: 14,
		title: 'Classificados',
		image: require('../images/classificados.jpg'),
		icon: 'document-text',
		subcategories: []
	}, {
		id: 15,
		title: 'Casa e Construção',
		image: require('../images/casaeconstrucao.jpg'),
		icon: 'ios-home',
		subcategories: []
	}
];

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: false,
			user: props.nav.data,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}).cloneWithRows(categories),
			dataSourceImages: new ViewPager.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			items: []
		}

		fetch(Constants.URL + "ads/shows")
			.then((response) => response.json())
			.then((shows) => {
				var items = [];
				for (var i = 0; i < shows.length; i++) {
					items.push(shows[i]);
				};

				this.setState({
					items: items,
					dataSourceImages: this.state.dataSourceImages.cloneWithPages(items),
					loaded: true
				});
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
        	});
	}

	renderLoadingView() {
		return (
			<ActivityIndicatorIOS
		        animating={this.state.animating}
		        style={[ null, { height: 162 } ]}
		        size="large" />
		);
	}

	openSubCategory(row) {
		if (row.subcategories.length == 0) {
			fetch(Constants.URL + "sub_types/get/" + row.id)
				.then((response) => response.json())
				.then((subtypes) => {
					row.subcategories = subtypes;

					this.props.nav.toRoute({
						name: row.title,
						component: Subcategory,
						data: subtypes
					})
				})
				.catch((error) => {
					Alert('Error', 'Houve um error ao se conectar ao servidor');
	        	});
		} else {
			this.props.nav.toRoute({
				name: row.title,
				component: Subcategory,
				data: row.subcategories
			})
		}
	}

	openShows(show) {
		this.props.nav.toRoute({
			name: show.name,
			component: Show,
			data: show,
			rightCorner: Like,
			rightCornerProps: {
				user: this.state.user,
				show: show
			}
		})
	}

	renderCategory(row) {
		if (row.icon != null) {
			return (
				<View>
					<TouchableOpacity style={ styles.press } onPress={() => this.openSubCategory(row)}>
						<View style={ styles.categories }>
							<Image style={ styles.image } source={row.image} />
							
							<View style={ styles.iconArea }>
								<Icon style={ styles.icon } name={ row.icon } size={ 30 } />
							</View>
							<Text style={ styles.title }>{ row.title }</Text>
						</View>
					</TouchableOpacity>
				</View>
			);
		} else {
			var self = this;
			if (!this.state.loaded) {
				return this.renderLoadingView();
			} else {
				return (
					<View style={{ height:162 }}>
						<ViewPager
							dataSource={this.state.dataSourceImages}
							renderPage={this._renderPage.bind(this)}
							isLoop={true}
							autoPlay={true}/>
					</View>
				);
			}
		}
	}

	_renderPage(data, pageID) {
		return (
			<TouchableOpacity onPress={() => this.openShows(data) }>
				<Image key={ pageID } style={{ width: viewWidth, height: 160 }} source={{ uri: Constants.IMAGE + 'images/store/' + data.image }} />
			</TouchableOpacity>
		)
	}

	render() {
		return (
			<ListView 
				dataSource={ this.state.dataSource }
				renderRow={ this.renderCategory.bind(this) } />
		);
	}
}

var styles = StyleSheet.create({
	page: {
		width: 100
	},
	press: {
		marginBottom: 2
	},
	categories: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch'
	},
	opacity: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)'
	},
	title: {
		position: 'absolute',
		top: 110,
		left: 0,
		right: 0,
		textAlign: 'center',
		fontSize: 30,
		color: 'FFFFFF',
		backgroundColor: 'rgba(0,0,0,0)'
	}, 
	image: {

	},
	iconArea: {
		position: 'absolute',
		top: 60,
		left: 0,
		right: 0,
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0)'
	},
	icon: {
		alignSelf: 'center',
		paddingHorizontal: 8,
		paddingVertical: 5,
		color: '#FFFFFF',
		textAlign: 'center',
		borderRadius: 22,
		borderWidth: 2,
		borderColor: '#FFFFFF',
		width: 44,
		height: 44,
		backgroundColor: 'rgba(0,0,0,0)'
	}
});

module.exports = Home;
