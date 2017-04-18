'use strict';

var React = require('react-native');
var {
	Text,
	View,
	Image,
	Navigator,
	TouchableOpacity,
	Component,
	StyleSheet,
	TabBarIOS,
	ListView
} = React;

var Drawer = require('react-native-drawer');

var Icon = require('react-native-vector-icons/MaterialIcons');

var Home = require('./home');
var Stores = require('./stores');

var Constants = require('../constants');


	var Dimensions = require('Dimensions');
	var viewWidth = Dimensions.get('window').width;

var Alert = require('../components/alert');


	var categories = [{
			id: 1,
			title: 'HOJE',
			image: 'images/img/show_1.jpg',
			option: 'today'
		}, {
			id: 2,
			title: 'ESSA SEMANA',
			image: 'images/img/show_2.jpg',
			option: 'week'
		}, {
			id: 3,
			title: 'ESSE MÊS',
			image: 'images/img/show_3.jpg',
			option: 'month'
		}, {
			id: 4,
			title: 'MAIS',
			image: 'images/img/show_4.jpg',
			option: 'more'
		}
	];

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: props.data,
			selectedTab: 'home',
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}).cloneWithRows(categories)
		};
	}

	tabClick(option) {
		this.setState({
			selectedTab: option
		})
	}

	renderCategory(row) {
		var image = { uri: Constants.IMAGE + row.image + '?random_number=' + (new Date().getTime()) };
		console.log(image);
		return (
			<View>
				<TouchableOpacity style={ styles.press } onPress={() => this.tabClick(row.option)}>
					<View style={ styles.categories }>
						<Image style={{ width: viewWidth, height: 200}} source={image} />
						<Text style={ styles.title }>{ row.title }</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	render() {
		return (
			<TabBarIOS
		        tintColor="white"
		        barTintColor="#424242"
		        style={{ backgroundColor: '#323232' }}>
		        <Icon.TabBarItem
		          	title="Inicio"
		          	iconName="home"
		          	selectedIconName="home"
		          	selected={this.state.selectedTab === 'home'}
		          	onPress={() => this.tabClick('home') }>
		          	<ListView dataSource={ this.state.dataSource } renderRow={ this.renderCategory.bind(this) } />
		        </Icon.TabBarItem>
		        <Icon.TabBarItem
		          	title="Hoje"
		          	iconName="view-day"
		          	selectedIconName="view-day"
		          	selected={this.state.selectedTab === 'today'}
		          	onPress={() => this.tabClick('today') }>
		          	<Stores nav={ this.props } options='today' />
		        </Icon.TabBarItem>
		        <Icon.TabBarItem
		          	title="Essa semana"
		          	iconName="view-week"
		          	selectedIconName="view-week"
		          	selected={this.state.selectedTab === 'week'}
		          	onPress={() => this.tabClick('week') }>
		          	<Stores nav={ this.props } options='week' />
		        </Icon.TabBarItem>
		        <Icon.TabBarItem
		          	title="Esse mês"
		          	iconName="view-module"
		          	selectedIconName="view-module"
		          	selected={this.state.selectedTab === 'month'}
		          	onPress={() => this.tabClick('month') }>
		          	<Stores nav={ this.props } options='month' />
		        </Icon.TabBarItem>
		        <Icon.TabBarItem
		          	title="Mais"
		          	iconName="date-range"
		          	selectedIconName="date-range"
		          	selected={this.state.selectedTab === 'more'}
		          	onPress={() => this.tabClick('more') }>
		          	<Stores nav={ this.props } options='more' />
		        </Icon.TabBarItem>
			</TabBarIOS>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#383838'
	},
	content: {
		flex: 1,
		marginBottom: 53
	},
  	tabBar: {
  		flex: 1,
  		flexDirection: 'row',
  		backgroundColor: '#424242',
  		position: 'absolute',
  		bottom: 0
  	},
  	tabBarItem: {
  		alignItems: 'center',
  		paddingTop: 5,
  		paddingBottom: 5
  	},
  	text: {
  		fontSize: 11,
  		marginTop: 4,
  		color: '#FFF'
  	},
  	inactive: {
  		color: '#CCC'
  	},
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
		top: 155,
		left: 0,
		right: 0,
		textAlign: 'center',
		fontSize: 30,
		color: 'FFFFFF',
		backgroundColor: 'rgba(0,0,0,0.6)',
		paddingTop: 5,
		paddingBottom: 5
	}
});


module.exports = Main;