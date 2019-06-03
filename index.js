var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));

var mysql = require('mysql');
var connection = mysql.createConnection({

	host: 'localhost',
	user: 'root',
	post: 3307,
	password: '1234',
	database: 'my_db'});

connection.connect(function (err){
	if(err){
	console.error('error connecting: ' + err.stack);
	return;
}
 console.log('Success DB connection');
});

var server = require('http').createServer(app);

var io = require('socket.io')(server);


app.get('/', function (req, res) {
  res.render('index.html', {alert: false});
});
app.post('/register', function(req, res){
	var name = req.body.name;
	var pwd = req.body.pwd;
	var pwdconf = req.body.pwdconf;
	var rname = req.body.rname;
	var gender = req.body.gender;
	var birth = req.body.birth;
	var nname = rname; //default : nickname = realname

	console.log(name, pwd, rname, gender, birth, nname);
	//db에 쿼리 날리기
	var sql = 'INSERT INTO user_info VALUES(?, ?, ?, ?, ?, ?)';
	connection.query(sql, [name, pwd, rname, gender, birth, nname], function(error, results, fields){
		console.log(results);
	});

	res.redirect('/');
});

// 클라이언트와 socket.io 통신
// 클라이언트와 connection에 대한 listening
// 리턴값으로 socket 객체가 넘어온다. (연결된 소켓 정보)
io.on('connection', function (socket) {
	// 소켓으로부터 login 에 대한 listening
	socket.on('login', function (data) {
		console.log('client logged-in:' + data.username);
		socket.username = data.username;
		io.emit('login', data.username);
	});
	// 소켓으로부터 chat 에 대한 listening
	socket.on('chat', function (data) {
		console.log('Message form %s: %s', socket.username, data.msg);
		var msg = {
			username: socket.username,
			msg: data.msg
		};
		io.emit('chat', msg);
	});
	// 소켓으로부터 disconnect 에 대한 listening
	socket.on('disconnect', function () {
		socket.broadcast.emit('logout', socket.username);
		console.log('user disconnected: ' + socket.username);
	});
});


server.listen(8000, function () {
  console.log('Example app listening on port 8000!');
});

app.get('/', function(req, res) {
	res.render('index.html', {alert: false});
});

app.post('/', function(req, res){
	var name = req.body.name;
	var pwd  = req.body.pwd;

	//db에 query 전송
	var sql = 'SELECT * FROM user_info WHERE username  = ?';
	connection.query(sql, [name], function(error, results, fields){ //?가 한개라서 name만 기입
		if(results.length == 0)
		{
			res.render('index.html' ,{ alert: true});
		}
		else{
			var db_pwd = results[0].password;

			if(pwd  == db_pwd){
				res.render('welcome.html', { username: results[0].nickname});
			}else{
				res.render('index.html' ,{ alert: true});
			}
		}
	});
});


app.get('/register', function(req, res){
	res.render('register.html');
});
app.get('/welcome', function(req, res){
	res.render('welcome.html');
});   