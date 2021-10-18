
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import queryString from 'query-string';

var qs = require('querystring');

class Helpers{
  constuctor(){}

  async logout(props) {
    var url = "" + props.graviteeserver + props.graviteedomaine + "/logout?invalidate_tokens=true&target_url=" + props.redirecturl;
    await _H.manageuserlogin('out')
    props.window.location.href = url;
  }

  async loginurl(props){
    var url = "" + props.graviteeserver + props.graviteedomaine + "/oauth/authorize?client_id=" + props.clientid + "&response_type=code&redirect_uri=" + props.redirecturl;
    return url;
  }

  async tokenurl(props){
    var url = "" + props.graviteeserver + props.graviteedomaine + "/oauth/token";
    return url;
  }

  async tokenurlheader(props) {
    var config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': "Basic " + props.bearer
      }
    };
    return config;
  }

  async tokenurldata(props,code) {
    var data2 = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: props.redirecturl,
      client_id: props.clientid
    };
    // console.log('tokenurldata:', qs.stringify(data2));
    return data2;
  }

  getcode(location){
    let parsed = queryString.parse(location.search);

    // console.log("OIDC-IN = ", localStorage.getItem('oidc-in'))
    const aux = parsed.code
    if (aux !== undefined){
      if(localStorage.getItem('oidc-in') === null){
        localStorage.setItem('oidc-in', aux)
        return aux
      }else{
        if(localStorage.getItem('oidc-in') !== aux){
  					localStorage.setItem('oidc-in', aux);
  					return aux
				}else{
      	   return null;
				}
      }
    }else{
      return undefined
    }
  }

  async getusertoken(props, code){
    const tokenurl = await _H.tokenurl(props)
    const tokenurldata = await _H.tokenurldata(props, code)
    const tokenurlheader = await _H.tokenurlheader(props)

    const callback = props.receivetokencallback
    console.log("=== CALL GET USER TOKEN === for code: ", code)

    axios.post(tokenurl, qs.stringify(tokenurldata), tokenurlheader).then(function (res) {
      var jwtObj = res.data.access_token.split('.');

      console.log("TOKEN = ", res);
      if (props.userinfo === true){
        _H.getuserinfo(jwt_decode(res.data.access_token), res.data, callback, props);
      }else{
        callback({
          access_token:  res.data.access_token
        })
      }
    }).catch((err) => {
      // console.log('=========> ERROR - getUserToken: ', err.response);
      callback(err.response.data)
    });
  }

  async getuserinfo(jwtObj, data, callback, props) {
    if (callback === void 0) {
      callback = undefined;
    }

    var config = {
      headers: {
        'Authorization': "Bearer " + data.access_token
      }
    };
    var url = jwtObj.iss + "/userinfo";
    axios.get(url, config).then(function (res) {
      // console.log('getUserInfo', res.data);

      _H.checkUserRoles(props, res.data).then((valid_roles) => {
        console.log("valid_roles = ", valid_roles)
        if(props.roles.length === 0){
          res.data['roles'] = []
          callback({
            access_token: data.access_token,
            user_data: res.data
          });

        }else{
          if (valid_roles.length > 0){
            res.data['roles'] = valid_roles
            callback({
              access_token: data.access_token,
              user_data: res.data
            });

          } else{
            callback({ error_code:403, error_message:'Right needed !, Please contact application admin !' })
          }
        }
      })


    }).catch((err) => {
      console.log('ERROR - getUserToken: ', err);
      callback(err.response.data)
    });
  }

  async checkUserRoles(props, usr_data){
    const usr_roles = usr_data['roles']
    let roles_validated = []

    if(usr_roles != undefined){
      for (var id in usr_roles){
        if (props.roles.includes(usr_roles[id])){
          roles_validated.push(usr_roles[id])
        }
      }
    }
    return roles_validated
  }

  manageuserlogin(type, code=undefined){
    switch (type){
      case 'in':{
        console.log("OIDC-IN:", type, code)
        localStorage.setItem('oidc-in',code)
        break;
      }
      case 'out':{
        console.log("OIDC-OUT:", type, code)
        localStorage.removeItem('oidc-in')
        break;
      }
    }
    return localStorage.getItem('oidc-in')
  }

  async getdevmodetoken(){
    const act = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6Impkb0BtYWlsLmNvbSJ9.Q2tDAkrVf10jcthgKAyHo0W6iGhMqA1OSnX_KP-mSkM'
    return act
  }
}

const _H = new Helpers()
export default _H
