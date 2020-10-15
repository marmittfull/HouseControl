import React, {useState} from 'react';
import { StyleSheet, View} from 'react-native';
import Accordian from './Accordion'
import { CustomHeader }  from '../assets/CustomHeader'
import {useNavigation} from '@react-navigation/native'


export default function SuportScreen() {

  const navigation = useNavigation()
  let [menu, setMenu] = useState([
    {
      title: 'Por que não consigo abrir meu portão?',
      data: [{key: 'Para realizar as funções de abertura e fechamento do seu portão é essencial que seu smartphone esteja conectado e pareado com o portão através do Bluetooth, além de possuir uma conexão instável com a internet.', value: false}],
      key: 1
    },
    {
      title: 'Por que não consigo gerenciar os usuários?',
      data: [{key: 'Os usuários podem ser gerenciados apenas por contas do tipo "administrador", caso a opção de gerenciamento não esteja disponível para você, significa que seu usuário é do tipo "comum".', value: false}],
      key:2
    },
    {
      title: 'Por que preciso informar meu CPF?',
      data: [{key: 'Ao menos um CPF deve ser informado ao cadastrar o usuário, caso a senha ou email seja perdido, será necessário o código de segurança e CPF para recuperá-la.', value: false}],
      key:3
    },
    {
      title: 'Por que não consigo editar meu CPF?',
      data: [{key: 'Por questões de segurança, o email informado no cadastro do usuário não pode ser alterado.', value: false}],
      key:4
    },
    {
     title: 'Por que não consigo editar meu email?',
     data: [{key: 'Por questões de segurança, o email informado no cadastro do usuário não pode ser alterado.', value: false}],
     key:5
    },
    {
      title: 'Por que não consigo editar meu código de verificação?',
      data: [{key: 'Por questões de segurança, o código de verificação informado no cadastro do usuário não pode ser alterado.', value: false}],
      key:6
    },
    {
      title: 'Por que não consigo excluir o primeiro usuário criado no sistema?',
      data: [{key: 'Por questões de segurança, o primeiro usuário cadastrado no sistema não pode ser excluido, isso garante que em toda a vida útil de seu aplicativo terá ao menos uma conta administrador para gerenciar o sistema.', value: false}],
      key:7
    },
      {
          title: 'Por que não consigo visualizar os meus registros antigos?',
          data: [{key: 'Para garantir uma boa e veloz experiência ao utilizar o aplicativo mostramos os registros das aberturas e fechamentos do portão realizados nos últimos 7 dias.', value: false}],
          key:8
      }
  ])

  let renderAccordians=()=> {
    const items = [];
    let i= 0;
    for (item of menu) {
        items.push(
            <Accordian
                title = {item.title}
                data = {item.data}
                key = {item.key}
            />
        );
    }
    return items;
}
    return (
      <View style={styles.container}>
          <CustomHeader title="Suporte"  navigation={navigation}/>
        { renderAccordians() }
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
   flex:1,
   backgroundColor:'white',

  }
});
