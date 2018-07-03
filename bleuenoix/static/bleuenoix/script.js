
$(document).ready(function () {

  $.ajax(
    {
      type: "GET",
      url: "/memes/getAllMemes",
      data: {
      },
      success: function (data) {
        if (data.ok === false) {
          alert("Fail" + appreciation);
          return;
        }
       console.log(JSON.parse(data.memes));
       var memes = JSON.parse(data.memes);
       $.each(memes, function( index, value ) {
         var divWrapper = $("<div>");
         var memeToAdd = $("<a>", {"data-meme-id": value.pk, 
         "data-meme-uploader": value.fields.uploader,
         "data-meme-upvotes": value.fields.upvoters.length,
         "data-meme-downvotes": value.fields.downvoters.length,
         "data-meme-title": value.fields.titre,
         "data-meme-url": value.fields.image,
         "class" :"modal-opener",
         "data-toggle" : "modal",
         "data-target" : "#memeModal"});
         memeToAdd.append($("<div>",{
          "class":"centre-cropped",
          "style":"background-image: url("+value.fields.image+");",
          "height" : "300px"
         }));
         divWrapper.append(memeToAdd);
        $( "#grid" ).append(divWrapper);
      
     

    
      });
      


      /*
      
    <a data-meme-id="{{meme.id}}" 
    
    {% if user == meme.uploader %}
    data-meme-editable="true" 
    {% else %}
    data-meme-editable="false" 
    {% endif %}
    data-meme-uploader="{{meme.uploader}}"
    data-meme-upvotes="{{meme.upvoters.count}}"
    data-meme-downvotes="{{meme.downvoters.count}}" 
    data-meme-title="{{meme.titre}}" 
    data-meme-url="{{meme.image.url}}" class="modal-opener" data-toggle="modal" data-target="#memeModal">
      <div class="center-cropped" style="background-image: url({{meme.image.url}});"></div>
    </a>
    */ 
 //  salvattore.registerGrid(document.querySelector('#grid'));
   salvattore.rescanMediaQueries();
     //  salvattore.recreateColumns(document.querySelector('#grid'));

      }
    })
    $('#memeModal').on('show.bs.modal', function (e) {

      //get data-id attribute of the clicked element
      $("#modal-title").text($(e.relatedTarget).data('meme-title'));
      //populate the textboxe.currentTarget).find('#inside').val($(e.relatedTarget).data('meme-id'));
      $("#img-modal").attr("src", $(e.relatedTarget).data('meme-url'));
      $(".vote-button").attr("data-meme-id", $(e.relatedTarget).data('meme-id'));
      $('#number-upvotes').text($(e.relatedTarget).data('meme-upvotes'));
      $('#number-downvotes').text($(e.relatedTarget).data('meme-downvotes'));
      $('#meme-uploader').text($(e.relatedTarget).data('meme-uploader'));
      $('#edit-button').attr("href", "updatememe/"+ $(e.relatedTarget).data('meme-id'));
     
      if($(e.relatedTarget).data('meme-editable') == true)
      {
        $('#edit-button').show();
      }
      else
      {
        $('#edit-button').hide();
      }
      $('.vote-button').unbind();
      $(".vote-button").click({memeid: $(e.relatedTarget).data('meme-id')}, votefunction);
      $('#delete-button').click({memeid: $(e.relatedTarget).data('meme-id')}, deletefunction);
    });
  
    function deletefunction(event){
      var memeid = event.data.memeid;
      $.ajax(
        {
          type: "GET",
          url: "/memes/deletememe",
          data: {
            post_id: memeid
          },
          success: function (data) {
            if (data.ok === false) {
              alert("Fail" + appreciation);
              return;
            }
            $("[data-meme-id="+memeid+"]").remove();
            salvattore.recreateColumns(document.querySelector('#grid'));
            $('#memeModal').modal('toggle');
          }
        })
    }
    function votefunction (event) {
      var memeid = event.data.memeid;
      var appreciation = $(this).data('appreciation');
      $.ajax(
        {
          type: "GET",
          url: "/memes/" + appreciation + "meme",
          data: {
            post_id: memeid
          },
          success: function (data) {
            if (data.ok === false) {
              alert("Fail" + appreciation);
              return;
            }
            $('#number-upvotes').text(data.upvotes);
            $('#number-downvotes').text(data.downvotes);

            $("[data-meme-id="+memeid+"]").data("meme-upvotes",data.upvotes);
            $("[data-meme-id="+memeid+"]").data("meme-downvotes",data.downvotes);
   
          }
        })
    }
      

 
  });