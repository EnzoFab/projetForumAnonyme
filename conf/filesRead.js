/**
 * Created by ENZO on 17/05/2017.
 */
var fs = require('fs');


fs.readdir('public/images/avatar/', function (err,files) {
    if (err) {
        return console.log(err);
    }else {
        var avatar = [];

        files.forEach( function (file) {
            avatar.push(file);
            module.exports.AVATAR_LIST = avatar;

        })
    }
    //console.log(data);

});


fs.readFile('public/ressources/bannedName.txt','utf8',function (err,data) {
    if(err)
        console.log(err);
    else{
        var name =data.split(/[\r\n]+/g)
        module.exports.BANNED_NAME = name;
    }
});

fs.readFile('public/ressources/bannedWord.txt','utf8',function (err,data) {
    if(err)
        console.log(err);
    else{
        var word = data.split(/[\r\n]+/g);
        module.exports.BANNED_WORD = word;
    }
});


