'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper')

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
	AlertIOS
} = React;

class AddComment extends React.Component {
	constructor(props) {
		super(props);

		if (props.data.store) {
			this.state = {
				text: '',
				user: props.data.user,
				store: props.data.store
			};
		} else if (props.data.show) {
			this.state = {
				text: '',
				user: props.data.user,
				show: props.data.show
			};
		} else {
			this.state = {
				text: '',
				user: props.data.user,
				checkin: props.data.checkin
			};
		}
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
			<View style={{ flex: 1 }}>
				<Text style={ styles.title }>Digite seu comentário</Text>

				<TextInput
					autoFocus={ true }
					multiline={ true }
				    style={ styles.textArea }
				    onChangeText={(text) => this.setState({text})}
				    value={this.state.text} />

				<View style={ styles.buttonArea }>
					<Icon.Button name="ios-paperplane" backgroundColor="#03a9f4" onPress={this.sendComment.bind(this)}>
						<Text style={ styles.sendButton }>Enviar comentário</Text>
					</Icon.Button>
				</View>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	title: {
		fontSize: 18,
		margin: 10
	},
	textArea: {
		height: 100, 
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 2,
		margin: 10,
		marginTop: 0,
		padding: 5
	},
	buttonArea: {
		margin: 10,
		marginTop: 0
	},
	sendButton: {
		color: '#FFF'
	}
});

module.exports = AddComment;
