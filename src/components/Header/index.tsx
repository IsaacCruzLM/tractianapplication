import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import React from 'react';

import styles from './styles.module.scss';

export function Header () {
 
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {locale: ptBR,});

    return (

        <header className={styles.headerContainer}>
            <Link href={`http://localhost:3000/`} >
                <img src="/logo.svg" alt="TRACTIAN"/>
            </Link>
            <p>Monitoramento de máquinas <strong>Tractian</strong></p>

            <span>{currentDate}</span>

            <div>
                <img src="/user-solid.svg" alt="Usuário" />
                <p>Testador 1</p>
            </div>
        </header>
    );
}

