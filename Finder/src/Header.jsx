import React, {Component} from 'react'
import './main.css';
    
export default class Header extends Component {
    render = () => {
       return (
        <div className="logo_container">
        <div className="logo">
          <div>Hoteval</div>
          <div>hotel finder</div>
          <div className="logo_image">
          <img src="images/logo.png" alt="down load failed"/>
          </div>
        </div>
      </div>
              )
  }
  }