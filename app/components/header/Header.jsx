import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import ProfileIcon from 'material-ui/svg-icons/social/person'
import SearchIcon from 'material-ui/svg-icons/action/search'
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app'
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

    toggleLeftNav = () => {
        this.setState({ leftNavVisible: !this.state.leftNavVisible });
    }

    closeLeftNav = () => {
        this.setState({ leftNavVisible: false });
    }

    logout = () => {
        ClientAuth.clearAuthState();
        this.closeLeftNav();
        logoutUser();
    }

    render() {
        return (
            <div>
                <AppBar
                  style={mystyle}
                  onLeftIconButtonTouchTap={(event) => this.toggleLeftNav()}
                  title={<img className="logo" />}
                  showMenuIconButton={ClientAuth.isUserAuthenticated()}
                />
                <Drawer
                  open={this.state.leftNavVisible}
                  docked={false}
                  onRequestChange={(leftNavVisible) => this.setState({ leftNavVisible })}
                  containerStyle={{ height: 'calc(100% - 64px)', top: 64 }}
                >
                    <Link to="/profile" className="menu-links">
                        <MenuItem primaryText="My Profile" leftIcon={<ProfileIcon />} onClick={this.closeLeftNav}/>
                    </Link>
                    {ClientAuth.isAdminUser() && <Link to="/search" className="menu-links">
                        <MenuItem primaryText="Search" leftIcon={<SearchIcon />} onClick={this.closeLeftNav}/>
                    </Link>}
                    <Link to="/" className="menu-links">
                        <MenuItem primaryText="Sign out" leftIcon={<LogoutIcon />} onClick={this.logout}/>
                    </Link>
                </Drawer>
            </div>
        );
    }
}
