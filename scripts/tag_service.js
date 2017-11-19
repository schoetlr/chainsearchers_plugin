var tagService = {

  tags: [],

  getTags: function(){
    $.ajax({
      type: "GET",
      url: url.baseUrl+"/tags.json",
      
      success: function(response){
        tagService.tags = response[0].tags;
      },

      error: function(){
        console.log("could not get tags");
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