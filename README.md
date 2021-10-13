# oidc-connect-pf

> Gravitee login module, created with CRL

[![NPM](https://img.shields.io/npm/v/oidc-connect.svg)](https://www.npmjs.com/package/oidc-connect) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save oidc-connect
```

## Usage

```jsx
import React, { Component } from 'react'

import IODCComponent from 'oidc-connect-pf'
import 'oidc-connect-pf/dist/index.css'


const setUserToken = (resp) => {
  console.log('USER TOKEN RECEIVED: ', resp)
}

class Example extends Component {
  render() {
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
}
```

## License

MIT Open source © [Thierry LOUREL](https://github.com/Thierry LOUREL)
