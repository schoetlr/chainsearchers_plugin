$("document").ready(function(){
  //set up variables to hold the background services
  var background = chrome.extension.getBackgroundPage();
  var currentView = chrome.extension.getViews({type:"popup"})[0].document;
  $currentDoc = $(currentView);

  var authService = background.authService;
  var listService = background.listService;
  var Link = listService.Link;

  var tagService = background.tagService;

  //populate the tag list
  tagService.populateTags($currentDoc);

  //put persistent form data back
  function updateDOM(){
    $("#list-title").val(listService.title);
    $("#list-description").val(listService.description);
    listService.selectedTags.forEach(function($tag){
      $("#selected-tags").append($tag);
    });
    if(listService.postToWall){
      $("#wall-post").prop("checked", true);
    } else {
      $("#wall-post").prop("checked", false);
    };
    
  };

  updateDOM();

  

  authService.updateSession();

  //set up listeners
  $("#sign-in-btn").click(function(){
    authService.requestGrant();
  });

  $("#logout-link").click(function(){
    authService.accessToken = undefined;
    authService.updateSession();
  });

  $("#post-list-btn").click(function(){
    if(authService.userSignedIn()){
      listService.postCurrentList(authService.accessToken);
    } else {
      listService.postCurrentListAnon();
    };
    
  });
  
  $("#add-link-btn").click(function(){

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var url = tabs[0].url;
      var description = $("#link-description").val();
      var link = Link(url, description);
      listService.addLink(link);
    });
  });

  $("#post-wall-btn").click(function(){
    console.log("in click");
    var url = undefined;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var url = tabs[0].url;
      var description = $("#wall-link-description").val();
      var link = Link(url, description);
      var linkData = { link: link };

      if(authService.userSignedIn()){
        listService.postToWall(linkData, authService.accessToken);
      } else {
        console.log("right brnach");
        listService.postToWallAnon(linkData);
      };
      
      $("#wall-link-description").val("");

    });
    
  });

  $("#list-reset-btn").click(function(){
    listService.resetList();
    updateDOM();
  });

  $("#list-title").keyup(function(){
    listService.title = $("#list-title").val();
  });

  $("#list-description").keyup(function(){
    listService.description = $("#list-description").val();
  });

  $("#wall-post").click(function(){
    listService.postToWall = $("#wall-post").val();
  });

  //filter the tag list
  $("#tag-search").keyup(function(event){
    $(".tag").each(function(i, tag){
      var $tag = $(tag);
      var search = $(event.target).val().toLowerCase();
      var tagTxt = $tag.text().toLowerCase();
      
      if(tagTxt.includes(search)){
        $tag.show();
      } else {
        $tag.hide();
      };
    });
  });

  //add to selected tags
  $(".tag").click(function(event){
    $tag = $(event.target).clone();
    $tag.addClass("selected-tag");
    $tag.removeClass("tag");
    listService.selectedTags.push($tag);
    $("#selected-tags").append($tag);
  });

  $(".selected-tag").click(function(event){

  });
  

})
