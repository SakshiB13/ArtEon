import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './Main';
import Home from './Home'
import SignUp from './signUp';
import LogIn from './Login';
import Displaymarket from './Displaymarket';
import ForgotPassword from './ForgotPassword';
//import Portfolio from './Portfolio';
import Portfolio from './[id]';
import ArtistPage from './artist';
import CollectorPage from './collector';
import Feature from './feature';
import EditProfile from './components/EditProfile';

import { ThemeProvider } from './components/themeContext';
import AuctionPage from './AuctionPage';
import Chatbox from './components/Chatbox';


const App = () => {

  return (
    <div>
             <ThemeProvider>
                  <Routes>
                      <Route path='/' element={<Main/>}/>
                      <Route path='/home' element={<Home/>}/>
        
                      <Route path='/signup' element={<SignUp/>}/>
                      <Route path='/market' element={<Displaymarket/>}/>
                      <Route path='/forgotpassword' element={<ForgotPassword/>}/>
                      
                      <Route path='/:id' element={<Portfolio/>}/>
                      <Route path='/artistpage' element={<ArtistPage/>}/>
                      <Route path='/collectorpage' element={<CollectorPage/>}/>
                      <Route path='/feature' element={<Feature/>}/>
                      <Route path="/editprofile" element={<EditProfile />}></Route>
                      <Route path="/auction" element={<AuctionPage />}></Route>
                      <Route path="/chatbox" element={<Chatbox />}></Route>
                  </Routes>
                  </ThemeProvider>
    </div>
  );
};

export default App;