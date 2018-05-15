import * as React from 'react'
import { Redirect } from 'react-router-dom'
import ClientAuth from '../../api/ClientAuth'

class HomeComponent extends React.Component {

    render() {
        if (ClientAuth.isUserAuthenticated()) {
            return (
                <Redirect to={"/profile/" + ClientAuth.getLoggedInUser()} />
            )
        }
        else {
            return (
                <Redirect to="/login" />
            )
        }
    }
}

export default HomeComponent
