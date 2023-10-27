import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Splash } from '../lotties/Splash';
import Login from '../screens/Login';
import AuthRoutes from './tab.routes';
import Pessoas from '../screens/Pessoas';
import NovaPessoa from '../screens/NovaPessoa';
import Categorias from '../screens/Categorias';
import NovaCategoria from '../screens/NovaCategoria';
import Produtos from '../screens/Produtos';
import NovoProduto from '../screens/NovoProduto';
import ComprarProduto from '../screens/ComprarProduto';
import Estoque from '../screens/Estoque';
import Pagar from '../screens/Pagar';
import NovaContaPagar from '../screens/NovaContaPagar';
import BaixarPagar from '../screens/BaixarPagar';
import Receber from '../screens/Receber';
import NovaContaReceber from '../screens/NovaContaReceber';
import BaixarReceber from '../screens/BaixarReceber';
import Vendas from '../screens/Vendas';
import NovaVenda from '../screens/NovaVenda';
import FecharVenda from '../screens/FecharVenda';
import Compras from '../screens/Compras';
import NovaCompra from '../screens/NovaCompra';
import FecharCompra from '../screens/FecharCompra';
import Movimentacoes from '../screens/Movimentacoes';

const Stack = createNativeStackNavigator();

function StackNavigator(){
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={AuthRoutes} />
            <Stack.Screen name="Pessoas" component={Pessoas} />
            <Stack.Screen name="NovaPessoa" component={NovaPessoa} />
            <Stack.Screen name="Categorias" component={Categorias} />
            <Stack.Screen name="NovaCategoria" component={NovaCategoria} />
            <Stack.Screen name="Produtos" component={Produtos} />
            <Stack.Screen name="NovoProduto" component={NovoProduto} />
            <Stack.Screen name="ComprarProduto" component={ComprarProduto} />
            <Stack.Screen name="Estoque" component={Estoque} />
            <Stack.Screen name="Pagar" component={Pagar} />
            <Stack.Screen name="NovaContaPagar" component={NovaContaPagar} />
            <Stack.Screen name="BaixarPagar" component={BaixarPagar} />
            <Stack.Screen name="Receber" component={Receber} />
            <Stack.Screen name="NovaContaReceber" component={NovaContaReceber} />
            <Stack.Screen name="BaixarReceber" component={BaixarReceber} />
            <Stack.Screen name="Vendas" component={Vendas} />
            <Stack.Screen name="NovaVenda" component={NovaVenda} />
            <Stack.Screen name="FecharVenda" component={FecharVenda} />
            <Stack.Screen name="Compras" component={Compras} />
            <Stack.Screen name="NovaCompra" component={NovaCompra} />
            <Stack.Screen name="FecharCompra" component={FecharCompra} />
            <Stack.Screen name="Movimentacoes" component={Movimentacoes} />

            <Stack.Screen name="Splash" component={Splash} />
            
        </Stack.Navigator>
    )
}

function AppRoutes(){
    return(
        <NavigationContainer>
            <StackNavigator />
        </NavigationContainer>
    )
}
export default AppRoutes;