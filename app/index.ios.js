import React from 'react-native';

const {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
} = React;

var Router = require('react-native-simple-router');
var Login = require('./view/login');
var BackButton = require('./components/backButton');
var Search = require('./components/search');
var NoneButton = require('./components/noneButton');

class Achow extends React.Component {
    render() {
    	console.log('iOS');
	
        return (
            <Router 
            	headerStyle={ styles.header } 
            	backButtonComponent={BackButton} 
            	rightCorner={NoneButton}
            	firstRoute={ {
	            	name: 'Achow',
	            	component: Login
	            } } />
        );
    }
}

var styles = StyleSheet.create({
	header: {
		backgroundColor: '#03a9f4'
	}
});

AppRegistry.registerComponent('socialAuthExample', () => Achow);
