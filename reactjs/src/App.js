import './css/index.css'
import Layout from './components/Layout/Layout'
import { Route, Routes } from 'react-router-dom'
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginRegister/LoginPage';
import RegisterPage from './components/LoginRegister/RegisterPage';
import Errorpage from './components/ErrorPage/Errorpage';
import UserMessages from './components/Messages/UserMessages';
import ReadMessage from './components/Messages/ReadMessage';

function App() {
  return (
    <Layout>
      <Routes>

        <Route path='/' element={ <MainPage /> } />
        <Route path='/login' element={ <LoginPage /> } />
        <Route path='/register' element={ <RegisterPage /> } />

        <Route path='/my-messages' element={ <UserMessages /> } />
        <Route path='/my-messages/:id' element={ <ReadMessage /> } />

        <Route path='/error' element={ <Errorpage /> } />

      </Routes>
    </Layout>
  );
}

export default App;
