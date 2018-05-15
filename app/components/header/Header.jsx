import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
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
  state = {
    leftNavVisible: false,
  }

  constructor(props) {
    super(props);
  }

  logout = () => {
    logoutUser();
    ClientAuth.deauthenticateUser();
    browserHistory.push('/');
  }

  toggleLeftNav = () => {
    this.setState({ toggleLeftNav: !this.state.toggleLeftNav });
  }

  render() {
    let rightButtons = (<div />);
    if (ClientAuth.isUserAuthenticated()) {
      rightButtons = (
        <div>
          <Link className="logout" to="/">Logout</Link>
        </div>
      );
    }

    return (
      <div>
        <AppBar
          style={mystyle}
          onLeftIconButtonTouchTap={(event) => this.toggleLeftNav()}
          title={<img className="logo" />}
        />
        <Drawer open={this.state.leftNavVisible}>
          <MenuItem primaryText="My Profile" />
          <MenuItem primaryText="Search" />
          <MenuItem primaryText="Sign out" onClick={this.logout} />
        </Drawer>
      </div>
    );
  }
}
