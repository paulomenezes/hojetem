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
	TabBarIOS
} = React;

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
			notifications: 0
		};

		this.loadRequests();
		this.loadNotifications();
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

	_renderContent(color, pageText, num) {
	    return (
	      	<View style={[styles.tabContent]}>
	        	<Text style={styles.tabText}>{pageText}</Text>
	        	<Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>

	        	<Icon.Button name="code" backgroundColor="#3b5998">
			    	Login with Facebook
			  	</Icon.Button>
	    	</View>
		);
	}

	render() {
		return (
			<TabBarIOS
		        tintColor="black"
		        barTintColor="white">
		        <Icon.TabBarItem
		          	title="Inicio"
		          	iconName="ios-home-outline"
		          	selectedIconName="ios-home"
		          	selected={this.state.selectedTab === 'home'}
		          	onPress={() => {
		            	this.setState({
		              		selectedTab: 'home',
		            	});
		          	}}>
		          	<Home nav={ this.props } />
		        </Icon.TabBarItem>
		        <Icon.TabBarItem
		          	title="Notificações"
		          	badge={ this.state.notifications ? (this.state.notifications > 0 ? this.state.notifications : undefined) : undefined }
		          	iconName="ios-bell-outline"
		          	selectedIconName="ios-bell"
		          	selected={this.state.selectedTab === 'notifications'}
		          	onPress={() => {
		            	this.setState({
		              		selectedTab: 'notifications',
		            	});
		          	}}>
		          	<Notifications nav={ this.props } />
		        </Icon.TabBarItem>
		        <Icon.TabBarItem
		          	title="Contatos"
		          	badge={ this.state.requests ? (this.state.requests > 0 ? this.state.requests : undefined) : undefined }
		          	iconName="ios-people-outline"
		          	selectedIconName="ios-people"
		          	selected={this.state.selectedTab === 'contacts'}
		          	onPress={() => {
		            	this.setState({
		              		selectedTab: 'contacts',
		            	});
		          	}}>
		          	<Contacts nav={ this.props } />
		        </Icon.TabBarItem>
		        <Icon.TabBarItem
		          	title="Bate Papo"
		          	iconName="ios-chatboxes-outline"
		          	selectedIconName="ios-chatboxes"
		          	selected={this.state.selectedTab === 'chat'}
		          	onPress={() => {
		            	this.setState({
		              		selectedTab: 'chat',
		            	});
		          	}}>
		          	<ChatRooms nav={ this.props } />
		        </Icon.TabBarItem>
		        <Icon.TabBarItem
		          	title="Mais"
		          	iconName="ios-more-outline"
		          	selectedIconName="ios-more"
		          	selected={this.state.selectedTab === 'more'}
		          	onPress={() => {
		            	this.setState({
		              		selectedTab: 'more',
		            	});
		          	}}>
		          	<More nav={ this.props } user={ this.state.user } />
		        </Icon.TabBarItem>
			</TabBarIOS>
		);
	}
}

var styles = StyleSheet.create({
  	tabContent: {
    	flex: 1,
    	alignItems: 'center',
  	},
  	tabText: {
    	color: 'black',
    	margin: 50,
  	},
});

module.exports = Main;