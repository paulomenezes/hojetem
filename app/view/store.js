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

class Store extends React.Component {
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
			store: props.data,
			likes: 0,
			checkins: 0,
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}),
			dataSourceImages: new ViewPager.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}).cloneWithPages(items)
		};

		this.loadUser();
		this.loadCheckins();
		this.loadComments();
	}

	componentWillReceiveProps() {
		this.loadComments();
		this.loadCheckins();
	}

	loadUser() {
		user = require('../util/load.user').user[0];

		fetch(Constants.URL + "store_visited/" + user['id'] + "/1/" + this.props.data.id)
				.then((response) => response.json())
				.then((likes) => {
					this.setState({
						likes: likes.visited
					})
				})
				.catch((error) => {
					Alert('Error', 'Houve um error ao se conectar ao servidor');
				});
	}

	loadComments() {
		fetch(Constants.URL + "store_comment/" + this.props.data.id)
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

	loadCheckins() {
		fetch(Constants.URL + "stores/" + this.props.data.id + "/checkins")
				.then((response) => response.json())
				.then((likes) => {
					var _checkins = [];

					for (var i = 0; i < likes.length; i++) {
						if (likes[i].CheckinImage.length > 0) {
							_checkins.push(likes[i]);
						}
					};

					this.setState({
						checkins: _checkins
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

	goPhotos() {
		this.props.toRoute({ 
			name: 'Fotos', 
			component: StorePhotos, 
			rightCorner: NoneButton,
			data: this.state.checkins
		})
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
								<View style={ styles.text }><Text>{ decodeURIComponent(escape(this.props.data.phone1)) }</Text></View>
							</TouchableOpacity>
							<TouchableOpacity style={ styles.item } onPress={ this.goPhotos.bind(this) }>
								<Icon style={ styles.icon } name="ios-camera" color="#4F8EF7" size={ 20 } />
								<View style={ styles.text }><Text>{ this.state.checkins.length } fotos</Text></View>
							</TouchableOpacity>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="thumbsup" color="#4F8EF7" size={ 20 } />
								<View style={ styles.textLast }><Text>{ this.state.likes } avaliações</Text></View>
							</View>
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
					<ActionButton.Item buttonColor='#03a9f4' title="Visualizar Cardápio" onPress={ this.goMenu.bind(this) }>
		            	<Icon name="android-restaurant" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#03a9f4' title="Estou Aqui" onPress={ this.goCheckin.bind(this) }>
		            	<Icon name="ios-location" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#03a9f4' title="Adicionar aos Favoritos" onPress={ this.addFav.bind(this) }>
		            	<Icon name="star" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#03a9f4' title="Adicionar comentário" onPress={ this.goComments.bind(this) }>
		            	<Icon name="chatbox" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#03a9f4' title="Marcar Encontro" onPress={ this.goMeeting.bind(this) }>
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
				store: this.props.data
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
				store: this.props.data
			}
		})
	}

	goCheckin() {
		this.props.toRoute({ 
			name: 'Estou aqui', 
			component: Checkin, 
			rightCorner: NoneButton,
			data: {
				user: user,
				store: this.props.data
			}
		})
	}

	goMenu() {
		this.props.toRoute({ 
			name: 'Cardápio', 
			component: Menu, 
			rightCorner: NoneButton,
			data: {
				user: user,
				store: this.props.data
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

	addFav() {
		fetch(Constants.URL + 'store_visited', {
			method: "POST",
    		body: JSON.stringify({
    			idAccount: user.id,
    			idStore: this.props.data.id,
    			idVisitedType: 5
    		}),
    		headers: Constants.HEADERS
		})
		.then((response) => response.json())
		.then((fav) => {
			if (fav.removed) {
				Alert('Favoritos', 'Esse estabelecimento foi removido dos favoritos!');
			} else {
				Alert('Favoritos', 'Adicionado aos favoritos!');	
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
		color: '#03a9f4',
		fontSize: 16
	}
});

module.exports = Store;
