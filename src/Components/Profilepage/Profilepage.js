import React from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import reqURL from '../../RequestURL';
import './Profilepage.css'
axios.defaults.withCredentials = true;

export default class Profilepage extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      myId: '',
      friendRequests: [
        {
          firstName: 'Bob',
          lastName: 'Sterling',
          friendId: 'asdfaweffssdfsd'
        },
        {
          firstName: 'Joe',
          lastName: 'West',
          friendId: 'asdfaefasfasdfasdf'
        }
      ],
      friendList: [],
      usernameMatch: false,
      loginState: false,
      isFriend: false,
      isFriendRequested: false
    }
  }
  componentDidMount() {
    let getUsername = window.location.href;
    // grabs username inside current url
    getUsername = getUsername.split('/').pop();
    const user = {username: getUsername}
    axios
      .post(`${reqURL}/getUserData`, user)
      .then((data) => {
        console.log(data);
        let firstName = data.data.firstName;
        let lastName = data.data.lastName;
        let username = data.data.username
        this.setState({firstName, lastName, username})
        this.loginCheck();
      })
      .catch((err) => {
        console.log(err)
      })
  }
  loginCheck() {
    const { username } = this.state;
    axios
    .get(`${reqURL}/loginCheckReturnUserData`)
    .then((data) => {
      console.log('data check: ' + data.data.error)
       //checks if logged 
      if (!data.data.error) {
  
        this.setState ({loginState: true, friendRequests: data.data.friendRequests, myId: data.data.friendId, friendList: data.data.friendList});
        
        //checks whether you are looking at your own profile or someone elses
        if (data.data.username === username) {
          this.setState ({usernameMatch: true});
        } else {
          this.setState ({usernameMatch: false});

          // checks then to see that the profile you are looking at is a frined or nots
          this.checkFriendStatus();
        }

      } else {
        this.setState ({loginState: false});
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }
  checkFriendStatus() {
    const { username }= this.state;
    const user = { username };
    axios
      .post(`${reqURL}/checkFriendStatus`, user)
      .then((data) => {
        console.log(data.data.status)
        if (data.data.status === 'friend') {
          this.setState({isFriend: true});
        } else if (data.data.status === 'requested') {
          this.setState({ isFriendRequested: true})
        } else {
          this.setState({ isFriendRequested: false, isFriend: false});
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  logoutUser () {
    axios
      .get(`${reqURL}/logoutUser`)
      .then((data) => {
        if (data.data.success) {
          window.location.href = '/';
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  requestFriendship = () => {
    const { username } = this.state;

    const  user = {username};
    axios.post(`${reqURL}/createFriendRequest`, user)
      .then((data) => {
        if (data.data.success) {
          this.setState({ isFriendRequested: true})
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  acceptFriendRequest = (friendUsername) => {
    const { firstName, lastName, myId, username } = this.state;
    const data = {username: friendUsername, firstName, lastName, friendId: myId}
    axios
      .post(`${reqURL}/acceptFrienRequest`, data)
      .then((data) => {
        if (data.data.success) {
          window.location.href = `/profile/${username}`;
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  render() {
    const { friendRequests, friendList, firstName, lastName, usernameMatch, loginState, isFriend, isFriendRequested } = this.state;
    let content;
    if (usernameMatch && loginState) {
      content = <div class="content-container">
                  <div>
                    <div>
                      <h1>{firstName} {lastName}</h1>
                    </div>
                  </div>
                  <div>
                    <h1>Friend Requests</h1>
                  </div>
                  <div class='request-grid'>
                    {friendRequests.map((data) => {
                      return (
                        <div key={data.friendId} class='requestform-container'>
                          <div class="request-data">
                            <span>{data.firstName} </span>
                            <span>{data.lastName}</span>
                          </div>
                          <div class='request-button'>
                            <span onClick={() => this.acceptFriendRequest(data.username)} >Accept</span>
                            <span>Ignore</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <h1>Friend List</h1>
                  </div>
                  <div class='request-grid'>
                    {friendList.map((data) => {
                      return (
                        <div key={data.friendId} class='requestform-container'>
                          <div class="request-data">
                            <span>{data.firstName} </span>
                            <span>{data.lastName}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div class="logout-button">
                    <span onClick={this.logoutUser}>Logout</span>
                  </div>
                </div>
    } 
    if (loginState && isFriend) {
      content = <div class="content-container">
      <div>
        <div>
          <h1>{firstName} {lastName}</h1>
          <p1>You guys are Friends</p1>
        </div>
      </div>
    </div>
    }
    if (loginState && isFriendRequested && !isFriend && !usernameMatch) {
      content = <div class="content-container">
      <div>
        <div>
          <h1>{firstName} {lastName}</h1>
          <p1>You have Requested Friendship</p1>
        </div>
      </div>
    </div>
    }
    if (loginState && !isFriend && !isFriendRequested && !usernameMatch) {
        content = <div class="content-container">
        <div>
          <div>
            <div class="friendship-data">
              <h1>{firstName} {lastName}</h1>
              <p1>Not Friends Yet</p1>
            </div>
            <div>
              <span onClick={this.requestFriendship} class="friendship-button">Request Friendship</span>
            </div>
          </div>
        </div>
      </div>
    }
    if (!loginState) {
      content = <div class="content-container">
      <div>
        <div>
          <h1>{firstName} {lastName}</h1>
          <p1>Not Logged in</p1>
        </div>
      </div>
    </div>
    }
    return(
      <div>
        <div>
          <Navbar />
        </div>
        {content}
      </div>
    )
  }
}