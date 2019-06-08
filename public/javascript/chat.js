$(function() {
    // socket.io 서버에 접속
    var socket = io();

    // 최초로 한번 서버에게 login 메세지 전달
    socket.emit("login", { username: username });

    // login 에 대한 listening
    socket.on("login", function (data) {
        $("#chatLog").append("<li style ='color : yellow; text-align:center;background-color:darkgray;" +
            "margin-left: 20px; margin-right: 20px;'><strong>『"+data+"』</strong> 님이 입장하셨습니다.</li>");

    });
    // logout 에 대한 listening
    socket.on("logout", function (data) {
        $("#chatLog").append("<li style ='color : red;text-align:center;background-color:darkgray;margin-left: 20px; " +
            "margin-right: 20px;'><strong>『"+data+"』</strong> 님이 퇴장하셨습니다.</li>");
    });
    // chat 에 대한 listening
    socket.on("chat", function (data) {
        $("#chatLog").append("<li><strong>"+data.username+"</strong> : "+data.msg+"</li>");
        $("#chatLog").scrollTop($("#chatLog")[0].scrollHeight);
    });

    // form submit
    $("form").submit(function(e) {
        e.preventDefault();
        var $msgForm = $("#msgForm");
        // 서버로 메시지를 전송한다.
        socket.emit("chat", { msg: $msgForm.val() });
        $msgForm.val("");
    });
});
