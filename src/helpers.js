
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import queryString from 'query-string';

var qs = require('querystring');

class Helpers{
  constuctor(){}

  async logout(props) {
    var url = "" + props.graviteeserver + props.graviteedomaine + "/logout?invalidate_tokens=true&target_url=" + props.redirecturl;
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
    console.log('tokenurldata:', qs.stringify(data2));
    return data2;
  }

  async getcode(location){
    let parsed = queryString.parse(location.search);
    console.log("LOCATION:", location.search, parsed.code);

    return parsed.code
  }

  async getusertoken(props, code){
    const tokenurl = await _H.tokenurl(props)
    const tokenurldata = await _H.tokenurldata(props, code)
    const tokenurlheader = await _H.tokenurlheader(props)

    const callback = props.receivetokencallback
    axios.post(tokenurl, qs.stringify(tokenurldata), tokenurlheader).then(function (res) {
      var jwtObj = res.data.access_token.split('.');

      // console.log(jwt_decode(res.data.access_token));
      _H.getuserinfo(jwt_decode(res.data.access_token), res.data.access_token, callback);
    }).catch((err) => {
      // console.log('=========> ERROR - getUserToken: ', err.response);
      callback(err.response.data)
    });
  }

  async getuserinfo(jwtObj, access_token, callback) {
    if (callback === void 0) {
      callback = undefined;
    }

    var config = {
      headers: {
        'Authorization': "Bearer " + access_token
      }
    };
    var url = jwtObj.iss + "/userinfo";
    axios.get(url, config).then(function (res) {
      console.log('getUserInfo', res.data);
      callback({
        access_token: access_token,
        user_data: res.data
      });
    }).catch((err) => {
      // console.log('ERROR - getUserToken: ', err);
      callback(err.response.data)
    });
  };

  async getdevmodetoken(){
    const act = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6Impkb0BtYWlsLmNvbSJ9.Q2tDAkrVf10jcthgKAyHo0W6iGhMqA1OSnX_KP-mSkM'
    return act
  }
}

const _H = new Helpers()
export default _H
