import React, { useEffect } from "react";
import ParticlesBg from "particles-bg";
import $ from "jquery";
import "./Main.css"; // Import your CSS file for styling

const Main = () => {
  
  const color =["#800080","#fff700","#FF5733","#3498DB"," #2ECC71","#9B59B6"];

  useEffect(() => {
    // Smooth scrolling functionality
    $('.smoothscroll').on('click', function(e) {
      e.preventDefault();
      var target = this.hash,
          $target = $(target);
      $('html, body').stop().animate({
        'scrollTop': $target.offset().top
      }, 800, 'swing', function() {
        window.location.hash = target;
      });
    });
  }, []);

  return (
    <div>
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
              <a className="smoothscroll" href="#contact">
                Contact
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#creators">
                Creators
              </a>
            </li>
          </ul>
        </nav>
        <div className="row banner">
          <div className="banner-text">
            <h1 className="responsive-headline">ArtEon</h1>
            <h3>"Unlock the World of Digital Artistry"</h3>
            <hr />
            <ul className="social">
              <a href="/signup" className="button btn project-btn">
                <i className="fa fa-book"></i>Sign Up
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
      
      <section id="about" className="section-center">
        <div className="row">
         
          <div className="nine columns main-col">
            <h2>About Us</h2>
            <p>"At ArtEon, we believe in the power of art to inspire, connect, and transform. Our journey began with a simple idea: to create a vibrant community where artists and art enthusiasts alike can thrive. From seasoned creators to emerging talents, we're dedicated to providing a platform that celebrates creativity in all its forms. With a passion for innovation and a commitment to accessibility, we're shaping the future of digital art and NFTs. Join us on this exciting adventure as we redefine the way the world experiences and values art."</p>
          </div>
        </div>
      </section>
      
      <section id="contact" className="section-center">
        <div className="row">
          <div className="twelve columns">
            <h2>Contact Us</h2>
            <p className="address">
              <span>Email: arteon@example.com</span>
            </p>
          </div>
        </div>
      </section>

      <section id="creators" className="section-center">
        <div className="row">
          <div className="twelve columns">
            <h2>Meet the Creators</h2>
            <div className="creator-card">
              <div className="creator">
                <img src="/images/sakshi.png" alt="Sakshi Bole" />
                <p>Sakshi Bole</p>
              </div>
              <div className="creator">
                <img src="/images/shruti.png" alt="Shruti Chaudhari" />
                <p>Shruti Chaudhari</p>
              </div>
              <div className="creator">
                <img src="/images/ruchita.png" alt="Ruchita Khadtare" />
                <p>Ruchita Khadtare</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;
