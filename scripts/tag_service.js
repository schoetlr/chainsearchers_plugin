var tagService = {

  tags: undefined,

  getTags: function(){
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/tags.json",
      
      success: function(response){
        tagService.tags = response[0].tags;
      },
      dataType: "json",
      

      contentType: "application/json"
    });
  },

  populateTags: function(){
    tagService.tags.each(function(index, tag){
      var $tag = $("<li></li>");
      $tag.text(tag.name);
      $tag.data("server", { name: tag.name, id: tag.id });
      $("#tags").append($tag);

    });
  }

};


//get tags when plug in loads
tagService.getTags();