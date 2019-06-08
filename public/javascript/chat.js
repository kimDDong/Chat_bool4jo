$(function() {
    // socket.io 서버에 접속
    var socket = io();

    // 최초로 한번 서버에게 login 메세지 전달
    socket.emit("login", { username: username });

    // login 에 대한 listening
    socket.on("login", function (data) {
        $("#chatLog").append("<li style ='color : white; text-align:center;background-color:#63738a;;" +
            "margin-left: -18px; margin-right: -18px;'><strong>『"+data+"』</strong> 님이 입장하셨습니다.</li>");

    });
    // logout 에 대한 listening
    socket.on("logout", function (data) {
        $("#chatLog").append("<li style ='color : white;text-align:center;background-color:#63738a;margin-left: -18px; " +
            "margin-right: -18px;'><strong>『"+data+"』</strong> 님이 퇴장하셨습니다.</li>");
    });
    // chat 에 대한 listening
    socket.on("chat", function (data) {
    	if(username == data.username){
	        $("#chatLog").append("<li style ='text-align:right;background-color:#ffb8c6;margin-left: -18px; margin-right: -18px; '><strong>"+"</strong>"+data.msg+"</li>");
    	}
    	else{
	        $("#chatLog").append("<li style ='text-align:left;background-color:#f9c6cf;margin-left: -18px; margin-right: -18px; '><strong>"+data.username+"</strong> : "+data.msg+"</li>");
    	}
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
