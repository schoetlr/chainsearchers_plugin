var listService = {

  links: [],

  postCurrentList: function(){


  },

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






