'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ViewPager = require('react-native-viewpager');
var Constants = require('../constants');

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
	ScrollView,
	IntentAndroid
} = React;

class StorePhotos extends React.Component {
	constructor(props) {
		super(props);

		console.log(props.data);

		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}).cloneWithRows(props.data)
		}
	}

	_renderPage(data) {
		var image = data.UserImage.indexOf('http') >= 0 ? data.UserImage : Constants.IMAGE + data.UserImage;
		
		return (
			<View style={{ marginBottom: 10 }}>
				<View style={ styles.item }>
					<Image style={ styles.image } source={{ uri: image }} />
					<View style={ styles.text }>
						<Text style={ styles.name }>{ data.UserName + ' ' + data.UserLastname }</Text>
						<Text>{ data.message }</Text>
					</View>
				</View>

				<View style={ styles.picArea }>
					<Image style={ styles.pic } source={{ uri: Constants.IMAGE + data.CheckinImage }} />
				</View>
			</View>
		);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<ListView
					style={{ flex: 1 }}
					dataSource={this.state.dataSource}
					renderRow={this._renderPage.bind(this)}/>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	item: {
		flex: 1,
		flexDirection: 'row'
	},
	icon: {
		margin: 10,
	},
	image: {
		width: 50,
		height: 50,
		margin: 10,
		borderRadius: 25
	},
	text: {
		flex: 1,
		padding: 10,
		paddingTop: 12
	},
	name: {
		fontWeight: 'bold',
		color: '#d6013b',
		fontSize: 16
	},
	picArea: {
		flex: 1,
		alignItems: 'stretch'
	},
	pic: {
		flex: 1,
		height: 300
	}
});

module.exports = StorePhotos;