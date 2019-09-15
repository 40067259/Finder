import React, {Component} from 'react'
import './main.css';
import {connect} from 'react-redux';
import { Link } from "react-router-dom";
    
 class UnconnectedHeader extends Component {

     constructor(props){
       super(props)
       this.state={
         logIn:false
       }
     }

     logOut = evt =>{
       evt.preventDefault();
       this.props.dispatch({
         type:"logout"
       })
     }
    render = () => {
      if(this.props.firstName == undefined){
console.log(this.props.firstName)
       return (
        <div className="general">
        <div className="logo">
          <div className="Hoteval">Hoteval 
          <Link to="/" >Home</Link> 
          <Link to="/inf" >About Us</Link>
          <Link to="/contact" >Contact</Link> 
          <Link to="/signUp" >Account</Link></div>
          <div className="hotel">hotel finder</div>
          <div className="logo_image">
          <img src="logo.png" alt="Logo"/>
          </div>
        </div>
        
      </div>
              )
       }
       else 
       console.log(this.props.firstName)
       return (
         
        <div className="general">
        <div className="logo">
          <p className ="greeting">Welcome,&nbsp;{this.props.firstName}</p>
          <div className="Hoteval">Hoteval <Link to="/" >Home</Link> <Link to="/inf" >About Us</Link><Link to="/contact" >Contact</Link>
          <a href="/">LogOut</a></div>
          <div className="hotel">hotel finder</div>
          <div className="logo_image">
          <img src="logo.png" alt="Logo"/>
          </div>
        </div>
      </div>
              )
    }
  }
  let mapToStates = storeState =>{
    return{
      firstName : storeState.firstName
    }
  }
  let Header = connect(mapToStates)(UnconnectedHeader)
  export default  Header