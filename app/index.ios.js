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

class HojeTem extends React.Component {
    render() {
    	console.log('iOS');
	
        return (
            <Router 
            	headerStyle={ styles.header } 
            	backButtonComponent={BackButton} 
            	rightCorner={NoneButton}
            	firstRoute={ {
	            	name: 'HOJE TEM',
	            	component: Login
	            } } />
        );
    }
}

var styles = StyleSheet.create({
	header: {
		backgroundColor: '#424242'
	}
});

AppRegistry.registerComponent('socialAuthExample', () => HojeTem);
