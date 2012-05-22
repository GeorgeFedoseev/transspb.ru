
$(document).ready(function(){
    
    $('#options_button').live('click', function(){
        
        if(_state.page == stMAP)
         showOptions();
        else if(_state.page == stOPTIONS)
         hideOptions();
    });
});

function showOptions(){
    hideMap(false, function(){
        $('#options_button img').attr('src', _img.swtch.map);
         $('#options').fadeIn('slow');
          showLogo();
           logoTop();
            m._state.page = m._state.types.stOPTIONS;
    });
}

function hideOptions(){
    $('#options').fadeOut('slow');   
    m.showMap();    
    m._state.page = m._state.types.stMAP;
}

function hideLogo(){  
    $('#logo').hide();
    m._state.logoVisible = false;
}

function showLogo(){    
    $('#logo').show();
    m._state.logoVisible = true;
}

function logoTop(){
      $('#logo').css({top: "5%"});
      m._state.logoCentered = false;
}

function logoCenter(){
    $('#logo').css({top: "35%"});
    _state.logoCentered = true;
}

function log(s){
    if(console)
     console.log(s);
}