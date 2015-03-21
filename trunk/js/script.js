/**
 * Srvd WordPress Plugin
 * info@bstechnologies.com
 * http://www.bstechnologies.com
 * 
 */

jQuery(function($){

	if(hasApiKey == "true") {
		$("#srvd_status").text('connected').css('color', 'green');
		$(".srvd_input").val(apiKey);
	} else {
		$("#srvd_status").text('Not connected').css('color', 'red');
	}
	
	$("[name='srvd_login']").on('click', function(e){
		e.preventDefault();
		e.stopPropagation();
		apiKey = $("[name='username']").val();
		
		datasrvd = {
			"apiKey" : apiKey
		};
		datawp= {
				"action": "setEmail",
				"apiKey": apiKey	
			};
		
		$.post(
				'http://app.srvd.co/check-api-key',
				datasrvd,
				function(data){
					console.log(data)
					if(data.success){
						$("#srvd_errorLogin").hide();
						$.post(
								admin_url,
								datawp,
								function(data){
									$("#srvd_status").text('connected').css('color', 'green');
									
								}
						).fail(function(error){
								$("#srvd_status").text('Error with the wordpress database. Please retry to log in.').css('color', 'red');
						});
					} else {
						
						$("#srvd_errorLogin").text(data.error).show();
						if(hasApiKey == "true") {
							$("#srvd_status").text('connected').css('color', 'green');
						} else {
							$("#srvd_status").text('Not connected').css('color', 'red');
						}
					}
				}
		);
		return false;	
	});
	
})