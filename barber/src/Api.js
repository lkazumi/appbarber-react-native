import AsyncStorage from '@react-native-community/async-storage';

const BASE_API = 'https://api.b7web.com.br/devbarber/api';

export default {
    checkToken: async (token) => {
        const req = await fetch(`${BASE_API}/auth/refresh`,{
            method: 'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token})
        });
        const json = await req.json();
        return json;
    },   
    signIn: async (email, password) => { //capta dados inseridos nos campos
        const req = await fetch(`${BASE_API}/auth/login`,{  //requisição dos dados de login
            method: 'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})  //conteudo que sera mandado
        });
        const json = await req.json();    //transforma em json 
        return json;    //retorna requisição
    },

    signUp: async (name, email, password) => {  
        const req = await fetch(`${BASE_API}/user`,{ 
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password}) 
        });
        const json = await req.json(); //
        return json;
    },

    logout: async () => {  
        const token = await AsyncStorage.getItem('token');

        const req = await fetch(`${BASE_API}/auth/logout`,{ 
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token}) 
        });
        const json = await req.json(); //
        return json;
    },

    getBarbers: async (lat=null, long=null, address=null) => {
        //Pega lista de barbeiros na api
        const token = await AsyncStorage.getItem('token');

        console.log("LAT ",lat);
        console.log("LGN ",long);
        console.log("Address ",address);

        const req = await fetch(`${BASE_API}/barbers?token=${token}&lat=${lat}&long=${long}&address=${address}`);
        const json = await req.json();
        return json;
    },

    getBarber: async (id) => {
        const token = await AsyncStorage.getItem('token');
        const req = await fetch(`${BASE_API}/barber/${id}?token=${token}`);
        const json = await req.json();
        console.log(json);
        return json;
    },

    setFavorite: async (barberId) => {
        const token = await AsyncStorage.getItem('token');

        const req = await fetch(`${BASE_API}/user/favorite`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({barber:barberId})
        });
        const json = await req.json();
        return json;
    }
};