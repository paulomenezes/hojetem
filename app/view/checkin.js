'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper');

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

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
	Switch,
	Platform
} = React;

class Checkin extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			text: '',
			user: props.data.user,
			store: props.data.store,
			image: null,
			change: false,
			newImage: null
		};
	}

	sendMeeting() {
		if (this.state.text.length > 0) {
			var checkin = {
				idAccount: this.state.user.id,
				idStore: this.state.store.id,
				message: this.state.text,
				image: this.state.change ? this.state.image : false,
				change: this.state.change
			};

			console.log(checkin);

			var props = this.props;

			fetch(Constants.URL + 'stores/checkin', {
				method: "POST",
	    		body: JSON.stringify(checkin),
	    		headers: Constants.HEADERS
			})
			.then((response) => response.json())
			.then((checkin) => {
				console.log(checkin);
				Alert('Check-in', 'Check-in compartilhado.');
				props.toBack();
			})
			.catch((error) => {
				console.log(error);
	    		Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});
		} else {
			Alert('Check-in', 'Digite uma mensagem.');
		}
	}

	changeImage() {
		var options = {
			title: 'Selecionar imagem', // specify null or empty string to remove the title
			cancelButtonTitle: 'Cancelar',
			takePhotoButtonTitle: 'Tirar foto...', // specify null or empty string to remove this button
			chooseFromLibraryButtonTitle: 'Escolher da Biblioteca...', // specify null or empty string to remove this button
			customButtons: { },
			cameraType: 'back', // 'front' or 'back'
			mediaType: 'photo', // 'photo' or 'video'
			videoQuality: 'high', // 'low', 'medium', or 'high'
			maxWidth: 300,
			maxHeight: 300,
			aspectX: 1, // aspectX:aspectY, the cropping image's ratio of width to height
			aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
			quality: 1, // photos only
			angle: 0, // photos only
			allowsEditing: true, // Built in functionality to resize/reposition the image
			noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
			storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
				skipBackup: true, // image will NOT be backed up to icloud
				path: 'images' // will save image at /Documents/images rather than the root
			}
		};

		UIImagePickerManager.showImagePicker(options, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('UIImagePickerManager Error: ', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				// You can display the image using either data:
				var source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

				var newImage = '';

				if (Platform.OS == 'ios') {
					newImage = response.uri.replace('file://', '');
				} else {
					newImage = response.uri;
				}

				this.setState({
					image: source.uri,
					change: true,
					newImage: newImage
				});
			}
		});
	}

	render() {
		var image = this.state.change ? this.state.newImage : false;

		return (
			<View style={{ flex: 1 }}>
				<Text style={ styles.title }>O que você está fazendo?</Text>

				<TextInput
					autoFocus={ true }
					multiline={ true }
				    style={ styles.textArea }
				    onChangeText={(text) => this.setState({text})}
				    value={this.state.text} />

				<View style={{ margin: 10, marginTop: 0 }}>
					<Icon.Button name="ios-camera" backgroundColor="#d6013b" onPress={this.changeImage.bind(this)}>
						<Text style={{ color: '#fff' }}>Selecionar imagem</Text>
					</Icon.Button>
				</View>

				<View style={ styles.buttonArea }>
					<Icon.Button name="android-share-alt" backgroundColor="#d6013b" onPress={this.sendMeeting.bind(this)}>
						<Text style={ styles.sendButton }>Compartilhar com seus amigos</Text>
					</Icon.Button>
				</View>

				{ image ? 
				<View style={ styles.profileArea }>
					<Image style={ styles.image } source={{ uri: image }} />
				</View>
				: <View /> }
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
	},
	selected: {
		borderWidth: 1,
		borderColor: '#d6013b',
	},
	item: {
		flex: 1,
		flexDirection: 'row'
	},
	profileArea: {
		flex: 1,
		alignItems: 'stretch'
	},
	image: {
		flex: 1,
		margin: 10,
		marginTop: 0
	},
	text: {
		flex: 1,
		padding: 10,
		paddingTop: 12,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	name: {
		fontSize: 16
	},
	nameSelected: {
		color: '#d6013b',
		fontSize: 16
	}
});

module.exports = Checkin;
