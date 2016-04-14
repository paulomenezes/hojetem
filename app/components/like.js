var React = require('react-native');	

const {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
	TouchableHighlight,
	ActivityIndicatorIOS,
	AlertIOS
} = React;

var Icon = require('react-native-vector-icons/Ionicons');
var Constants = require('../constants');
var Alert = require('../components/alert');

var styles = StyleSheet.create({
	backButton: {
		width: 21,
		height: 21,
		marginTop: 3,
		marginRight: 15
	}
});

class Like extends React.Component {
	constructor(props) {
		super(props);

		if (props.store) {
			this.state = {
				loading: false,
				user: props.user,
				store: props.store
			};
		} else {
			this.state = {
				loading: false,
				user: props.user,
				show: props.show
			};
		}
	}

	openSearch() {
		var state = this.state;

		var like = {};
		if (this.state.store) {
			like = {
    			idAccount: state.user.id,
    			idStore: state.store.id,
    			idVisitedType: 1
    		};
		} else {
			like = {
    			idAccount: state.user.id,
    			idShows: state.show.id,
    			idVisitedType: 1
    		};
		}

		fetch(Constants.URL + 'store_visited', {
				method: "POST",
	    		body: JSON.stringify(like),
	    		headers: Constants.HEADERS
			})
			.then((response) => response.json())
			.then((like) => {
				this.setState({
					loading: false
				});

				if (like.failed) {
					Alert('Gostei', 'Você já marcou como gostei esse evento');	
				} else {
					Alert('Gostei', 'Obrigado!');	
				}
			})
			.catch((error) => {
				Alert('Error', 'Houve um error ao se conectar ao servidor');
	    	});

			this.setState({
				loading: true
			})
	}

	render() {
		if (!this.state.loading) {
			return (
				<TouchableOpacity onPress={this.openSearch.bind(this)}>
					<Icon name="thumbsup" color="#fff" size={25} style={styles.backButton} />
				</TouchableOpacity>
			)
		} else {
			return (
				<ActivityIndicatorIOS
					style={styles.backButton}
					color="white"
			        size="small" />
			)
		}
	}
}

module.exports = Like;