import React from 'react'
import  { useState, useEffect, Fragment } from 'react'
import styles from './styles.module.css'
import _H  from './helpers.js'

// const ExampleComponent = ({ text }) => {
//   return <div className={styles.test}>Example Component: {text}</div>
// }

export const ExampleComponent = (props) => {
    // console.log("ExampleComponent: ", Object.keys(props))

    const LogoutButtonComponent = props.customButton;

    // State
    const [isReady, setIsReady] = useState(undefined)
    const [loginurl, setLoginUrl] = useState(undefined)
    const [tokenurl, setTokenUrl] = useState(undefined)

    // callback methods
    let token_callback = props.receivetokencallback
    let logout_callback = props.logoutcallback
    let notallowed_callback = props.notallowedcallback

    // check required properties
    const _init = (props) =>{
      if (props.graviteeserver != undefined){
        if(props.graviteedomaine != undefined){
          if(props.redirecturl != undefined){
            if(props.clientid != undefined){
              if(props.bearer != undefined){
                if(props.roles != undefined){
                  if(props.window != undefined){
                    if(props.apphost != undefined){
                      if(props.devmode != undefined){
                        if(props.devmode_data != undefined){
                          return true
                        }
                      }
                    }
                  }
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
        console.log("Loginurl = ", res)
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
            props.token_callback(devdata)
        })
      }
    }

    const logout = (props) => {
      props.logoutcallback();
      _H.logout(props);
    }

    // useEffect
    useEffect(() => {
      // ceck url params
      _H.getcode(props.window.location).then((res) => {
        if (res === undefined){
          //Call init
          if(isReady === undefined){
            if(_init(props)){
              setIsReady(true)
              prepare_variable(props)
            }
            console.log("====> START LOGIN")
          }
        }else{
          console.log('Get token: ', res)
          _H.getusertoken(props, res)
          setIsReady(true)
        }
      })


    },[])

    return (
      <>
        {
          (isReady) &&  (
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
      </>
    )
}
