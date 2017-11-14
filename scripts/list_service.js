var listService = {

  links: [],

  title: "",

  description: "",

  postToWall: true,

  selectedTags: [],

  postCurrentList: function(accessToken){
    //prepare the data
    var data = listService.prepareListData();

    var header = "Bearer " + accessToken;
    
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/lists.json",
      data: data,
      success: function(response){
        console.log("post was successful");
        //reset data
        listService.resetList();
      },
      dataType: "json",

      contentType: "application/json",

      headers: {
        "Authorization": header
      }
    });

  },

  postCurrentListAnon: function(){
    var data = listService.prepareListData();
    data.postToWall = false;

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/lists.json",
      data: data,
      success: function(response){
        console.log("post was successful");
        //reset data
        listService.resetList();
      },
      dataType: "json",

      contentType: "application/json"

    });
  },

  //this is to post a single link
  postToWall: function(link, accessToken){
    var header = "Bearer " + accessToken;
    link = JSON.stringify(link);

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/links.json",
      data: link,
      success: function(response){
        
      },
      dataType: "json",

      contentType: "application/json",

      headers: {
        "Authorization": header
      }
    });
  },

  //for anon links
  postToWallAnon: function(link){
    link = JSON.stringify(link);
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/links.json",
      data: link,
      success: function(response){
        
      },
      dataType: "json",

      contentType: "application/json"

    });
  },

  addLink: function(link){
    listService.links.push(link);
  },

  //Link constructor
  Link: function(url, description){
    var link = {};

    link.url = url;
    link.description = description;

    return link;
  },

  prepareTags: function(){
    var tags = [];

    listService.selectedTags.forEach(function($tag){
      var id = $tag.attr("data-id");
      var name = $tag.text();

      var tag = { name: name, id: id };
      tags.push(tag);
    })

    return tags;
  },

  resetList: function(){
    listService.selectedTags = [];
    listService.links = [];
    listService.title = "";
    listService.description = "";
    listService.postToWall = true;
  },

  prepareListData: function(){
    var tags = listService.prepareTags();
    var listData = { title: listService.title, description: listService.description};

    var data = {};
    data.list = listData;
    data.selectedTags = tags;
    data.links = listService.links;
    data.postToWall = listService.postToWall;

    return JSON.stringify(data);
  },

  userLists: undefined,

  updateStatus: false,

  updatableList: undefined,

  getLists: function(){
    var header = "Bearer " + authService.accessToken;

    $.ajax({
      type: "GET",
      url: "http://localhost:3000/api/lists.json",
      
      success: function(response){
        listService.userLists = response;
        listService.populateUserLists();
      },
      dataType: "json",

      contentType: "application/json",

      headers: {
        "Authorization": header
      }

    });
  },

  updateList: function(accessToken){
    //prepare the data
    var data = listService.prepareListData();
    var data.id = listService.updatableList.id;
    var header = "Bearer " + accessToken;
    
    var requestUrl = "http://localhost:3000/api/lists.json";
    $.ajax({
      type: "POST",
      url: requestUrl,
      data: data,
      success: function(response){
        console.log("post was successful");
        //reset data
        listService.resetList();
      },
      dataType: "json",

      contentType: "application/json",

      headers: {
        "Authorization": header
      }
    });
  },

  populateUserLists: function(){
    var currentView = chrome.extension.getViews({type:"popup"})[0].document;
    var $view = $(currentView);

    listService.userLists.forEach(function(list){
      var $list = $("<li></li>");
      $list.text(list.title);
      $list.attr("data-id", list.id);
      $list.attr("data-desc", list.description);
      $list.addClass("user-list");

      $view.find("#user-lists").append($list);
    });
  }



  
};






