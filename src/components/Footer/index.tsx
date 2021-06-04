import styles from './styles.module.scss';

export function Footer () {
    return (
        <footer className={styles.footer}>
            <img src="/copyright-regular.svg" alt="copyright" />
            <p> - Copyright, 2021 - Isaac Cruz</p>
        </footer>
    );
}