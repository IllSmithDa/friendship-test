import React from 'react';
import axios from 'axios';
//import bcrypt from 'bcrypt';
import Navbar from '../Navbar/Navbar'
import reqURL from '../../RequestURL';
import './Homepage.css';

axios.defaults.withCredentials = true;

export default class Homepage extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: 'Mel',
      lastName: 'Winston',
      username: '',
      password: '',
      loginUsername: '',
      loginPassword: '',
      users: [],
      loginState: false,
    }
  }
  componentDidMount() {
    axios.get(`${reqURL}/getNewUsers`)
      .then((data) => {
        console.log('data: ' + data)
        console.log('data: ' + data[0],data)
        this.setState({users: data.data })
        console.log(this.users)
        this.loginCheck();
      })
      .catch((err) => {
        console.log(err);
      })
  }
  setFirstName = (event) => {
    this.setState({ firstName: event.target.value});
  }
  setLastName = (event) => {
    this.setState({ lastName: event.target.value});
  }
  setUsername = (event) => {
    this.setState({ username: event.target.value});
  }
  setPassword = (event) => {
    this.setState({ password: event.target.value});
  }
  setLoginUsername = (event) => {
    this.setState({ loginUsername: event.target.value});
  }
  setLoginPassword = (event) => {
    this.setState({ loginPassword: event.target.value});
  }
  createUser = () => {
    // get user data from the state
    const { firstName, lastName, username, password  } = this.state;
    const userData = {firstName, lastName, username, password};
    axios
      .post(`${reqURL}/userCreate`, userData)
      .then((data) => {
        if (data.data.success) {
          axios
            .post(`${reqURL}/loginUser`, userData)
            .then((data) => {
              console.log(data)
              window.location.href = `/profile/${username}`;
            })
            .catch((err) => {
              console.log(err);
            })
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  loginUser = () => {
    const{ loginUsername, loginPassword } = this.state;
    const userData = { username: loginUsername, password: loginPassword};
    axios
      .post(`${reqURL}/loginUser`, userData)
      .then((data) => {
        console.log(data)
        window.location.href = `/profile/${loginUsername}`;
      })
      .catch((err) => {
        console.log(err);
      })
  }
  goToProfile(username) {
    window.location.href = `/profile/${username}`;
  }
  loginCheck () {
    axios
      .get(`${reqURL}/userLoginCheck`)
      .then((data) => {
        console.log('error check: ' + data.data.error)
        if (data.data.error === 'user not logged on') {
          this.setState({loginState: false})
        } else {
          this.setState({loginState: true})
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  render() { 
    const { users, loginState } = this.state;
    let appContent;
    if (!loginState) {
      appContent = <div>
                      <div className='user-create-section'>
                        <div>
                          <h1>Create New Account Here</h1>
                        </div>
                        <div>
                          <span>First Name: </span><input onChange={this.setFirstName}/>
                        </div>
                        <div>
                          <span>Last Name: </span><input onChange={this.setLastName}/>
                        </div>
                        <div>
                          <span>Username: </span><input onChange={this.setUsername}/>
                        </div>
                        <div>
                          <span>Password: </span><input type="password" onChange={this.setPassword}/>
                        </div>
                        <div class="create-button">
                          <span onClick={this.createUser}>Create New Account</span>
                        </div>
                      </div>
                      <div class='user-login-section'>
                        <div>
                          <h1>Login Here</h1>
                        </div>
                        <div>
                          <span>Username: </span><input onChange={this.setLoginUsername}/>
                        </div>
                        <div>
                          <span>Password: </span><input type="password" onChange={this.setLoginPassword}/>
                        </div>
                        <div class="create-button">
                          <span onClick={this.loginUser}>Login</span>
                        </div>
                      </div>
                  </div>
    } else {
      appContent = <div>
                       <div className='user-create-section'>
                          <div>
                            <h1>Welcome to App</h1>
                          </div>
                       </div>
                    </div>
    }
    return(
      <div>
        <div>
          <Navbar />
        </div>
        {appContent}
        <div className="all-users-section">
          <h1>All Users</h1>
          <div className="name-section-container">
            {users.map((data) => {
              return(
                <div>
                  <div onClick={() => this.goToProfile(data.username)} className="name-section">
                    <span>{data.firstName} {data.lastName}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}