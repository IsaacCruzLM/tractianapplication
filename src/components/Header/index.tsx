import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss';

export function Header () {
 
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {locale: ptBR,});

    return (

        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="TRACTIAN"/>

            <p>Monitoramento de máquinas <strong>Tractian</strong></p>

            <span>{currentDate}</span>

            <div>
                <img src="/user-solid.svg" alt="Usuário" />
                <p>Testador 1</p>
            </div>
        </header>
    );
}

