'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ActionButton = require('react-native-action-button');
var Swiper = require('react-native-swiper');
var Accordion = require('react-native-accordion');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

import SmartScrollView from 'react-native-smart-scroll-view';
import { SegmentedControls } from 'react-native-radio-buttons';

var Constants = require('../constants');

var NoneButton = require('../components/noneButton');

var Dimensions = require('Dimensions');
var viewWidth = Dimensions.get('window').width;
var md5 = require("md5");

var user;

var reactStore = require('react-native-store');
var LoadUser = require('../util/load.user');
var UserActiveModel = null;

var Search = require('../components/search');
var Main = require('./main');

var Alert = require('../components/alert');
var userUtil = require('../util/load.user');

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
	SegmentedControlIOS,
	ScrollView,
	DatePickerIOS,
	Platform,
	NativeModules
} = React;

class Settings extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			gender: props.data.gender ==  0 || 'Masculino' ? 'Masculino' : 'Feminino',
			options: props.data.gender,
			name: props.data.name,
			lastname: props.data.lastname,
			password: "",
			phone: props.data.phone,
			date: new Date(),
			timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
			image: props.data.image,
			birth: props.data.birth,
			change: false,
			newImage: null
		};

		user = userUtil.user[0];
		UserActiveModel = userUtil.userModel;
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
			maxWidth: 150, // photos only
			maxHeight: 150, // photos only
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

	updateBirth() {
		var self = this;
		NativeModules.DateAndroid.showDatepicker(function() {}, function(year, month, day) {
			self.setState({
				birth: day + "/" + month + "/" + year,
				date: day + "/" + month + "/" + year
			});
		});
	}

	setSegment(value) {
		this.setState({ 
			gender: value 
		});
	}

	render() {
		var inputSize = (viewWidth / 2) - 15;

		var header = (
			<View style={ styles.header }>
				<Text>Data de nascimento</Text>
			</View>
		);

		var content = (
			<View>
				<DatePickerIOS
					date={ this.state.date }
					mode="date"
					timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
					onDateChange={(date) => this.setState({ 
						date: date,
						birth: date.getDay() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
					}) } />
			</View>
		);

		var headerPassword = (
			<View style={ styles.header }>
				<Text>Editar senha</Text>
			</View>
		);

		var contentPassword = (
			<View>
				<TextInput
					placeholder="Senha"
					smartScrollOptions={{
						moveToNext: true,
						type:       'text'
					}}
					secureTextEntry={true}
				    style={[ styles.input, { marginBottom: 5, marginTop: 5 } ]}
				    onChangeText={(text) => this.setState({ password: text }) }
				    value={ this.state.password } />
				<Text style={{ fontSize: 12 }}>Deixe em branco caso não deseje alterar</Text>
			</View>
		);

		var image = this.state.change ? this.state.newImage : (this.state.image ? this.state.image.indexOf('http') >= 0 ? this.state.image : Constants.IMAGE + this.state.image : false);

		return (
			<View style={{ flex: 1 }}>
				<SmartScrollView>
					{ image ? 
					<View style={ styles.profileArea }>
						<Image style={ styles.profile } source={{ uri: image }} />
					</View>
					: <View /> }

					<View style={{ margin: 10, marginBottom: 0 }}>
						<Icon.Button name="ios-camera" backgroundColor="#d6013b" onPress={this.changeImage.bind(this)}>
							<Text style={{ color: '#fff' }}>Trocar imagem do perfil</Text>
						</Icon.Button>
					</View>

					<View style={ styles.group }>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<TextInput
								placeholder="Nome"
								smartScrollOptions={{
									moveToNext: true,
									type:       'text'
								}}
								style={[ styles.input, { width: inputSize, marginRight: 10 } ]}
							    onChangeText={(text) => this.setState({ name: text }) }
							    value={ this.state.name } />
							<TextInput
								placeholder="Sobrenome"
								smartScrollOptions={{
									moveToNext: true,
									type:       'text'
								}}
								style={[ styles.input, { width: inputSize } ]}
							    onChangeText={(text) => this.setState({ lastname: text }) }
							    value={ this.state.lastname } />
						</View>
					</View>

					<View style={ styles.group }>
						{ Platform.OS == 'ios' ?
						<Accordion 
							header={ headerPassword }
							content={ contentPassword }
							easing="easeOutCubic" />
						: contentPassword }
					</View>

					<View style={ styles.group }>
						<SegmentedControls
							tint="#d6013b"
							options={[ 'Masculino', 'Feminino' ]}
							onSelection={ this.setSegment.bind(this) }
							selectedOption={ this.state.gender } />
					</View>

					<View style={ styles.group }>
						<TextInput
							placeholder="Telefone"
							smartScrollOptions={{
								moveToNext: false,
								type:       'text'
							}}
							keyboardType="phone-pad"
						    style={ styles.input }
						    onChangeText={(text) => this.setState({ phone: text }) }
						    value={ this.state.phone } />
					</View>

					<View style={ styles.group }>
						{ Platform.OS == 'ios' ?
						<Accordion 
							header={ header }
							content={ content }
							easing="easeOutCubic" />
						:
						<Icon.Button name="android-calendar" backgroundColor="#d6013b" onPress={ this.updateBirth.bind(this) }>
							<Text style={{ color: '#fff' }}>Atualizar data de nascimento ({ this.state.birth })</Text>
						</Icon.Button>
						}
					</View>

					<View style={ styles.group }>
						<Icon.Button name="checkmark" backgroundColor="#d6013b" onPress={ this.register.bind(this) }>
							<Text style={{ color: '#fff' }}>Concluído</Text>
						</Icon.Button>
					</View>
				</SmartScrollView>
			</View>
		);
	}

	register() {
		if (this.state.name.length == 0) {
			Alert('Error', 'O campo nome é obrigatório.');
		} else if (this.state.lastname.length == 0) {
			Alert('Error', 'O campo sobrenome é obrigatório.');
		} else if (!this.state.birth) {
			Alert('Error', 'Atualize sua data de nascimento')
		} else {
			var nav = this.props;
    		var updatedUser = this.state;

    		fetch(Constants.URL + "users/update/" + this.props.data.id, {
	        		method: "POST",
	        		body: JSON.stringify(this.state),
	        		headers: Constants.HEADERS
	        	})
	        	.then((response) => response.text())
	        	.then((data) => {
	        		var newData = JSON.parse(data);

	        		var newUser = user;

	        		newUser.name = updatedUser.name;
	        		newUser.lastname = updatedUser.lastname;
	        		newUser.image = updatedUser.change ? newData.image : newUser.image;
	        		newUser.birth = updatedUser.birth;
	        		newUser.phone = updatedUser.phone;
	        		newUser.gender = updatedUser.gender;

	        		UserActiveModel.updateById(newUser, newUser._id).then(function (obj) {
	        			userUtil.update(obj);

	        			nav.toBack();
	        		});
	        	})
	        	.catch((error) => {
	        		Alert('Error', 'Houve um error ao se conectar ao servidor');
	        	});
		}
	}
}

