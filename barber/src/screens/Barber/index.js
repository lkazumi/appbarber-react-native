import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'
import Swiper from 'react-native-swiper';

import Stars from '../../components/Stars';
import BarberModal from '../../components/BarberModal';

import FavoriteFullIcon from '../../assets/favorite_full.svg';
import FavoriteIcon from '../../assets/favorite.svg';
import BackIcon from '../../assets/back.svg';
import NavPrevIcon from '../../assets/nav_prev.svg';
import NavNextIcon from '../../assets/nav_next.svg';

import { 
    Container,
    Scroller,
    PageBody,
    BackButton,
    LoadingIcon,

    SwipeDot,
    SwipeDotActive,
    SwipeItem,
    SwipeImage,
    FakeSwiper,

    UserInfoArea,
    UserAvatar,
    UserInfo,
    UserInfoName,
    UserFavButton,

    ServiceArea,
    ServicesTitle,
    ServiceItem,
    ServiceInfo,
    ServiceName,
    ServicePrice,
    ServiceChooseButton,
    ServiceChooseBtnText,

    TestimonialArea,
    TestimonialItem,
    TestimonialInfo,
    TestimonialName,
    TestimonialBody
} from './style';
import Api from '../../Api';

export default () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [userInfo, setUserInfo] = useState({
        id: route.params.id,
        avatar: route.params.avatar,
        name: route.params.name,
        stars: route.params.stars
    });

    const [loading, setLoading] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        //Faz requisição para pegar informações do barbeiro
        const getBarberInfo = async () => {
            setLoading(true);

            let json = await Api.getBarber(userInfo.id);
            if(json.error == ''){
                setUserInfo(json.data);
                setFavorited(json.data.favorited);
            }else {
                alert("Erro: "+json.error);
            }

            setLoading(false);
        }
        getBarberInfo();
    }, [])

    const handleBackButton = () => {
        navigation.goBack(); // goBack volta de onde veio
    }

    const handleFavClick = () => {
        setFavorited( !favorited ); //botao favoritos
        Api.setFavorite( userInfo.id );
    }

    const handleServiceChoose = (key) => {
        setSelectedService(key);
        setShowModal(true);
    }

    return(
        <Container>
            <Scroller>
                {userInfo.photos && userInfo.photos.length > 0 ? //if ternario verifica se há fotos da barbearia
                    <Swiper
                        style={{height: 240}}
                        dot={<SwipeDot />}
                        sctiveDot={<SwipeDotActive />}
                        paginationStyle={{top: 15, right: 15, bottom: null, left: null}} //local do ponto
                        autoplay={true} //transicao automatica das imagens
                    >
                        {userInfo.photos.map((item,key)=>(
                            <SwipeItem key={key}> 
                                <SwipeImage source={{uri:item.url}} resizeMode="cover" /*redimenciona a imagem*//> 
                            </SwipeItem>
                        ))}
                    </Swiper>
                    :
                    <FakeSwiper></FakeSwiper>
                }
                <PageBody>
                    <UserInfoArea>
                        <UserAvatar source={{uri:userInfo.avatar}} />
                        <UserInfo>
                            <UserInfoName>{userInfo.name}</UserInfoName>
                            <Stars stars={userInfo.stars} showNumber={true} />
                        </UserInfo>
                        <UserFavButton onPress={handleFavClick}>
                            {favorited ?
                                <FavoriteFullIcon width="24" height="24" fill="#FF0000" />
                                :
                                <FavoriteIcon width="24" height="24" fill="#FF0000" />
                            }                            
                        </UserFavButton>
                    </UserInfoArea>

                    {loading &&
                        <LoadingIcon size="large" color="#000000" />
                    }
                    
                    {userInfo.services &&
                        <ServiceArea>
                            <ServicesTitle>Lista de Serviços</ServicesTitle>

                            {userInfo.services.map((item, key)=>(
                                <ServiceItem key={key}>
                                    <ServiceInfo>
                                        <ServiceName>{item.name}</ServiceName>
                                        <ServicePrice>R$ {item.price.toFixed(2)}</ServicePrice>
                                    </ServiceInfo>
                                    <ServiceChooseButton onPress={()=> handleServiceChoose(key)}>
                                        <ServiceChooseBtnText>Agendar</ServiceChooseBtnText>
                                    </ServiceChooseButton>
                                </ServiceItem>
                            ))}
                        </ServiceArea>
                    }

                    {userInfo.testimonials && userInfo.testimonials.length > 0 &&
                        <TestimonialArea>
                            <Swiper 
                                style={{height: 110}} 
                                showsPagination={false}
                                showsButtons={true}
                                prevButton={<NavPrevIcon width="35" height="35" fill="#000000" />}
                                nextButton={<NavNextIcon width="35" height="35" fill="#000000" />}
                            >
                                {userInfo.testimonials.map((item,key)=>(
                                    <TestimonialItem key={key}>
                                        <TestimonialInfo>
                                            <TestimonialName>{item.name}</TestimonialName>
                                            <Stars stars={item.rate} showNumber={false} />
                                        </TestimonialInfo>
                                        <TestimonialBody>{item.body}</TestimonialBody>
                                    </TestimonialItem>
                                ))}
                            </Swiper>
                        </TestimonialArea>
                    }
                </PageBody>
            </Scroller>
            <BackButton onPress={handleBackButton}>
                <BackIcon width="44" height="44" fill="#FFFFFF" />
            </BackButton>

            <BarberModal  
                show={showModal}
                setShow={setShowModal}
                user={userInfo}
                service={selectedService}
            />

        </Container>
    );
}