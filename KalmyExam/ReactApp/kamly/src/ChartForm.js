import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import Chart from "./Component/Chart/Chart"

class LoginForm extends React.Component {
    async componentDidMount() {

        try {
          let res = await fetch("/isLoggedIn", {
            method: "post",
            headers: {
              "Accept": "application/json",
              "Content-type": "application/json"
            }
          });
    
          let result = await res.json();
          if (result && result.success) {
            UserStore.loading = false;
            UserStore.isLoggedIn = true;
            UserStore.username = result.username;
          }
          else {
            UserStore.loading = false;
            UserStore.isLoggedIn = false;
          }
        }
        catch (e) {
          UserStore.loading = false;
          UserStore.isLoggedIn = false;
        }
      }
    
      // componentWillMount() {
      //   // this.getchartData(); // this should be this.getChartData();
      //   this.getChartData();
      // }
      async getChartData() {
        debugger
        if (this.state != null) {
          const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              UserName: this.state.username,
              Password: this.state.password
            })
          };
          let res = await fetch("https://localhost:44365/api/authentication/Aunthenticate", requestOptions)
          // Ajax calls here
          this.setState({
            chartData: {
              labels: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford'],
              datasets: [
                {
                  label: 'Population',
                  data: [
                    617594,
                    181045,
                    153060,
                    106519,
                    105162,
                    95072
                  ],
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                  ]
                }
              ]
            }
          });
        }
        else {
          this.setState({
            chartData: {}
          });
        }
      }
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            buttonDisable: false
        }
    }

    setInputValue(property, val) {
        val = val.trim();
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
                body: JSON.stringify({  UserName: this.state.username,
                    Password: this.state.password})
            };
            let res = await fetch("https://localhost:44365/api/authentication/Aunthenticate", requestOptions)
                // .then(response => response.json())
                // .then(data => this.setState({ postId: data.id }));
            // let res = await (fetch("https://localhost:44365/api/authentication/Aunthenticate"), {
            //     method: 'POST',
            //     headers: {
            //         "Accept": "application/json",
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({
            //         UserName: this.state.username,
            //         Password: this.state.password
            //     })
            // });
            let result = await res.json();
            if (result && result.usuario.token!="") {
                UserStore.isLoggedIn = true;
                UserStore.username = result.usuario.userName;
                UserStore.Token = result.usuario.token;
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
            <div className="loginForm">
                      Bienvenido {UserStore.username}
              <br />
              Seleccione tipo
              <br />
              <select onChange={this.getChartData()}>
                <option value="1">Por tipo</option>
                <option value="2">Por tipo y marca</option>
                <option value="3">Por marca y tipo</option>
              </select>
              <Chart chartData={this.state.chartData} location="Massachusetts" legendPosition="bottom" />
            </div>
        );
    }
}
export default LoginForm;
