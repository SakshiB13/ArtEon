import React from "react";
import ParticlesBg from "particles-bg";
//import Fade from "react-reveal";

const Main = () => {
  
  const color =["#800080","#fc0fc0","##FF5733","#3498DB"," #2ECC71","#9B59B6"]

  return (
    <header id="home">
      <ParticlesBg type="circle" color={color} bg={true} num={10}/>

      <nav id="nav-wrap">
        <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
          Show navigation
        </a>
        <a className="mobile-btn" href="#home" title="Hide navigation">
          Hide navigation
        </a>

        <ul id="nav" className="nav">
          <li className="current">
            <a className="smoothscroll" href="#home">
              Home
            </a>
          </li>

          <li>
            <a className="smoothscroll" href="#about">
              About
            </a>
          </li>

          <li>
            <a className="smoothscroll" href="#resume">
              Resume
            </a>
          </li>

          <li>
            <a className="smoothscroll" href="#portfolio">
              Works
            </a>
          </li>

          <li>
            <a className="smoothscroll" href="#contact">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <div className="row banner">
        <div className="banner-text">
          
            <h1 className="responsive-headline">ArtEon</h1>

            <h3>Hi.</h3>
        
          <hr />
       
            <ul className="social">
              <a href="" className="button btn project-btn">
                <i className="fa fa-book"></i>Project
              </a>
              <a href="" className="button btn github-btn">
                <i className="fa fa-github"></i>Github
              </a>
            </ul>
         
        </div>
      </div>

      <p className="scrolldown">
        <a className="smoothscroll" href="#about">
          <i className="icon-down-circle"></i>
        </a>
      </p>
    </header>
  );
};

export default Main;
