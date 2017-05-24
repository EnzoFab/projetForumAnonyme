/**
 * Created by ENZO on 17/05/2017.
 */
var fs = require('fs');


fs.readdir('public/images/avatar/', function (err,files) {
    if (err) {
        return console.log(err);
    }else {
        avatar = [];

        files.forEach( function (file) {
            avatar.push(file);
            module.exports.AVATAR_LIST = avatar;
            console.log("image  " +file);
        })
    }
    //console.log(data);



});


