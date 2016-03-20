'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

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
	AlertIOS,
	ActivityIndicatorIOS,
	ScrollView
} = React;

class Institutional extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<ScrollView style={ styles.page }>
				<View style={ styles.div }><Text>Olá !!!</Text></View>
                <View style={ styles.div }><Text>Somos o <Text style={ styles.span }>ACHOW</Text>, como o nome já diz tudo que você precisa, pode procurar e você <Text style={ styles.span }>ACHOW</Text>.</Text></View>
                <View style={ styles.div }><Text>Desenvolvemos uma plataforma exclusiva, que vai ajudar você na busca do tudo que você precisar, nosso ponto de partida é a cidade de Porto Feliz / SP, porém nossas ambições são muito...muito maiores, e já estamos trabalhando duro pra isso.</Text></View>
                <View style={ styles.div }><Text>Nosso objetivo, foi criar uma plataforma de interação entre você seus amigos e a cidade de Porto Feliz, para isso investimos pesado no desenvolvimento de nosso projeto, e ao final criamos o ÙNICO aplicativo que permite você interagir com sua cidade, pois aqui você pode:</Text></View>
                <View style={ styles.div }><Text>- Baixar gratuitamente o aplicativo <Text style={ styles.span }>ACHOW</Text></Text></View>
                <View style={ styles.div }><Text>- Visitar todos os lugares da cidade, seja para se deliciar com os sabores da cidade, comprar o&nbsp;</Text></View>
                <View style={ styles.div }><Text>que precisa, consultar onde vai se divertir, &nbsp;saber dos EVENTOS e participar dos SORTEIOS.</Text></View>
                <View style={ styles.div }><Text>- Você pode convidar seus amigos e criar sua própria rede <Text style={ styles.span }>ACHOW</Text>.</Text></View>
                <View style={ styles.div }><Text>&nbsp;- Dar sua opinião ON LINE sobre os lugares e &nbsp;serviços que você consultou</Text></View>
                <View style={ styles.div }><Text>&nbsp;- Marcar um encontro no lugar que você quer se encontrar com um ou mais pessoas através do aplicativo</Text></View>
                <View style={ styles.div }><Text>&nbsp;- Entrar na exclusiva Sala de Bate Papo que disponibilizamos pra você e interagir com quem quiser</Text></View>
                <View style={ styles.div }><Text>&nbsp;- Salvar seus lugares favoritos, e assim não precisa mais fazer uma segunda busca para encontra-lo novamente.</Text></View>
                <View style={ styles.div }><Text>&nbsp;- Ter acesso aos cardápios com preço para escolher o quiser, e poderá ligar imediatamente pelo aplicativo para fazer seu pedido, &nbsp;legal né ?</Text></View>
                <View style={ styles.div }><Text>&nbsp;- E se você gostou do lugar visitado, marque GOSTEI...e não esqueça de deixar seu depoimento, ele vai ajudar as pessoas a melhorarem seu negócio, isso vai ser bom pra você também.</Text></View>
                <View style={ styles.div }><Text>Portanto, faça o DOWNLOAD GRATUITO de nosso aplicativo, e leve tudo isso no seu CELULAR, estamos sempre em busca de novidades, já temos algumas, &nbsp;fique atento e siga-nos no Facebook temos uma FAN PAGE te esperando, lá você saberá de tudo que acontecer no seu&nbsp;</Text></View>
                <View style={ styles.div }><Text><Text style={ styles.span }>ACHOW</Text>.</Text></View>
                <View style={ styles.div }><Text style={ styles.b }>Equipe <Text style={ styles.span }>ACHOW</Text></Text></View>
			</ScrollView>
		);
	}
}

var styles = StyleSheet.create({
	page: {
		padding: 10
	},
	div: {
		marginBottom: 10
	},
	span: {
		color: '03a9f4'
	},
	b: {
		fontWeight: 'bold'
	}
});

module.exports = Institutional;