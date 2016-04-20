import React from 'react-native';

const {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions
} = React;

var Router = require('react-native-simple-router');
var Login = require('./view/login');
var BackButton = require('./components/backButton');
var Search = require('./components/search');
var NoneButton = require('./components/noneButton');

class HojeTem extends React.Component {
    render() {
    	console.log('Android');
        return (
            <Router 
            	headerStyle={ styles.header } 
            	backButtonComponent={BackButton} 
            	rightCorner={NoneButton}
            	handleBackAndroid={true}
            	firstRoute={ {
	            	name: 'Hoje Tem',
	            	component: Login,
	            } } />
        );
    }
}

var styles = StyleSheet.create({
	header: {
		backgroundColor: '#d6013b'
	}
});

AppRegistry.registerComponent('socialAuthExample', () => HojeTem);