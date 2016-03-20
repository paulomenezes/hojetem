'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var utf8 = require('utf8');

var Stores = require('./stores');

const {
	AppRegistry,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
	TouchableHighlight,
	ListView,
	Image
} = React;

class Subcategory extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2
			}).cloneWithRows(props.data)
		}
	}

	onClick(row) {
		this.props.toRoute({
			name: decodeURIComponent(escape(row.name)),
			component: Stores,
			data: row
		})
	}

	renderSubCategory(row) {
		return (<TouchableOpacity style={ styles.row } onPress={() => this.onClick(row) }>
					<Text style={ styles.text }>
						{ decodeURIComponent(escape(row.name)) }
					</Text>
				</TouchableOpacity>);
	}

	render() {
		return (
			<ListView 
				dataSource={ this.state.dataSource }
				renderRow={ this.renderSubCategory.bind(this) } />
		);
	}
}

var styles = StyleSheet.create({
	row: {
		padding: 10,
		borderBottomColor: '#ddd',
		borderBottomWidth: 1,
		backgroundColor: 'rgba(0,0,0,0)'
	},
	text: {
		backgroundColor: 'rgba(0,0,0,0)'
	}
});

module.exports = Subcategory;
