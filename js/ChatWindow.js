var ChatWindow = function(){
    var roboCount = 0;
    var messageCount = 0;
    var roboResponses = ["Hey! How's it going?", "Do you like the chat window?", "Awesome!"];

    this.init = function(){
        roboResponse();
        //set on click listener for send message button
        $('#buttonSend').click(function() {
            var text = $('#messageInput').val();
            if(text =='') return;
            var message = new Message(text);
            displayNewMessage(message);
            roboResponse();
            $('#messageInput').val('');
        });
        //enter key to click 'send' button
        $("#messageInput").keyup(function(event){
            if(event.keyCode == 13){
                $("#buttonSend").click();
            }
        });
    }

    var checkCount = function(){
        if( messageCount<4)
            $('.items').height($('.items').height() + 76);
        else $('.items').height(260);
        messageCount++;
    }

    var displayNewMessage = function(message){
        checkCount();
        var text = '<p class="chatText">'+message.text+'</p>';
        var messageHTML = '<li class="chatMessage"><p class="chatTime">'+message.time+'</p></br><img class="thumbnail" src='+message.imgUrl+'><p class="chatText">'+message.text+'</p></li>';
        $(messageHTML).hide().appendTo('ul.items').show();
        $('.items').scrollTop($('.items li').length * 76);
    }

    var roboResponse = function(){
        setTimeout(function(){
            var message = new Message(roboResponses[roboCount%3]);
            displayNewMessage(message);
            roboCount++;
        },1400);
    }

}