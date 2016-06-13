import Ember from 'ember';

var Photo = Ember.Object.extend({
	title:'',
	username:'',
	url:''
});

var PhotoCollection = Ember.ArrayProxy.extend(Ember.SortableMixin, {
	sortProperties:['title'],
	sortAscending:false,
	content: [],
});

var testPhotos = PhotoCollection.create();

/*var testimg1 = Photo.create({
	title:"Google logo",
	username:"google",
	url:"https://www.google.com/images/srpr/logo11w.png"
});
var testimg2 = Photo.create({
	title:"UNO logo",
	username:"UNO",
	url:"http://unomaha.edu/_files/images/logo-subsite-o-2.png"
});


var testimg3 = Photo.create({
	title:"Orange Man",
	username:"Orange",
	url:"http://i.imgur.com/Ip4CbC5.jpg"
});*/
/*
testPhotos.pushObject(testimg1);
testPhotos.pushObject(testimg2);
testPhotos.pushObject(testimg3);
*/
var ps = [
{
	title:"Google logo",
	username:"google",
	url:"https://www.google.com/images/srpr/logo11w.png"
},
{
	title:"UNO logo",
	username:"UNO",
	url:"http://unomaha.edu/_files/images/logo-subsite-o-2.png"
},
{
	title:"Orange Man",
	username:"Orange",
	url:"http://i.imgur.com/Ip4CbC5.jpg"
},
{
	title: "Hubble Carina Nebula",
	username: "NASA",
	url: "http://imgsrc.hubblesite.org/hu/db/images/hs-2010-13-a-1920x1200_wallpaper.jpg"
}

];

for(var i = 0; i < ps.length; i++) {
	var ph = Photo.create(ps[i]);
	testPhotos.pushObject(ph);
}

export default Ember.Controller.extend({
	photos: testPhotos,
	searchField: '',
	filteredPhotos: testPhotos,
	actions: {
		search: function () {
			var filter = this.get('searchField');
			var rx = new RegExp(filter, 'gi');
			var photos = this.get('photos');
			this.set('filteredPhotos',
				photos.filter(function(photo){
					return photo.get('title').match(rx) || photo.get('username').match(rx);
				})
			);
		}
	}
});