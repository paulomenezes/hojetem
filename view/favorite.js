'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Swiper = require('react-native-swiper')

var Subcategory = require('./subcategory');

var Constants = require('../constants');

var Dimensions = require('Dimensions');
var viewHeight = Dimensions.get('window').height;

var Store = require('./store');
var Like = require('../components/like');

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
	AlertIOS,
	ActivityIndicatorIOS,
	SegmentedControlIOS
} = React;

class Favorite extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			user: props.data,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
		}

		this.loadNotifications();
	}

	loadNotifications() {
		var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

		fetch(Constants.URL + 'store_visited/' + id + '/favorite')
			.then((response) => response.json())
			.then((favorites) => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(favorites)
				});
			})
			.catch((error) => {
	    		Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	onClick(row) {
		this.props.toRoute({
			name: row.name,
			component: Store,
			data: row,
			rightCorner: Like,
			rightCornerProps: {
				user: this.state.user,
				store: row
			}
		});
	}

	renderStores(row) {
		var image = row.icon ? { uri: Constants.IMAGE + 'images/store/' + row.icon } : require('../images/logoSquare.png');
		return (<TouchableOpacity style={ styles.row } onPress={() => this.onClick(row) }>
					<View style={ styles.container }>
						<Image style={ styles.image } source={image} />
						<View style={ styles.texts }>
							<Text style={ styles.title }>{ decodeURIComponent(escape(row.name)) }</Text>
							<View style={ styles.about }>
								<View style={ styles.item }>
									<Icon style={ styles.icon } name="map" color="#4F8EF7" size={ 20 } />
									<View style={ styles.text }><Text style={ styles.size }>{ decodeURIComponent(escape(row.address)) }</Text></View>
								</View>
								<View style={ styles.item }>
									<Icon style={ styles.icon } name="ios-telephone" color="#4F8EF7" size={ 20 } />
									<View style={ styles.text }><Text style={ styles.size }>{ decodeURIComponent(escape(row.phone1)) }</Text></View>
								</View>
							</View>
						</View>
					</View>
				</TouchableOpacity>);
	}

	render() {
		return (
			<ListView 
				style={{ flex: 1 }}
				dataSource={ this.state.dataSource }
				renderRow={ this.renderStores.bind(this) } />
		);
	}
}

var styles = StyleSheet.create({
	row: {
		marginTop: 10,
		borderTopColor: '#ddd',
		borderTopWidth: 1,
		borderBottomColor: '#ddd',
		borderBottomWidth: 1,
	},
	container: {
		flex: 1,
		flexDirection: 'row'
	},
	texts: {
		flex: 1,
		padding: 5
	},
	image: {
		width: 100,
		height: 100
	},
	title: {
		fontSize: 18,
		marginBottom: 5
	},
	item: {
		flex: 1,
		flexDirection: 'row'
	},
	icon: {
		margin: 4,
		marginBottom: 0
	},
	text: {
		flex: 1,
		padding: 4,
		paddingBottom: 0
	},
	size: {
		marginTop: 3,
		fontSize: 12
	}
});

module.exports = Favorite;