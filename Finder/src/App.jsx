import React, { component } from "react";
import { Route, BrowerRouter } from "react-router-dom";
import Header from "./Header.jsx"

 class App extends Component {
  
  render = () => {
    return(
      <div>Hello Good</div>
    )
  }

  // renderHomePage = () => {
  //   return (
  //     <div>
  //       <Header />
  //     </div>
  //   )
  // }

  // renderSignUp =() => {
  //   return (
  //     <div>
  //       <SignUp />
  //     </div>
  //   )
  // }
  //   render = () => {
  //      return (
  //            <BrowserRouter>
  //            <div>
  //              <Route exact={true} path="/" render={this.renderHomePage}/>
  //              <Route exact={true} path="signUp" render={this.renderSignUp}/>
  //            </div>
  //            </BrowserRouter>
  //             )
  // }
  }
  export default App;