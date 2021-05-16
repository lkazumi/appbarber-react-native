import React from 'react';
import styled from 'styled-components/native';

// utilizado em styled.<metodo>`` 

//Style background
export const Container = styled.SafeAreaView`
    background-color: #63C2D1;
    flex: 1;
    justify-content: center;
    align-items: center;
`;

//Icone de carregamento
export const LoadingIcon = styled.ActivityIndicator`
    margin-top: 50px;
`;