$(document).ready(function () {


    //socket.emit('connection', "hum");

   /* if(window.location.href.includes("/topic/")){ // check the url of the page to see we are on a topic page
        var socket =io.connect(); // room
        topicName = window.location.href.split("/topic")[1]; // get the topicName
        socket.on('connect', function() {
            // Connected, let's sign-up for to receive messages for this room
            socket.emit('room', topicName);
        });

        socket.on('new_user',function (message) {
            console.log("nouveau client");
        });

        socket.on('message_received', function (data) {
            $('.grid').append(); // add the message
        });

        console.log(topicName);
        console.log(window.location.href);


    } */


    function appendNewMessage(message, bool){ // append a new message to the grid
        // if true it's my message otherwise the message from another user
        if(bool){ // it's me
            $('.grid').append('<div class="row"><div class="column"></div> <div class="column"></div>' +
                '<div class="column">  <div class="ui card yellow"><div class="content"><div class="meta right floated">' +
                '<a class="author" href="/user/' +message.nickname +'">' + message.nickname+
                '</a></div><div class="description">'+message.text + '</div> <div class="meta left floated">' +
                '<span class="date">' +message.date + '</span>'+
                '</div> ::after' +
                '</div>::after</div>  </div> </div>');
        }else{

        }

    }

    $('#sendMessage').click(function (e) {
        e.preventDefault();
        console.log($(this).parent().find('input[type="text"]').val() ) ;
        console.log(new Date().toLocaleDateString('en-GB'));
    });








    $(".help.icon#information").popup({
        on:'click'
    });

    function upFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    function get(url,callback, resultForm) {
        $.get(
            url,
            callback,
            resultForm
        );
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
                    }else {
                        $.post(
                            "/topic/create",
                            {
                                color : $('input[name="color"]').val(),
                                topicName :  $('input[name="topicName"]').val().trim().replace('/', '-'),
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
                                            window.location = "/topic/"+$('input[name="topicName"]').val();
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
                        $('#password').val() ==''){
                        message = $('#message');
                        message.fadeIn(); // display the message
                        message.transition('shake')
                        return false; // 0 nickname
                    }
                    else {
                        console.log($('#nickname').val());
                        $.post(
                            "/user/signIn",{
                                nickname : upFirstLetter($('#nickname').val()),
                                password: $('#password').val()
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









   /* $('.ui.search').search({
        apiSettings: {
            url: '/autocomplete',
            minCharacters : 1,
            onResponse: function(results) {
                var response = {
                    results : []
                };
                $.each(results, function(index, item) {
                    response.results.push({
                        title       : item.name,
                        description : item
                        //url       : item.html_url
                    });
                });
                return response;
            },
        },
    });*/

    // Define API endpoints once globally
    /*$.fn.api.settings.api = {
        'search' : '/autocomplete'
    };
    $('.ui.search')
        .api({
            debug: true,
            action: 'search',
            url: '/autocomplete',
            searchFullText: false,
            stateContext: '.ui.input'
        })
    ;*/

    /*$('.ui.search')
        .search({
            type          : 'category',
            minCharacters : 3,
            apiSettings   : {
                url        : '/autocomplete',
                onResponse : function(githubResponse) {
                    var
                        response = {
                            results : {}
                        }
                    ;
                    console.log(githubResponse[0])
                    if(!githubResponse || !githubResponse.items) {
                        return;
                    }
                    // translate GitHub API response to work with search
                    $.each(githubResponse.items, function(index, item) {
                        var
                            language   = item.language || 'Unknown',
                            maxResults = 8
                        ;
                        if(index >= maxResults) {
                            return false;
                        }
                        // create new language category
                        if(response.results[language] === undefined) {
                            response.results[language] = {
                                name    : language,
                                results : []
                            };
                        }
                        // add result to category
                        response.results[language].results.push({
                            title       : item.name,
                            description : item.description,
                            url         : item.html_url
                        });
                    });
                    return response;
                }
            }
        });*/


    /* function connexionModal() {
     $("ui.modal.inverted.segment.yellow#loginModal")
     .modal({
     inverted: true,
     closable  : false,

     onApprove : function() {
     if($('#loginNickname').val() == ''||
     $('#loginPassword').val()){
     message = $('#errorConnection');
     message.fadeIn(); // display the message
     message.transition('shake')
     return false; // 0 nickname
     }
     else {
     $.post(
     "/newUser",{
     nickname : $('#loginNickname').val(),
     password: $('#loginPassword').val()
     },
     function (data) {
     if(data ="success"){

     return true;
     }

     else{
     // do somthing on the page
     return false;
     }
     },'text'
     );
     }

     }
     })
     .modal('show');
     }
*/

     $('.ui.search').search({ apiSettings: { url: '/autocomplete' } });

});