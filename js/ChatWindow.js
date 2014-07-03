var ChatWindow = function(){
    this.init = function(){
        var i = 0;
        $('#buttonSend').click(function() {
            var message = $('#messageInput').val();
            if(message =='') return;
            //set chat window height manually to keep messages appearing at bottom
            if( i<4)
                $('.items').height($('.items').height() + 76);
            else $('.items').height(260);
            i++;
            var messageHTML = createMessage();
            //$('<li class="chatMessage"><p>'+message+'</p></li>').hide().appendTo('ul.items').show();
            $(messageHTML).hide().appendTo('ul.items').slideDown('fast');
            $('.items').scrollTop($('.items li').length * 75);
            $('#messageInput').val('');
        });
    }


    var createMessage = function(){
        d = new Date();
        var time = d.toLocaleTimeString();
        var message = $('#messageInput').val();
        var messageHTML = '<li class="chatMessage"><p class="chatTime">'+time+'</p></br><p class="chatText">'+message+'</p></li>';
        return messageHTML;
    }

}