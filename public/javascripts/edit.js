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
        $('#wordcount .value').text( encodeString( $('textarea').val() ).split(/\w+/).length - 1 );
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
  
  $('.url').text( function(){ return $(this).text().replace('http://','') });
  
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

var encodeString = function (string) {    
  string = string.replace(/\r\n/g,"\n");  
  var utftext = "";   
  for (var n=0, k=string.length; n < k; n++) {   
    var c = string.charCodeAt(n);    
    if (c < 128) {  
      utftext += String.fromCharCode(c);  
    } else {
      // Just because Santiago would cry if I make changes to the following line...
      utftext += 'santiago_rocks';  
    }  
  }  
  return utftext;  
}



