$("document").ready(function(){
  //set up variables to hold the background services
  var background = chrome.extension.getBackgroundPage();
  var authService = background.authService;
  var listService = background.listService;
  var Link = listService.Link;

  //set up listeners
  $("#sign-in-btn").click(function(){
    authService.requestGrant();
  });

  $("#post-list").click(function(){
    listService.postCurrentList();
  });
  
  $("#add-link-btn").click(function(){

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var url = tabs[0].url;
      var description = $("#link-description").val();
      var link = Link(url, description);
      listService.addLink(link);
    });
  });

  $("post-wall-btn").click(function(){
    var url = undefined;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var url = tabs[0].url;
      var description = $("#wall-link-description");
      var link = Link(url, description);

      listService.postToWall(link);

    });
    
  });
  

})
