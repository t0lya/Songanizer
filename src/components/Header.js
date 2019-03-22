import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { login, logout } from '../actions'

const signupLink = 'https://accounts.google.com/signup/v2/webcreateaccount?hl=en-GB&flowName=GlifWebSignIn&flowEntry=SignUp'

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToProps = { login, logout }

class ConnectedHeader extends React.Component {
    render() {
        return (
            <nav className='navbar navbar-expand-md navbar-dark bg-dark fixed-top border-bottom border-secondary'>
                <button className="navbar-toggler mr-2" type="button" data-toggle="collapse" data-target="#navbar2" aria-controls="navbar2" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Link className="navbar-brand font-weight-bold ml-sm-2" to='/'>Songanizer</Link>
                
                <div className="collapse navbar-collapse" id="navbar2">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link className='nav-link' to='/'>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className='nav-link' to='/search'>Search</Link>
                        </li>
                        {this.props.isAuthenticated &&
                        <li className="nav-item">
                            <Link className='nav-link' to='/profile'>Profile</Link>
                        </li>}
                        <li className="nav-item">
                            <Link className='nav-link' to='/about'>About</Link>
                        </li>
                    </ul>
                </div>

                <ul className="nav ml-auto mr-sm-2">
                    {!this.props.isAuthenticated ? (
                    [<li className="nav-item" key="signup">
                        <form action={signupLink} target='_blank' rel="noopener noreferrer">
                            <input type='submit' value='Sign Up' className='btn btn-dark border-white mr-1'/>
                        </form>
                    </li>,
                    <li className="nav-item" key="login">
                        <a 
                            rel="noopener noreferrer" 
                            className='btn btn-dark border-white mr-1'
                            href='http://localhost:8080/users/login'>
                        Login with Google</a>
                    </li>]
                    ) : (
                    <li className="nav-item" key="logout">
                        <Link to='/'>
                            <button 
                                target='_blank' 
                                rel="noopener noreferrer" 
                                className='btn btn-dark border-white mr-1'
                                onClick={this.props.logout}>
                            Logout</button>
                        </Link>
                    </li>)}
                </ul>

            </nav>
        )
    }
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(ConnectedHeader)