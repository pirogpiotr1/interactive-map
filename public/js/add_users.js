
(function ($) {
    //insert to JQ fn
    $.fn.add_users = function (options)
    {
        //stałe
        var constant = {};

        //wartości domyślne  po inicjalizacji nadpisanie z options
        var defaults = {
            lang: {
                users: null
            },
            ajax: {
                deleteRow: null
            }
        };

        defaults = $.extend(defaults, options);

        var vars = {};



        var events = {

            deleteRow: function (row) {

                $.ajaxSetup({
                    beforeSend: function (xhr, type) {
                        if (!type.crossDomain) {
                            xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
                        }
                    },
                });
                $.ajax({
                    url: defaults.ajax.deleteRow,
                    type: 'post',
                    data: {
                        row: row.attr('data-id')
                    },
                    success: function (data)
                    {
                        switch (data.success)
                        {
                            case 'AJAX_OK':
                                row.parents("tr").remove();
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

            initMapUser: function () {

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

                google.maps.event.addListener(map, "click", function (e) {

                    //lat and lng is available in e object
                    let lat = e.latLng.lat();
                    let lng = e.latLng.lng();

                    $('input[name="lat"]').val(lat);
                    $('input[name="lng"]').val(lng);

                });
            },

            init: function () {

                $('.add-form').on('click', function () {
                    let length = $('.inputs').length;
                    if (!length) {
                        $('#form').append($html);
                        functions.initMapUser();
                    } else {
                        alert('You can only add/edit one user at once');
                    }
                });
                $('.edit').on('click', function () {
                    let length = $('.inputs').length;
                    if (!length) {
                        let lng = $('[name="record"]:checked').length
                        if (lng <= 1) {
                            $("table tbody").find('input[name="record"]').each(function () {
                                if ($(this).is(":checked")) {
                                    let id = $(this).attr('data-id')
                                    $('#form').append($htmlEdit);
                                    $('#user').attr('action', '/editUser');
                                    functions.initMapUser();
                                    $.each(defaults.lang.users, function (key, value) {
                                        if (value.id == id) {
                                            $('input[name="city"]').val(value.city);
                                            $('input[name="desc"]').val(value.desc);
                                            $('input[name="lat"]').val(value.latitude);
                                            $('input[name="lng"]').val(value.longitude);
                                            $('input[name="name"]').val(value.name);
                                            $('input[name="surrname"]').val(value.surrname);
                                            $('input[name="phone"]').val(value.phone);
                                            $('input[name="street"]').val(value.street);
                                        }
                                    });
                                    $('input[name="id"]').val($(this).attr('data-id'));
                                    return false;// break
                                }
                            });
                        } else {
                            alert('You can only add/edit one user at once');
                        }

                    } else {
                        alert('You can only add/edit one user at once');
                    }
                });

                $(".delete-row").click(function () {
                    $("table tbody").find('input[name="record"]').each(function () {
                        if ($(this).is(":checked")) {
                            events.deleteRow($(this));
                        }
                    });
                });


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