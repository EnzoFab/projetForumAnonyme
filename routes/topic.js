var express = require('express');
var router = express.Router();
var fs = require('../conf/filesRead');
const pool = require('../conf/query'); // make queries
var wordfilter = require('wordfilter');



/* GET users listing. */
router.get('/', function(req, res, next) {
    // display all topics
    pool.pgQuery(
        'SELECT T.name, T.color, T.creator, T.creationDate, T.category, U.avatar, Count(M.idmessage) as nbmessage FROM public.topic T inner join public.user U on T.creator = U.name  Left Join public.message M on T.name = M.topic Group by T.name, T.color, T.creator, T.creationDate, T.category, U.avatar Order by Count(M.idmessage) Desc',
        function (err,resultat) {
            if(err){
                message = "An error has occured "+err ;
                res.render('error', {title:'Free2talk',errorMessage: message, avatars :fs.AVATAR_LIST } );

            } else{
                res.render('topics/allTopics',
                    {title:'Free2talk', allTopics : resultat.rows, size:resultat.rows.length, avatars :fs.AVATAR_LIST });
                // send the length of the array resultat.rows in order to organize our layout
            }
        });


});





router.post('/create',function (req, res, next) {
    if(req.cookies.UserCookie === undefined)
        res.send('not connected');
    else{

        pool.pgQuery('SELECT name, count(*) as nb From public.user WHERE token = $1 Group by name',[req.cookies.UserCookie],
            function (err,rslt) {
            if(err)
                res.send('Error');
            else if(rslt.rows[0].name ==0){
                res.send('not connected');
            }else{
                var name = rslt.rows[0].name;
                pool.pgQuery("SELECT COUNT(*) as nb FROM public.topic Where creator =$1 ",[req.cookies.UserCookie] ,function (err, resultat) {
                    if(err) res.send(err);
                    else if (resultat.rows[0].nb > 4){
                        res.send("You have already create 5 or more topics");
                    }else{
                        // seconde query
                        pool.pgQuery("SELECT COUNT(*) as nb FROM public.topic Where name =$1",[req.body.topicName],
                            function (error,result) {
                                if(error) res.send(error);
                                else if(result.rows[0].nb == 1){
                                    res.send("Change your topic name, this one already exists");
                                }else {

                                    wordfilter.addWords(fs.BANNED_NAME);
                                    wordfilter.addWords(fs.BANNED_WORD);
                                    if(wordfilter.blacklisted(req.body.topicName.toLowerCase())){
                                        res.send("Your title contains inappropriate words");
                                    }else{
                                        // last one
                                        pool.pgQuery('INSERT INTO topic VALUES($1,$2,$3,$4,$5)',
                                            [req.body.topicName, req.body.color, name,
                                                new Date().toLocaleDateString("fr-FR"), req.body.category],
                                            function (err, r3) {
                                                if (err) res.send(err);
                                                else res.send('success');
                                            });
                                    }

                                }
                            });
                    }
                });
            }

        });
        // first query

    }

});



router.get('/:n',function (req, res, next) {


    pool.pgQuery('SELECT COUNT(*) as nb FROM public.topic Where name=$1',[req.params.n],
        function (err, resultat) {
            if(err)res.send(err);
            else if(resultat.rows[0].nb ==0 ){
                message = "The topic "+ req.params.n+ " doesn't exist or has been removed";
                res.render('error', {errorMessage: message, avatars :fs.AVATAR_LIST } );
            }else {
                pool.pgQuery("SELECT * FROM public.topic WHERE name=$1",[req.params.n],function (e, r) {
                    if(e){
                        message = "An error has occured ";
                        res.render('error', {title:'Free2talk',errorMessage: message, avatars :fs.AVATAR_LIST } );
                    }
                    else{
                        var dataT = r.rows[0]; // all data about the topic
                        pool.pgQuery('SELECT * FROM public.message M, public.user U WHERE M.topic=$1 and M.sender = U.name ORDER by idmessage ASC',
                            [req.params.n],function (error,rslt) {
                                if(error){
                                    message = "An error has occured ";
                                    res.render('error', {title:'Free2talk',errorMessage: message, avatars :fs.AVATAR_LIST } );
                                }else{

                                    topicRoom = '/'+req.params.n;

                                    res.socket.of(topicRoom).once('connection',function (socket) {
                                        //in order to fix the issue of multi connect for a single socket

                                        socket.broadcast.emit('new_user','An user comes in');



                                        //socket.broadcast.emit('new_user','An user comes in');
                                        socket.on('disconnect', function () {
                                            socket.removeAllListeners('send message');
                                            socket.removeAllListeners('disconnect');
                                            this.removeAllListeners('connection');
                                        });
                                        
                                        socket.on('new_message', function (data) {
                                            socket.broadcast.emit('message_received',data);
                                        });
                                    });


                                    // check if user is connected
                                    pool.pgQuery('SELECT name, count(*) as nb from public.user WHERE token=$1 Group by name',
                                    [req.cookies.UserCookie], function (error, resultat) {
                                        if(error){
                                            message = "An error has occured ";
                                            res.render('error', {title:'Free2talk',errorMessage: message, avatars :fs.AVATAR_LIST } );
                                        }else if(resultat.rows[0].nb == 0){ // doesn't exist
                                            message = "Your are not connected ";
                                            res.render('error', {title:'Free2talk',errorMessage: message, avatars :fs.AVATAR_LIST } );
                                        }else {
                                            res.render('topics/topic',
                                                {title:'Free2talk', topicData:dataT,
                                                    allMessages : rslt.rows,
                                                    currentUser: resultat.rows[0].name,avatars :fs.AVATAR_LIST  }); // display the page
                                        }

                                    });




                                }
                            });

                    }
                });

            }
        });

});


module.exports = router;
