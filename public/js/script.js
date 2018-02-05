'use strict';

const socket = io();
var d = new Date();
jQuery(window).load(function () {
    var h = d.getHours();
    var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    setTimeout(function () {
        $('#chatbox').append(' <div class="container darker">\n' +
            '        <img src="/img/avatar_bot.png" alt="Bot" class="right" style="width:100%;">\n' +
            '        <p>' + 'Ciao, come posso aiutarti?' + ' </p>\n' +
            '        <span class="time-right">' + h + ':' + m + '  </span>\n' +
            '    </div>'
        );
    }, 1500);

});
$('form').submit(function () {
    socket.emit('chat message', $('#m').val());
    var h = d.getHours();
    var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    $('#chatbox').append(' <div class="container">\n' +
        '        <img src="/img/avatar_user.jpg" alt="Tu">\n' +
        '        <p>' + $('#m').val() + '</p>\n' +
        '        <span class="time-right">' + h + ':' + m + '  </span>\n' +

        '    </div>'
    );
$('#chatbox').animate({"scrollTop": $('#chatbox')[0].scrollHeight}, "fast");

    $('#m').val('');
    return false;
});

socket.on('bot reply', function (replyText) {
    if (replyText == '') replyText = '(No answer...)';
    var h = d.getHours();
    var m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    $('#chatbox').append(' <div class="container darker">\n' +
        '        <img src="/img/avatar_bot.png" alt="Bot" class="right" style="width:100%;">\n' +
        '        <p>' + replyText + ' </p>\n' +
        '        <span class="time-right">' + h + ':' + m + '  </span>\n' +
        '    </div>'

    );
$('#chatbox').animate({"scrollTop": $('#chatbox')[0].scrollHeight}, "fast");
}

);
