import React, {useState} from 'react';
import './ProductList.css';
import {ProductItem} from "./ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1',title: 'Джинсы', price: 5000,description:'Голубые цвета,прямые', img: 'https://catherineasquithgallery.com/uploads/posts/2021-02/1614532065_16-p-odezhda-na-belom-fone-21.jpg'},
    {id: '2',title:'Куртка',price: 12000, description:'Черного цвета,теплая',img: 'http://i01.i.aliimg.com/wsphoto/v0/32222974693_4/2014-mens-winter-jacket-men-s-hooded-padded-coat-winter-thickening-outerwear-mens-slim-casual-cotton.jpg'},
    {id: '3' ,title: 'Мобильный телефон', price: 25000, desription:'Темно синего цвета', img: 'https://cdn.skidka-msk.ru/images/prodacts/sourse/8306/8306729_mobilnyiy-telefon-vertex-k202-k202br.jpg'},
    {id: '4', title:'копьютер',price:90000,description: 'Черный,самый мощный', img: 'https://digital-discount.ru/wp-content/uploads/d/1/b/d1b29c75bf0f4d184912958d7c906a11.jpeg'},
    {id: '5', title:'пицца',price:500000000000000000000,description:'Золотая',img: 'https://pic.rutubelist.ru/video/a4/9a/a49aff2b750e8ab097f17bcbe801d14f.jpg'},
    {id:'6',title:'дом',price:1000000,description:'Коричнивый цвета,большой',img:'//almode.top/uploads/posts/2021-05/1622442373_52-p-kirpichnii-dom-v-amerikanskom-stile-57.jpg'},
    {id:'7',title:'корова',price:56000,description:'Очень грязная',img:'//gov.cap.ru/Content2021/news/202110/26/Original/shutterstock_520144285.jpg'},
    {id:'8',title:'привет сосед',price:350,description:'Игра',img:'https://avatars.dzeninfra.ru/get-zen-logos/5398874/pubsuite_101e8038-baf1-4ea7-b48a-058171a9787e_64f581adc812e202f3d84fb5/orig'},
    {id: '9',title:'доска',price:6791,description:'Зеленая',img:'https://catherineasquithgallery.com/uploads/posts/2021-02/1613655366_26-p-fon-dlya-prezentatsii-shkolnaya-doska-27.jpg'}
]


const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

export const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);

    const {tg, queryId, onClose} = useTelegram();

    const onSendData = useCallback(() => {
        
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
            tg.onClose()
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};
 