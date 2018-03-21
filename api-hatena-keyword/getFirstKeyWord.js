// 応答はXMLで返ってくるのでXMLからJSONに変換するパーサーを使用する
var parser = require('xml2json');
var prettyjson = require('prettyjson');

// はてなキーワードAPIでキーワード検索して 最初のキーワードを使用する
function getFirstKeyWordByHatena( searchWord ){

    return new Promise( resolve => {

        const http = require('http');
        // const url = 'http://search.hatena.ne.jp/keyword?word=' + searchWord + '&mode=rss&ie=utf8&page=1';
        // const url = 'http://search.hatena.ne.jp/keyword?word=' + searchWord.toString( ) + '&mode=rss&ie=utf8&page=1';
        var url = 'http://search.hatena.ne.jp/keyword?word=' + encodeURI( searchWord ) + '&mode=rss&ie=utf8&page=1';
        console.log( 'url: ' + url );
        // console.log( 'encodeURI: ' + encodeURIComponent( url ) );
        
        
        const req = http.request(url, (res) => {
            res.on('data', (chunk) => {
                // console.log(`BODY: ${chunk}`);
                
                var xmlString = chunk;
                
                resolve( xmlString );
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        })

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
        });

        req.end();
    } )
}

// await指定された関数の実行が終わるまでreturnするのを待つ
exports.searchFirstKeyWord = async function( searchWord ) {
    
    console.log("decoded searchWord: ", decodeURI( searchWord ) );
    const result = await getFirstKeyWordByHatena( searchWord );
    
    // xml to json
    var json = parser.toJson( result );
    // console.log("to json: ", json);
    
    // console.log("to json -> %s", JSON.stringify( json, null , "\t" ) );
    // console.log("to json:", prettyjson.render( json ) );
    // console.log("to json: ", prettyjson.render( JSON.stringify( json ) ) );
    
    // JavaScriptオブジェクトに変換
    var parsedJsonObject = JSON.parse( json );
    console.log("parsedJsonObject: ", parsedJsonObject );

    var item = JSON.parse( json )[ 'rdf:RDF' ][ 'item' ]
    console.log("first: ", prettyjson.render( item ) );
    
    var firstHit = item[ 0 ] || item;
    
    /*
    if ( item[ 0 ] ) {
        firstHit = item[ 0 ][ 'title' ];
    } else {
        firstHit = item[ 'title' ];
        console.log( 'item[ 0 ] is null.' );
    }
    */
    
    // console.log("to json: ", prettyjson.render( JSON.parse( json ) ) );
    
    // return result;
    // return firstHit;
    return firstHit[ 'title' ];
}

