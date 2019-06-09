<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Interactive map</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
        <script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.7/jquery.validate.min.js"></script>
        <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?v=3&sensor=true"></script>
        <script type="text/javascript" src="{{ URL::asset('js/add_users.js') }}"></script>
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link rel="stylesheet" href="{{ URL::asset('css/add_users.css') }}" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    <body>
        <header>
            <div class="header"> 
                <div class="center-it">
                    <h1>Interactive map</h1> 

                    <ul class="navigation"> 
                        <li><a href="/">Home page</a></li> 
                        <li><a href ="{{ url('map')}}">The map</a></li> 
                    </ul> 
                </div>
            </div>
        </header>

        <main>
            <div class="main-content">
                <div class='flex-container-max'>
                    <div class='table-con'>
                        <table class="user-table" > 
                            <thead>
                                <tr>

                                    <td>Name</td>
                                    <td >Surrname</td>
                                    <td >Phone</td>
                                    <td >City</td>
                                    <td >Street</td>
                                    <td >Description</td>
                                    <td >Lat Lng</td>
                                    <td >Select</td>
                                </tr>
                            <tbody>
                                @foreach($users as $key => $data)
                                <tr>    
                                    <th>{{$data->name}}</th>
                                    <th>{{$data->surrname}}</th>
                                    <th>{{$data->phone}}</th>
                                    <th>{{$data->city}}</th>
                                    <th>{{$data->street}}</th>
                                    <th>{{$data->desc}}</th>
                                    <th>{{$data->latitude}} {{$data->longitude}}</th>  
                                    <td><input data-id ="{{$data->id}}" data-key ="{{$key}}" type="checkbox" name="record" value="{{ csrf_token() }}" /></td>
                                </tr>
                                @endforeach
                                @if($users->isEmpty())
                                We have no data yet
                                @endif
                        </table>
                    </div>


                    <div class = "flex-options">
                        <div class="add-form" title="Add row">
                            <i class="fas fa-plus"></i>Add row
                        </div>
                        <div class="delete-row" title="Delete row">
                            <i class="fas fa-minus"></i>Delete row
                        </div>
                        <div class="edit" title="Edit only one row">
                            <i class="fas fa-edit"></i>Edit
                        </div>
                    </div>
                </div>

                <form  method="post" id="user" action="{{ URL::to('/addUser') }}" accept-charset="UTF-8"> 
                    {{ csrf_field() }}
                    <div id='form'>
                    </div>
                </form>
                <div class="cim-container">
                    <div class='map-container middle'>
                        <div class="cim-map">
                            <div id="map-canvas"></div>
                            <div class="clear"></div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
        <script>
$html = "<div class='inputs'>";
$html += "<div class='flex-container flex-down'>";
$html += "<div><input type='text' name='name' placeholder='Name'></div>"
        $html += "<div><input type='text' name='surrname' placeholder='Surrname'></div>"
        $html += "<div><input type='text' name='phone' placeholder='Phone'></div>"
        $html += "<div><input type='text' name='city' placeholder='City'></div>"
        $html += "<div><input type='text' name='street' placeholder='Street'></div>"
        $html += "<div><input type='text' name='desc' placeholder='Description'></div>"
        $html += "<div><input type='text' name='lat' placeholder='Latigute'></div>"
        $html += "<div><input type='text' name='lng' placeholder='Length'></div>"
        $html += "</div>";
$html += "<div>";
$html += "<button class='btn'>SAVE</button>"


        $html += "<span>Click on the map to get latitude nad longitude </span> </div>";
$htmlEdit = "<div class='inputs'>";
$htmlEdit += "<div class='flex-container flex-down'>";
$htmlEdit += "<div><input type='text' name='name' placeholder='Name' val={}></div>"
        $htmlEdit += "<div><input type='text' name='surrname' placeholder='Surrname'></div>"
        $htmlEdit += "<div><input type='text' name='phone' placeholder='Phone'></div>"
        $htmlEdit += "<div><input type='text' name='city' placeholder='City'></div>"
        $htmlEdit += "<div><input type='text' name='street' placeholder='Street'></div>"
        $htmlEdit += "<div><input type='text' name='desc' placeholder='Description'></div>"
        $htmlEdit += "<div><input type='text' name='lat' placeholder='Latigute'></div>"
        $htmlEdit += "<div><input type='text' name='lng' placeholder='Length'></div>"
        $htmlEdit += "<div><input type='hidden' name='id' ></div>"
        $htmlEdit += "</div>";
$htmlEdit += "<div>";
$htmlEdit += "<button class='btn'>UPDATE</button>"
        $htmlEdit += "<span>Click on the map to get latitude nad longitude </span> </div>";
$('.cim-map').add_users({
lang: {
latitude: '52.274989',
        longitude: '19.289849',
        zoom: 6,
        users:{!! $users !!}
},
        ajax:
{
deleteRow: "{{ url('/delete') }}"
}
}
);
        </script>

        <script>
            $(document).ready(function () {
            $("#user").validate({
            rules: {
            "name": {
            required: true,
                    minlength: 2
            },
                    "surrname": {
                    required: true,
                            minlength: 3
                    },
                    "phone": {
                    required: true,
                           minlength: 9,
                           number: true
                    },
                    "desc": {
                    required: true,
                    },
                    "city": {
                    required: true,
                    },
                    "street": {
                    required: true,
                    },
                    "lat": {
                    required: true,
                            number: true
                    },
                    "lng": {
                    required: true,
                            number: true
                    }
            },
                    messages: {
                    "name": {
                    required: "Please, enter a name"
                    },
                            "surrname": {
                            required: "Please, enter a surrname",
                            },
                            'phone': {
                            required: "Please, enter a phone number",
                            },
                            'desc': {
                            required: "Please, enter a description",
                            }
                    },
//        submitHandler: function (form) { // for demo
//            alert('valid form submitted'); // for demo
//            return false; // for demo
//        }
            });
            });
        </script>

    </body>
</html>


