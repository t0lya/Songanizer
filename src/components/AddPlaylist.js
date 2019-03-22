import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { AllHtmlEntities as entities } from 'html-entities'
import uuid from 'uuid/v4'

import { getYoutubePlaylists, postPlaylist, importYoutubePlaylist } from '../actions'

let Form = (props) => {
  const { handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
    <div className='mt-3'>
      <div className='form-control-inline m-2'>
        <div>
          <Field name="name" component="input" type="text" placeholder="Name"/>
        </div>
      </div>
      <div className='form-inline m-2'>
        <label className='mr-2'>Public?</label>
        <div>
          <Field name="isPublic" component="input" type="checkbox"/>
        </div>
      </div>
      <div className='mt-3 ml-2'>
        <Button color='dark'>Create</Button>
      </div>
      </div>
    </form>
  )
}

Form = reduxForm({
    form: 'form'
})(Form)

const mapStateToProps = (state) => {
    return {
        youtubePlaylists: state.profile.youtubePlaylists,
        tracks: state.playlist.tracks
    }
}

const mapDispatchToProps = {
    getYoutubePlaylists,
    postPlaylist,
    importYoutubePlaylist
}

class AddPlaylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      activeTab: '1'
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  toggleModal() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
    tab === '2' && this.props.getYoutubePlaylists()
  }

  handleSubmit(val) {
      this.props.postPlaylist({
          id: uuid(),
          title: val.name,
          isPublic: val.isPublic,
          thumbnail: 'https://i.ytimg.com/vi/XIMLoLxmTDw/default.jpg',
          tracks: []
      }, 'add')
      this.toggleModal()
  }

  render() {
    return (
      <div>
        <Button className='m-2' color="dark" onClick={this.toggleModal} active={this.state.modal}>
            <FontAwesomeIcon icon={faPlus}/>
        </Button>
        {this.state.modal && <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader className='bg-secondary' toggle={this.toggleModal}>Add a Playlist</ModalHeader>
          <ModalBody className='bg-secondary'>
            <Nav tabs>
            <NavItem>
                <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={() => { this.toggleTab('1'); }}
                >
                Create Playlist
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                className={classnames({ active: this.state.activeTab === '2' })}
                onClick={() => { this.toggleTab('2'); }}
                >
                Import from my Youtube Account
                </NavLink>
            </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
                <Form 
                    onSubmit={this.handleSubmit}
                    initialValues={{name: '', isPublic: false}}/>
            </TabPane>
            <TabPane tabId="2">
                {this.props.youtubePlaylists.map((item, index) => {
                    return (
                        <div className='d-flex flex-row align-items-center' key={index} align='left'>
                            <div className='p-2'>
                                <img 
                                    className='img-thumbnail bg-dark border-dark'  
                                    alt={'Thumbnail for ' + item.title} 
                                    src={item.thumbnail} />
                            </div>
                            <div className='p-2'>
                                <Button
                                    color='dark'
                                    onClick={() => {
                                        this.props.importYoutubePlaylist(item)
                                        this.toggleModal()}}> 
                                    <FontAwesomeIcon icon={faPlus}/>
                                </Button>
                            </div>  
                            <div className='track-title p-2'>
                                <span> {entities.decode(item.title)} </span>
                            </div>                      
                        </div>
                    )
                })}
            </TabPane>
            </TabContent>
          </ModalBody>
        </Modal>}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPlaylist)