import { GetStaticPaths, GetStaticProps } from 'next';
import styles from './units.module.scss';
import Head from 'next/head';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

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

type Unit = {
    id: number;
    name: string;
    companyId: number;
  }

type UnitProps = {
    assets: Asset[];
    units : Unit[];
    slug;
} 

export default function Unit({ assets, slug, units }: UnitProps) {

    // Filtra objs da API da unidade atual
    const filteredAssets = assets.filter((asset) => asset.unitId === parseFloat(slug));

    // Pega unidade atual
    const currentUnit = units.find((unit) => unit.id === parseFloat(slug));

    // Gera dados para gráfico de saúde
    const dataGenerator = () => {
        const dataArray = filteredAssets.map((asset) => {
            return (
                {
                    name: asset.name,
                    color: '#396eeb',
                    y: asset.healthscore,
                    drilldown: asset.id
                }
            )
        })
        return dataArray;
    }

    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Pontuações de Saúde'
        },
        xAxis: {
            title: {
                text: 'Unidades'
            },
            type: 'category'
        },
        yAxis: {
            title: {
                text: '% de Saúde'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        },
        series: [
            {
                name: 'Assets',
                colorByPoint: true,
                data: dataGenerator()
            }
        ]
    }

    return (
        <div className={styles.episodes}>

            <Head>
                <title>{currentUnit.name} | TRACTIAN</title>
            </Head>

            <h1>{currentUnit.name}</h1>

            <section className={styles.allAssets}>
                <h2>Todos Ativos:</h2>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Modelo</th>
                            <th>Sensores</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAssets.map((asset) => {
                            return (
                                <tr>
                                    <td>
                                        <img style={{ width: 30}} src={asset.image} alt={asset.name} />
                                    </td>
                                    <td>{asset.name}</td>
                                    <td>{asset.model}</td>
                                    <td>{asset.sensors}</td>
                                    <td>{asset.status}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </section>

            <section className={styles.graphic}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </section>
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
        units: data.units,
      }
    }
}

