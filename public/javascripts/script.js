$(document).ready(function () {


    //socket.emit('connection', "hum");

   if(window.location.href.includes("/topic/")){ // check the url of the page to see we are on a topic page

        topicName = window.location.href.split("/topic")[1]; // get the topicName

       var socket =io(topicName,{'force new connection': true}); // room
       console.log(socket);
       socket.on('connected',function () {
           console.log('connected to the room' +topicName );
       });

        socket.on('new_user',function (message) {
            console.log("nouveau client");
        });


        socket.on('message_received', function (data) {
            console.log("message received");
            appendNewMessage(data,false);
        });




    }


    function appendNewMessage(message, bool){ // append a new message to the grid
        // if true it's my message otherwise the message from another user
        if(bool){ // it's me
            $('.grid').append('<div class="row"><div class="column"></div>' +
                '<div class="column">  <div class="ui segment card inverted red" id="'+ message.id+'" >' +
                '<div class="content">' +
                '<div class="meta left floated deleteMessage"><a href="#"><i class="close icon black"></i><span>delete</span></a></div>' +
                '<div class="ui divider hidden"></div><div class="meta right floated">' +
                '<a class="author ui label red image author" href="/user/' +message.nickname +'"><img src="/images/avatar/'+ message.avatar+
                '"/><div class="detail">'
                + message.nickname+
                '</div> </a></div><div class="description">'+message.text + '</div> <div class="meta left floated">' +
                '<span class="date">' +message.date + '</span>'+
                '</div> ' +
                '</div></div>  </div> </div>');
        }else{
            $('.grid').append('<div class="row">' +
                '<div class="column">  <div class="ui card segment inverted red"><div class="content"><div class="meta right floated">' +
                '<a class="author ui label red image author" href="/user/' +message.nickname +'"><img src="/images/avatar/'+ message.avatar+
                '"/><div class="detail">'
                + message.nickname+
                '</div> </a></div><div class="description">'+message.text + '</div> <div class="meta left floated">' +
                '<span class="date">' +message.date + '</span>'+
                '</div>' +
                '</div></div>  </div> <div class="column"></div></div>');
        }

    }

    $('#sendMessage').click(function (e) {
        e.preventDefault();

        if(!$(this).parent().find('input[type="text"]').val() ==''){
            $.post(
                '/user/sendMessage',
                {
                    text:$(this).parent().find('input[type="text"]').val(),
                    topic: $('#topicName').text()
                },
                function (data) {
                    message = {
                        id: data.id,
                        nickname :data.name,
                        text: data.text,
                        avatar : data.avatar,
                        date : new Date().toLocaleDateString('fr-FR')
                    };
                    appendNewMessage(message,true);
                    console.log($(this).parent().find('input[type="text"]').val());
                    socket.emit('new_message', message);
                },'json');
        }




    });




     setInterval(function () { // call the function every 500ms
         $('.deleteMessage').each(function () { // on each element of the class
             $(this).on('click', function (e) {
                 e.preventDefault();
                 $.post(
                     '/user/deleteMessage',
                     {
                         id: $(this).parent().parent().attr('id')
                     },function (data) {

                         if(data == 'success'){
                            window.location.reload();
                         }
                     },'text');

                 return false;
             });
         });
     },500);


    $('#searchButton').click(function (e) {
        e.preventDefault();

        if(  $('#searchInput').val() !=''){
            var searchUrl ='/search/'+$('#select').val() + "/"+$('#searchInput').val();
            window.location
        }
    });

    $(".help.icon#information").popup({
        on:'click'
    });

    function upFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    function get(url,callback, resultForm) {
        $.get(url, callback, resultForm);
    } // get methode with callback



    get("/category/allCategories",
        function (data) {
            console.log(JSON.stringify(data));
            console.log(data.length);
            for(i=0;i< data.length; i++){
                $("#category").append("<option value="+data[i].namecat +">"+data[i].namecat+"</option>");
                $("#categoryMenu").append("<a class='item' href='/category/" + data[i].namecat + "'>"
                    + data[i].namecat + "</a>");
            }



        },'json'); // load all Categories

    get('/checkCookie',function (data) {
            console.log(data);
            if(data == 'true'){ // if there isn't a cookie data = true and we display the modal
               displayModal();
            }
    },'text');



    $('.message .close')
        .on('click', function() {
            $(this)
                .closest('.message')
                .transition('fade')
            ;
        });


    $('.main.menu').visibility({
        type: 'fixed'
    });

   $(".sticky").visibility({
        type:'fixed'
    })


   $("#showSideBar").click(function () {
       $('.ui.sidebar')
           .sidebar('toggle')
   });

    $('.ui.accordion')
        .accordion()
    ;

    $('.overlay.overlay').visibility({
        type :'fixed',
        offset: 100
    });

    $('.ui.dropdown') // drop down menu on the modal
        .dropdown();
    
    $("#buttonCreate").click(function () {
        $('.ui.modal#createTopic')
            .modal({
                inverted: true,

                onApprove:function () {

                    console.log($('#category').val());
                    // need to change the value

                    // if one input isn't filled
                    if($('input[name="color"]').val() == '' ||
                        $('#category').val()== '' ||
                        $('input[name="topicName"]').val() == ''){
                        message = $('#topicMessage');
                        message.html("Please fill all champs")
                        message.fadeIn(); // display the message
                        message.transition('shake');
                        return false; // 0 nickname

                    }else if( $('input[name="topicName"]').val().includes('/') ||$('input[name="topicName"]').val().includes('\\') ||
                        $('input[name="topicName"]').val().includes('\n') || $('input[name="topicName"]').val().includes('\0')
                        || $('input[name="topicName"]').val().includes('<') ||$('input[name="topicName"]').val().includes('>'))
                    {

                            message = $('#topicMessage');
                            message.html("Invalid title, it might include special caracter");
                            message.fadeIn(); // display the message
                            message.transition('shake');
                            return false;
                    }else if($('input[name="topicName"]').val().length > 40){
                        message = $('#topicMessage');
                        message.html("Choose a shorter title ");
                        message.fadeIn(); // display the message
                        message.transition('shake');
                        return false;
                    }
                    else {
                        topic = $('input[name="topicName"]').val().trim().replace(/\//g, '_').replace(/ /, '_').replace(/&/g,'_');
                        $.post(
                            "/topic/create",
                            {
                                color : $('input[name="color"]').val(),
                                topicName :  topic,
                                    // trim() in order to remove beginning et trailling space
                                category: $('#category').val()
                            },
                            function (data) {
                                console.log(data);
                                if(data == 'success'){
                                    $("#topicMessage").fadeOut(function () {
                                        $("#succesTopic").html("Topic created");
                                        $("#succesTopic").fadeIn();
                                        setTimeout(function () {
                                            window.location = "/topic/"+topic;
                                        },1500);
                                    });

                                    return true;
                                }else{
                                    $("#topicMessage").html(data);
                                    $("#topicMessage").fadeIn(); // display the message
                                    $("#topicMessage").transition('shake');
                                    return false; // the modal doesn't disappear
                                }
                            },'text'
                        );
                        return false;
                    }
                }
            })
            .modal('show');
    });






    function displayModal() {
        $('.ui.basic.test.modal#createAccont')
            .modal({
                inverted: true,
                closable  : false,
                onDeny: function () {
                    // it(s not really deny it just allows us to do 2 actions

                    if($('#loginNickname').val() ==''||
                        $('#loginPassword').val() =='') {
                        message = $('#errorLoginLessage');
                        message.fadeIn(); // display the message
                        message.transition('shake')
                        return false; // 0 nickname
                    }else {
                        $.post( //  try to login
                            "/user/login",{
                                nickname : upFirstLetter($('#loginNickname').val()),
                                password: $('#loginPassword').val()
                            },
                            function (data) {
                                console.log(data)
                                if(data ="success"){
                                    location.reload();
                                    return true;
                                }

                                else{
                                    $('#errorLoginLessage').html(data);
                                    // do somthing on the page
                                    return false;
                                }
                                return false;
                            },'text'
                        );
                    }
                },


                onApprove : function() {
                    console.log($('#nickname').val())
                    if($('#nickname').val() == ''||
                        $('#password').val() =='' ||
                        $('#avatar').val() == ''){
                        message = $('#message');
                        message.append('Please choose a nickname and an avatar also fill the password champ');
                        message.fadeIn(); // display the message
                        message.transition('shake')
                        return false; // 0 nickname
                    }
                    else {
                        $.post(
                            "/user/signIn",{
                                nickname : upFirstLetter($('#nickname').val()),
                                password: $('#password').val(),
                                avatar: $('#avatar').val()
                            },
                            function (data) {
                                console.log(data)
                                if(data ="success"){
                                    location.reload();
                                    return true;
                                }

                                else{
                                    $('#message').html(data);
                                    // do somthing on the page
                                    return false;
                                }
                                return false;
                            },'text'
                        );
                    }

                }
            })
            .modal('show'); // show the modal

        get("/user/registredUser", function (data) {
            if(data == 'error'){
                console.log("error");
            }else{
                for(i=0;i< data.length; i++){
                    $("#loginMenu")
                        .append("<div class='item' value="+JSON.stringify(data[i].name)+">"+data[i].name+"</div>");

                }

            }
        },'json');

        get('/user/nickNames',function (data) {
            if(data == 'error'){
                console.log("error");
            }else{
                for(i=0;i< data.length; i++){
                    $("#signInMenu")
                        .append("<div class='item' value="+JSON.stringify(data[i].nickname)+">"+data[i].nickname+"</div>");
                    // add to the menu
                }

            }


        },'json');





    }




    $('#updatePassword').click(function () {
        $("#failMessage").hide();
        $("#successMessage").hide();
        if($('#oldPass').val() =='' || $('#newPass').val() == ''){
            $("#failMessage").html('Fill both champs');
            $("#failMessage").fadeIn();
        }else {
            $.post(
                '/user/updatePassword',
                {
                   old :$('#oldPass').val(),
                    new: $('#newPass').val()
                },function (data) {
                    if(data =='success'){
                        $("#successMessage").html('Password Updated with success');
                        $("#successMessage").fadeIn();
                    }else {
                        $("#failMessage").html(data);
                        $("#failMessage").fadeIn();
                    }
                },'text');
        }
    });


    $('#updateAvatar').click(function () {
        $("#failMessage").hide();
        $("#successMessage").hide();
        if($('#newAvatar').val() == ''){
            $("#failMessage").html('Choose an avatar');
            $("#failMessage").fadeIn();
        }else {
            $.post(
                '/user/updateAvatar',
                {
                    avatar: $('#newAvatar').val()
                },function (data) {
                    if(data == 'success'){
                        $("#successMessage").html('Avatar successfully updated ');
                        $("#successMessage").fadeIn();
                        $('#avatarImg').attr('src',"/images/avatar/"+$('#newAvatar').val());

                    }else{
                        $("#failMessage").html(data);
                        $("#failMessage").fadeIn();
                    }
                },'text');

        }
    });




 

});