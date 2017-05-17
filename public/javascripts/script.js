$(document).ready(function () {
    // check in the pseudo list if the one chosen is available
    $('#start').click(function (e) {
        e.preventDefault();
        $.post(
            "/newUser",
            {
                pseudo :$('#pseudo').val()
            },function (data) {
                switch (data){
                    case 'succes':
                        window.location =$('#start').attr('href');
                        break;
                    case 'cookieExist':
                        window.location =  '/home';
                        break;
                    case 'pseudo Forgiven':
                        // affiche un message sur la page
                        break;
                }

            },'text'
        );
    });

    $('.ui.dropdown') // drop down menu on the modal
        .dropdown()
    ;

    $('.ui.basic.test.modal')
        .modal({
            closable  : false,
            onApprove : function() {
                console.log($('input[name="user"]').val());
                $.post(
                    "/newUser",{
                        nickname : $('input[name="user"]').val()
                    },
                    function (data) {
                        if(data ="success"){
                            console.log(getCookie('MyCookie'));
                            return true;
                        }

                        else{
                            // do somthing on the page
                            return false;
                        }
                    },'text'
                );
            }
        })
        .modal('show')
    ;

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