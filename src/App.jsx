import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './Main';
import Home from './Home'
import SignUp from './signUp';
import LogIn from './Login';
import Displaymarket from './Displaymarket';
import ForgotPassword from './ForgotPassword';
import Portfolio from './Portfolio';

const App = () => {

  return (
    <div>
                  <Routes>
                      <Route path='/' element={<Main/>}/>
                      <Route path='/home' element={<Home/>}/>
        
                      <Route path='/signup' element={<SignUp/>}/>
                      <Route path='/market' element={<Displaymarket/>}/>
                      <Route path='/forgotpassword' element={<ForgotPassword/>}/>
                      <Route path='/Portfolio' element={<Portfolio/>}/>
                  </Routes>
    </div>
  );
};

export default App;
