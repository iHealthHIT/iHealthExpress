var mysql=require("mysql");

function query(sql,callback) {
    var db=mysql.createConnection({
        host: "127.0.0.1",
        port: "3306",
        user: "root",
        password: "qiuying1219",
        database: "iwatch",
        charset: "UTF8_GENERAL_CI"
    });
    db.query(sql, function (err, rows) {
            callback(err, rows);
    });
    db.end();
}

exports.query = query;


