var React = require('react-native');	

const {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
	TouchableHighlight,
} = React;

var Icon = require('react-native-vector-icons/Ionicons');

var NoneButton = require('./noneButton');

var styles = StyleSheet.create({
	backButton: {
		width: 21,
		height: 21,
		marginTop: 3,
		marginRight: 15
	}
});

class ChatInfo extends React.Component {
	constructor(props) {
		super(props);
	}

	openSearch() {
		var ChatMembers = require('../view/chatMembers');

		this.props.nav.toRoute({
			name: 'Informações do Grupo',
			component: ChatMembers,
			rightCorner: NoneButton,
			data: this.props.room
		});
	}

	render() {
		return (
			<TouchableOpacity onPress={this.openSearch.bind(this) }>
				<Icon name="ios-information" color="#fff" size={25} style={styles.backButton} />
			</TouchableOpacity>
		)
	}
}

module.exports = ChatInfo;