
var Message = function(text) {
    var d = new Date();
    var time = d.toLocaleTimeString();
    var message = {
        text:text,
        time:time,
        imgUrl:'img/default-user.png'
    }
    return message;
}