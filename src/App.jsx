import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import Header from "./Header.jsx"
import SignUp from "./SignUp.jsx"
import Middle from "./Middle.jsx"

class App extends Component {
  
  
  renderHomePage = () => {
    return (
      <div>
        <Header />
        <Middle />
      </div>
    )
  }

  renderSignUp =() => {
    return (
      <div>
        <SignUp />
      </div>
    )
  }
    render = () => {
       return (
             <BrowserRouter>
             <div>
               <Route exact={true} path="/" render={this.renderHomePage}/>
               <Route exact={true} path="/signUp" render={this.renderSignUp}/>
              
             </div>
             </BrowserRouter>
              )
  }
  }
  export default App;