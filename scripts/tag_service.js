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

  populateTags: function($view){
    tagService.tags.forEach(function(tag){
      var $tag = $("<li></li>");
      $tag.text(tag.name);
      $tag.addClass("tag");
      $tag.attr("data-id", tag.id);
      $view.find("#tags").append($tag);
      
    });
  }

};


//get tags when plug in loads
tagService.getTags();