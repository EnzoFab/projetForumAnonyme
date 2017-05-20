$(document).ready(function () {

    $(".help.icon#information").popup({
        on:'click'
    });


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
            for(i=0;i< data.length; i++)
                $("#category").append("<option value="+data[i].nameCat +">"+data[i].nameCat+"</option>");

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

    $('.ui.sticky')
        .sticky({
            context: '#example2',
            pushing: true
        })
    ;



    // message on the home page

    $('.ui.dropdown') // drop down menu on the modal
        .dropdown();
    
    $("#buttonCreate").click(function () {
        $('.ui.modal#createTopic')
            .modal({
                inverted: true,

                onApprove:function () {

                    console.log($('#catergory').val());
                    // need to change the value

                    // if one input isn't filled
                    if($('input[name="color"]').val() == '' ||
                        $('#category').val()== '' ||
                        $('input[name="topicName"]').val() == ''){
                        message = $('#topicMessage');
                        message.fadeIn(); // display the message
                        message.transition('shake')
                        return false; // 0 nickname
                    }else {
                        $.post(
                            "/topic/create",
                            {
                                color : $('input[name="color"]').val(),
                                topicName :  $('input[name="topicName"]').val(),
                                category: $('#category').val()
                            },function (data) {
                                if(data == 'succes'){
                                    setTimeout(function () {
                                        window.location = $('input[name="topicName"]').val();
                                    },1500)
                                }
                            },'text'
                        );
                    }
                }
            })
            .modal('show');
    });


    function connexionModal() {
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




    function displayModal() {
        $('.ui.basic.test.modal#createAccont')
            .modal({
                inverted: true,
                closable  : false,
                onDeny: function () {
                    // it(s not really deny it just allows us to do 2 actions
                    console.log($('#nickname').val());
                    if($('#nickName').val() ==''||
                        $('#password').val() =='') {
                        message = $('#message');
                        message.fadeIn(); // display the message
                        message.transition('shake')
                        return false; // 0 nickname
                    }else {
                        $.post(
                            "/login",{
                                nickname : $('#nickname').val(),
                                password: $('#password').val()
                            },
                            function (data) {
                                console.log(data)
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
                },


                onApprove : function() {
                    if($('#nickname').val() == ''||
                        $('#password').val() ==''){
                        message = $('#message');
                        message.fadeIn(); // display the message
                        message.transition('shake')
                        return false; // 0 nickname
                    }
                    else {
                        $.post(
                            "/signIn",{
                                nickname : $('#nickname').val(),
                                password: $('#password').val()
                            },
                            function (data) {
                                console.log(data)
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
            .modal('show'); // show the modal
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

    $('.ui.search').search({ apiSettings: { url: '/autocomplete' } });

});