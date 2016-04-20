'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper');
var ViewPager = require('react-native-viewpager');

var Communications = require('react-native-communications');

var utf8 = require('utf8');

var Constants = require('../constants');
var Alert = require('../components/alert');
var user;

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
	TextInput,
	AlertIOS,
	ScrollView,
	IntentAndroid
} = React;

var Dimensions = require('Dimensions');

var viewWidth = Dimensions.get('window').width;
var viewHeight = Dimensions.get('window').height;

var AddComments = require('./addComments');
var MarkMeeting = require('./markMeeting');
var Checkin = require('./checkin');
var Menu = require('./menu');
var User = require('./user');
var StorePhotos = require('./storePhotos');

var NoneButton = require('../components/noneButton');

class Meeting extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			store: props.data,
			likes: 0,
			checkins: 0,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			dataSourceUsers: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			})
		};

		this.loadUsers();
		this.loadComments();
	}

	componentWillReceiveProps() {
		this.loadUsers();
		this.loadComments();
	}

	loadUsers() {
		user = require('../util/load.user').user[0];

		fetch(Constants.URL + "stores/checkin/users/get/" + this.props.data.idCheckin)
				.then((response) => response.json())
				.then((users) => {
					this.setState({
						dataSourceUsers: this.state.dataSourceUsers.cloneWithRows(users)
					})
				})
				.catch((error) => {
					console.log(error);
					Alert('Error', 'Houve um error ao se conectar ao servidor');
				});
	}

	loadComments() {
		fetch(Constants.URL + "store_comment/checkin/" + this.props.data.idCheckin)
				.then((response) => response.json())
				.then((comments) => {
					this.setState({
						dataSource: this.state.dataSource.cloneWithRows(comments)
					})
				})
				.catch((error) => {
					console.log(error);
					Alert('Error', 'Houve um error ao se conectar ao servidor');
				});
	}

	renderComments(comment) {
		var image = comment.image.indexOf('http') >= 0 ? comment.image : Constants.IMAGE + comment.image;
		
		return (
			<TouchableOpacity style={ styles.item } onPress={() => this.goUser(comment) }>
				<Image style={ styles.image } source={{ uri: image }} />
				<View style={ styles.text }>
					<Text style={ styles.name }>{ comment.name + ' ' + comment.lastname }</Text>
					<Text>{ comment.message }</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		var commentsSize = viewHeight - 450;

		return (
			<View style={{ flex: 1 }}>
				<ScrollView>
					<View style={{ height:160 }}>
						<Image style={{ width: viewWidth, height: 160 }} source={{ uri: Constants.IMAGE + 'images/store/' + this.props.data.StoreCover }} />
					</View>
					<View>
						<Text style={ styles.title }>{ decodeURIComponent(escape(this.props.data.storeName)) }</Text>
						<View style={ styles.about }>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="ios-person" color="#4F8EF7" size={ 20 } />
								<View style={ styles.text }><Text>{ this.props.data.name }</Text></View>
							</View>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="document-text" color="#4F8EF7" size={ 20 } />
								<View style={ styles.textLast }><Text>{ this.props.data.message }</Text></View>
							</View>
						</View>

						<View style={ styles.about2 }>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="ios-people" color="#4F8EF7" size={ 20 } />
								<View style={ styles.text }><Text>Convidados</Text></View>
							</View>
							<ListView 
								horizontal={ true }
								dataSource={ this.state.dataSourceUsers }
								renderRow={ this.renderUsers.bind(this) } />
						</View>

						<View style={ styles.about2 }>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="chatbox" color="#4F8EF7" size={ 20 } />
								<View style={ styles.text }><Text>Comentários</Text></View>
							</View>
							<ListView 
								style={{ height: 200 }}
								dataSource={ this.state.dataSource }
								renderRow={ this.renderComments.bind(this) } />
						</View>
					</View>
				</ScrollView>

				<ActionButton buttonColor="rgba(231,76,60,1)" onPress={() => {}}>
		          	<ActionButton.Item buttonColor='#d6013b' title="Eu vou!" onPress={ this.accept.bind(this) }>
		            	<Icon name="thumbsup" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#d6013b' title="Não vou poder" onPress={ this.remove.bind(this) }>
		            	<Icon name="thumbsdown" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#d6013b' title="Adicionar comentário" onPress={ this.goComments.bind(this) }>
		            	<Icon name="chatbox" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		        </ActionButton>
			</View>
		);
	}

	renderUsers(row) {
		var image = row.image ? (row.image.indexOf('http') >= 0 ? { uri: row.image } : { uri: Constants.IMAGE + row.image }) : require('../images/logoSquare.png');
		console.log(image);

		return (
			<TouchableOpacity onPress={() => this.goUser(row) }>
				<Image style={ styles.image2 } source={ image} />
				{ row.visited == -1 ? 
				<View style={ styles.marked }>
					<Icon style={ styles.checkmark } name="help" size={20} color="#fff" />
				</View>
				: <View /> }
				{ row.visited == 6 ? 
				<View style={ styles.marked }>
					<Icon style={ styles.checkmark } name="thumbsup" size={20} color="#fff" />
				</View>
				: <View /> }
				{ row.visited == 7 ? 
				<View style={ styles.marked }>
					<Icon style={ styles.checkmark } name="thumbsdown" size={20} color="#fff" />
				</View>
				: <View /> }
			</TouchableOpacity>
		)
	}

	goComments() {
		this.props.toRoute({ 
			name: 'Enviar comentário', 
			component: AddComments, 
			rightCorner: NoneButton,
			data: {
				user: user,
				checkin: this.props.data
			}
		})
	}

	accept() {
		fetch(Constants.URL + 'store_visited', {
			method: "POST",
    		body: JSON.stringify({
    			idAccount: user.id,
    			idCheckin: this.props.data.idCheckin,
    			idVisitedType: 6
    		}),
    		headers: Constants.HEADERS
		})
		.then((response) => response.json())
		.then((fav) => {
			Alert('Participação', 'Você confirmou sua participação.');
			this.loadUsers();
		})
		.catch((error) => {
			Alert('Error', 'Houve um error ao se conectar ao servidor');
    	});
	}

	remove() {
		fetch(Constants.URL + 'store_visited', {
			method: "POST",
    		body: JSON.stringify({
    			idAccount: user.id,
    			idCheckin: this.props.data.idCheckin,
    			idVisitedType: 7
    		}),
    		headers: Constants.HEADERS
		})
		.then((response) => response.json())
		.then((fav) => {
			Alert('Participação', 'Você cancelou a participação.');
			this.loadUsers();
		})
		.catch((error) => {
			Alert('Error', 'Houve um error ao se conectar ao servidor');
    	});
	}

	goUser(user) {
		this.props.toRoute({
			name: user.name,
			component: User,
			data: user
		})
	}
}

var styles = StyleSheet.create({
	slide: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		margin: 10
	},
	about: {
		borderTopColor: '#DDD',
		borderTopWidth: 1,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	about2: {
		marginTop: 10,
		borderTopColor: '#DDD',
		borderTopWidth: 1,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
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
	image2: {
		flex: 1,
		width: 50,
		height: 50,
		margin: 10,
		marginRight: 0,
		borderRadius: 25
	},
	marked: {
		width: 50,
		height: 50,
		margin: 10,
		borderRadius: 25,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		position: 'absolute',
		top: 0
	},
	checkmark: {
		alignSelf: 'center',
		marginTop: 15
	},
	text: {
		flex: 1,
		padding: 10,
		paddingTop: 12,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	textLast: {
		flex: 1,
		padding: 10,
		paddingTop: 12,
	},
	actionButtonIcon: {
	    fontSize: 20,
	    height: 22,
	    color: 'white',
	},
	name: {
		color: '#d6013b',
		fontSize: 16
	}
});

module.exports = Meeting;
