'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper')

var utf8 = require('utf8');

var Constants = require('../constants');
var Alert = require('../components/alert');

var User = require('./user');

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
	AlertIOS
} = React;

class AddComment extends React.Component {
	constructor(props) {
		super(props);

		if (props.data.store) {
			this.state = {
				text: props.data.user.name,
				user: props.data.user,
				store: props.data.store,
				dataSource: new ListView.DataSource({
					rowHasChanged: (row1, row2) => row1 !== row2
				})
			};
		} else if (props.data.show) {
			this.state = {
				text: props.data.user.name,
				user: props.data.user,
				show: props.data.show
			};
		} else {
			this.state = {
				text: props.data.user.name,
				user: props.data.user,
				checkin: props.data.checkin
			};
		}

		this.loadComments();
	}

	goUser(user) {
		this.props.toRoute({
			name: user.name,
			component: User,
			data: user
		})
	}

	loadComments() {
		fetch(Constants.URL + "store_comment/" + this.state.store.id)
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
		var image = comment.image ? (comment.image.indexOf('http') >= 0 ? comment.image : Constants.IMAGE + comment.image) : false;
		
		return (
			<TouchableOpacity style={ styles.item } onPress={() => this.goUser(comment) }>
				{ image ? <Image style={ styles.image } source={{ uri: image }} /> : <View style={ styles.image } /> }
				<View style={ styles.text }>
					<Text style={ styles.name }>{ comment.name + ' ' + comment.lastname }</Text>
					<Text style={{ color: '#FFF' }}>{ comment.message }</Text>
				</View>
			</TouchableOpacity>
		)
	}

	sendComment() {
		var comment = {};
		if (this.state.store) {
			comment = {
				idAccount: this.state.user.id,
				idStore: this.state.store.id,
				message: this.state.text
			};	
		} else if (this.state.show) {
			comment = {
				idAccount: this.state.user.id,
				idShows: this.state.show.id,
				message: this.state.text
			};
		} else {
			comment = {
				idAccount: this.state.user.id,
				idCheckin: this.state.checkin.idCheckin,
				message: this.state.text
			};
		}

		var props = this.props;

		fetch(Constants.URL + 'store_comment', {
			method: "POST",
    		body: JSON.stringify(comment),
    		headers: Constants.HEADERS
		})
		.then((response) => response.json())
		.then((comment) => {
			props.toBack();
		})
		.catch((error) => {
    		Alert('Error', 'Houve um error ao se conectar ao servidor');
    	});
	}

	render() {
		return (
			<View style={{ flex: 1, backgroundColor: '#383838' }}>
				<Text style={ styles.title }>Digite seu nome</Text>

				<TextInput
					autoFocus={ true }
					multiline={ true }
				    style={ styles.textArea }
				    onChangeText={(text) => this.setState({text})}
				    value={this.state.text} />

				<View style={ styles.buttonArea }>
					<Icon.Button name="ios-paperplane" backgroundColor="#d6013b" onPress={this.sendComment.bind(this)}>
						<Text style={ styles.sendButton }>Salvar nome</Text>
					</Icon.Button>
				</View>

				<ListView 
					style={{ height: 200 }}
					dataSource={ this.state.dataSource }
					renderRow={ this.renderComments.bind(this) } />
			</View>
		);
	}
}

var styles = StyleSheet.create({
	title: {
		fontSize: 18,
		margin: 10,
		color: '#FFF'
	},
	textArea: {
		height: 100, 
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 2,
		margin: 10,
		marginTop: 0,
		padding: 5,
		color: '#FFF'
	},
	buttonArea: {
		margin: 10,
		marginTop: 0
	},
	sendButton: {
		color: '#FFF'
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

module.exports = AddComment;
