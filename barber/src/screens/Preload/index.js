import React, { useEffect, useContext } from 'react';
import { Container, LoadingIcon } from './style';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';

import { UserContext } from '../../contexts/UserContext';
import Api from '../../Api';

import BarberLogo from '../../assets/barber.svg';

export default () => {

    //Manda informações para o context
    const { dispatch :  userDispatch } = useContext(UserContext);

    //Instancia Navigation para utilizar nos metodos
    const navigation = useNavigation();

    useEffect(()=>{
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if(token) {
                //Valida token
                let res = await Api.checkToken(token);
                if(res.token) {

                    //Salva token do usuário
                    await AsyncStorage.setItem('token', res.token);

                    //Salva informação do avatar/imagem  no context
                    userDispatch({
                        type: 'setAvatar',
                        payload:{
                            avatar: res.data.avatar
                        }
                    });

                    //Envia usuário para tela principal apos o login
                    navigation.reset({
                        routes:[{name: 'MainTab'}]
                    });

                }else {
                    navigation.navigate('SignIn');
                }

            }else {
                navigation.navigate('SignIn');
            }
        }
        checkToken();
    },[]);

    return (
        <Container>
            <BarberLogo width="100%" height="160" />
            <LoadingIcon size="large" color="#FFFFFF" />
        </Container>
    );
}