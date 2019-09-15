import React, { Component } from "react";
import { connect } from "react-redux";
import './main.css';
import Header from "./Header.jsx";
class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      registered: null
    };
  }

  usernameChange = evt => {
    this.setState({
      username: evt.target.value
    });
  };
  passwordChange = evt => {
    this.setState({
      password: evt.target.value
    });
  };
  firstNameChange = evt => {
    this.setState({
      firstName: evt.target.value
    });
  };
  lastNameChange = evt => {
    this.setState({
      lastName: evt.target.value
    });
  };

  submitHandler = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    data.append("firstName", this.state.firstName);
    data.append("lastName", this.state.lastName);
    let response = await fetch("/signup", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let responseBody = await response.text();
    console.log("responseBody form signup", responseBody);
    let body = JSON.parse(responseBody);
    if (body.success === false) {
      this.setState({ registered: false });
      return;
    } else {
      //update the info to store
      console.log(body.username, "body");
      this.setState({ registered: true });
      
      console.log(body.fName+"body.fName")
      this.props.dispatch({
        type: "username",
        username: body.username,
        sid: body.sid,
        firstName: body.fName,
        lastName: body.lName,
      })
      return
    }
  };
  
  render = () => {
    console.log(this.props.firstName +" in render")
    if (this.state.registered && this.props.firstName !==undefined) {
      return (
        <div>
          <Header />
        </div>
      );
    } else if (this.state.registered === false) {
      return (
        <div>
          <h2>Sorry this email address already exists.</h2>
        </div>
      );
    }
     else if (this.props.firstName === undefined)
    return (
      <div className="signUp">
        <form className="white" onSubmit={this.submitHandler}>
          <h5 className="grey-text text-darken-3">Sign up</h5>
          <div className="input field">
            {" "}
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" onChange={this.firstNameChange} />
          </div>
          <div className="input field">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" onChange={this.lastNameChange} />
          </div>
          <div className="input field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" onChange={this.usernameChange} />
          </div>
          <div className="input field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={this.passwordChange}
            />
          </div>
          {/* <div>
              <input type="checkbox" id="newsletter" name="newsletter" />
              <p>Sign me up for emails to get exclusive offers</p>
            </div> */}
          <div className="input field">
            <input
              className="btn pink lighten-1 z-depth-0"
              type="submit"
              value="Register"
            />
          </div>
          <div>
            By clicking “Register”, you agree to our terms of service, privacy
            policy and cookie policy
          </div>

          {/* <div className="link linkSignup">
            <Link to="/">
              <span className="arrow">←</span>Return to marketplace
            </Link>
          </div> */}
        </form>
      </div>
    );
  };
}
let mapStateToProps = st => {
  return {
    username: st.username,
    sid: st.sid,
    firstName: st.firstName,
    lastName: st.lastName
  };
};
let Signup = connect(mapStateToProps)(UnconnectedSignup);
export default Signup;
