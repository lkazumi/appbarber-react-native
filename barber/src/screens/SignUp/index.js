import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import { UserContext } from '../../contexts/UserContext';

import { 
    Container,
    InputArea,
    CustomButton,
    CustomButtonText,
    SignMessageButton,
    SignMessageButtonText,
    SignMessageButtonTextBold 
} from './style';

import SignInput from '../../components/SignInput';

import Api from '../../Api';

import BarberLogo from '../../assets/barber.svg';
import PersonIcon from '../../assets/person.svg';
import EmailIcon from '../../assets/email.svg';
import LockIcon from '../../assets/lock.svg';


export default () => {

    //Manda informações para o context
    const { dispatch: userDispatch } = useContext(UserContext);

    //Instancia Navigation para utilizar nos metodos
    const navigation = useNavigation();

    //capta dados da tela de cadastro
    const [nameField, setNameField ] = useState('');
    const [emailField, setEmailField ] = useState('');
    const [passwordField, setPasswordField ] = useState('');

    //Valida dados inseridos e insere no banco de dados(API)
    const handleSignClick = async () => {
        if(nameField != '' && emailField != '' && passwordField != '') {
            let res = await Api.signUp(nameField, emailField, passwordField); //cadastra os dados
            

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
                    routes:[{name:'MainTab'}]
                });
                
            }else {
                alert("Erro: " + res.error);
            }

        } else {
            alert('Preencha os campos!')
        }
    }

    //Direciona para tela de login
    const handleMessageButtonClick = () => {
        navigation.reset({
            routes: [{name: 'SignIn'}]
        });
    }

    return (
        <Container>
            <BarberLogo width="100%" height="160" />

            <InputArea>
                <SignInput 
                    IconSvg={PersonIcon}
                    placeholder="Digite seu nome"
                    value={nameField}
                    onChangeText={t=>setNameField(t)}
                />

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
                    <CustomButtonText>CADASTRAR</CustomButtonText>
                </CustomButton>

            </InputArea>

            <SignMessageButton onPress={handleMessageButtonClick}>
                <SignMessageButtonText>Já possui uma conta?</SignMessageButtonText>
                <SignMessageButtonTextBold>Faça Login</SignMessageButtonTextBold>
            </SignMessageButton>

        </Container>
    );
}