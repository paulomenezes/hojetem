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
	DeviceEventEmitter,
	ListView
} = React;

/*
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
} else {*/

	var Drawer = require('react-native-drawer');

	var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';

	var Icon = require('react-native-vector-icons/MaterialIcons');

	var Home = require('./home');
	var Stores = require('./stores');
	//var More = require('./more');
	//var Login = require('./login');

	var Constants = require('../constants');

	var Dimensions = require('Dimensions');
	var viewWidth = Dimensions.get('window').width;

	var Alert = require('../components/alert');

	var categories = [{
			id: 1,
			title: 'Hoje',
			image: 'images/img/show_1.jpg',
			option: 'today'
		}, {
			id: 2,
			title: 'Essa Semana',
			image: 'images/img/show_2.jpg',
			option: 'week'
		}, {
			id: 3,
			title: 'Esse Mês',
			image: 'images/img/show_3.jpg',
			option: 'month'
		}, {
			id: 4,
			title: 'Mais',
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

		componentDidMount() {
			var self = this;

			/*GcmAndroid.addEventListener('notification', function(notification){
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

				/*if (e.action == "Solicitações") {
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

			GcmAndroid.requestPermissions();*/
		}

		tabClick(option) {
			this.setState({
				selectedTab: option
			})
		}

		renderCategory(row) {
			var image = { uri: Constants.IMAGE + row.image + '?random_number=' + (new Date().getTime()) };

			return (
				<View key={row.id}>
					<TouchableOpacity style={ styles.press } onPress={() => this.tabClick(row.option) }>
						<View style={ styles.categories }>
							<Image style={{ width: viewWidth, height: 200}} source={image} />
							<Text style={ styles.title }>{ row.title }</Text>
						</View>
					</TouchableOpacity>
				</View>
			);
		}

		render() {
			var iconSize = viewWidth / 5;

			return (
				<View style={ styles.container }>
					<View style={ styles.content }>
						{ this.state.selectedTab == 'home' ? 
							<ListView dataSource={ this.state.dataSource } renderRow={ this.renderCategory.bind(this) } />
						: this.state.selectedTab == 'today' ?
							<Stores nav={ this.props } options='today' /> 
						: this.state.selectedTab == 'week' ?
							<Stores nav={ this.props } options='week' /> 
						: this.state.selectedTab == 'month' ?
							<Stores nav={ this.props } options='month' />
						: <Stores nav={ this.props } options='more' /> }
					</View>

					<View style={ styles.tabBar }>
						<TouchableOpacity onPress={() => this.tabClick('home') } style={[ styles.tabBarItem, { width: iconSize } ]}>
							{ this.state.selectedTab == 'home' ? 
							  <Icon name='home' size={30} color="#FFF" />
							: <Icon name='home' size={30} color="#CCC" /> }
							<Text style={[ styles.text, this.state.selectedTab != 'home' && styles.inactive ]}>Inicio</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.tabClick('today') } style={[ styles.tabBarItem, { width: iconSize } ]}>
							{ this.state.selectedTab == 'today' ? 
							  <Icon name='view-day' size={30} color="#FFF" />
							: <Icon name='view-day' size={30} color="#CCC" /> }
							<Text style={[ styles.text, this.state.selectedTab != 'today' && styles.inactive ]}>Hoje</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.tabClick('week') } style={[ styles.tabBarItem, { width: iconSize } ]}>
							{ this.state.selectedTab == 'week' ? 
							  <Icon name='view-week' size={30} color="#FFF" />
							: <Icon name='view-week' size={30} color="#CCC" /> }
							<Text style={[ styles.text, this.state.selectedTab != 'week' && styles.inactive ]}>Essa Semana</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.tabClick('month') } style={[ styles.tabBarItem, { width: iconSize } ]}>
							{ this.state.selectedTab == 'month' ? 
							  <Icon name='view-module' size={30} color="#FFF" />
							: <Icon name='view-module' size={30} color="#CCC" /> }
							<Text style={[ styles.text, this.state.selectedTab != 'month' && styles.inactive ]}>Esse Mês</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => this.tabClick('more') } style={[ styles.tabBarItem, { width: iconSize } ]}>
							{ this.state.selectedTab == 'more' ? 
							  <Icon name='date-range' size={30} color="#FFF" />
							: <Icon name='date-range' size={30} color="#CCC" /> }
							<Text style={[ styles.text, this.state.selectedTab != 'more' && styles.inactive ]}>Mais</Text>
						</TouchableOpacity>
					</View>
				</View>
			);

			/*
			<TouchableOpacity onPress={() => this.tabClick('user') } style={[ styles.tabBarItem, { width: iconSize } ]}>
				{ this.state.selectedTab == 'user' ? 
				  <Icon name='person' size={30} color="#FFF" />
				: <Icon name='person' size={30} color="#CCC" /> }
				<Text style={[ styles.text, this.state.selectedTab != 'user' && styles.inactive ]}>Meu Perfil</Text>
			</TouchableOpacity>
			*/
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
//}