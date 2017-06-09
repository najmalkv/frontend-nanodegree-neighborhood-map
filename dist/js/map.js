function initMap(){function e(e){return new google.maps.MarkerImage("http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|"+e+"|40|_|%E2%80%A2",new google.maps.Size(21,34),new google.maps.Point(0,0),new google.maps.Point(10,34),new google.maps.Size(21,34))}function a(e,a,t){if(a.marker!=e){a.marker&&(a.marker.setAnimation(null),a.marker.setIcon(r)),a.marker=e,e.setAnimation(google.maps.Animation.BOUNCE),e.setIcon(o);var n='<div class="restaurant-info"><h2 class="restaurant-name row">'+t.name+'</h2><img class="restaurant-image" src="'+t.featured_image+'" alt="image of'+t.name+'" /><div class="restaurant-details row"><b>Cuisine(s): </b>'+t.cuisines+'</div><div class="restaurant-details row"><b>Rating: </b>'+t.user_rating.aggregate_rating+'/5</div><a class="restaurant-link row" target="_blank" href="'+t.url+'">View on Zomato</a></div></div>';a.setContent(n),a.open(map,e),a.addListener("closeclick",function(){a.marker=null,e.setAnimation(null),e.setIcon(r)})}}var t={lat:10.024999,lng:76.308687},n=new google.maps.LatLngBounds;map=new google.maps.Map(document.getElementById("map"),{center:t,zoom:16});var r=e("0091ff"),o=e("FFFF24"),s="https://developers.zomato.com/api/v2.1/geocode?lat="+t.lat+"&lon="+t.lng;$.ajax({url:s,headers:{"user-key":"712f98e6b0c6af2838568407a010b798"},success:function(e){e.nearby_restaurants?(viewModel.restaurants(e.nearby_restaurants),e.nearby_restaurants.forEach(function(e){var t=parseFloat(e.restaurant.location.latitude),s=parseFloat(e.restaurant.location.longitude),l=new google.maps.Marker({position:{lat:t,lng:s},map:map,icon:r,animation:google.maps.Animation.DROP,title:e.restaurant.name});markers.push(l),n.extend(l.position),l.addListener("click",function(){a(this,i,e.restaurant)}),l.addListener("mouseover",function(){this.setIcon(o)}),l.addListener("mouseout",function(){null===l.getAnimation()&&this.setIcon(r)})}),map.fitBounds(n),google.maps.event.addDomListener(window,"resize",function(){map.fitBounds(n)})):alert("Oops! Unexpected response received from the API. Please refresh the page or try again later.")},error:function(){alert("Oops! Information on restaurants could not be loaded since The zomato API was unreachable. Please refresh the page or try again later.")}});var i=new google.maps.InfoWindow}function mapError(){alert("Error! Unable to load the  google maps API. Please refresh or try again later.")}var map,markers=[];