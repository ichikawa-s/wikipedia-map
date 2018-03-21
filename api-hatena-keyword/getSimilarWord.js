/* Node.jsで類似語を取得する関数 */

// Node.jsでxml-rpcを実行するモジュール
var xmlrpc = require('xmlrpc')

// Promiseを返す
function getSimilarWordByHatena( keywordlist ) {
    return new Promise( resolve => {
        // Creates an XML-RPC client. Passes the host information on where to
        // make the XML-RPC calls.
        // はてなキーワード連想語API
        var client = xmlrpc.createClient({ host: 'd.hatena.ne.jp', port: 80, path: '/xmlrpc'});
        
        // Sends a method call to the XML-RPC server
        client.methodCall('hatena.getSimilarWord', keywordlist, function (error, value) {
            if (error) {
                console.log('error:', error);
                console.log('req headers:', error.req && error.req._header);
                console.log('res code:', error.res && error.res.statusCode);
                console.log('res body:', error.body);
            } else {
                console.log('value:', value);
                resolve( value );
            } 
        });
    })
}

// await指定された関数の実行が終わるまでreturnするのを待つ
exports.searchSimilarWord = async function ( keywordlist ) {
    const result = await getSimilarWordByHatena( keywordlist );
    
    // 配列で返す
    var similarWords = [];
    for( let similarWord of result[ 'wordlist' ] ) {
        similarWords.push( similarWord[ 'word' ] );
    }
    
    return similarWords;
}
