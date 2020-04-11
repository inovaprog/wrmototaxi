import React from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Image, Button, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default class App extends React.Component {

  state = {

    funcao: 'busca',


    partida:
    {
      latitude: -19.645384,
      longitude: -43.218483,
    },

    initialRegion: {
      latitude: -19.645384,
      longitude: -43.218483,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03

    },

    markers: []

  }
  componentDidMount = async () => {
    this.setState({
      funcao: 'carregando',
    });
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({  
        funcao: 'busca',
      })
     
    } else {

      let location = await Location.getCurrentPositionAsync({})
      var newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03
      }
      var newPartida = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }

      this.setState({
        funcao: 'carregando',
        initialRegion: newRegion,
        funcao: 'busca',
        partida: newPartida,
      })
    }

  };

  _MudaBusca = () => {
    this.setState({
      funcao: 'busca',
      markers: [],
    });
  }
  _MudaShow = () => {

    var newRegion = {
      latitude: this.state.partida.latitude,
      longitude: this.state.partida.longitude,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03

    }

    this.setState({
      funcao: 'carregando',
      initialRegion: newRegion,
    });

    fetch('http://www.wrmototaxi.appspot.com/api/busca', {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: this.state.partida.latitude,
        longitude: this.state.partida.longitude,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            markers: responseJson,
            funcao: 'show',
          },
        );
      })

  }
  _MudaLista = () => {

    this.setState({
      funcao: 'carregando',
    });

    fetch('http://www.wrmototaxi.appspot.com/api/ativos', { method: "post" })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            markers: responseJson,
            funcao: 'lista',
          },
        );
      })


  }
  _MudaContato = () => {
    this.setState({
      funcao: 'contato',
    });
  }
  _posicaoPartida = (ponto) => {
    this.setState({
      partida: ponto,
    });
  }

  render() {
    if (this.state.funcao == 'show') {
      return (
        <View style={styles.container}>

          <MapView style={styles.mapStyle}
            initialRegion={this.state.initialRegion}

          >
            <Marker
              coordinate={this.state.partida}
            >
              <View style={styles.marcador}>
                <Image source={{ uri: 'https://image.flaticon.com/icons/png/512/31/31139.png' }}
                  style={{ width: 30, height: 30 }} />
              </View>
            </Marker>

            {this.state.markers.map(marker => (

              <Marker
                coordinate={marker.coordnate}
                title={marker.title}
              >
                <View style={styles.marcador}>
                  <Image source={{ uri: 'https://image.winudf.com/v2/image/Y29tLm1vdG90YXhpZHJpdmVyLmJyX2ljb25fMTUyMTEwMjU3Nl8wNDM/icon.png?w=170&fakeurl=1' }}
                    style={{ width: 50, height: 50 }} />
                </View>

                <Callout style={{ width: 290, borderRadius: 20, }} onPress={() => { Linking.openURL(`http://api.whatsapp.com/send?1=pt_BR&phone=55${marker.whatsapp}`) }}>
                  <View>
                    <WebView source={{ uri: 'https://wrmototaxi.s3-sa-east-1.amazonaws.com/' + marker.fotos }} style={{ height: 250 }} scalesPageToFit />
                    <Text style={styles.titulo} numberOfLines={1} >{marker.title}</Text>
                    <Text style={styles.telefone} numberOfLines={1}>Telefone: {marker.telefone}</Text>
                    <Text style={styles.endereco} >Endereço: {marker.endereco}</Text>
                    <Text style={styles.funcionamento} >Funcionamento: {marker.funcionamento}</Text>
                    <Text style={styles.funcionamento} >Quantidade de Motos: {marker.qtdMotos}</Text>
                  </View>
                </Callout>

              </Marker>


            ))}
          </MapView>
          <View style={styles.menu}>
            <View style={styles.botoes}>
              <Text style={styles.txBotao}  > MAPA</Text>
            </View>
            <View style={styles.botoes}>
              <Text onPress={this._MudaLista}>LISTA</Text>
            </View>
            <View style={styles.botoes}>
              <Text onPress={this._MudaContato}>CONTATO</Text>
            </View>
          </View>
          <View style={{
            position: 'absolute',
            left: '5%',
            top: '4%',
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 20,

          }}>
            <Text onPress={this._MudaBusca} style={{ fontWeight: 'bold', }}>Voltar</Text>
          </View>
        </View >
      );
    }
    if (this.state.funcao == 'busca') {
      return (
        <View style={styles.container}>

          <MapView style={styles.mapStyle}
            initialRegion={this.state.initialRegion}
            onPress={(e) => { this._posicaoPartida(e.nativeEvent.coordinate); }}

          >

            <Marker
              coordinate={this.state.partida}
            >
              <View style={styles.marcador}>
                <Image source={{ uri: 'https://image.flaticon.com/icons/png/512/31/31139.png' }}
                  style={{ width: 30, height: 30 }} />
              </View>
            </Marker>

          </MapView>

          <View style={styles.menu}>
            <View style={styles.botoes}>
              <Text style={styles.txBotao}  > MAPA</Text>
            </View>
            <View style={styles.botoes}>
              <Text onPress={this._MudaLista}>LISTA</Text>
            </View>
            <View style={styles.botoes}>
              <Text onPress={this._MudaContato}>CONTATO</Text>
            </View>
          </View>

          <View style={{
            position: 'absolute',
            width: '70%',
            left: '15%',
            top: '85%',
          }}>
            <Button
              onPress={this._MudaShow}
              title="Definir Partida"
              color="black"
            />
          </View>
        </View >

      );
    }
    if (this.state.funcao == 'lista') {
      return (

        <View style={styles.container}>

          <ScrollView style={{ width: '100%'}}>

            <View style={{ width: '100%', height: 30, backgroundColor: '#000', alignContent: "center" , justifyContent: "center"}}>
              <Text style={{ color: "#fff", alignSelf: "center" }}>LISTA DE MOTO TÁXI PARCEIROS</Text>
            </View>
            {this.state.markers.map(marker => (
              <View style={{padding: 10}}>
                <Image source={{ uri: `https://wrmototaxi.s3-sa-east-1.amazonaws.com/${marker.fotos}` }} style={{ height: 100 }} resizeMode="contain" />
                <Text style={styles.txBotao}>{marker.title}</Text>
                <Text>Telefone: {marker.telefone}</Text>
                <Text>Endereço: {marker.endereco}</Text>
                <Text>Horário de Funcionamento: {marker.funcionamento}</Text>
                <Text>Quantidade de Motos: {marker.qtdMotos}</Text>
                <View style={{ width: '100%', height: 20 }}></View>
              </View>
            ))}
          </ScrollView>
          <View style={{height: '7%'}} ></View>
          <View style={styles.menu}>
            <View style={styles.botoes}>
              <Text onPress={this._MudaBusca} > MAPA</Text>
            </View>
            <View style={styles.botoes}>
              <Text style={styles.txBotao} >LISTA</Text>
            </View>
            <View style={styles.botoes}>
              <Text onPress={this._MudaContato}>CONTATO</Text>
            </View>
          </View>
        </View>

      )
    }
    if (this.state.funcao == 'contato') {
      return (
        <View style={styles.container}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', }}>
            <Text style={styles.txBotao}>Wellinton Reis</Text>
            <Text style={styles.txBotao}>Telefone:</Text>
            <Text onPress={() => { Linking.openURL(`http://api.whatsapp.com/send?1=pt_BR&phone=553199489-9834`) }}>31 9489-9834</Text>
            <View style={{ height: 10 }}></View>
            <Text style={styles.txBotao}>E-mail:</Text>
            <Text>wellintonreisr49@gmail.com</Text>
            <View style={{ height: 10 }}></View>
            <Text style={styles.txBotao}>Instagram:</Text>
            <Text onPress={() => { Linking.openURL(`https://www.instagram.com/wrr.atacado/`) }}>@wrr.atacado</Text>
          </View>
          <View style={styles.menu}>
            <View style={styles.botoes}>
              <Text onPress={this._MudaBusca} > MAPA</Text>
            </View>
            <View style={styles.botoes}>
              <Text onPress={this._MudaLista}>LISTA</Text>
            </View>
            <View style={styles.botoes}>
              <Text style={styles.txBotao} >CONTATO</Text>
            </View>
          </View>
        </View >
      )
    }
    if (this.state.funcao == 'carregando') {
      return (
        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', }}>
          <ActivityIndicator />
        </View>
      );

    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Constants.statusBarHeight,
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,

  },
  marcador: {

    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    flex: 1,
    fontSize: 15,
    alignSelf: "center",
    fontWeight: 'bold',
  },
  telefone: {
    flex: 1,
    fontSize: 13,
    alignSelf: "center",
  },
  endereco: {
    flex: 1,
    fontSize: 13,
    alignSelf: "center",
  },
  funcionamento: {
    flex: 1,
    fontSize: 13,
    alignSelf: "center",
  },
  menu: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: '100%',
    position: 'absolute',
    left: 0,
    top: '93%',
    backgroundColor: '#fff',
    height: '7%',

  },
  botoes: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txBotao: {
    fontWeight: 'bold',
  },
  galeria: {
    flexDirection: "row",

  }

});
