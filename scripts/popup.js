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
  
  //set up listeners
  $("#sign-in-btn").click(function(){
    authService.requestGrant();
  });

  $("#post-list-btn").click(function(){
    listService.postCurrentList(authService.accessToken);
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
      var description = $("#wall-link-description").val();
      var link = Link(url, description);

      listService.postToWall(link);

    });
    
  });

  $("#list-title").keyup(function(){
    listService.title = $("#list-title").val();
  });

  $("#list-description").keyup(function(){
    listService.description = $("#list-description").val();
  });

  $("#wall-post").keyup(function(){
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
