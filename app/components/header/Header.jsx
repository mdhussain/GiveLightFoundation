import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom'
import { logoutUser } from '../../api/api'
import ClientAuth from '../../api/ClientAuth'

require('./Header.css');

const mystyle = {
  margin: "0px",
  backgroundColor: "#0073aa"
}

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    logoutUser();
    ClientAuth.deauthenticateUser();
  }

  render() {
      let rightButtons = (<div />);
      if (ClientAuth.isUserAuthenticated()) {
        rightButtons = (
          <div>
            <Link className="logout" onClick={this.logout} to="/">Logout</Link>
          </div>
        );
      }
      return (
        <AppBar
          style={mystyle}
          iconElementLeft={<div />}
          iconElementRight={rightButtons}
          title={<img className="logo" />}
        />
      );
    }
}
