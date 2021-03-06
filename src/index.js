import React from 'react'
import  { useState, useLayoutEffect, Fragment } from 'react'
import styles from './styles.module.css'
import _H  from './helpers.js'

// const ExampleComponent = ({ text }) => {
//   return <div className={styles.test}>Example Component: {text}</div>
// }

const OIDCComponentReact = (props) => {
    // console.log("ExampleComponent: ", Object.keys(props))

    const LogoutButtonComponent = props.customButton;

    // State
    const [loginurl, setLoginUrl] = useState(undefined)
    const [tokenurl, setTokenUrl] = useState(undefined)

    // callback methods
    let token_callback = props.receivetokencallback
    let logout_callback = props.logoutcallback
    let notallowed_callback = props.notallowedcallback

    // check required properties
    const _init = (props) =>{
      if (props.graviteeserver != undefined && props.graviteedomaine != undefined){
          if(props.redirecturl != undefined && props.clientid != undefined){
              if(props.bearer != undefined && props.roles != undefined){
                  if(props.window != undefined && props.apphost != undefined){
                      if(props.devmode != undefined && props.devmode_data != undefined){
                        if(props.userinfo != undefined){
                          return true
                        }
                      }
                  }
              }
          }
      }
      return false
    }

    const prepare_variable = (props) => {
      // loginurl
      _H.loginurl(props).then((res) => {
        setLoginUrl(res)
        // console.log("Loginurl = ", res)
        // call apimlogin
        apimlogin(props, res)
      })

      // toekn url
      _H.tokenurl(props).then((res) => {
        setTokenUrl(res)
      })
    }

    const apimlogin = (props, url) => {
      console.log('APIM Call ==> Go:', url);

      if (props.devmode === false) {
        props.window.location.href = url;
      }else if (props.devmode === true){
        _H.getdevmodetoken().then((res) => {
            const devdata = {access_token: res, user_data:props.devmode_data}
            props.receivetokencallback(devdata)
        })
      }
    }

    const logout = (props) => {
      _H.logout(props).then(() => {
        props.logoutcallback();
      });
    }

    // useEffect
    useLayoutEffect(() => {
      let isMounted = true
      if (_init(props)){
          const code = _H.getcode(props.window.location)
          if (isMounted){
            if(code === undefined){
              prepare_variable(props)
            }else{
                if(code !== null){
                    console.log("GET TOKEN")
                    _H.getusertoken(props, code)
                }
            }
          }
      }

      return function cleanup() {
        console.log("Cleanup OIDC Component")
        isMounted = false;
      }

    },[])

    return (
      <>
        {
          (_init(props)) &&  (
            <div className={props.className != undefined ? props.className : ''} onClick={() => logout(props) }>
                {
                  (LogoutButtonComponent === undefined) && (<p>Logout</p>)
                }
                {
                  (LogoutButtonComponent !== undefined) && (<LogoutButtonComponent />)
                }
            </div>
          )
        }
        {
          (!_init(props)) &&  (<p style={{color:'red', padding:5}}>OIDC cfg ERROR</p>)
        }
      </>
    )
}

export {
  OIDCComponentReact as OIDCComponent
}
