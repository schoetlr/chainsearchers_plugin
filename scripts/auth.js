var authService = {

  clientId: "8af3c5b8a1315e4e04964b43f174cfa57eb2c9cfd19206abd03a5e886b71ecb4",

  redirectUri: "https://modhaaboeefkahhijacfpadakhbigfjm.chromiumapp.org/popup.html",

  grantEndPoint: function(){
    return "http://localhost:3000/oauth/authorize?client_id="+authService.clientId+"&response_type=code&redirect_uri="+authService.redirectUri;
  },

  requestGrant: function(){

    chrome.identity.launchWebAuthFlow({
        'url': authService.grantEndPoint(),
        'interactive': true}, function(redirect_url){
      alert(redirect_url); 
    /* Extract auth code from redirect_url */ 
      var code = this.extractCode(redirect_url);
    
      authService.getAccessToken(code);
    }); //launchWebAuthFlow ends here
  
  },

  tokenEndPoint: "http://localhost:3000/oauth/token",

  clientSecret: "49ac1fe681b57b9b816ef33dcff0e0876fc23886d5dfab0f036dc488e5dfe873",

  //stores response from second request
  accessToken: undefined,

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
        authService.accessToken = response;
      },
      dataType: "json"
    });
  },


  extractCode: function(url){
    console.log("debug below");
    console.log(url);
    var halves = url.split("code=");
    foofoo = halves;
    var code = halves[halves.length-1];
    alert(code);
    return code;
  }
};