'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper')
var ViewPager = require('react-native-viewpager');

var Communications = require('react-native-communications');

var utf8 = require('utf8');

var Constants = require('../constants');

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

var NoneButton = require('../components/noneButton');

var Alert = require('../components/alert');

class Show extends React.Component {
	constructor(props) {
		super(props);

		var items = [];

		if (props.data.image) 
			items.push(props.data.image);
		if (props.data.image1) 
			items.push(props.data.image1);
		if (props.data.image2) 
			items.push(props.data.image2);
		if (props.data.image3) 
			items.push(props.data.image3);

		this.state = {
			show: props.data,
			likes: 0,
			items: [],
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			dataSourceConfirm: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			dataSourceLikes: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			dataSourceImages: new ViewPager.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}).cloneWithPages(items)
		};

		this.loadUser();
		this.loadComments();
		this.loadConfirm();
	}

	componentWillReceiveProps() {
		this.loadComments();
	}

	loadUser() {
		user = require('../util/load.user').user[0];

		fetch(Constants.URL + "store_visited/shows/" + user['id'] + "/1/" + this.props.data.id)
				.then((response) => response.json())
				.then((likes) => {
					this.setState({
						dataSourceLikes: this.state.dataSourceLikes.cloneWithRows(likes.accounts)
					})
				})
				.catch((error) => {
					Alert('Error', 'Houve um error ao se conectar ao servidor');
				});
	}

	loadComments() {
		fetch(Constants.URL + "store_comment/shows/" + this.props.data.id)
				.then((response) => response.json())
				.then((comments) => {
					this.setState({
						dataSource: this.state.dataSource.cloneWithRows(comments)
					})
				})
				.catch((error) => {
					Alert('Error', 'Houve um error ao se conectar ao servidor');
				});
	}

	loadConfirm() {
		fetch(Constants.URL + "store_visited/shows/" + user.id + '/2/' + this.props.data.id)
				.then((response) => response.json())
				.then((confirms) => {
					for (var i = 0; i < confirms.accounts.length; i++) {
						confirms.accounts[i].n = (i + 1);
					};

					this.setState({
						dataSourceConfirm: this.state.dataSourceConfirm.cloneWithRows(confirms.accounts)
					})
				})
				.catch((error) => {
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

	renderLikes(row) {
		var image = row.image ? (row.image.indexOf('http') >= 0 ? { uri: row.image } : { uri: Constants.IMAGE + row.image }) : require('../images/logoSquare.png');
		
		return (
			<TouchableOpacity onPress={() => this.goUser(row) }>
				<Image style={ styles.image2 } source={ image} />
			</TouchableOpacity>
		)
	}

	renderConfirm(row) {
		var image = row.image ? (row.image.indexOf('http') >= 0 ? { uri: row.image } : { uri: Constants.IMAGE + row.image }) : require('../images/logoSquare.png');
		
		return (
			<TouchableOpacity onPress={() => this.goUser(row) }>
				<Image style={ styles.image2 } source={ image} />
				<View style={ styles.label }><Text style={ styles.labelText }>{ row.n }</Text></View>
			</TouchableOpacity>
		)
	}

	_renderPage(data, pageID) {
		return <Image key={ pageID } style={{ width: viewWidth, height: 160 }} source={{ uri: Constants.IMAGE + 'images/store/' + data }} />
	}

	goMaps() {
		if (this.props.data.lat && this.props.data.longitude) {
			var url = 'http://maps.google.com/maps?q=' + this.props.data.lat + ',' + this.props.data.longitude;
			IntentAndroid.openURL(url);
		}
	}

	goPhone() {
		if (this.props.data.phone1) {
			Communications.phonecall(this.props.data.phone1, true)
		}
	}

	render() {
		var commentsSize = viewHeight - 450;

		return (
			<View style={{ flex: 1 }}>
				<ScrollView>
					<View style={{ height:160 }}>
						<ViewPager
							dataSource={this.state.dataSourceImages}
							renderPage={this._renderPage}
							isLoop={true}
							autoPlay={true}/>
					</View>
					<View>
						<Text style={ styles.title }>{ decodeURIComponent(escape(this.props.data.name)) }</Text>
						<View style={ styles.about }>
							<TouchableOpacity style={ styles.item } onPress={ this.goMaps.bind(this) }>
								<Icon style={ styles.icon } name="map" color="#4F8EF7" size={ 20 } />
								<View style={ styles.text }><Text>{ decodeURIComponent(escape(this.props.data.address)) }</Text></View>
							</TouchableOpacity>
							<TouchableOpacity style={ styles.item } onPress={ this.goPhone.bind(this) }>
								<Icon style={ styles.icon } name="ios-telephone" color="#4F8EF7" size={ 20 } />
								<View style={ styles.textLast }><Text>{ decodeURIComponent(escape(this.props.data.phone1)) }</Text></View>
							</TouchableOpacity>
						</View>

						<View style={ styles.about2 }>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="thumbsup" color="#4F8EF7" size={ 20 } />
								<View style={ styles.text }><Text>Curtiram</Text></View>
							</View>
							<ListView 
								horizontal={ true }
								dataSource={ this.state.dataSourceLikes }
								renderRow={ this.renderLikes.bind(this) } />
						</View>

						<View style={ styles.about2 }>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="checkmark-circled" color="#4F8EF7" size={ 20 } />
								<View style={ styles.text }><Text>Confirmaram participação</Text></View>
							</View>
							<ListView 
								horizontal={ true }
								dataSource={ this.state.dataSourceConfirm }
								renderRow={ this.renderConfirm.bind(this) } />
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
		          	<ActionButton.Item buttonColor='#d6013b' title="Confirmar Participação" onPress={ this.confirm.bind(this) }>
		            	<Icon name="checkmark-circled" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#d6013b' title="Adicionar comentário" onPress={ this.goComments.bind(this) }>
		            	<Icon name="chatbox" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#d6013b' title="Marcar Encontro" onPress={ this.goMeeting.bind(this) }>
		            	<Icon name="ios-people" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		        </ActionButton>
			</View>
		);
	}

	goComments() {
		this.props.toRoute({ 
			name: 'Enviar comentário', 
			component: AddComments, 
			rightCorner: NoneButton,
			data: {
				user: user,
				show: this.props.data
			}
		})
	}

	goMeeting() {
		this.props.toRoute({ 
			name: 'Marcar Encontro', 
			component: MarkMeeting, 
			rightCorner: NoneButton,
			data: {
				user: user,
				show: this.props.data
			}
		})
	}

	goUser(user) {
		this.props.toRoute({
			name: user.name,
			component: User,
			data: user
		})
	}

	confirm() {
		fetch(Constants.URL + 'store_visited', {
			method: "POST",
    		body: JSON.stringify({
    			idAccount: user.id,
    			idShows: this.props.data.id,
    			idVisitedType: 2
    		}),
    		headers: Constants.HEADERS
		})
		.then((response) => response.json())
		.then((fav) => {
			if (fav.id) {
				Alert('Participação', 'Você confirmou sua participação.');
			} else {
				Alert('Participação', 'Você já confirmou participação.');	
			}
		})
		.catch((error) => {
			Alert('Error', 'Houve um error ao se conectar ao servidor');
    	});
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
	},
	label: {
		position: 'absolute',
		bottom: 5,
		marginLeft: 20,
		padding: 2,
		paddingLeft: 10,
		paddingRight: 10,
		backgroundColor: '#d6013b',
		borderRadius: 5,
	},
	labelText: {
		color: '#fff'
	}
});

module.exports = Show;
