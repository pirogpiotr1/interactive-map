(function ($) {
    //insert to JQ fn
    $.fn.interactiveMap = function (options)
    {
        //stałe
        var constant = {};

        //wartości domyślne  po inicjalizacji nadpisanie z options
        var defaults = {
            lang: {
                latitude: null,
                longitude: null,
                zoom: null,
                partners: null,
                poligons: null
            },
            ajax: {
                loadPartners: null
            }
        };

        defaults = $.extend(defaults, options);

        var vars = {};
        var partnersFromDB = defaults.lang.partners;
        var events = {
            loadPartners: function (partners_array) {
                $.ajaxSetup({
                    beforeSend: function (xhr, type) {
                        if (!type.crossDomain) {
                            xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                        }
                    },
                });
                $.ajax({
                    url: defaults.ajax.loadPartners,
                    type: 'post',
                    data: {
                        partners: partners_array
                    },
                    success: function (data)
                    {
                        switch (data.success)
                        {
                            case 'AJAX_OK':
                                //Clear
                                $('.partner-wrapper').empty();
                                $('.partners-container').removeClass('middle');
                                $('.map-container').removeClass('middle');
                                $('.partner-wrapper').hide();
                                if (data.no_results === true)
                                {
                                    $('.partners-container').addClass('middle');
                                    $('.map-container').addClass('middle');
                                } else
                                {
                                    if ($('body').width() < 1250) {
                                        if ($(".partners-container").length) {
                                            $('html, body').animate({
                                                scrollTop: $(".partners-container").offset().top - 100
                                            }, 500);
                                        }
                                    }
                                }

                                //Paste results
                                $('.partner-wrapper').html(data.html);
                                $('.partner-wrapper').fadeIn();



                                break;
                            default:
                                console.log('default-action')
                        }
                    },
                    error: function (request, textStatus, errorThrown) {
                        console.log('errror');
                    }
                });
            }

        };


        //funkcje używane w pluginie
        var functions = {
            /**
             * Init
             */
            
            initializeMap: function ()
            {

                var latitude = defaults.lang.latitude;
                var longitude = defaults.lang.longitude;

                var stylez = [
                    {
                        featureType: "all",
                        elementType: "all",
                        stylers: [
                            {
                                saturation: -100
                            }
                        ]
                    }
                ];
                
                function initialize()
                {
                    var myLatlng = new google.maps.LatLng(latitude, longitude);
                    var map = new google.maps.Map(document.getElementById("map-canvas"), {
                        zoom: defaults.lang.zoom,
                        center: myLatlng,

                        styles:
                                [
                                    {
                                        "featureType": "administrative.country",
                                        "elementType": "geometry.fill",
                                        "stylers": [
                                            {
                                                "visibility": "off"
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "administrative.country",
                                        "elementType": "geometry.stroke",
                                        "stylers": [
                                            {
                                                "visibility": "off"
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "administrative.country",
                                        "elementType": "labels.text",
                                        "stylers": [
                                            {
                                                "visibility": "off"
                                            }
                                        ]
                                    }
                                ]

                    });

                    var canvas = $('#map-canvas').height();
                    if (canvas == 400) {
                        map.setZoom(5);
                    }
                    //Obiekty partnerów które beda zaznaczone na mapie
                    var partner_id = {};
                    var partner_localization = [];
                    for (i = 0; i < partnersFromDB.length; i++)
                    {

                        partner_localization[i] = new google.maps.LatLng(
                                Number(partnersFromDB[i].latitude),
                                Number(partnersFromDB[i].longitude)
                                );

                        partner_id[i] = new Array();
                        partner_id[i].push(partnersFromDB[i].id);

                    }

                    //Muszą być w tej samej kolejności co w area.json (tablica przechowywująca koordynaty województw)
                    var provinces = [];

                    provinces['0'] = 'dolnoslaskie';
                    provinces['1'] = 'kieleckie';
                    provinces['2'] = 'kujawsko_pomorskie';
                    provinces['3'] = 'lodzkie';
                    provinces['4'] = 'lubelskie';
                    provinces['5'] = 'lubuskie';
                    provinces['6'] = 'malopolskie';
                    provinces['7'] = 'mazowieckie';
                    provinces['8'] = 'opolskie';
                    provinces['9'] = 'podkarpackie';
                    provinces['10'] = 'podlaskie';
                    provinces['11'] = 'pomorskie';
                    provinces['12'] = 'slaskie';
                    provinces['13'] = 'warminsko_mazurskie';
                    provinces['14'] = 'wielkopolskie';
                    provinces['15'] = 'zachodnio_pomorskie';

                    var polygon = JSON.parse(defaults.lang.poligons);
                    var polgyon_map = polygon.features;
                    var i;
                    var j;
                    var provinces_with_polygons = [];
                    var province_polygon = [];
                    var polygon_arr = [];

                    //funkcja która stwierdza czy polygon zawiera punkt  !hard shit 
                    google.maps.Polygon.prototype.Contains = function (point) {
                        var crossings = 0,
                                path = this.getPath();

                        // for each edge
                        for (var i = 0; i < path.getLength(); i++) {
                            var a = path.getAt(i),
                                    j = i + 1;
                            if (j >= path.getLength()) {
                                j = 0;
                            }
                            var b = path.getAt(j);
                            if (rayCrossesSegment(point, a, b)) {
                                crossings++;
                            }
                        }
//
                        // odd number of crossings?
                        return (crossings % 2 == 1);

                        function rayCrossesSegment(point, a, b) {
                            var px = point.lng(),
                                    py = point.lat(),
                                    ax = a.lng(),
                                    ay = a.lat(),
                                    bx = b.lng(),
                                    by = b.lat();
                            if (ay > by) {
                                ax = b.lng();
                                ay = b.lat();
                                bx = a.lng();
                                by = a.lat();
                            }
                            // alter longitude to cater for 180 degree crossings
                            if (px < 0) {
                                px += 360;
                            }
                            if (ax < 0) {
                                ax += 360;
                            }
                            if (bx < 0) {
                                bx += 360;
                            }

                            if (py == ay || py == by)
                                py += 0.00000001;
                            if ((py > by || py < ay) || (px > Math.max(ax, bx)))
                                return false;
                            if (px < Math.min(ax, bx))
                                return true;

                            var red = (ax != bx) ? ((by - ay) / (bx - ax)) : Infinity;
                            var blue = (ax != px) ? ((py - ay) / (px - ax)) : Infinity;
                            return (blue >= red);

                        }
                    }

                    //Zliczanie propertiesów partnera
                    function countProperties(obj) {
                        var count = 0;

                        for (var property in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, property)) {
                                count++;
                            }
                        }

                        return count;
                    }


                    var markers = [];

                    // Sets the map on all markers in the array.
                    function setMapOnAll(map) {
                        for (var i = 0; i < markers.length; i++) {
                            markers[i].setMap(map);
                        }
                        markers = [];
                    }

                    // Removes the markers from the map, but keeps them in the array.
                    function clearMarkers() {
                        setMapOnAll(null);
                    }

                    var index_final = [];
                    var final = [];

                    //partner_elements - to są już rozmieszczeni na mapie partnerzy na danych województwach
                    var partner_elements = {};
                    //Przelatujemy po każdym województwie i ustawiamy mu parametry
                    provinces.forEach(function (province_name, province_index)
                    {
                        //Nadajemy każdemu województwowi granice - polygony
                        provinces_with_polygons[province_name] = [];
                        for (j = 0; j < polgyon_map[province_index].geometry.coordinates[0][0].length; j++) {
                            provinces_with_polygons[province_name].push(
                                    new google.maps.LatLng(
                                            polgyon_map[province_index].geometry.coordinates[0][0][j][1],
                                            polgyon_map[province_index].geometry.coordinates[0][0][j][0]
                                            )
                                    );
                        }

                        //Ustalenie wyglądu wszystkich województw
                        province_polygon[province_name] = new google.maps.Polygon({
                            paths: provinces_with_polygons[province_name],
                            strokeColor: '#000',
                            strokeOpacity: 0.8,
                            strokeWeight: 1,
                            fillColor: '#fff',
                            fillOpacity: 0.6
                        });

                        //Wsadzanie wszystkich polygonów do jednej tablicy
                        polygon_arr.push(province_polygon[province_name]);
                        //Ustawienie mapy na każdym województwie
                        province_polygon[province_name].setMap(map);

                        //Ustalenie położenia danego partnera
                        partner_elements[province_index] = new Array();
                        for (j = 0; j < countProperties(partner_id); j++)
                        {
                            if (polygon_arr[province_index].Contains(partner_localization[j]))
                            {
                                partner_elements[province_index].push(partner_localization[j]);
                                partner_elements[province_index].push(partner_id[j]);
                            }
                        }

                        //Dodanie koloru na hover-in
                        google.maps.event.addListener(polygon_arr[province_index], 'mouseover', function (event) {
                            this.setOptions(
                                    {
                                        fillOpacity: 0.6,
                                        fillColor: '#ccc'},
                                    );
                        });
                        //Dodanie koloru na hover-out
                        google.maps.event.addListener(polygon_arr[province_index], 'mouseout', function (event) {
                           
                            this.setOptions(
                                    {
                                        fillOpacity: 0.6,
                                        fillColor: '#fff'},
                                    );
                        });

                        //Dodanie hovera tam gdzie jest jakiś partner
                        var index_partner = Number(polygon_arr.indexOf(polygon_arr[province_index]));
                        for (j = 0; j < partner_elements[index_partner].length; j++) {
                          
                            polygon_arr[province_index].setOptions(
                                        {
                                            fillOpacity: 0.6,
                                            fillColor: '#e8412c'},
                                        );
                             google.maps.event.addListener(polygon_arr[province_index], 'mouseout', function (event) {
                           
                            this.setOptions(
                                    {
                                        fillOpacity: 0.6,
                                        fillColor: '#e8412c'},
                                    );
                             });           
                            google.maps.event.addListener(polygon_arr[province_index], 'mouseover', function (event) {
                                this.setOptions(
                                        {
                                            fillOpacity: 0.8,
                                            fillColor: '#e8412c'},
                                        );
                            });

                        }

                        //Dodanie eventu na click danego województwa
                        google.maps.event.addListener(province_polygon[province_name], 'click', function (event) {
                            clearMarkers();

                            for (i = 0; i < partner_elements[province_index].length; i++) {
                                //Aby dla każdego elementu ustalony był marker dla nieparzystych, 
                                if ((i % 2) == 0)
                                {
                                    var partner_type = null;
                                    //Pobranie typu partnera
                                    partnersFromDB.forEach(function (partner, partner_index)
                                    {
                                        //Inkrementacja iteracji aby wyciągnąć id danego partnera
                                        if (partner.id == partner_elements[province_index][Number(i + 1)][0])
                                        {
                                            partner_type = partner.partner_type;
                                        }
                                    });

                                    //Ustawienie innych kolorow w zależności od typu partnera // TO DO przerobić jak będzie baza tych typów lub pobierać z langa
                                    if (partner_type == null || !partner_type)
                                    {
                                        var icon = {
                                            url: "/gfx/map_marker_blue.png", // url w razie wu
                                            scaledSize: new google.maps.Size(35, 35) // scaled size
                                        };
                                    } else
                                    {
                                        var icon = {
                                            url: "/gfx/map_marker_blue.png", // w razie wu
                                            scaledSize: new google.maps.Size(50, 50) // scaled size
                                        };
                                    }

                                    //ustawienie markera
                                    var marker = new google.maps.Marker({
                                        position: partner_elements[province_index][i],
                                        animation: google.maps.Animation.DROP,
                                        map: map,
                                        icon: icon
//											label: {
//												fontFamily: 'Font Awesome 5 Free',
//												text: '<i class="fa fa-map-marker" aria-hidden="true"></i>'
//											}
                                    });

                                    markers.push(marker);
                                } else {
                                    index_final.push(partner_elements[province_index][i]);
                                }

                            }
                            for (i = 0; i < countProperties(partnersFromDB); i++) {
                                for (j = 0; j < index_final.length; j++)
                                {
                                    if (partnersFromDB[i].id == index_final[j]) {
                                        final.push(partnersFromDB[i]);
                                    }
                                }
                            }
                            //AJAX załadowanie danych obok mapki
                            events.loadPartners(final);

                            //Reset po kliknięciu innego województwa
                            index_final = [];
                            final = [];
                        });
                    });
                }
                ;

                if (typeof ($("#map-canvas").attr("id")) != "undefined")
                    initialize();
            },

            init: function () {
                functions.initializeMap();
            }
        };

        //funkcje używane w pluginie
        var public_functions = {};

        //elementy pobrane
        var $this = this;

        //PLUGIN
        functions.init();
        //PLUGIN - END

        return public_functions;
    };
})(jQuery);