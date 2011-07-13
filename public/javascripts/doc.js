var typing = false;
var keystrokes = 0;
var editingTitle = false;

$(function(){  
  
  $('h1')
    .mouseover(function(){
      $(this).addClass('highlight');
    })
    .mouseout(function(){
      $(this).removeClass('highlight');
    });
  
  $('h1').click(function(){
    $(this).after('<input type="text" class="text" id="title" name="title" value="'+$(this).text()+'"/>');
    $(this).hide();
    editingTitle = true;
  });
  
  $('body').click(function(e){
    if(e.target != $('#title')[0] && e.target != $('h1')[0] && editingTitle){
      updateTitle();
    }
  });
  
  $('#title').live('keypress', function(event){
    if(event.keyCode == 13){
      updateTitle();
    }
  });
  
  $('textarea')
    .autogrow()
    .keyup(function(){
      keystrokes += 1;
      if(!typing){
        typing = true;
      }
      if(keystrokes > 99){
        updateContent();
      }
      if($('textarea').val()){
        $('#wordcount .value').text( $('textarea').val().match(/\b/g).length/2 );
        $('#charcount .value').text( $('textarea').val().length );
      }
      else{        
        $('#wordcount .value').text('0');
        $('#charcount .value').text('0');
      }
    })
    .focus()
    .keyup();
  
  $(document).mousemove(function(){
    if(typing){
      typing = false;
      updateContent();
    }
  });
  
})

var updateContent = function(){
  $.ajax({
    type: 'POST',
    url: document.location.pathname,
    data: {text: function(){
      return $('textarea').val();
    }},
    success: function(response){
      keystrokes = 0;
    }
  })
}

var updateTitle = function(){
  $.ajax({
    type: 'POST',
    url: document.location.pathname,
    data: {title: function(){
      return $('#title').val();
    }},
    success: function(response){
      $('h1').show().text( $('#title').val() );
      $('#title').remove();
      editingTitle = false;
    }
  })
}