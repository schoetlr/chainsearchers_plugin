var listService = {

  links: [],

  title: "",

  description: "",

  postToWall: false,

  selectedTags: [],

  postCurrentList: function(accessToken){
    var data = {};
    var header = "Bearer " + accessToken;

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/lists",
      data: data,
      success: function(response){
        
      },
      dataType: "json",

      headers: {
        "Authorization": header
      }
    });

  },

  //this is to post a single link
  postToWall: function(){

  },

  addLink: function(link){
    listService.links.push(link);
  },

  //Link constructor
  Link: function Link(url, description){
    var link = {};

    link.url = url;
    link.description = description;

    return link;
  }



  
};






