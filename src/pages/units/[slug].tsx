import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './units.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

type Asset = {
    id: number;
    sensors: object;
    model: string;
    status: string;
    healthscore: number;
    name: string;
    image: string;
    specifications: object;
    metrics: object;
    unitId: number;
}


type UnitProps = {
    assets: Asset[];
    slug;
} 

export default function Unit({assets, slug }: UnitProps) {

    const filteredAssets = assets.filter((asset) => asset.unitId === parseFloat(slug))

    return (
        <div className={styles.episodes}>

            <Head>
                <title> | TRACTIAN</title>
            </Head>

            <ul>
                {filteredAssets.map((asset) => {
                    return(
                        <li>
                            <p>{asset.id}</p>
                            <p>{asset.healthscore}</p>
                            <p>{asset.image}</p>
                            <p>{asset.model}</p>
                            <p>{asset.name}</p>
                            <p>{asset.sensors}</p>
                            <p>{asset.status}</p>
                        </li>
                    )
                })}
            </ul>
            
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const res = await fetch('https://my-json-server.typicode.com/tractian/fake-api/assets');
    const data = await res.json();

    const paths = data.map(asset => {
        return{
            params: {
                slug: (asset.unitId).toString()
            }
        }
    })

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const res = await fetch('https://my-json-server.typicode.com/tractian/fake-api/db');
    const data = await res.json();

    data.slug = slug;
  
    return {
      props: {
        assets: data.assets,
        slug: data.slug,
      }
    }
}