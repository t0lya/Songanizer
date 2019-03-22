import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { Button } from 'reactstrap'
import InfiniteScroller from 'react-infinite-scroller'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons'

import TrackRow from './TrackRow'
import PlaylistRow from './PlaylistRow'
import { searchItems, setNextTracks, clearSearch, setQuery } from '../actions'


let SearchForm = props => {
  const { handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
      <div className='form-inline mb-4'>
        <Field 
          className='form-control bg-dark border-0 text-white mr-2' 
          name="type" 
          component="select">
            <option value="video">Tracks</option>
            <option value="playlist">Playlists</option>
        </Field>
        <Field 
          className='search-field bg-dark border-0 text-white form-control mr-2' 
          name="searchQuery" 
          component='input' 
          type="text"/>
        <Button color='dark'>
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </div>
    </form>
  )
}

SearchForm = reduxForm({
    form: 'searchItems'
  })(SearchForm)

const mapDispatchToProps = { 
    searchItems,
    setNextTracks,
    clearSearch,
    setQuery
}

const mapStateToProps = (state) => {
    return { 
        foundItems: state.search.foundItems,
        type: state.search.type,
        nextPageToken: state.search.nextPageToken,
        query: state.search.query
    }
}
class ConnectedSearch extends React.Component{
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(val) {
        this.props.setQuery(val.type, val.searchQuery)
        this.props.searchItems(val.type, val.searchQuery)
        this.props.setNextTracks([])
    }

    componentDidMount() {
        this.props.setQuery(this.props.type, this.props.query)
        this.props.foundItems.length === 0 && this.props.searchItems()
    }

    render() {
        return (
            <div>
              <SearchForm 
                onSubmit={this.handleSubmit}
                initialValues={{type: this.props.type, searchQuery: this.props.query}} />
              <div>
              <InfiniteScroller
                    pageStart={0}
                    loadMore={(page) => {
                        this.props.searchItems(
                            this.props.type,
                            this.props.query,
                            this.props.foundItems ? this.props.foundItems : [], 
                            this.props.nextPageToken)
                    }}
                    hasMore={this.props.nextPageToken ? true : false}
                    loader={<FontAwesomeIcon key={0} className='m-2' icon={faSpinner} pulse/>}>
                {this.props.foundItems.map((item, index, array) => {
                  if (this.props.type === 'video') {
                  return (
                    <TrackRow 
                      key={index+1} 
                      item={item}
                      index={index}
                      array={array}
                      enableDislike={false}/>)} 
                  if (this.props.type === 'playlist') { 
                  return (
                    <PlaylistRow 
                      key={index+1} 
                      item={item}/>)}
                  return null
                  })
                }
              </InfiniteScroller>
              </div>
            </div>
        )
    }
}

ConnectedSearch.propTypes = {
  foundItems: PropTypes.array,
  type: PropTypes.string,
  nextPageToken: PropTypes.string,
  query: PropTypes.string
}

export const Search = connect(mapStateToProps, mapDispatchToProps)(ConnectedSearch)