$(document).ready(function(){
	var old,difdir,msg1,msg2;
	
	//load log
	$.ajax({
			url: 'transferlog.txt',
			dataType: 'text',
			success: function(text) {
				$("#textarea").html(text);
			}
	});
	//dynamically load old directory dropbox
	var origdirArray = {
		"Select":"",
		"Processing":"C://Users/briantk/Pictures/Processing/",
		"TEST1":"C://Users/briantk/Pictures/Processing/test1/"
	};
	var origdirHTML ="<select id='origlocation'>";
	$.each(origdirArray, function(key,value){
		origdirHTML +="<option value='";
		origdirHTML += value;
		origdirHTML +="'>";
		origdirHTML +=key;
		origdirHTML +="</options>";
	});
	origdirHTML +="</select>";
	$("#oldoptions").html(origdirHTML);
	
	$("#origlocation").change(function(){
		//alert("old");
		
		old = $('#origlocation option:selected').val();
		//alert(old);
		$.ajax({
			method: "POST",
			url: "upload.php",
			data: {"old":old},
			dataType: "json",
			success: function (data){
				msg1 = data;
				$("#origselchoice").html(msg1);
			}
			});
		
		
	});
		
		//dynamically generate drop down box for original directory
		var newdirArray ={
			"Select":"",
			"Superheroes":"E://Photo Repository/Visual Sets/WW/",
			"Online Arts":"E://Photo Repository/Visual Sets/Online Arts/",
			"Imgur":"E://Photo Repository/Visual Sets/Online Arts/Photos/",
			"RoK Military":"E://Photo Repository/Visual Sets/Military/",
			"Other Militaries":"E://Photo Repository/Visual Sets/Military/NonKoreanMilitary/",
			"Science Fiction":"E://Photo Repository/Visual Sets/Military/Others/",
			"Anime":"E://Photo Repository/Visual Sets/Anime, Manga, Manhwa and Pseudomanga/",
			"Pictures":"E://Photo Repository/Visual Sets/Images/",
			"TEST2":"E://Photo Repository/Visual Sets/Anime, Manga, Manhwa and Pseudomanga/test2/",
			"TEST3":"E://Photo Repository/Visual Sets/Anime, Manga, Manhwa and Pseudomanga/test3/"
		};
		
		var newdirHTML ="<select id='newlocation'>";
		$.each(newdirArray, function(key,value){
			newdirHTML +="<option value='";
			newdirHTML += value;
			newdirHTML +="'>";
			newdirHTML +=key;
			newdirHTML +="</options>";
		});
		newdirHTML +="</select>";
		$("#newoptions").html(newdirHTML);
		
		$("#newlocation").change(function(){
			//alert(old);
			difdir = $('#newlocation option:selected').val();
			//alert(difdir);
			//$("#newselchoice").html(difdir);
			$.ajax({
				method: "POST",
				url: "upload.php",
				dataType: "json",
				data: {"new":difdir},
				success: function (data){
					msg2 = data;
					$("#newselchoice").html(msg2);
					
				}
				});
			/*
			if(old.length > 0 && difdir.length >0){
				alert("both");
			}*/
		});
	//drag and drop
	
	$('.file_drag_area').on('dragover',function(){
		$(this).addClass('file_drag_over');
		return false;
	});
	$('.file_drag_area').on('dragleave',function(){
		$(this).removeClass('file_drag_over');
	});
	$('.file_drag_area').on('drop', function(e){
		e.preventDefault();
		$(this).removeClass('file_drag_over');
		var formData = new FormData();
		var files_list = e.originalEvent.dataTransfer.files;
		//console.log(files_list);
		//console.log(files_list[0]['type']);
		//confirm file extension
		var fileType = files_list[0]['type'];
		var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
		if ($.inArray(fileType, ValidImageTypes) >= 0) {
			
			for(var i = 0; i<files_list.length; i++){
				formData.append('file[]', files_list[i]);
				}
			//console.log(formData);
			$.ajax({
				url:"upload.php",
				method:"POST",
				data:formData,
				dataType: "json",
				contentType:false,
				cache:false,
				processData: false,
				success:function(data){
					//$('#uploaded_files').html(data);
					//alert(data.info);
					if(data.status == 'success'){
						$('#uploaded_files').html("Update on transfer!");
					}else if(data.status == 'error'){
						$('#uploaded_files').html("Error, check the log for issue!");
					}
					
				}
			});
			
			$.ajax({
				url: 'transferlog.txt',
				dataType: 'text',
				success: function(text) {
					$("#textarea").html(text);
				}
			});
		}else{
			//alert('wrong file type!');
			//updates the log
			$.ajax({
				url:"upload.php",
				method:"POST",
				data:{extension:fileType},
				dataType: "json",
				success:function(data){
				
					if(data.status =='error'){
						//alert('success');
						$('#uploaded_files').html("Error, check the log for issue!");
					}
				}
			});	
		}
	});	
	
});