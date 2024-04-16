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


const App = () => {

  return (
    <div>
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
                  </Routes>
    </div>
  );
};

export default App;
