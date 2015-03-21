/**
 * Srvd WordPress Plugin
 * info@bstechnologies.com
 * http://www.bstechnologies.com
 * 
 */

jQuery(function($) {
	var options_array = [];
function downloadPlacements(editor){
	data = {
			"apiKey" : apiKey	
		};
		$.get(
			'http://app.srvd.co/get-placement-wp',
			data,
			function(data){
				if (data.success){
					array = data.data;
				
					$.each(array, function(key, value){
						var object = 
						    {
								text : value.name,
								value : '<!--Srvd--><span id="srvd_'+value.type+'_'+value.id+'"></span>'
										+'<script type="text/javascript" src="//app.srvd.co/placement/'+value.type+'/output/'+value.id+'/srvd.js"></script>',
								onclick : function() {
									editor.insertContent(this.value());
								}
						    };
						options_array.push(object);
					});
					if (options_array.length > 0){
						tinyMCE.activeEditor.settings.srvd_list = options_array;
					}
					
					tinyMCE.activeEditor.plugins.srvd_dropdown.refresh();
				} else {
					alert(data.error);
				}
			}
		).fail(function(){
			tinyMCE.activeEditor.plugins.srvd_dropdown.refresh();
		});	
}	
		tinymce.PluginManager.add('srvd_dropdown', function(editor, url) {
			var self = this, button;
			
			function getValues() {
			      return editor.settings.srvd_list;
			}
			dropdown=editor.addButton('srvd_dropdown', {
				title : 'Your Srvd code',
				icon : 'srvd-icon',
				type: 'menubutton',
				menu: [
				    {
				    	text: "Waiting..."
				    }
				],
				onPostRender: function() {
			         button = this;
			    },
			});
			downloadPlacements(editor);
			
			self.refresh = function() {
				if (getValues(error=null)){
				      //remove existing menu if it is already rendered
				      if(button.menu){
				         button.menu.remove();
				         button.menu = null;
				      }
				      
				      button.settings.values = button.settings.menu = getValues();
				} else {
					if(button.menu){
				         button.menu.remove();
				         button.menu = null;
				    }
					errorArray = [
					    {
					    	text : "No placement found."
					    }
					];
					button.settings.values = button.settings.menu = errorArray;
				}
			};
	        editor.on( 'BeforeSetContent', function( e ) {   
	          	if ( e.content ) {
	              	if ( e.content.indexOf( '<!--Srvd' ) !== -1 ) {       
	                 	e.content = e.content.replace( /<!--Srvd(.*?)-->/g, function( match, moretext ) {
	                     	moretext = "Srvd";
	                       	return '<img src="'+plugin_url+'/img/srvd-wp.png" data-srvd="Srvd" />';
	                   	});
	              	}
	          	}
	        });
	        editor.on( 'PostProcess', function( e ) {
	          	if ( e.get ) {
	              	e.content = e.content.replace(/<img[^>]+>/g, function( image ) {
	                 	var match, moretext = '';
	                  	if ( image.indexOf( 'data-srvd="Srvd"' ) !== -1 ) {
	                     	image = '<!--Srvd-->';
	                    }
	                  	return image;
	               	});
	        	}
	        });
	        editor.on( 'ResolveName', function( event ) {
	         	var attr;

	           	if ( event.target.nodeName === 'IMG' && ( attr = editor.dom.getAttrib( event.target, 'data-srvd' ) ) ) {
	             	event.name = attr;
	           	}
	        });
		});
});
