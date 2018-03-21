/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
var express = require("express");
var app = express();
app.set('json spaces', 2); // Nice formatting for JSON outputs

// Cross-origin resource sharing allows client-side Javascript from other sites to use this API
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

/* 2. listen()メソッドを実行して3000番ポートで待ち受け。*/
var server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});

/* 3. 以後、アプリケーション固有の処理 */

var hatenaApi = require('./getSimilarWord.js');

// はてなキーワードAPIでキーワード検索して、
// 最初のキーワードを使用することにしよう。
// 応答はXMLで返ってくる
// var xml2json = require('xml2json');


// http://127.0.0.1:3000/links?page={検索語}
app.get("/links", function(req, res, next){
    
    // 検索キーワード
    console.log('keyword:', req.query.page );
    var keyword = [ { 'wordlist' : req.query.page } ];

    // 類似語検索を実行
    hatenaApi.searchSimilarWord( keyword ).then(result => {
        console.log('result:', result);
        // res.json( result );
        res.json( result );
    }).catch(function (error) {
        // 非同期処理失敗。呼ばれない
        console.log(error);
    });
});

var hatenaApiFirst = require('./getFirstKeyWord.js');

// http://127.0.0.1:3000/links?page={検索語}
app.get("/pagename", function(req, res, next){

    // 検索キーワード
    console.log('keyword:', req.query.page );
    var keyword = req.query.page;
    
    hatenaApiFirst.searchFirstKeyWord( keyword ).then( result => {
        console.log( 'xmlString : ' + result );
        res.json( result );
    }).catch(function (error) {
        // TODO 検索した結果が０件だった場合
        console.log(error);
    });
    
});