var team = {
    "async": true,
    "crossDomain": true,
    "url": "https://free-nba.p.rapidapi.com/teams?page=0",
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "free-nba.p.rapidapi.com",
        "x-rapidapi-key": "b66eb3153bmsh1d00af693516ac2p106275jsn0b6d5b9e5b20"
    }
}

var players = {
    "async": true,
    "crossDomain": true,
    "url": "https://free-nba.p.rapidapi.com/players",
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "free-nba.p.rapidapi.com",
        "x-rapidapi-key": "b66eb3153bmsh1d00af693516ac2p106275jsn0b6d5b9e5b20"
    }
}

function dataPlayers(cb){
    $.ajax(players).done(response => {
        $('#pagination-demo').twbsPagination({
            totalPages: response.meta.total_pages,
            visiblePages: 6,
            next: 'Next',
            prev: 'Prev',
            onPageClick: function (event, page) {
                //fetch content and render here
                    cb({page})
                }
            });
        
        $(".total-pages").text(response.meta.total_pages)
    });
}

dataPlayers(function(newData){
    $.ajax({
        async : true,
        url : 'https://free-nba.p.rapidapi.com/players',
        data: { page: newData.page, per_page: 25 },
        method: 'GET',
        beforeSend: function(){
            $("#loading").show();
            $('.thumbs').hide();
        },
        complete: function(){
            $("#loading").hide();
            $('.thumbs').show();
        },
        headers: {
            "x-rapidapi-host": "free-nba.p.rapidapi.com",
            "x-rapidapi-key": "b66eb3153bmsh1d00af693516ac2p106275jsn0b6d5b9e5b20"
        },
        success: (response => {
            var fname = response.data;
            fname.sort((a,b) => (a.first_name > b.first_name) ? 1 : ((b.first_name > a.first_name) ? -1 : 0));
            var li;
            $("#list").html('');
            var i;
            // let kosong = [];
            for (i=0; i<response.data.length; i++) {
                let fn = response.data[i].first_name;
                let ln = response.data[i].last_name;
                let pos = response.data[i].position;
                let full_name = fn + " " + ln;
                let team_name = response.data[i].team.full_name;
                
                li = $('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 card border-light">');
                li.append(`
                    <div class="card-body text-center">
                        <p>${full_name}</p> 
                        <b>${team_name}</b><br>
                        <small>${pos}</small>
                    </div>
                `)
                $("#list").append(li)
            }
            
        }),
        error:(response => {
            $("#loading").text('Data kosong')
        })
    }) 
})

function findPlayer() {
    var value = $("#search").val();
    let page;
    $.ajax({
        url: 'https://free-nba.p.rapidapi.com/players',
        async: true,
        data: {search: value},
        beforeSend: function(){
            $("#loading").show();
            $('.thumbs').hide();
        },
        complete: function(){
            $("#loading").hide();
            $('.thumbs').show();
            $('.total-pages').hide();
        },
        method: 'GET',
        headers: {
            "x-rapidapi-host": "free-nba.p.rapidapi.com",
            "x-rapidapi-key": "b66eb3153bmsh1d00af693516ac2p106275jsn0b6d5b9e5b20"
        },
        success: (response => {
            $(".pagination").hide();
            $(".list").hide();

            page = response.meta.total_pages;

            // pagination
            // $('.newPagination-demo').twbsPagination({
            // totalPages: response.meta.total_pages,
            // visiblePages: 6,
            // next: 'Next',
            // prev: 'Prev',
            // onPageClick: function (event, page) {
            //     //fetch content and render here
            //         // cb({page})
            //         console.log('still develop for next page')
            //     }
            // });
            
            // $(".total").append('<p>Ini ya: '+ page +'')
            var fname = response.data;
            fname.sort((a,b) => (a.first_name > b.first_name) ? 1 : ((b.first_name > a.first_name) ? -1 : 0));
            var newList;
            $("#newList").html('');
            if( response.data.length < 1 ) {
                $("#newList").append('<div>Data Tidak ditemukan</div>')
            } else {
                for (i=0 ; i<response.data.length ; i++) {
                    let fn = response.data[i].first_name;
                    let ln = response.data[i].last_name;
                    let pos = response.data[i].position;
                    let full_name = fn + " " + ln;
                    let team_name = response.data[i].team.full_name;
                    newList = $('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 card border-light">');
                    newList.append(`
                        <div class="card-body text-center">
                            <p>${full_name}</p> 
                            <b>${team_name}</b><br>
                            <small>${pos}</small>
                        </div>
                    `);
                    $("#newList").append(newList)
                }
            }

        }),
        error: (response=>{
            $("#newList").append('<li>Server Error</li>')
        })
    });
}

$("#search").keyup(function() {
    var x = $('.btn-search');
    if($(this).val() == "" || $(this).val().length < 4 ) {
        x.css('visibility','hidden')
    } else {
        x.css('visibility','visible')
    }
});

$(".backHome").click(function(){
    location.reload();
})