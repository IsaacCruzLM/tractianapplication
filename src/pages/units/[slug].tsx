import { GetStaticPaths, GetStaticProps } from 'next';
import styles from './units.module.scss';
import Head from 'next/head';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useState } from 'react';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';


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

type User = {
    id: number;
    name: string;
    unitId: number;
}

type UnitProps = {
    assets: Asset[];
    units : Unit[];
    users: User[];
    slug;
} 

export default function Unit({ assets, slug, units, users }: UnitProps) {

    // Filtra objs da API da unidade atual
    const filteredAssets = assets.filter((asset) => asset.unitId === parseFloat(slug));

    // Filtra users da unidade
    const filteredUsers = users.filter((user) => user.unitId === parseFloat(slug));

    // Pega unidade atual
    const currentUnit = units.find((unit) => unit.id === parseFloat(slug));

    // Formata datas de última atualização
    const arrarOfFormatedDates = filteredAssets.map((asset) => {
        return format(parseISO(asset.metrics['lastUptimeAt']), "dd MMMM yyyy', às ' HH:mm'h'", {locale: ptBR})
    })

    // Icon Generator
    const iconGenerator = (string) => {
        if (string === 'inAlert') { return <img className={styles.statusIcon} src="/asset-inAlert.svg" alt="Em Alerta" />}
        if (string === 'inDowntime') { return <img className={styles.statusIcon} src="/asset-inDownTime.svg" alt="Em Parada" />}
        if (string === 'inOperation') { return <img className={styles.statusIcon} src="/asset-inOperation.svg" alt="Em Operação" />}
    }

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
            text: 'Pontuações de Saúde',
            style: {
                fontWeight: 600,
            }
        },
        xAxis: {
            type: 'category',
            labels: {
                style: {
                    color: 'black',
                    fontSize: '15px'
                }
            }
        },
        yAxis: {
            title: {
                text: '% de Saúde',
                style: {
                    color: 'black',
                    fontSize: '20px'
                }
            },
            labels: {
                style: {
                    color: 'black',
                    fontSize: '10px'
                }
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
    const specificationRPM = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Especificações de RPM',
            style: {
                fontWeight: 600,
            }
        },
        xAxis: {
            type: 'category',
            labels: {
                style: {
                    color: 'black',
                    fontSize: '15px'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Rotações por Minuto',
                style: {
                    color: 'black',
                    fontSize: '20px'
                }
            },
            labels: {
                style: {
                    color: 'black',
                    fontSize: '10px'
                }
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
    const specificationPower = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Especificações de Potência',
            style: {
                fontWeight: 600,
            }
        },
        xAxis: {
            type: 'category',
            labels: {
                style: {
                    color: 'black',
                    fontSize: '15px'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Potência em kWh',
                style: {
                    color: 'black',
                    fontSize: '20px'
                }
            },
            labels: {
                style: {
                    color: 'black',
                    fontSize: '10px'
                }
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
    const specificationTemp = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Especificações de Temperatura',
            style: {
                fontWeight: 600,
            }
        },
        xAxis: {
            type: 'category',
            labels: {
                style: {
                    color: 'black',
                    fontSize: '15px'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Temperatura Máxima em Celsius',
                style: {
                    color: 'black',
                    fontSize: '20px'
                }
            },
            labels: {
                style: {
                    color: 'black',
                    fontSize: '10px'
                }
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

    const [specification, setSpecification] = useState(specificationRPM);

    return (
        <div className={styles.mainContent}>

            <Head>
                <title>{currentUnit.name} | TRACTIAN</title>
                <link rel="icon" href="/favicon-traction.ico" />
            </Head>

            <div className={styles.unitHead}>
                <img src="/cogs-solid.svg" alt="unit"/>
                <h1>{currentUnit.name}</h1>
            </div>

            <section className={styles.allAssets}>
                <h2>Todos Ativos:</h2>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Modelo</th>
                            <th>Sensores</th>
                            <th>Responsável</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAssets.map((asset) => {
                            return (
                                <tr>
                                    <td>
                                        <img  src={asset.image} alt={asset.name} />
                                    </td>
                                    <td>{asset.name}</td>
                                    <td>{asset.model}</td>
                                    <td>{asset.sensors}</td>
                                    <td>
                                        <select name="" id="">
                                            <option value={0}>Selecionar Responsável</option>
                                            {filteredUsers.map((user) => <option value={user.id}>{user.name}</option> )}
                                        </select>
                                    </td>
                                    <td className={styles.statusColumn}>{asset.status}</td>
                                    <td>{iconGenerator(asset.status)}</td>
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
                <h4>Selecione a propiedade</h4>
                <div className={styles.graphicButtons}>
                    <button onClick={() => setSpecification( specificationRPM )}>Rotações Por Minuto</button>
                    <button onClick={() => setSpecification( specificationPower )}>Potência</button>
                    <button onClick={() => setSpecification( specificationTemp )}>Temperatura</button>
                </div>
            </section>
            <div id="graphic">
                    <HighchartsReact highcharts={Highcharts} options={specification} />
            </div>
            <section className={styles.allUpdates}>
                <h2>Ultimas Atualizações:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Total de Coletas Uptime</th>
                            <th>Total de Horas de Coletas Uptime</th>
                            <th>Data da Ultima Coleta Uptime</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAssets.map((asset, index) => {
                            return (
                                <tr>
                                    <td>{asset.name}</td>
                                    <td>{asset.metrics['totalCollectsUptime']}</td>
                                    <td>{asset.metrics['totalUptime'].toFixed(2)}</td>
                                    <td>{arrarOfFormatedDates[index]}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <span>*Uptime - Ligada</span>
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
        users: data.users,
      }
    }
}


