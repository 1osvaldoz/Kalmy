import React from 'react';
import { observer } from "mobx-react"
import UserStore from './stores/UserStore'
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import Select from 'react-select';
import SubmitButton from "./SubmitButton"
import './App.css';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

const options = [
  { value: '1', label: 'By Type' },
  { value: '4', label: 'By Brand' },
];



class App extends React.Component {
  constructor() {
    super();
    this.state = {
      chartData: {}
    }
  }
  state = {
    selectedOption: null,
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
    this.getChartDataFind(selectedOption)
  };

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

  componentWillMount() {
    // this.getchartData(); // this should be this.getChartData();

  }

  async getChartDataFind(val) {


    if (val.value == 1) {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("Token")
        }

      };
      const res = await fetch("https://localhost:44365/api/Automovil/Report?type=" + val.value, requestOptions);

      let result = await res.json();
      var labels = [], number = []
      result.map(function (item, i) {
        labels.push(item.type);
        number.push(item.num);
      })
      this.setState({
        chartData: {
          labels: labels,
          datasets: [
            {
              label: "Types",
              data: number,
              backgroundColor: [
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
              ]
            }
          ]
        }
      });
    }
    else if (val.value == 4) {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("Token")
        }

      };
      const res = await fetch("https://localhost:44365/api/Automovil/Report?type=" + val.value, requestOptions);

      let result = await res.json();


      var labels = [], number = []
      result.map(function (item, i) {
        labels.push(item.type);
        number.push(item.num);
      })
      this.setState({
        chartData: {
          labels: labels,
          datasets: [
            {
              label: "Brands",
              data: number,
              backgroundColor: [
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',
                '#A4F1D3',

              ]
            }
          ]
        }
      });
    } else {



      this.setState({
      });
    }
  }
  async doLogout() {

    try {

      localStorage.setItem("Token", "");
      UserStore.isLoggedIn = false;
      UserStore.username = "";
      localStorage.setItem("Name", "");

      window.location.reload()

    }
    catch (e) {
      console.log(e)
    }
  }
  async doRegister() {

    try {

      localStorage.setItem("Token", "");
      UserStore.isLoggedIn = false;
      UserStore.Register = true;
      localStorage.setItem("Name", "");

      window.location.reload()

    }
    catch (e) {
      console.log(e)
    }
  }

  render() {
    const { selectedOption } = this.state;
    if (!UserStore.Register) {
      if (UserStore.loading) {
        return (
          <div className="app">
            <div className="container">
              Loading, please wait...
          </div>
          </div>
        );
      }
      else {

        if (localStorage.getItem("Token") != "" && localStorage.getItem("Token") != null) {
          return (
            <div className="app" style={{ paddingTop: "30pt", backgroundColor: "rgba(255,255, 255, 0.8)" }}>

              <div className="container">
                <div class="row">
                  <MDBCol md="11" >
                    <h3> Welcome &nbsp;<b style={{ color: "#5CE6B0" }}>{localStorage.getItem("Name")}</b>
                    </h3>
                  </MDBCol>
                  <MDBCol md="1" >
                    <MDBBtn style={{ backgroundColor: "#4285F4 !important", color: "black !important" }} disabled={this.state.buttonDisable} onClick={() => this.doLogout()}>Logout</MDBBtn>
                  </MDBCol>
                </div>
                <br />
              Select type
              <br />
                <Select
                  value={selectedOption}
                  onChange={this.handleChange}
                  options={options}
                />
                <Bar
                  redraw
                  data={this.state.chartData}
                  options={{
                    scales: {
                      yAxes: [{
                        ticks: {
                          stepSize: 1,
                          beginAtZero: true
                        }
                      }]
                    },
                    title: {
                      display: "hola",
                      text: "Graph",
                      fontSize: 25
                    },
                    legend: {
                      position: "bottom"
                    }
                  }}
                />


              </div>
            </div>
          );
        }
        else {
          return (
            <div className="app">
              <div className="container">

                <LoginForm />
              </div>
            </div>
          );
        }
      }
    }
    else{
      return (
        <div className="app">
          <div className="container">
            <RegisterForm/>
            <regis />
          </div>
        </div>
      );
    }
  }
}
export default observer(App);
