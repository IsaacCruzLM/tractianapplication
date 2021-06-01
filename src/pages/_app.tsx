import '../styles/global.scss';

import styles from '../styles/app.module.scss';

import { Header } from '../components/Header';

function MyApp({ Component, pageProps }) {
  return(
    <main>
      <Header />
      <Component {...pageProps} />
    </main>
  )
}

export default MyApp
