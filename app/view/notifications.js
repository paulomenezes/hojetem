'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Swiper = require('react-native-swiper')

var Subcategory = require('./subcategory');
var User = require('./user');
var Meeting = require('./meeting');

var Constants = require('../constants');

var Dimensions = require('Dimensions');
var viewHeight = Dimensions.get('window').height;

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

class Notifications extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			user: props.nav.data,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
		}

		this.loadNotifications();
	}

	loadNotifications() {
		var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

		fetch(Constants.URL + 'notifications/' + id + '/read')
			.then((response) => response.json())
			.then((notifications) => {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(notifications.notifications)
				});
			})
			.catch((error) => {
				console.log(error);
	    		Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
	}

	goUser(user) {
		this.props.nav.toRoute({
			name: user.name,
			component: User,
			data: user
		})
	}

	goMeeting(notification) {
		console.log(notification);

		this.props.nav.toRoute({
			name: notification.storeName,
			component: Meeting,
			data: notification
		})
	}

	renderNotifications(notification) {
		var image = notification.image ? Constants.IMAGE + notification.image : (notification.icon ? Constants.IMAGE + 'images/store/' + notification.icon : false);

		if (notification.storeName) {
			return (
				<TouchableOpacity style={ styles.item } onPress={() => this.goMeeting(notification) }>
					<View style={ styles.item }>
						{ image ? 
						<Image style={ styles.image } source={{ uri: image }} />
						: <View style={ styles.image } /> }
						<View style={ styles.text }>
							<Text style={ styles.nameFriend }>O usuário { notification.name } convidou você para ir ao { notification.storeName }</Text>
							<Text style={{ color: '#03a9f4' }}>{ notification.message }</Text>
						</View>
					</View>	
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableOpacity style={ styles.item } onPress={() => this.goUser(notification) }>
					{ image ? 
					<Image style={ styles.image } source={{ uri: image }} />
					: <View style={ styles.image } /> }
					<View style={ styles.text }>
						<Text style={ styles.nameFriend }>O usuário { notification.name } lhe enviou uma mensagem</Text>
						<Text style={{ color: '#03a9f4' }}>{ notification.message }</Text>
					</View>
				</TouchableOpacity>
			);
		}
	}

	render() {
		return (
			<ListView 
				style={{ flex: 1 }}
				dataSource={ this.state.dataSource }
				renderRow={ this.renderNotifications.bind(this) } />
		);
	}
}

var styles = StyleSheet.create({
	view: {
		flex: 1,
	},
	segmented: {
		margin: 10
	},
	item: {
		flex: 1,
		flexDirection: 'row'
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
		paddingTop: 12,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	nameFriend: {
		fontSize: 16
	},
	buttons: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	button: {
		borderColor: '#03a9f4',
		borderWidth: 1,
	},
	button2: {
		borderColor: '#03a9f4',
		borderWidth: 1,
	},
	sendButton: {
		color: '#fff'
	},
	sendButton2: {
		color: '#03a9f4'
	},
});

module.exports = Notifications;