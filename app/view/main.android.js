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
	DeviceEventEmitter
} = React;

var GcmAndroid = require('react-native-gcm-android');
import Notification from 'react-native-system-notification';

if (GcmAndroid.launchNotification) {
	var notification = GcmAndroid.launchNotification;

	Notification.create({
		subject: notification.data.title,
		message: notification.data.msg,
		category: 'social',
		action: notification.data.action,
		payload: {
			data: JSON.parse(notification.data.user),
		}
	});

	GcmAndroid.stopService();
} else {

	var Drawer = require('react-native-drawer');

	var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';

	var Icon = require('react-native-vector-icons/Ionicons');

	var Home = require('./home');
	var Contacts = require('./contacts');
	var Notifications = require('./notifications');
	var ChatRooms = require('./chatRooms');
	var More = require('./more');
	var Login = require('./login');

	var Constants = require('../constants');

	var Dimensions = require('Dimensions');
	var viewWidth = Dimensions.get('window').width;

	var Alert = require('../components/alert');

	class Main extends Component {
		constructor(props) {
			super(props);

			this.state = {
				user: props.data,
				selectedTab: 'home',
				notifCount: 0,
				presses: 0,	
				requests: 0,
				notifications: 0,
				contactsOptions: false
			};

			this.loadRequests();
			this.loadNotifications();
		}

		componentDidMount() {
			var self = this;

			GcmAndroid.addEventListener('notification', function(notification){
				if (!GcmAndroid.isInForeground) {
					Notification.create({
						subject: notification.data.title,
						message: notification.data.msg,
						category: 'social',
						action: notification.data.action
					});
				}
			});

			DeviceEventEmitter.addListener('sysNotificationClick', function(e) {
				console.log('sysNotificationClick', e);

				if (e.action == "Solicitações") {
					self.setState({
						selectedTab: 'contacts',
						contactsOptions: true
					})
				} else if (e.action == "Chat") {
					self.setState({
						selectedTab: 'notifications'
					})
				} else if (e.action == "Group") {
					self.setState({
						selectedTab: 'chat'
					})
				} else if (e.action == "Meeting") {
					self.setState({
						selectedTab: 'notifications'
					})
				}
			});

			GcmAndroid.requestPermissions();
		}

		loadRequests() {
			var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

			fetch(Constants.URL + 'users/' + id + '/requests')
				.then((response) => response.json())
				.then((requests) => {
					this.setState({
						requests: requests.length,
					});
				})
				.catch((error) => {
		    		Alert('Error', 'Houve um error ao se conectar ao servidor');
		    	});
		}

		loadNotifications() {
			var id = this.state.user.idAccount ? this.state.user.idAccount : this.state.user.id;

			fetch(Constants.URL + 'notifications/' + id)
				.then((response) => response.json())
				.then((notifications) => {
					var total = 0;
					for (var i = 0; i < notifications.notifications.length; i++) {
						if (!notifications.notifications[i].read || notifications.notifications[i].read == 0) {
							total++;
						}
					};
					
					this.setState({
						notifications: total
					});
				})
				.catch((error) => {
		    		Alert('Error', 'Houve um error ao se conectar ao servidor');
		    	});
		}

		tabClick(option) {
			this.setState({
				selectedTab: option
			})
		}

		render() {
			var iconSize = viewWidth / 5;

			var page = <View />;
			if (this.state.selectedTab == 'home') 
				page = <Home nav={ this.props } />;
			else if (this.state.selectedTab == 'notifications')
				page = <Notifications nav={ this.props } />; 
			else if (this.state.selectedTab == 'contacts')
				page = <Contacts nav={ this.props } options={ this.state.contactsOptions } />; 
			else if (this.state.selectedTab == 'chat')
				page = <ChatRooms nav={ this.props } />; 
			else if (this.state.selectedTab == 'more')
				page = <More nav={ this.props } user={ this.state.user } />; 

			return (
				<View style={ styles.container }>
					<View style={ styles.content }>
						{ page }
					</View>

					<View style={ styles.tabBar }>
						<TouchableOpacity onPress={() => this.tabClick('home') } style={[ styles.tabBarItem, { width: iconSize } ]}>
							{ this.state.selectedTab == 'home' ? 
							  <Icon name='ios-home' size={30} color="#000" />
							: <Icon name='ios-home-outline' size={30} color="#929292" /> }
							<Text style={[ styles.text, this.state.selectedTab != 'home' && styles.inactive ]}>Home</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.tabClick('notifications') } style={[ styles.tabBarItem, { width: iconSize } ]}>
							{ this.state.selectedTab == 'notifications' ? 
							  <Icon name='ios-bell' size={30} color="#000" />
							: <Icon name='ios-bell-outline' size={30} color="#929292" /> }
							<Text style={[ styles.text, this.state.selectedTab != 'notifications' && styles.inactive ]}>Notificações</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.tabClick('contacts') } style={[ styles.tabBarItem, { width: iconSize } ]}>
							{ this.state.selectedTab == 'contacts' ? 
							  <Icon name='ios-people' size={30} color="#000" />
							: <Icon name='ios-people-outline' size={30} color="#929292" /> }
							<Text style={[ styles.text, this.state.selectedTab != 'contacts' && styles.inactive ]}>Contatos</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.tabClick('chat') } style={[ styles.tabBarItem, { width: iconSize } ]}>
							{ this.state.selectedTab == 'chat' ? 
							  <Icon name='ios-chatboxes' size={30} color="#000" />
							: <Icon name='ios-chatboxes-outline' size={30} color="#929292" /> }
							<Text style={[ styles.text, this.state.selectedTab != 'chat' && styles.inactive ]}>Bate Papo</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.tabClick('more') } style={[ styles.tabBarItem, { width: iconSize } ]}>
							{ this.state.selectedTab == 'more' ? 
							  <Icon name='ios-more' size={30} color="#000" />
							: <Icon name='ios-more-outline' size={30} color="#929292" /> }
							<Text style={[ styles.text, this.state.selectedTab != 'more' && styles.inactive ]}>Mais</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}
	}

	var styles = StyleSheet.create({
		container: {
			flex: 1
		},
		content: {
			flex: 1,
			marginBottom: 53
		},
	  	tabBar: {
	  		flex: 1,
	  		flexDirection: 'row',
	  		backgroundColor: '#F6F6F8',
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
	  		marginTop: 4
	  	},
	  	inactive: {
	  		color: '#929292'
	  	}
	});

	module.exports = Main;
}