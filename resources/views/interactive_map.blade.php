<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Interactive map</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
         <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?v=3&sensor=true"></script>
        <script type="text/javascript" src="{{ URL::asset('js/interactive_map.js') }}"></script>
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link rel="stylesheet" href="{{ URL::asset('css/interactive_map.css') }}" />
        
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
            <div class="cim-container">
                <div class='map-container middle'>
                    <div class="cim-map">
                    <div id="map-canvas"></div>
                    <div class="clear"></div>
                </div>

                <script type="text/javascript">
                $(document).ready(function(){
                $('.cim-map').interactiveMap({
                lang:{
                latitude: '52.274989',
                longitude: '19.289849',
                zoom: 6,
                        partners: {!! $users !!},
                        poligons: {!! $poligons !!}
                },
                        ajax:
                {
                     loadPartners: "{{ url('/map/post') }}"
                }
                });
                });
                </script>
            </div>
            <div class='partners-container middle'>
                <div class="partner-wrapper">
                    <h1>Tap province to show reprezetatives!</h1>
                </div>
            </div>
        </div>
    </main>
</body>
</html>

