var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');
const pool = require('./query'); // make queries

/* GET users listing. */
router.get('/', function(req, res, next) {
    // display all topics
    pool.pgQuery(
        'SELECT T.name, T.color, T.creator, T.creationDate, T.category, Count(M.idmessage) as nbmessage FROM public.topic T Left Join public.message M on T.name = M.topic Group by T.name, T.color, T.creator, T.creationDate, T.category Order by Count(M.idmessage) Desc',
        function (err,resultat) {
            if(err){
                message = "An error has occured "+err ;
                res.render('error', {title:'Free2talk',errorMessage: message} );

            } else{
                res.render('topics/allTopics',
                    {title:'Free2talk', allTopics : resultat.rows, size:resultat.rows.length});
                // send the length of the array resultat.rows in order to organize our layout
            }
        });


});





router.post('/create',function (req, res, next) {
    if(req.cookies.UserCookie === undefined)
        res.send('not connected');
    else{
        // first query
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
                      // last one
                      pool.pgQuery('INSERT INTO topic VALUES($1,$2,$3,$4,$5)',
                          [req.body.topicName, req.body.color, req.cookies.UserCookie,
                              new Date().toLocaleDateString("fr-FR"), req.body.category],
                          function (err, r3) {
                              if (err) res.send(err);
                              else res.send('success');
                          });
                  }
              });
          }
      });

    }

});



router.get('/:n',function (req, res, next) {
    console.log(req.params.n);
    pool.pgQuery('SELECT COUNT(*) as nb FROM public.topic Where name=$1',[req.params.n],
        function (err, resultat) {
            if(err)res.send(err);
            else if(resultat.rows[0].nb ==0 ){
                message = "The topic "+ req.params.n+ " doesn't exist or has been removed";
                res.render('error', {errorMessage: message} );
            }else {
                pool.pgQuery("SELECT * FROM public.topic WHERE name=$1",[req.params.n],function (e, r) {
                    if(e){
                        message = "An error has occured ";
                        res.render('error', {errorMessage: message} );
                    }
                    else{
                        var dataT = r.rows[0]; // all data about the topic
                        pool.pgQuery('SELECT * FROM public.message WHERE topic=$1',
                            [req.params.n],function (error,rslt) {
                                if(error){
                                    message = "An error has occured ";
                                    res.render('error', {errorMessage: message} );
                                }else{

                                    topicRoom = '/'+req.params.n;
                                    serverSock =  res.socket.sockets;

                                    serverSock.on('connection',function (socket) {

                                        socket.on('room', function(room) {
                                            console.log("New Room "+room);
                                            socket.join(room); // choose the room
                                        });
                                    });// connection

                                    serverSock.in(topicRoom).emit('new_user', 'test');
                                    serverSock.in(topicRoom).on('message_sent',function (message) {
                                        var data ={
                                            nickname: '',
                                            text: 'One text'
                                        };
                                        serverSock.in(topicRoom).emit('message_received',data);
                                    });

                                    res.render('topics/topic',
                                        {title:'Free2talk', topicData:dataT,
                                            allMessages : rslt.rows,
                                            currentUser: req.cookies.UserCookie }); // display the page
                                }
                            });

                    }
                });

            }
        });

});


module.exports = router;
