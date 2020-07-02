import React from 'react';
import axios from 'axios';
import reqURL from '../../RequestURL';
import './Navbar.css';

axios.defaults.withCredentials = true;

export default class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: 'Mel',
      lastName: 'Winston',
      username: '',
      loggedInState: false,
    }
  }
  componentDidMount() {
    // condtional render of profile button depending on whether user is logged in or not
    axios
      .get(`${reqURL}/loginCheckReturnUserData`)
      .then((data) => {
        if (data.data) {
          console.log('data is: ' + data.data)
          this.setState({firstName: data.data.firstName, lastName: data.data.lastName, username: data.data.username, loggedInState: true});
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  gotoProfile = () => {
    const { username } = this.state;
    window.location.href = `/profile/${username}`;
  }
  goHome = () => {
    window.location.href = '/';
  }
  render() {
    const { loggedInState, firstName, lastName } = this.state;
    let profileData;
    if(loggedInState) {
      profileData = <div class='right-section'>
                      <span onClick ={this.gotoProfile}>{firstName} {lastName}</span>
                    </div>
    } else {
      profileData = <div class='right-section'>
                      <span >Please Log In</span>
                    </div>
    }
    return(
      <div class='navbar-container'>
        <div>
          <div class='left-section'>
            <span onClick={this.goHome}>Home</span>
          </div>
        </div>
        <div>
          <div class='mid-section'>
            <input />
            <span><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAMAAAC93eDPAAAAY1BMVEX///8AAAD7+/v29vbw8PDz8/Ps7Ozd3d1dXV3V1dXp6emoqKhNTU1JSUnj4+NSUlIbGxu9vb1oaGiPj482Nja3t7fOzs6bm5sxMTGGhoZ6enohISGAgIBwcHBBQUEpKSkQEBAlj4emAAADqElEQVR4nO1b65qCIBA1vGtq5q3Lpr3/U25Klmi2wowx+32dn7uCRzjMDHAyjC+++OK/gzlui8DU8fKgLH6i3fW66XDd1ZewjNnHXs/cyjtspmi2R9/+BIGg2r54fY/D0V2bQJm8eT9HXqwpjbSeDH5e5834j+dwLRL+cAR29T5MfTd2LCdw/TL8ic6D/9bFGgTM0/MN12MaTB6wyip/PrKdPgBF+vz+07ziguzJosIlYD+GoA6dt0+a6WPBJJgDEffdLhEaS/uROJdoDNz+u7KFSg/7BliqLHqFxYubWP3EZagMMqkUUCBy6JdCKtnOb7AWRsk7apZPQg87weHgAwINu/DGIYiBw5NC9D4WzGLPOYCSp8f7UK0CGJ+LA6CWqXiEUY9yjMe0vXIHMR8DSIyzdqAQxTwENfEV1VhqrXmY9UAMDCPrejkptXXOICn2uEtSaVVkSInGV1akySMCmIFh/HQ9+fINK9WGEzDFYTC71XRBYKD8NQXaINyE3X3OUbZZFxO2KAzuarhKhmkXte5S6q1S4T0PT0FYEZ4YW/BAK9Uk2KnUavNw5MXdFYwHvK0Ij9JSpWyGkaAmHUpFJ3nSf6Ab1lwmZYNLlTG4GCTKcLtrgLo9l/2oLr/uFCud18glC7Bu5hLUM7yTpLoqWNn7CrJLIlMv9+bQxcdEkoJ0cn2LQjLzZthhoZfX/6NAYCL0ypHAoiQQmggEaFN/miKQrCmULAQKNwLlK4EinsBWhsKGjsC2doXN/UZ2TAkccRA46CFw3IV+6KeScfQffRqW/gNgAsfgFC4DUK5ErkBF6b8YonA9RuGSkMBV6ePC+Kx+YQzfE0Gvzdt5hG6KYOYBHt4UtTTpTcZCcdkISKBGJ3UjyQM1VA+KdhphHKB6WG4qsouHqUg0nnngjfoya1U8sFaFTiSOA3hLsMRgNnBBJrfBYiKHGm6+E212+QKbne3h6sFYbDZsHqK1RHukh2EKXWC5rIvBpJsiaYxquDWeRjPvbjExnjKRc4RjxjTn7LfJK/utJeoBvjZ7BK0AhybkU1jOxO+xHnBNqdyKHf9lxV5DD5IwR2vzI2bpEcZ60MHBFu3b3ues6wOIHCIdHEwCc0FBD+Yod2ugcD/ZfupBxw877LViNYCDjnEY1VFY55pyGMVqCnrQEqtHuVtLrBb1oCV3MwLrgoIemJg39cdqhRMcDJh73QyGetDF4Bmr9TEweKzWNgsct1pOM4M2Vutm8MUXX5DHL5DtLC9cTAobAAAAAElFTkSuQmCC" 
                  alt="search"/></span>
          </div>
        </div>
        <div>
          {profileData}
        </div>
      </div>
    )
  }
}