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

class SearchResult extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}).cloneWithRows(props.data)
		};

		user = require('../util/load.user').user[0];
	}

	onClick(row) {
		this.props.toRoute({
			name: row.name,
			component: Store,
			data: row
		});
	}

	renderStores(row) {
		var image = row.icon ? { uri: Constants.IMAGE + 'images/store/' + row.icon } : require('../images/logoSquare.png');
		return (<TouchableOpacity style={ styles.row } onPress={() => this.onClick(row) }>
					<View style={ styles.container }>
						<View style={ styles.texts }>
							<Text style={ styles.title }>{ row.name }</Text>
							<View style={ styles.about }>
								<View style={ styles.item }>
									<Icon style={ styles.icon } name="map" color="#d6013b" size={ 20 } />
									<View style={ styles.text }><Text style={ styles.size }>{ row.address }</Text></View>
								</View>
								<View style={ styles.item }>
									<Icon style={ styles.icon } name="android-calendar" color="#d6013b" size={ 20 } />
									<View style={ styles.text }><Text style={ styles.size }>{ row.event_date.substr(8, 2) + '/' + row.event_date.substr(5, 2) + '/' + row.event_date.substr(0, 4) }</Text></View>
								</View>
								<View style={ styles.item }>
									<Icon style={ styles.icon } name="ios-clock-outline" color="#d6013b" size={ 20 } />
									<View style={ styles.text }><Text style={ styles.size }>{ row.event_time.substr(0, 5) }</Text></View>
								</View>
							</View>
						</View>
						<Image style={ styles.image } source={image} />
					</View>
				</TouchableOpacity>);
	}

	render() {
		return (
			<ListView 
				style={{ backgroundColor: '#383838' }}
				dataSource={ this.state.dataSource }
				renderRow={ this.renderStores.bind(this) } />
		);
	}
}

var styles = StyleSheet.create({
	row: {
		marginTop: 10,
		borderTopColor: '#424242',
		borderTopWidth: 1,
		borderBottomColor: '#424242',
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
		fontWeight: 'bold',
		marginBottom: 5,
		color: '#d6013b'
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
		fontSize: 12,
		color: '#FFF'
	}
});

module.exports = SearchResult;
