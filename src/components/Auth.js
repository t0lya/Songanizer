import React from 'react'
import { connect } from 'react-redux'

export const Auth = (InputComponent) => {
    const MapStateToProps = (state) => {
        return {
            token: state.auth.token
        }
    }

    class OutputComponent extends React.Component {
        checkAuth() {
            if (!this.props.token) {
                this.props.history.push('/')
            }
        }

        componentDidMount() {
            this.checkAuth()
        }

        componentDidUpdate() {
            this.checkAuth()
        }

        render() {
            return <InputComponent {...this.props} />
        }
    }

    return connect(MapStateToProps)(OutputComponent)

}
