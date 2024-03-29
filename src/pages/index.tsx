import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import styles from './home.module.scss'

type Unit = {
  id: number;
  name: string;
  companyId: number;
}

type Company = {
  id: number;
  name: string;
}

type HomeProps = {
  units : Unit[];
  companies: Company[];
}

export default function Home({ units, companies }: HomeProps) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Tractian</title>
        <link rel="icon" href="/favicon-traction.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.companyContainer}>
          <img src="/building-solid.svg" alt="Empresa" />
          <div>
            <p>Company Name:</p>
            <h1>{companies[0].name}</h1>
          </div>
        </section>

        <section className={styles.unitsContainer}>
          <h2>Todas as Unidades:</h2>
          <ul>
            {units.map((unit) => {
              return (
                <li key={unit.id}>
                  <div className={styles.unitHead}>
                    <img src="/cogs-solid.svg" alt="unit"/>
                    <h3>Unidade {unit.id}</h3>
                  </div>
                  <p>Nome da Unidade:</p>
                  <h4>{unit.name}</h4>
                  <p>Nome da Empresa:</p>
                  {/* Pegar Dinamicamente o nome da empresas com o unityID */}
                  <h4>{companies[0].name}</h4>
                  <div className={styles.arroyImg}>
                    <Link href={`/units/${unit.id}`} >
                      <img src="arrow-alt-circle-right-solid.svg" alt="Verificar Unidade" />
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await fetch('https://my-json-server.typicode.com/tractian/fake-api/db');
  const data = await res.json();

  return {
    props: {
      units: data.units,
      companies: data.companies,
    }
  }
}




