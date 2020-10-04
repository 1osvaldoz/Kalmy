import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap-css-only/css/bootstrap.min.css"
import "mdbreact/dist/css/mdb.css"
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            buttonDisable: false
        }
    }

    setInputValue(property, val) {

        val = val.target.value.trim();
        if (val.length > 20) {
            return;
        }
        this.setState({
            [property]: val
        })
    }

    resetForm() {
        this.setState({
            username: "",
            password: "",
            buttonDisable: false
        })
    }
    async doLogin() {
        if (!this.state.username) {
            return;
        }

        if (!this.state.password) {
            return;
        }

        this.setState({
            buttonDisable: true
        })
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    UserName: this.state.username,
                    Password: this.state.password
                })
            };
            const res = await fetch("https://localhost:44365/api/authentication/Aunthenticate", requestOptions);
            
            let result = await res.json();




            if (result != null) {
                UserStore.isLoggedIn = true;
                UserStore.username = result.usuario.userName;
                localStorage.setItem("Token", result.usuario.token);
                localStorage.setItem("Name", result.usuario.userName);
                window.location.reload()

            }
            else if (result && result.success == false) {
                this.resetForm();
                alert(result.msg)
            }
        }
        catch (e) {
            console.log(e)
            this.resetForm();
        }

    }
    render() {
        return (
            <MDBContainer style={{ paddingLeft:"20%",paddingTop:"20%",backgroundColor:"rgba(255,255, 255, 0.8)"}}>
            <MDBRow>
              <MDBCol md="9" >
                  
                <form  >
                  <p className="h5 text-center mb-4 black-text">Sign in</p>
                  <div className="grey-text">
                    <MDBInput label="Type your email" icon="envelope" group type="email" validate error="wrong" success="right" value={this.state.username ? this.state.username:""} onChange={(val)=>this.setInputValue('username',val)}/>
                    <MDBInput label="Type your password" icon="lock" group type="password" validate alue={this.state.password ? this.state.password:""} onChange={(val)=>this.setInputValue('password',val)} />
                  </div>
                  <div className="text-center">
                    <MDBBtn disabled={this.state.buttonDisable} onClick={()=>this.doLogin()}>Login</MDBBtn>
                  </div>
                </form>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
            // <div className="loginForm">
            //     Log In
            //     <InputField type="text" placeholder="Usuario" value={this.state.username ? this.state.username:""} onChange={(val)=>this.setInputValue('username',val)}></InputField>
            //     <InputField type="password" placeholder="Password" value={this.state.password ? this.state.password:""} onChange={(val)=>this.setInputValue('password',val)}></InputField>
            //     <SubmitButton text="Login" disabled={this.state.buttonDisable} onClick={()=>this.doLogin()}/>
            // </div>
        );
    }
}
export default LoginForm;
