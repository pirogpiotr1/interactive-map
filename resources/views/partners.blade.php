@isset($partners)
@endisset
@if($partners)
    @foreach($partners as $key => $row)
    <div class="partner-title regional">Partner</div>
    <div class="partner-container">
        <div class="partner-item partner-name"><strong>Name and Surrname:</strong> {{$row['name']}} {{$row['surrname']}}</div>
        <div class="partner-item partner-telephone"><strong>Phone:</strong> {{$row['phone']}}</div>
        <div class="partner-item partner-telephone"><strong>City:</strong> {{$row['city']}}</div>
        <div class="partner-item partner-telephone"><strong>Street:</strong> {{$row['street']}}</div>
        <div class="partner-item partner-email"><strong>Description:</strong> {{$row['desc']}}</div>
    </div>

    @endforeach
@else
    <div class='empty'>
        <h1>No partners in this province</h1>
    </div>
@endif