var styles = StyleSheet.create({
	group: {
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		padding: 10
	},
	header: {
		padding: 5,
		borderColor: '#DDD',
		borderWidth: 1,
		backgroundColor: '#eee'
	},
	title: {
		color: '#d6013b',
		fontSize: 16,
		marginBottom: 5
	},
	value: {
		fontSize: 14
	},
	input: {
		height: 30,
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 5,
		padding: 5,
		fontSize: 12
	},
	textArea: {
		height: 100, 
		borderColor: 'gray', 
		borderWidth: 1,
		borderRadius: 5,
		padding: 5
	},
	item: {
		flex: 1,
		flexDirection: 'row'
	},
	image: {
		width: 50,
		height: 50,
		margin: 10,
		borderRadius: 25
	},
	text: {
		flex: 1,
		padding: 5,
		borderBottomColor: '#DDD',
		borderBottomWidth: 1
	},
	name: {
		color: '#d6013b',
		fontSize: 16
	},
	price: {
		fontSize: 14
	},
	description: {
		fontSize: 12
	},
	profileArea: {
		justifyContent: 'center',
		backgroundColor: 'transparent',
		marginTop: 10
	},
	profile: {
		alignSelf: 'center',
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: '#d6013b',
		alignItems: 'center'
	},
});

module.exports = Settings;
