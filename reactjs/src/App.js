import './css/index.css'
import Layout from './components/Layout/Layout'
import { Route, Routes } from 'react-router-dom'
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginRegister/LoginPage';
import RegisterPage from './components/LoginRegister/RegisterPage';
import Errorpage from './components/ErrorPage/Errorpage';
import UserMessages from './components/Messages/UserMessages';
import ReadMessage from './components/Messages/ReadMessage';
import Contact from './components/Contact/Contact';
import About from './components/Contact/About';
import Latest from './components/Latest/Latest';
import UserSettings from './components/UserSettings/UserSettings';
import ViewNews from './components/News/ViewNews';
import UserProfile from './components/Profile/UserProfile';
import WriteNews from './components/News/WriteNews';

function App() {
  return (
    <Layout>
      <Routes>

        <Route path='/' element={ <MainPage /> } />
        <Route path='/:nr' element={ <MainPage /> } />

        <Route path='/login' element={ <LoginPage /> } />
        <Route path='/register' element={ <RegisterPage /> } />
        
        <Route path='/user-settings' element={ <UserSettings /> } />
        <Route path='/user/:name' element={ <UserProfile /> } />

        <Route path='/my-messages' element={ <UserMessages /> } />
        <Route path='/my-messages/:id' element={ <ReadMessage /> } />

        <Route path='/latest-news' element={ <Latest /> } />
        <Route path='/latest-news/:nr' element={ <Latest /> } />

        <Route path='/news/:title' element={ <ViewNews /> } />
        <Route path='/write-news' element={ <WriteNews /> } />

        <Route path='/contact' element={ <Contact /> } />
        <Route path='/about' element={ <About /> } />

        <Route path='/error' element={ <Errorpage /> } />

      </Routes>
    </Layout>
  );
}

export default App;
