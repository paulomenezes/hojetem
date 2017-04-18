'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper');
var ViewPager = require('react-native-viewpager');

var Communications = require('react-native-communications');

import Hyperlink from 'react-native-hyperlink';

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
	IntentAndroid,
	WebView,
	Platform,
	LinkingIOS
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
			irei: 0,
			interesse: 0,
			dataSourceImages: new ViewPager.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}).cloneWithPages(items)
		};

		this.loadUser();
	}

	componentWillReceiveProps() {
		this.loadUser();
	}

	loadUser() {
		user = require('../util/load.user').user[0];

		fetch(Constants.URL + "store_visited/" + user['id'] + "/1/" + this.props.data.id)
				.then((response) => response.json())
				.then((likes) => {
					this.setState({
						irei: likes.visited
					})
				})
				.catch((error) => {
					console.log(error);
					Alert('Error', 'Houve um error ao se conectar ao servidor');
				});

		fetch(Constants.URL + "store_visited/" + user['id'] + "/2/" + this.props.data.id)
				.then((response) => response.json())
				.then((likes) => {
					this.setState({
						interesse: likes.visited
					})
				})
				.catch((error) => {
					console.log(error);
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

	renderComments(comment) {
		var image = comment.image.indexOf('http') >= 0 ? comment.image : Constants.IMAGE + comment.image;
		
		return (
			<TouchableOpacity style={ styles.item } onPress={() => this.goUser(comment) }>
				<Image style={ styles.image } source={{ uri: image }} />
				<View style={ styles.text }>
					<Text style={ styles.name }>{ comment.name + ' ' + comment.lastname }</Text>
					<Text style={{ color: '#FFF' }}>{ comment.message }</Text>
				</View>
			</TouchableOpacity>
		)
	}

	_renderPage(data, pageID) {
		return <Image key={ pageID } style={{ width: viewWidth, height: 160 }} source={{ uri: Constants.IMAGE + 'images/store/' + data }} />
	}

	goMaps() {
		if (this.props.data.address) {
			var url = 'http://maps.google.com/?q=' + this.props.data.address;
			
			if (Platform.OS !== 'ios') {
				IntentAndroid.openURL(url);
			} else {
				LinkingIOS.openURL(url);
			}
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

	redirect(path) {
		if (Platform.OS !== 'ios') {
			IntentAndroid.openURL(path);
		} else {
			LinkingIOS.openURL(path);
		}
	}

	render() {
		var commentsSize = viewHeight - 450;
		var description = this.props.data.description.replace(/www/g, 'http://www');

		return (
			<View style={ styles.container }>
				<ScrollView>
					<View style={{ height:160 }}>
						<ViewPager
							dataSource={this.state.dataSourceImages}
							renderPage={this._renderPage}
							isLoop={true}
							autoPlay={true}/>
					</View>
					<View>
						<Text style={ styles.title }>{ this.props.data.name }</Text>
						<View style={ styles.about }>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="document-text" color="#d6013b" size={ 20 } />
								<View style={ styles.text }>
									<Hyperlink linkStyle={{color:'#d6013b'}} onPress={(url) => this.redirect(url)}>
										<Text style={ styles.textColor }>{ description }</Text>
									</Hyperlink>
								</View>
							</View>
							{ this.props.data.man && this.props.data.man.length > 0 ?
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="social-usd" color="#d6013b" size={ 20 } />
								<View style={ styles.text }><Text style={ styles.textColor }>Masculino R$: { this.props.data.man }</Text></View>
							</View>
							: <View /> }
							{ this.props.data.woman && this.props.data.woman.length > 0 ?
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="social-usd" color="#d6013b" size={ 20 } />
								<View style={ styles.text }><Text style={ styles.textColor }>Feminino R$: { this.props.data.woman }</Text></View>
							</View>
							: <View /> }
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="android-calendar" color="#d6013b" size={ 20 } />
								<View style={ styles.text }><Text style={ styles.textColor }>{ this.props.data.event_date.substr(8, 2) + '/' + this.props.data.event_date.substr(5, 2) + '/' + this.props.data.event_date.substr(0, 4) }</Text></View>
							</View>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="ios-clock-outline" color="#d6013b" size={ 20 } />
								<View style={ styles.text }><Text style={ styles.textColor }>{ this.props.data.event_time.substr(0, 5) }</Text></View>
							</View>
							<TouchableOpacity style={ styles.item } onPress={ this.goMaps.bind(this) }>
								<Icon style={ styles.icon } name="map" color="#d6013b" size={ 20 } />
								<View style={ styles.text }><Text style={ styles.textColor }>{ this.props.data.address }</Text></View>
							</TouchableOpacity>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="ios-telephone" color="#d6013b" size={ 20 } />
								<View style={ styles.text }>
									<Text style={ styles.textColor }>
										{ this.props.data.phone1 + ' ' + 
										  (this.props.data.phone2 ? '/ ' + this.props.data.phone2 : '') + ' ' +
										  (this.props.data.phone3 ? '/ ' + this.props.data.phone3 : '') }
									</Text>
								</View>
							</View>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="thumbsup" color="#d6013b" size={ 20 } />
								<View style={ styles.text }><Text style={ styles.textColor }>{ this.state.irei } confirmados</Text></View>
							</View>
							<View style={ styles.item }>
								<Icon style={ styles.icon } name="star" color="#d6013b" size={ 20 } />
								<View style={ styles.textLast }><Text style={ styles.textColor }>{ this.state.interesse } tem interesse</Text></View>
							</View>
							{ this.props.data.lista == 'sim' ?
							<TouchableOpacity style={ styles.item } onPress={ this.goComments.bind(this) }>
								<Icon style={ styles.icon } name="chatbox" color="#d6013b" size={ 20 } />
								<View style={ styles.textLast }><Text style={ styles.textColor }>Nomes na lista</Text></View>
							</TouchableOpacity>
							: <View /> }
						</View>
					</View>
				</ScrollView>

				<ActionButton buttonColor="rgba(231,76,60,1)" onPress={() => {}}>
		          	<ActionButton.Item buttonColor='#d6013b' title="Estou Aqui" onPress={ this.goCheckin.bind(this) }>
		            	<Icon name="ios-location" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#d6013b' title="Irei" onPress={ this.irei.bind(this) }>
		            	<Icon name="thumbsup" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		          	<ActionButton.Item buttonColor='#d6013b' title="Tenho interesse" onPress={ this.tenhoInteresse.bind(this) }>
		            	<Icon name="star" style={styles.actionButtonIcon} />
		          	</ActionButton.Item>
		        </ActionButton>
			</View>
		);
	}

	goComments() {
		this.props.toRoute({ 
			name: 'Adicionar nome na lista', 
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

	tenhoInteresse() {
		fetch(Constants.URL + 'store_visited', {
			method: "POST",
    		body: JSON.stringify({
    			idAccount: user.id,
    			idStore: this.props.data.id,
    			idVisitedType: 2
    		}),
    		headers: Constants.HEADERS
		})
		.then((response) => response.json())
		.then((fav) => {
			if (fav.removed) {
				Alert('Interesse', 'Você cancelou o interesse nesse evento.');	
			} else {
				Alert('Interesse', 'Você tem interesse nesse evento.');
			}

			this.loadUser();
		})
		.catch((error) => {
			console.log(error);	
			Alert('Error', 'Houve um error ao se conectar ao servidor');
    	});
	}

	irei() {
		fetch(Constants.URL + 'store_visited', {
			method: "POST",
    		body: JSON.stringify({
    			idAccount: user.id,
    			idStore: this.props.data.id,
    			idVisitedType: 1
    		}),
    		headers: Constants.HEADERS
		})
		.then((response) => response.json())
		.then((fav) => {
			if (fav.removed) {
				Alert('Interesse', 'Você cancelou a presença nesse evento.');
			} else {
				Alert('Interesse', 'Você confirmou presença nesse evento.');	
			}

			this.loadUser();
		})
		.catch((error) => {
			Alert('Error', 'Houve um error ao se conectar ao servidor');
    	});
	}
}

var styles = StyleSheet.create({
	container: { 
		flex: 1,
		backgroundColor: '#383838'
	},
	slide: {
		flex: 1,
		backgroundColor: 'transparent',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		margin: 10,
		color: '#FFF'
	},
	about: {
		borderTopColor: '#424242',
		borderTopWidth: 1,
		borderBottomColor: '#424242',
		borderBottomWidth: 1
	},
	about2: {
		marginTop: 10,
		borderTopColor: '#424242',
		borderTopWidth: 1,
		borderBottomColor: '#424242',
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
		borderBottomColor: '#424242',
		borderBottomWidth: 1
	},
	textLast: {
		flex: 1,
		padding: 10,
		paddingTop: 12,
	},
	textColor: {
		color: '#FFF'
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

module.exports = Store;
