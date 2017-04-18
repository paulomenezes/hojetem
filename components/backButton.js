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

var styles = StyleSheet.create({
  backButton: {
    width: 10,
    height: 20,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  }
});

var BackButton = React.createClass({
	render() {
    	return (
      		<View><Icon name="ios-arrow-back" color="#fff" size={25} style={styles.backButton} /></View>
    	)
  	}
});

module.exports = BackButton;