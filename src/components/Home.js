import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faSearch, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'react-router-dom'

const SERVER_URL = process.env.REACT_APP_SERVER_URL

class Home extends Component {
  render() {
    return (
      <div className='container jumbotron bg-dark'>
        <h1 className="text-center">Welcome to Songanizer,</h1>
        <p className='lead text-center'>a music application based on the Youtube API.</p>
        <hr className="my-4" color='white'/>
        <div className='container'>
          <div className='row align-items-center justify-content-start'>
            <Button className='col-1 btn-sm' onClick={()=>this.props.history.push('/search')}>
              <FontAwesomeIcon icon={faSearch}/>
            </Button> 
            <span className='col col-mx-0'>Find and listen to your favorite tracks.</span>
          </div>
          <br/>
          <div className='row align-items-center justify-content-start'>
            <Button className='col-1 btn-sm' href={SERVER_URL+'/users/login'}>
              <FontAwesomeIcon icon={faSignInAlt}/>
            </Button>
            <span className='col'>Login with your Google Account to save tracks and create playlists.</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Home)