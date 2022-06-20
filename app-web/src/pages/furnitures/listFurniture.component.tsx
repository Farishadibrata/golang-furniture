import { Grid, LoadingOverlay, SimpleGrid, useMantineTheme } from '@mantine/core'
import { gql, GraphQLClient } from 'graphql-request';
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { CardWithStats } from './card.component';

function ListFurniture() {
    const [styles, setStyles] = useState([])

    const COLOR_LIST = Object.keys(useMantineTheme().colors)
    const [badgeColors, setBadgeColors] = useState<any>({})
    
    const client = new GraphQLClient("/gql/query", {
        headers: {
            authorization: "Bearer " + localStorage.getItem('jwt')
        }
    })

    const { isLoading, error, data } = useQuery(['cardFurnitures', styles], async () => {
        const queryFilter = ''
        const query = gql`query items {
          items(input: {}){
            id
            name
            price
            style
            description
            deliveryDays
          }
        }`;
        return await client.request(query).then(data => data.items)
    }, {
        initialData: []
    })

    useEffect(() => {
        data.map((item : any) => {
            if(!Object.keys(badgeColors).includes(item.style)){
                let colors = COLOR_LIST.sort( () => .5 - Math.random() );
                colors.map((color : string) => {
                    if(!Object.values(badgeColors).includes(color)){
                        let newColor : any = badgeColors
                        newColor[item.style] = color
                        setBadgeColors(newColor)
                    }
                })
            }
        })
    }, data)

    if(isLoading){
        return <LoadingOverlay visible />
    }

    return (
        <>
        
            <Grid columns={4} >
                {data.map((i, index) => (
                    <Grid.Col md={1} sm={2} span={4}>
                        <CardWithStats  {...i} index={index} deliveryDays={i.deliveryDays} badgeColor={badgeColors[i.style]} />
                    </Grid.Col>
                ))}
            </Grid>
        </>
    )
}

export default ListFurniture