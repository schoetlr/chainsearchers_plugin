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
  //populate the user lists
  listService.populateUserLists();
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
    }

    
  }
  //can probably put this in updateDOM
  function displayUpdateBox(){
    $checkbox = $("#update-list-check");
    if(listService.updateStatus){
      $checkbox.prop("checked", true);
    } else {
      $checkbox.prop("checked", false);
    }
  }

  updateDOM();
  displayUpdateBox();
  

  authService.updateSession();

  //set up listeners
  $("#sign-in-btn").click(function(){
    authService.requestGrant();
  });

  $("#logout-link").click(function(){
    authService.accessToken = undefined;
    authService.updateSession();
  });

  function invalidInput(){
    if($("#list-title").val().length === 0){
      return true;
    }
  }

  $("#post-list-btn").click(function(event){
    if(invalidInput()){
      event.preventDefault();
      $("#invalid-title").show();
      
    } else {

      if(authService.userSignedIn()){
        if(listService.updateStatus){
          listService.updateList();
        } else {
          listService.postCurrentList(authService.accessToken);
        }
        
      } else {
        listService.postCurrentListAnon();
      }
    }
  });
  
  $("#add-link-btn").click(function(){

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var url = tabs[0].url;
      var description = $("#link-description").val();
      var link = Link(url, description);
      listService.addLink(link);

      $("#checkmark").fadeIn(700);
      setTimeout(function(){
        $("#checkmark").fadeOut(700);
      }, 3500);
    });
  });

  $("#post-wall-btn").click(function(){
    
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var url = tabs[0].url;
      var description = $("#wall-link-description").val();
      var link = Link(url, description);
      var linkData = { link: link };

      if(authService.userSignedIn()){
        listService.postToWall(linkData, authService.accessToken);
      } else {
        
        listService.postToWallAnon(linkData);
      }
      
      $("#wall-link-description").val("");

    });
    
  });

  $("#list-reset-btn").click(function(){
    listService.resetList();
    updateDOM();
  });

  $("#list-title").keyup(function(){
    $titleInput = $("#list-title");
    listService.title = $titleInput.val();
    
    if($titleInput.val().length > 0){
      $("#invalid-title").hide();
    }
  });

  $("#list-description").keyup(function(){
    listService.description = $("#list-description").val();
  });

  $("#wall-post").click(function(){
    listService.postToWall = $("#wall-post").val();
  });

  //prevent default behavior for hitting enter on the form
  $("form").on("keyup keypress", function(event){
    var code = event.keyCode || event.which;
    if(code === 13){
      event.preventDefault();
      return false;
    }
  });

  //show tags on focus 
  $("#tag-search").focus(function(){
    $("#tags").slideDown(500);
  });

  $("#tag-search").focusout(function(){
    $("#tags").slideUp(500);
  });

  //filter the tag list
  $("#tag-search").keyup(function(event){
    var code = event.keyCode || event.which;
    if(code !== 13){
      $(".tag").each(function(i, tag){
        var $tag = $(tag);
        var search = $(event.target).val().toLowerCase();
        var tagTxt = $tag.text().toLowerCase();
        
        if(tagTxt.includes(search)){
          $tag.show();
        } else {
          $tag.hide();
        }
      });
    } else {
      handleTagSubmission(event);
    }
  });


  function handleTagSubmission(event){
    
    var $tag = $("<li></li>");
    $tag.text($(event.target).val());
    $tag.attr("data-id", undefined);
    $tag.addClass("selected-tag");
    listService.selectedTags.push($tag);
    //add to view
    updateDOM();
    $("#tag-search").val("");
    
  }


  //add to selected tags
  $("body").on("click", ".tag", function(event){
    $tag = $(event.target).clone();
    $tag.addClass("selected-tag");
    $tag.removeClass("tag");
    listService.selectedTags.push($tag);
    $("#selected-tags").append($tag);
  });

  $("body").on("click", ".selected-tag", function(event){
    //alert(".selected-tag click r");
    var $tag = $(event.target);
    listService.selectedTags = listService.selectedTags.filter(function(tag){
      return tag.text() !== $tag.text();
    });
    $tag.fadeOut(450, function(){
      this.remove();
    });
  });


   //update list stuff

   function toggleListSections(){
     $newListWrapper = $("#new-list-wrapper");
     $updateListWrapper = $("#update-list-wrapper");
     $newListWrapper.toggle();
     $updateListWrapper.toggle();
   }

  $("#update-list-check:checkbox").change(function(){

    var checked = $("#update-list-check").is(':checked');
    
    if(checked){
      listService.updateStatus = true;
      toggleListSections();
    } else {
      listService.updateStatus = false;
      listService.updatableList = undefined;
      listService.title = "";
      listService.description = "";
      toggleListSections();
      updateDOM();
    }
  });



  $("#list-filter").keyup(function(event){
    $(".user-list").each(function(i, list){
      var $list = $(list);
      var search = $(event.target).val().toLowerCase();
      var listTitle = $list.text();

      if(listTitle.includes(search)){
        $list.show();
      } else {
        $list.hide();
      }
    });
  });


  $("body").on("click", ".user-list", function(event){
    //track in listService
    $list = $(event.target);
    var id = $list.attr("data-id");
    var desc = $list.attr("data-desc");
    var title = $list.text();
    listService.updatableListID = id;
    listService.title = title;
    listService.description = desc;
    toggleListSections();
    updateDOM();
  });
  

});
