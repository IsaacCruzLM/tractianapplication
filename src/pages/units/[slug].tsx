import { GetStaticPaths, GetStaticProps } from 'next';
import styles from './units.module.scss';
import Head from 'next/head';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from 'react';


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
                }
            )
        })
        return dataArray;
    }

    // Options do gráfico de Saúde
    const healthOptions = {
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

    // Gera dados para gráfico de especificação para RPM
    const dataRPMGenerator = () => {
        const dataArray = filteredAssets.map((asset) => {
            const specificationsNames = Object.keys(asset.specifications);
            let rpm = specificationsNames.find((name) => name === 'rpm') !== undefined ? asset.specifications[specificationsNames.find((name) => name === 'rpm')] : 0;
            rpm === null ? rpm = 0 : rpm;
            return (
                {
                    name: asset.name,
                    color: '#396eeb',
                    y: rpm
                }
            )
        })
        return dataArray;
    }

    // Options do gráfico de especificação para RPM
    const specficationRPM = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Especificações de RPM'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Rotações por Minuto'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                name: 'Specifications',
                colorByPoint: true,
                data: dataRPMGenerator()
            }
        ]
    }

    // Gera dados para gráfico de especificação para Power
    const dataPOWERGenerator = () => {
        const dataArray = filteredAssets.map((asset) => {
            const specificationsNames = Object.keys(asset.specifications);
            const power = specificationsNames.find((name) => name === 'power') !== undefined ? asset.specifications[specificationsNames.find((name) => name === 'power')] : 0;
            return (
                {
                    name: asset.name,
                    color: '#396eeb',
                    y: power
                }
            )
        })
        return dataArray;
    }

     // Options do gráfico de especificação para Potência
    const specficationPower = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Especificações de Potência'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Potência em kWh'
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
                }
            }
        },
        series: [
            {
                name: 'Specifications',
                colorByPoint: true,
                data: dataPOWERGenerator()
            }
        ]
    }

    // Gera dados para gráfico de especificação para Power
    const dataTEMPGenerator = () => {
        const dataArray = filteredAssets.map((asset) => {
            const specificationsNames = Object.keys(asset.specifications);
            const temp = specificationsNames.find((name) => name === 'maxTemp') !== undefined ? asset.specifications[specificationsNames.find((name) => name === 'maxTemp')] : 0;
            return (
                {
                    name: asset.name,
                    color: '#396eeb',
                    y: temp
                }
            )
        })
        return dataArray;
    }
    
     // Options do gráfico de especificação para Temperatura
    const specficationTemp = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Especificações de Temperatura'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Temperatura Máxima em Celsius'
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
                }
            }
        },
        series: [
            {
                name: 'Specifications',
                colorByPoint: true,
                data: dataTEMPGenerator()
            }
        ]
    }

    const [specification, setSpecification] = useState(specficationRPM);

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

            <section className={styles.healthGraphic}>
                <HighchartsReact highcharts={Highcharts} options={healthOptions} />
            </section>

            <section className={styles.specificationsGraphic}>
                <button onClick={() => setSpecification( specficationRPM )}>Rotações Por Minuto</button>
                <button onClick={() => setSpecification( specficationPower )}>Potência</button>
                <button onClick={() => setSpecification( specficationTemp )}>Temperatura</button>
                <div id="grafico">
                    <HighchartsReact highcharts={Highcharts} options={specification} />
                </div>
            </section>

            <section className={styles.allUpdates}>
                <h2>Todos Ativos:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Total de Coletas Uptime(Ligada)</th>
                            <th>Total de Horas de Coletas Uptime(Ligada)</th>
                            <th>Data da Ultima Coleta Uptime(Ligada)</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAssets.map((asset) => {
                            return (
                                <tr>
                                    <td>{asset.name}</td>
                                    <td>{asset.metrics['totalCollectsUptime']}</td>
                                    <td>{asset.metrics['totalUptime']}</td>
                                    <td>{asset.metrics['lastUptimeAt']}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
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


