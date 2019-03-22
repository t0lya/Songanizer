import React from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { withRouter } from 'react-router-dom'

import { Header } from './components/Header'
import { PlayerBar } from './components/PlayerBar'
import { loadUser, login } from './actions'
import './App.scss'


const mapDispatchToProps = { loadUser, login }

class ConnectedApp extends React.Component{
  componentDidMount() {
    let query = queryString.parse(this.props.location.search)
    if (query.token) {
      this.props.login(query.token)
      this.props.history.push('/profile')
    }      
    this.props.loadUser()
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <br/>
        { this.props.children }
        <PlayerBar/>
      </div>
    )
  }
}

export const App = withRouter(connect(null, mapDispatchToProps)(ConnectedApp))