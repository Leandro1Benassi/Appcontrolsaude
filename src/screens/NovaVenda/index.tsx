import React, { useState, useEffect } from 'react';
import { AsyncStorage, Image, Modal, FlatList, Alert, Picker, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { EvilIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import { Success } from '../../lotties/Success';
import { TextInputMask } from 'react-native-masked-text';
import { showMessage, hideMessage } from "react-native-flash-message";
import Cardclientes from '../../components/CardPessoas';
import urlImg from '../../services/urlImg';
import SwipeableRow from '../../components/SwipeableRow/lista-itens';

import api from '../../services/api';

type ParamList = {
  Detail: {
    id_reg: string;

  };
};


const NovoCliente: React.FC = () => {
  const navigation: any = useNavigation();

  const route = useRoute<RouteProp<ParamList, 'Detail'>>();
  const id_reg = route?.params?.id_reg;

  const [totalVenda, setTotalVenda] = useState("0");
  const [totalItens, setTotalItens] = useState("0");

  const [nomecliente, setNomeCliente] = useState("Escolher Cliente");
  const [idcliente, setIdCliente] = useState("");

  const [nomeproduto, setNomeProduto] = useState("Escolher Produto");
  const [idproduto, setIdProduto] = useState("");

  const [quant_prod, setQuantProd] = useState("");
  const [id_item, setIdItem] = useState("");
  const [nome_prod, setNomeProd] = useState("");

  const [clientes, setclientes] = useState<any>([]);
  const [produtos, setProdutos] = useState<any>([]);
  const [listaItens, setListaItens] = useState<any>([]);


  const [modalVisible, setModalVisible] = useState(false);
  const [busca, setBusca] = useState("");

  const [modalVisibleProd, setModalVisibleProd] = useState(false);
  const [modalQuant, setModalQuant] = useState(false);

  const [onEndReachedCalledDuringMomentum, setMT] = useState(true);

  const [sucess, setSucess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  function escolherCliente(nome: string, id: string) {
    setNomeCliente(nome);
    setIdCliente(id);
    setModalVisible(false);

  }


  async function escolherProduto(nome: string, id: string) {
    const user = await AsyncStorage.getItem('@user');
    
    setNomeProduto(nome);
    setIdProduto(id);
    setModalVisibleProd(false);
    

    try {
      const obj = {
        id: id,
        quant: '1',
        user: user,
      }

      const res = await api.post("vendas/inserir-item.php", obj);

      listarItens();
      SearchProd();

      if (res.data.sucesso === false) {
        showMessage({
          message: "Erro ao Inserir Produto",
          description: res.data.mensagem,
          type: "warning",
        });

        return;
      }

    } catch (error) {
      Alert.alert("Ops", "Alguma coisa deu errado, tente novamente.");
      setSucess(false);
    }


  }


  function abrirModalQuant(id: string, quant:string, nome:string) {
    setIdItem(id);
    setQuantProd(quant);
    setNomeProd(nome);
    setModalQuant(true);
  }


  async function excluir(id: string) {
    try {

      const response = await api.get(`vendas/excluir-item.php?id=${id}`);
      showMessage({
        message: "Exclusão",
        description: 'Item excluído com Sucesso',
        type: "info",
      });
      listarItens();
      SearchProd();
    } catch (error) {
      Alert.alert('Não foi possivel excluir o item, tente novamente!')
    }
  }



  async function alterarQuant(id: string, quant: string, funcao: string) {
    try {
      const res = await api.get(`vendas/definir-quantidade.php?id=${id}&quant=${quant}&funcao=${funcao}`);
      
      if (res.data.sucesso === false) {
        showMessage({
          message: "Erro ao Inserir Quantidade",
          description: res.data.mensagem,
          type: "warning",
        });

        return;
      }
      
      if (res.data.mensagem == "0") {
        excluir(id);
        return;
      }
      listarItens();
      setModalQuant(false);
      SearchProd();
    } catch (error) {
      Alert.alert('Não foi possivel alterar o item, tente novamente!')
    }
  }

  const renderItem = function ({ item }: any) {
    if (item.id != undefined) {

      return (
        <View>
          <TouchableOpacity
            style={styles.box}
            onPress={() => escolherCliente(item.nome, item.id)}
          >
            <Text style={{ color: '#000' }}>{item.nome} - Telefone: {item.telefone}</Text>
          </TouchableOpacity>
        </View>
      )

    } else {
      return (
        <></>
      )
    }
  }



  const renderItemProd = function ({ item }: any) {
    if (item.id != undefined) {

      return (
        <View>
          <TouchableOpacity
            style={styles.box}
            onPress={() => escolherProduto(item.nome, item.id)}
          >
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: 65 }}>
                <Image style={{ width: 55, height: 55 }} source={{ uri: (urlImg + 'produtos/' + item.foto) }} />
              </View>

              <View style={{ width: '100%', marginTop: 3 }}>
                <Text style={{ color: '#000' }}>{item.nome} - Estoque: {item.estoque}</Text>
                <Text style={{ color: '#000' }}>{item.categoria} - Valor Venda: R$ {item.valor_venda}</Text>
              </View>

            </View>
          </TouchableOpacity>
        </View>
      )

    } else {
      return (
        <></>
      )
    }
  }




  const renderItemListaItens = function ({ item }: any) {
    if (item.id != undefined) {

      return (
        <View>
          <SwipeableRow
            onPressWhatsapp={async () => {
              alterarQuant(item.id, "1", "remover")
            }}

            onPressEdit={async () => {
              alterarQuant(item.id, "1", "add")
            }}

            onPressDelete={async () => {
              excluir(item.id);
            }}
          >
            <TouchableOpacity
              style={styles.box}
              onPress={() => abrirModalQuant(item.id, item.quantidade, item.nome)}
            >
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: 65 }}>
                  <Image style={{ width: 55, height: 55 }} source={{ uri: (urlImg + 'produtos/' + item.foto) }} />
                </View>

                <View style={{ width: '100%', marginTop: 3 }}>
                  <Text style={{ color: '#000', fontSize: 16 }}>{item.quantidade} - {item.nome} </Text>
                  <Text style={{ color: '#000' }}>Total Item: R$ {item.valor}</Text>
                </View>

              </View>
            </TouchableOpacity>
          </SwipeableRow>
        </View>
      )

    } else {

      return (
        <></>
      )
    }

  }


  async function listarclientes() {
    try {
      if (loading === true) return;

      //setLoading(true);

      const response = await api.get(`clientes/listar.php?pagina=${page}&limite=10`);

      setclientes([...clientes, ...response.data.resultado]);
      setPage(page + 1);
    } catch (error) {
      console.log(error)
    }
  }


  async function listarprodutos() {
    try {
      if (loading === true) return;

      //setLoading(true);

      const response = await api.get(`vendas/listar-prod.php?pagina=${page}&limite=10`);

      setProdutos([...produtos, ...response.data.resultado]);
      setPage(page + 1);
    } catch (error) {
      console.log(error)
    }
  }



  async function listarItens() {

    const user = await AsyncStorage.getItem('@user');
    const response = await api.get(`vendas/listar-itens.php?user=${user}`);
    setListaItens(response.data.resultado);
    if (response.data.totalItems == '' || response.data.totalItems == 0 || response.data.totalItems == null) {
      setTotalItens("0")
    } else {
      setTotalItens(response.data.totalItems);
    }

    if (response.data.total_venda == '' || response.data.total_venda == 0 || response.data.total_venda == null) {
      setTotalVenda("0")
    } else {
      setTotalVenda(response.data.total_venda);
    }



  }




  async function saveData() {

  }


  useEffect(() => {
    listarItens().then(() => {
      listarprodutos().then(() => setLoading(false))
    }).then(() => {
      listarclientes().then(() => setLoading(false))
    })

  }, [])



  async function Search() {
    const response = await api.get(`clientes/buscar.php?buscar=${busca}`);
    setclientes(response.data.itens);

  }

  async function SearchProd() {
    const response = await api.get(`vendas/buscar-prod.php?buscar=${busca}`);
    setProdutos(response.data.itens);

  }


  if (loading === true) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ActivityIndicator style={{ marginTop: 100 }} color="#000" size="large" />
      </View>
    )
  }

  if (sucess) {
    return <Success />
  }

  function Footer(load: any) {
    if (!load) return null;

    return (
      <View style={styles.loading}>
        <ActivityIndicator size={25} color="#000" />
      </View>
    )
  }


  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <View style={styles.Header}>
        <TouchableOpacity
          style={styles.BackButton}
          onPress={() => navigation.push("Vendas")}
        >
          <Ionicons name="md-arrow-back-circle-outline" size={35} color="#484a4d" />

        </TouchableOpacity>
        <View style={styles.Title}>
          <Text style={styles.TitleText}>Nova Venda</Text>
        </View>
      </View>

      <View style={{ padding: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignSelf: "center" }} >

        <View style={{ width: '49%' }}>

          <TouchableOpacity
            style={styles.inputObsHeadercliente}
            onPress={() => {
              setModalVisible(true)
            }}
          >
            <View style={styles.clientesContainer}>
              <Ionicons style={styles.iconPeople} name="people-outline" size={27} color="black" />
              <Text style={styles.textNomecliente} ellipsizeMode="tail" numberOfLines={1}>{nomecliente}</Text>
              <AntDesign style={styles.iconButton} name="caretdown" size={10} color="gray" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ width: '49%' }}>

          <TouchableOpacity
            style={styles.inputObsHeadercliente}
            onPress={() => {
              setModalVisibleProd(true)
            }}
          >
            <View style={styles.clientesContainer}>
              <Ionicons style={styles.iconPeople} name="grid" size={27} color="black" />
              <Text style={styles.textNomecliente} ellipsizeMode="tail" numberOfLines={1}>{nomeproduto}</Text>
              <AntDesign style={styles.iconButton} name="caretdown" size={10} color="gray" />
            </View>
          </TouchableOpacity>
        </View>

      </View>

      <View style={{ position: 'absolute', top: 120, bottom: 145 }}>
        <ScrollView>

          <FlatList
            data={listaItens}
            renderItem={renderItemListaItens}
            keyExtractor={item => String(item.id)}
            onEndReachedThreshold={0.1}
            removeClippedSubviews
            initialNumToRender={10}
            onEndReached={(distanceFromEnd) => {
              if (!onEndReachedCalledDuringMomentum) {
                listarItens().then(() => setLoading(false));
                setMT(true);
              }
            }}
            ListFooterComponent={(distanceFromEnd) => {
              if (!onEndReachedCalledDuringMomentum) {
                return <Footer load={loading} />
              } else {
                return <View></View>
              }
            }}
            onMomentumScrollBegin={() => setMT(false)}
            windowSize={10}
            getItemLayout={(data, index) => (
              { length: 50, offset: 50 * index, index }
            )}
          />

        </ScrollView>
      </View>

      <View style={styles.totais}>
        <View style={{ width: '50%', alignItems: 'center' }}>
          <Text style={styles.textoTotalValor}>R$ {totalVenda} </Text>
        </View>
        <View style={{ width: '50%', alignItems: 'center', }}>
          <Text style={styles.textoTotalItens}>Total Itens: {totalItens} </Text>
        </View>
      </View>

      <RectButton
        style={styles.Button}
        onPress={() => {
          navigation.push("FecharVenda", { subTotal: totalVenda, cliente: idcliente} )
        }}
      >
        <Text style={styles.ButtonText}>Fechar Venda</Text>
      </RectButton>


      {/* <NewPacientes /> */}


      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalViewcliente}>

            <Text style={styles.titleModal}>Clientes </Text>

            <TouchableOpacity
              style={styles.removeItem}
              onPress={() => setModalVisible(false)}
            >
              <EvilIcons name="close" size={25} color="black" />
            </TouchableOpacity>

            <View style={styles.containerSearch}>
              <TextInput
                style={styles.search}
                placeholder="Pesquisar Cliente."
                placeholderTextColor="gray"
                keyboardType="default"
                onChangeText={(text) => setBusca(text)}
                returnKeyType="search"
                onTextInput={() => Search()}
              />

              <TouchableOpacity
                style={styles.iconSearch}
                onPress={() => Search()}
              >
                <Ionicons name="search-outline" size={30} color="gray" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={clientes}
              renderItem={renderItem}
              keyExtractor={item => String(item.id)}
              onEndReachedThreshold={0.1}
              removeClippedSubviews
              initialNumToRender={10}
              onEndReached={(distanceFromEnd) => {
                if (!onEndReachedCalledDuringMomentum) {
                  listarclientes().then(() => setLoading(false));
                  setMT(true);
                }
              }}
              ListFooterComponent={(distanceFromEnd) => {
                if (!onEndReachedCalledDuringMomentum) {
                  return <Footer load={loading} />
                } else {
                  return <View></View>
                }
              }}
              onMomentumScrollBegin={() => setMT(false)}
              windowSize={10}
              getItemLayout={(data, index) => (
                { length: 50, offset: 50 * index, index }
              )}
            />

            <View style={styles.containerFloat}>
              <TouchableOpacity
                onPress={() => navigation.push("Pessoas")}
              >
                <Ionicons name="add" size={40} color="#FFF" />
              </TouchableOpacity>
            </View>

          </View>



        </View>


      </Modal>





      <Modal
        visible={modalVisibleProd}
        transparent={true}
        onRequestClose={() => {
          setModalVisibleProd(!modalVisibleProd)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalViewcliente}>
            <Text style={styles.titleModal}>Produtos</Text>

            <TouchableOpacity
              style={styles.removeItem}
              onPress={() => setModalVisibleProd(false)}
            >
              <EvilIcons name="close" size={25} color="black" />
            </TouchableOpacity>

            <View style={styles.containerSearch}>
              <TextInput
                style={styles.search}
                placeholder="Pesquisar Produto."
                placeholderTextColor="gray"
                keyboardType="default"
                onChangeText={(text) => setBusca(text)}
                returnKeyType="search"
                onTextInput={() => SearchProd()}
              />

              <TouchableOpacity
                style={styles.iconSearch}
                onPress={() => SearchProd()}
              >
                <Ionicons name="search-outline" size={30} color="gray" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={produtos}
              renderItem={renderItemProd}
              keyExtractor={item => String(item.id)}
              onEndReachedThreshold={0.1}
              removeClippedSubviews
              initialNumToRender={10}
              onEndReached={(distanceFromEnd) => {
                if (!onEndReachedCalledDuringMomentum) {
                  listarprodutos().then(() => setLoading(false));
                  setMT(true);
                }
              }}
              ListFooterComponent={(distanceFromEnd) => {
                if (!onEndReachedCalledDuringMomentum) {
                  return <Footer load={loading} />
                } else {
                  return <View></View>
                }
              }}
              onMomentumScrollBegin={() => setMT(false)}
              windowSize={10}
              getItemLayout={(data, index) => (
                { length: 50, offset: 50 * index, index }
              )}
            />
          </View>
        </View>
      </Modal>



      <Modal
        visible={modalQuant}
        transparent={true}
        onRequestClose={() => {
          setModalQuant(!modalQuant)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalViewQuant}>
            <Text style={styles.titleModal}>Quantidade: {nome_prod}</Text>

            <TouchableOpacity
              style={styles.removeItem}
              onPress={() => setModalQuant(false)}
            >
              <EvilIcons name="close" size={25} color="black" />
            </TouchableOpacity>

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 35 }}>

              <View style={{ width: '80%' }}>
                <TextInput
                  placeholder="Quantidade"
                  onChangeText={(text) => setQuantProd(text)}
                  value={quant_prod}
                  style={styles.TextInput}
                  keyboardType='numeric'
                />
              </View>

              <View style={{ width: '20%' }}>
                <TouchableOpacity
                  style={styles.ButtonQuant}
                  onPress={() => {
                    alterarQuant(id_item, quant_prod, "subst")
                  }}
                >
                  <Text style={styles.ButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>


          </View>
        </View>
      </Modal>


    </View>
  );
}

export default NovoCliente;