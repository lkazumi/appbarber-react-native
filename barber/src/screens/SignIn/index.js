import React, { useState, useContext, Image } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import {UserContext} from '../../contexts/UserContext';

import { 
    Container,
    InputArea,
    CustomButton,
    CustomButtonText,
    SignMessageButton,
    SignMessageButtonText,
    SignMessageButtonTextBold
} from './style';

import Api from '../../Api';

import SignInput from '../../components/SignInput';

import BarberLogo from '../../assets/barber.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';

export default () => {

    //Manda informações para o context
    const { dispatch: userDispatch } = useContext(UserContext);

    //Instancia Navigation para utilizar nos metodos
    const navigation = useNavigation();

    //capta email e senha da tela de login 
    const [emailField, setEmailField ] = useState('');          //user@gmail.net.br
    const [passwordField, setPasswordField] = useState('');     //123456

    //Valida login de acesso
    const handleSignClick = async () => {
        if(emailField != '' && passwordField != '') {

            let json = await Api.signIn(emailField, passwordField);
            if(json.token) {
                //Salva token do usuário
                await AsyncStorage.setItem('token', json.token);

                //Salva informação do avatar/imagem  no context
                userDispatch({
                    type: 'setAvatar',
                    payload:{
                        avatar: json.data.avatar
                    }
                });

                //Envia usuário para tela principal apos o login
                navigation.reset({
                    routes: [{name: 'MainTab'}]
                });

            }else {
                alert('E-mail e/ou senha incorretos!');
            }

        }else {
            alert("Preencha os campos!");
        }
    }

    //Direciona para a tela de cadastro
    const handleMessageButtonClick = () => {
        navigation.reset({
            routes: [{name: 'SignUp'}]
        });
    } 

    return (
        <Container>
            <BarberLogo width="100%" height="160" />
            
            <InputArea>
                <SignInput 
                    IconSvg={EmailIcon} 
                    placeholder="Digite seu e-mail"
                    value={emailField}
                    onChangeText={t=>setEmailField(t)}
                />

                <SignInput 
                    IconSvg={LockIcon} 
                    placeholder="Digite sua senha"
                    value={passwordField}
                    onChangeText={t=>setPasswordField(t)}
                    password={true}
                />

                <CustomButton onPress={handleSignClick}>
                    <CustomButtonText>LOGIN</CustomButtonText>
                </CustomButton>

            </InputArea>

            <SignMessageButton onPress={handleMessageButtonClick}>
                <SignMessageButtonText>Ainda não possui uma conta?</SignMessageButtonText>
                <SignMessageButtonTextBold>Cadastre-se</SignMessageButtonTextBold>
            </SignMessageButton>

        </Container>
    );
}