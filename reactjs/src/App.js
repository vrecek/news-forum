import './css/index.css'
import Layout from './components/Layout/Layout'
import { Route, Routes } from 'react-router-dom'
import MainPage from './components/MainPage/MainPage';

function App() {
  return (
    <Layout>
      <Routes>

        <Route path='/' element={ <MainPage /> } />

      </Routes>
    </Layout>
  );
}

export default App;
