import Ember from 'ember';

/*var Photo = Ember.Object.extend({
	title:'',
	username:'',
	owner: '',
	id: '',
	farm: 0,
	secret: '',
	server: '',
	url: function(){
		return "https://farm"+this.get('farm')+
		".staticflickr.com/"+this.get('server')+
		"/"+this.get('id')+"_"+this.get('secret')+"_b.jpg";
	}.property('farm','server','id','secret'),
});*/

var PhotoCollection = Ember.ArrayProxy.extend(Ember.SortableMixin, {
	sortProperties: ['dates.taken'],
	sortAscending: false,
	content: [],
});

export default Ember.Controller.extend({
	photos: PhotoCollection.create(),
	searchField: '',
	tagSearchField:'',
	tagList:[],
	grabbed:[],
	loading:false,
	filteredPhotos: function () {
		var filter = this.get('searchField');
		var rx = new RegExp(filter, 'gi');
		var photos = this.get('photos');

		return photos.filter(function(photo){
			return photo.get('title').match(rx) || photo.get('owner.username').match(rx);
		});
	}.property('photos.@each','searchField'),
	filteredPhotosLoaded: function(){
		console.log("loaded filtered photos");
		return this.get('filteredPhotos').length > 0;
	}.property('filteredPhotos.length'),

	actions: {
		search: function () {
			this.set('loading', true);
			this.get('photos').content.clear();
			this.store.unloadAll('photo');
			this.send('getPhotos',this.get('tagSearchField'));
		},
		getPhotos: function(tag){
			var apiKey = 'c89d5f163cec11aa357c7ca65a07c052';
			var host = 'https://api.flickr.com/services/rest/';
			var method = "flickr.photos.search";
			var requestURL = host + "?method="+method + "&api_key="+apiKey+"&tags="+tag+"&format=json&nojsoncallback=1";
			var photos = this.get('photos');
			var t = this;
			console.log(requestURL);
			Ember.$.getJSON(requestURL, function(data){
				//callback for successfully completed requests
				//make secondary requests to get all of the photo information
				data.photos.photo.map(function(photoitem) {//iterate over each photo
					var infoRequestURL = host + "?method="+"flickr.photos.getInfo" + "&api_key="+apiKey+ "&photo_id="+photoitem.id+"&format=json&nojsoncallback=1";
					Ember.$.getJSON(infoRequestURL, function(item){
						var photo = item.photo;
						var tags = photo.tags.tag.map(function(tagitem){
							return tagitem._content;
						});
						var pid = photo.id;
						var grab = false;
						console.log(t.get('grabbed').length);
						for(var i = 0; i < t.get('grabbed').length; i++) {
							if(t.get('grabbed').id == pid) {
								grab = true;
							}
						}
						var newPhotoItem = t.store.createRecord('photo',{
							title: photo.title._content,
							dates: photo.dates,
							owner: photo.owner,
							description: photo.description._content,
							link: photo.urls.url[0]._content,
							views: photo.views,
							tags: tags,
							//flickr url data
							id: photo.id,
							farm: photo.farm,
							secret: photo.secret,
							server: photo.server,
							grabbed:grab,
						});
						photos.pushObject(newPhotoItem);
					});
				});
			});
		},
		clicktag: function(tag){

			this.set('tagSearchField', tag);
			this.set('loading',true);
			this.get('photos').content.clear();
			this.store.unloadAll('photo');
			this.send('getPhotos',tag);
		},
		grabImage: function(photo) {
			/*var grabbed = this.get('grabbed');
			if(!g) {
				//this.set('grabbed',grabbed.append()).push({link:link,title:title,id:id});
				for(var i = 0; i < this.get('filteredPhotos').length; i++) {
					if(this.get('filteredPhotos')[i].id == photo.id) {
						this.get('filteredPhotos')[i].set('grabbed',true);
					}
				}
			}
			else {
				var idf = '';
				var idi = 0;
				for(var i = 0; i < this.get('grabbed').length; i++) {
					if(this.get('grabbed')[i].id == photo.id) {
						idf = this.get('grabbed')[i].id;
						idi = i;
					}
				}
				if(idf != '') {
					this.set('grabbed',this.get('grabbed').splice(idi,1));
					//this.get('grabbed') = this.get('grabbed').splice(idi,1);

					for(var i = 0; i < this.get('filteredPhotos').length; i++) {
						if(this.get('filteredPhotos')[i].id == id) {
							this.get('filteredPhotos')[i].set('grabbed',false);
						}
					}
				}
			}*/
			console.log('fired');
			photo.set('grabbed', true);
			this.get('grabbed').addObject(photo);

		},
		removeImage: function(photo) {
			photo.set('grabbed',false);
			this.set('grabbed',this.get('grabbed').removeObject(photo));
		}


	},
	init: function(){
		this._super.apply(this, arguments);
		var apiKey = '4435e3a217bc7afc94dfcba607b70eb1';
		var host = 'https://api.flickr.com/services/rest/';
		var method = "flickr.tags.getHotList";
		var requestURL = host + "?method="+method + "&api_key="+apiKey+"&count=75&format=json&nojsoncallback=1";
		var t = this;
		Ember.$.getJSON(requestURL, function(data){
			//callback for successfully completed requests
			console.log(data);
			data.hottags.tag.map(function(tag) {
				t.get('tagList').pushObject(tag._content);
			});
		});
	},


});