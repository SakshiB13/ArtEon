import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './darkmode.css'
//import './lightmode.css'
import App from './App'


ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="*" element={ <App /> }>
    </Route>
    </Routes>
  </BrowserRouter>
</React.StrictMode>,
 
  document.getElementById('root')
)