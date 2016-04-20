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

var categories = [{
		id: 1,
		title: 'Hoje',
		image: require('../images/ondecomer.jpg'),
		subcategories: []
	}, {
		id: 2,
		title: 'Essa Semana',
		image: require('../images/ondecomprar.jpg'),
		subcategories: []
	}, {
		id: 3,
		title: 'Esse Mês',
		image: require('../images/ondecurtir.jpg'),
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
			}).cloneWithRows(categories)
		}
	}

	openSubCategory(row) {
		
	}

	renderCategory(row) {
		return (
			<View>
				<TouchableOpacity style={ styles.press } onPress={() => this.openSubCategory(row)}>
					<View style={ styles.categories }>
						<Image style={ styles.image } source={row.image} />
						<Text style={ styles.title }>{ row.title }</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
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
	press: {
		marginBottom: 2
	},
	categories: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
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
	}
});

module.exports = Home;
