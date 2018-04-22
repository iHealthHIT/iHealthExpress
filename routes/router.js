var db=require('./database');
var uuid=require('node-uuid');

module.exports=function (app) {
    app.post('/signin',function (req,res) {
        var appleid=req.body.appleid;
        var sqla="select appleid from user where appleid='"+appleid+"'";
        db.query(sqla,function (err,rows) {
            results = JSON.stringify(rows);
            results = JSON.parse(results);
            if (err){
                console.log("something wrong when query sql");
                res.status(400);
                res.send();
            }
            else if (results.length>=1){
                console.log(appleid);
                res.status(400);
                res.send("sorry,The appleid has been used");
            }
            else{
                var sid=uuid.v1();
                sid=sid.substr(0,6);
                var weight=req.body.weight;
                var height=req.body.height;
                var birthday=req.body.birthday;
                var sex=req.body.sex;
                var password=req.body.password;
                var name=req.body.name;
                var sqlb="insert into user(appleid,sid,weight,height,birthday,sex,password,name) values('"+appleid+"','"+sid+"',"+weight+","+height+",'"+birthday+"','"+sex+"','"+password+"','"+name+"')";
                db.query(sqlb,function(err,rows) {
                    if (err){
                        console.log("INSERT ERROR");
                        res.status(400);
                        res.send();
                    }
                    else{
                        console.log("insert success");
                        res.status(200);
                        res.json({"sid":sid});
                        res.send();
                    }
                });
            }
        });
    });
    app.post('/signup',function (req,res) {
        var appleid=req.body.appleid;
        var password=req.body.password;
        var sqla="select appleid from user where appleid='"+appleid+"' and password='"+password+"'";
        db.query(sqla, function (err,rows) {
            results = JSON.stringify(rows);
            results = JSON.parse(results);
            if (err){
                console.log("err,我能怎么办");
            }
            else if (results.length>=1){
                res.status(200);
                console.log("登录成功");
                res.send();
            }
            else{
                res.status(400);
                console.log("登录失败");
                res.send();
            }
        })
    });
    app.post('/rewrite',function (req,res) {
        var appleid=req.body.appleid;
        var name=req.body.name;
        var weight=req.body.weight;
        var height=req.body.height;
        var sqla="update user set name='"+name+"',weight="+weight+",height='"+height+"' where appleid='"+appleid+"'";
        console.log(sqla);
        db.query(sqla,function (err,rows) {
            if (err){
                console.log("rewrite wrong");
            }
        });
        res.status(200);
        res.send();
    });

    app.post('/getinfo',function (req,res) {
        //获取个人信息
        var appleid=req.body.appleid;
        console.log(req.body.appleid);
        var sqla="select name,birthday,height,weight,sex from user where appleid='"+appleid+"'";
        db.query(sqla, function (err,rows) {
            results = JSON.stringify(rows);
            results = JSON.parse(results);
            if (err){
                res.status(400);
                res.send();
            }
            else if(results.length>=1){
                res.status(200);
                res.jsonp(results);
            }
            else{
                res.status(400);
                res.send("not exits");
            }
        })
    });

    app.post('/send',function (req,res) {
        //保存运动数据
        var appleid=req.body.appleid;
        var sendtime=req.body.sendtime;
        var step=req.body.step;
        var heartrate=req.body.heartrate;
        var height=req.body.height;
        var weight=req.body.weight;
        var bodymass=req.body.bodymass;
        var sqla="insert into sportsdata (appleid,step,heartrate,height,weight,bodymass) values("+appleid+","+step+","+heartrate+","+height+","+weight+","+bodymass+")";
        db.query(sqla, function (err,rows) {
            if (err){
                res.status(400);
                res.send();
            }
            else{
                res.status(200);
                res.send("ok");
            }
        })
    });

    app.post('/websignup',function (req,res) {
        var sid=req.body.sid;
        var name=req.body.name;
        var sql="select name,sid from user where (sid='"+sid+"' and name='"+name+"')";
        console.log(sql);
        db.query(sql,function (err,rows) {
            results = JSON.stringify(rows);
            results = JSON.parse(results);
            if(err){
                res.json({"exits":false});
                res.status(400);
                res.send();
            }
            else if(results.length>=1){
                res.json({"exits":true});
                res.send("登录成功");
            }
            else{
                res.json({"exits":false});
                res.send("登录失败");
            }
        });

    });

    app.post('/getdata', function (req, res) {
        var name=req.body.name;
        var step=req.body.step;
        var weight=req.body.weight;
        var height=req.body.height;
        var age=req.body.age;
        var birthday=req.body.birthday;
        var heartrate=req.body.heartrate;
        var sql = "select name,sid,weight,height from user where (sid=" + sid + "and name=" + name + "height="+height+",weight="+weight+")";
        var sqlb="select step,heartrate from sportdata where (step="+step+"and heartrate="+heartrate+")";
        var time1 = new Date().getTime();
        var time2=time1-birthday;
        db.query(sql,sqlb, function (err, rows) {
            if (err) {
                console.log("something wrong when query sql");
                res.status(400);

            }
            else if (rows) {
                var params=new Object();
                var params2=new Object();
                params.name=true;
                params2.time=time2;
                res.send("sorry,The appleid has been used");

            }
            else {
                res.status(400);
                res.send("sorry,The appleid has been used");
            }
            results=JSON.stringify(results);
            results=JSON.parse(results);
            var json={};
            json = eval('('+(JSON.stringify(params)+JSON.stringify(params2)+JSON.stringify(results)).replace(/}{/,',')+')');
            res.status(json);
        });
    });
};