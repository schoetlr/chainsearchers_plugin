
var authService = {

  clientId: "32e1aace2c30341bd32ef08751e4bfaec515dc1d668d29631de69403a502f403",

  redirectUri: "https://modhaaboeefkahhijacfpadakhbigfjm.chromiumapp.org/oauth2",

  grantEndPoint: function(){
    return url.baseUrl+"/oauth/authorize?client_id="+authService.clientId+"&response_type=code&redirect_uri="+authService.redirectUri;
  },

  requestGrant: function(){

    chrome.identity.launchWebAuthFlow(
      {
        'url': authService.grantEndPoint(),
        'interactive': true
      }, function(redirect_url){
       
    /* Extract auth code from redirect_url */ 
      var code = authService.extractCode(redirect_url);

      authService.getAccessToken(code);
    }); //launchWebAuthFlow ends here
  
  },

  tokenEndPoint: url.baseUrl+"/oauth/token",

  clientSecret: "46c714ae5a4d3e9dd1d35b6726a2c3fc35561cff42f9bf017abc32c9d3cd691e",

  //stores response from second request
  accessToken: undefined,
  refreshToken: undefined,
  expiresIn: undefined,

  getAccessToken: function(code){
    var data = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: "authorization_code",
      code: code
    };

    $.ajax({
      type: "POST",
      url: authService.tokenEndPoint,
      data: data,
      success: function(response){
        authService.accessToken = response.access_token;
        authService.refreshToken = response.refresh_token;
        authService.expiresIn = response.expires_in;
        authService.updateSession();
        listService.getLists();
        authService.tokenCountDown();
      },
      dataType: "json"
    });
  },


  extractCode: function(url){
    var halves = url.split("code=");
    var code = halves[halves.length-1];
    
    return code;
  },

  renewAccessCode: function(){
    var data = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: "refresh_token",
      refresh_token: authService.refreshToken
    };

    $.ajax({
      type: "POST",
      url: authService.tokenEndPoint,
      data: data,
      success: function(response){
        authService.accessToken = response.access_token;
        authService.refreshToken = response.refresh_token;
        authService.expiresIn = response.expires_in;
        authService.updateSession();
        authService.tokenCountDown();
      },
      dataType: "json"
    });
  },

  userSignedIn: function(){
    return !!authService.accessToken;
  },

  updateSession: function(){
    
    var currentView = chrome.extension.getViews({type:"popup"})[0].document;
    var $view = $(currentView);

    if(authService.userSignedIn()){
      $view.find(".signed-in").show();
      $view.find(".not-signed-in").hide();
    } else {
      $view.find(".signed-in").hide();
      $view.find(".not-signed-in").show();
    }
  
  },

  tokenCountDown: function(){
    setTimeOut(function(){
      authService.accessToken = undefined;
      authService.updateSession();
      authService.renewAccessCode();
    }, 7200000);
  }

};