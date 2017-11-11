$("document").ready(function(){

  //set up listeners
  $("#sign-in-btn").click(function(){
    authService.requestGrant();
  });

  $("#post-list").click(function(){
    listService.postCurrentList();
  });
  
  $("#add-link-btn").click(function(){
    //get url from tab
    var url = undefined;
    var description = $("#link-description").val();

    var link = Link(url, description);
    listService.addLink(link);
  });

  $("post-wall-btn").click(function(){
    var url = undefined;
    var description = $("#wall-link-description");
    var link = Link(url, description);

    listService.postToWall(link);
  });
  

})
