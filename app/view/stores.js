'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var utf8 = require('utf8');

var Constants = require('../constants');

var Store = require('./store');
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
	Image
} = React;

var user;

var Alert = require('../components/alert');

class Stores extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			})
		};

		user = require('../util/load.user').user[0];

		fetch(Constants.URL + 'stores/filtro/' + props.options)
			.then((response) => response.json())
			.then((stores) => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(stores)
				})
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
			});
	}

	onClick(row) {
		this.props.toRoute({
			name: decodeURIComponent(escape(row.name)),
			component: Store,
			data: row,
			rightCorner: Like,
			rightCornerProps: {
				user: user,
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

module.exports = Stores;
