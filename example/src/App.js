import React from 'react'

import { OIDCComponent } from 'oidc-connect'
import 'oidc-connect/dist/index.css'

const App = () => {
  const setUserToken = (resp) => {
    console.log('USER TOKEN RECEIVED: ', resp)
    localStorage.setItem('oidc-token',resp)
  }



  const logout_btn = (props) => {
    return (
      <div className="logout_btn">
        <p>LOGOUT</p>
      </div>
    )
  }

  return <OIDCComponent
                        apphost="apphost"
                        customButton={logout_btn}
                        className={undefined}
                        userinfo={true}
                        devmode={process.env.REACT_APP_DEVMODE == 0 ? false : true}
                        devmode_data={{"user":"DEV-USER", "token":"dev_token_receive", "roles":"TAVIE_GESTION"}}
                        window={window}
                        graviteeserver={process.env.REACT_APP_GRAVITEE_HOST}
                        graviteedomaine="internal"
                        clientid={process.env.REACT_APP_GRAVITEE_ID}
                        redirecturl={`${process.env.REACT_APP_GRAVITEE_REDIRECT}`}
                        roles={[]}
                        bearer={process.env.REACT_APP_GRAVITEE_BASIC}
                        logoutcallback = {() => {console.log('Logout callback')}}
                        receivetokencallback = {(token) => {
                            setUserToken(token)
                          }}/>
}

export default App
