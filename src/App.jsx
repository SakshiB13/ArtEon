import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './Main';
import Home from './Home'
import SignUp from './signUp';
import LogIn from './Login';

const App = () => {

  return (
    <div>
                  <Routes>
                      <Route path='/' element={<Main/>}/>
                      <Route path='/home' element={<Home/>}/>
        
                      <Route path='/signup' element={<SignUp/>}/>
                  </Routes>
    </div>
  );
};

export default App;
