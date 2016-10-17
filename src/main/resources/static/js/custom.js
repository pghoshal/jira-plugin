$(document).ready(function() {
	document.getElementById('customissues').style.display='none';
	document.getElementById('issues').style.display='';
	document.getElementById('result-page').style.display='none';
	document.getElementById('front-page').style.display='';
	
	$("#progress-bar").hide();
$("button#jQueryColorChange").on('click',function(){
    $(this).toggleClass('selected');
});

AJS.$(".dialog-show-button-custom").click(function() {
    AJS.dialog2("#demo-dialog").show();
});

AJS.$("#dialog-close-button").click(function(e) {
    e.preventDefault();
    AJS.dialog2("#demo-dialog").hide();
});
var task=null;
var story=null;
var request=null;
var bug=null;
var subtask=null;
var boolTask=false;
var boolStory=false;
var boolRequest=false;
var boolBug=false;
var boolSubtask=false;
$("#dialog-show-button-1").on('click',function(){
	$(this).toggleClass('selected');
	if(!boolTask){
		task = $("#dialog-show-button-1").val();
		boolTask=true;
	}else{
		task=null;
		boolTask=false;
		
	}
});
$("#dialog-show-button-2").on('click',function(){
	$(this).toggleClass('selected');
	if(!boolStory){
		story = $(this).val();
		boolStory=true;
	} else {
		story=null;
		boolStory=false;
	}
});
$("#dialog-show-button-3").on('click',function(){
	$(this).toggleClass('selected');
	if(!boolRequest){
		request = $(this).val();
		boolRequest=true;
	} else {
		request=null;
		boolRequest=false;
	}
});
$("#dialog-show-button-4").on('click',function(){
	$(this).toggleClass('selected');
    if(!boolBug){
    	bug = $(this).val();
    	boolBug=true;
	} else {
		bug=null;
		boolBug=false;
	}
});
$("#dialog-show-button-5").on('click',function(){
	$(this).toggleClass('selected');
	if(!boolSubtask){
			subtask = $(this).val();
			boolSubtask=true;
		} else {
			subtask=null;
			boolSubtask=false;
		}
});
$("#load-all-button").on('click' ,function(){
	var select = [];
    $.each($("input[name='check_tasks']:checked"), function(){            
    	select.push($(this).val());
    });
	var customIssues=[];
	var  dd1 = $("#sync-product-single-select-1").val();
	var  dd2 = $("#sync-product-single-select-2").val();
	customIssues = $("#multiselect").val();
	if(dd1==''){
		alert('Please select From Project to copy');
	}else if(dd2==''){
		alert('Please select To Project');
	}else if(dd1==dd2){
		alert('Please select different projects to copy');
	}else if(dd2=='' && dd1==''){
		alert('Please select Projects to proceed');
	} else {
		$("#progress-bar").show();
        if (AJS.$("#progress-bar").attr("data-value")) {
            AJS.progressBars.setIndeterminate("#progress-bar");
        } 
        var baseUrl= $('input#baseUrl').val()
		alert(select);
		$.ajax({
		    url: '/copyissues',
		    dataType: 'json',
		    type: 'post',
		    contentType: 'application/json',
		    data: JSON.stringify( { "projectA":dd1 , "projectB": dd2, "baseUrl" :baseUrl, "issues" :select , "customissue":customIssues} ),
		    processData: false,
		    success: function( data, textStatus, jQxhr ){
		    	//alert('Success response : ');
		    	$("#progress-bar").hide();
		    	var i =0;
		    	var responses = [];
		    	responses = data;
		    	//alert(JSON.stringify(data))
		    	var list = '<table class="aui">';
		    	var j=0;
		    	for(i=0;i<responses.length;i++){
		    		j=1;
		    		/*list = list+ '<div class="aui-message aui-message-success">'+
		    	   ' <p class="title">'+
		    	        '<strong>Successfully Copied from Issue <a href='+responses[i].sourceUrl+' target="_blank" >'+responses[i].source+'</a></strong>'+
		    	    '</p>'+ 
		    	    '<p>Issue URL : '+responses[i].self +'</p>'+
		    	    '<p>Created Issue Id : <a href='+responses[i].destUrl+' target="_blank">'+responses[i].destination +'</a></p>'+
		    	'</div>';*/
		    		list = list + '<tr><td headers="name"> <a href='+responses[i].destUrl+' target="_blank">'+responses[i].destination +'</a></td></tr>';
		    		//list = list + '<p style="margin-left: 65px;"> Issue URL : '+responses[i].self+'</p>' +'<p style="margin-left: 65px;"> Issue Id : '+responses[i].key+'</p>';
		    	}
		    	if(responses.length>0){
		    		list = list+'</table>';
		    		$('#innerhtml').html(list);
		    	}else{
		    		$('#innerhtml').html('<table class="aui"><tr><td><center><p>No Such Issues are available to Copy</p></center></td></tr></table>');
		    	}
		    	document.getElementById('front-page').style.display='none';
		    	document.getElementById('result-page').style.display='';
		    },
		    error: function( jqXhr, textStatus, errorThrown ){
		        console.log( errorThrown );
		        $("#progress-bar").hide();
		        AJS.flag({
		            type: 'error',
		            title: 'Error during issue copy.',
		            body: '<ul class="aui-nav-actions-list">' +
		            '</ul>'
		        });
		    }
		});
	}
	
});

$("#load-custom-issues").on("change", function (){
	var dd1=$("#sync-product-single-select-1").val();
	if(dd1==''){
		alert('Please select Issue from project');
	}else{
	$("#progress-bar").show();
	$.ajax({
	    url: '/getcustomissue',
	    dataType: 'json',
	    type: 'post',
	    contentType: 'application/json',
	    data: JSON.stringify({ "projectA":dd1 }),
	    processData: false,
	    success: function( data, textStatus, jQxhr ){
	        var array=[];
	        array = data;
	        var options='';
	        for (var i = 0; i < array.length; i++) {
	        	options  = options +'<div class="checkbox">'+
	        				'<input class="checkbox" type="checkbox" name="'+ array[i]+'" id="copy-'+array[i]+'">'+
                			'<label for="checkbox">'+array[i]+'</label>'+
                			'</div>';
            
	        	//options += '<option value="' + array[i] + '">' + array[i] + '</option>';
	        }
	        if(array.length){
	        	$("#checkbox-list").html(options);
	        	document.getElementById('issues').style.display='none';
	        	document.getElementById('customissues').style.display='';
	        } else {
	        	var nocheckboxmessage = '<div id="message"><p>No custom issue to copy </p></div>';
	        	$("#checkbox-list").html(nocheckboxmessage);
	        	document.getElementById('customissues').style.display='none';
	        	document.getElementById('issues').style.display='';
	        }
	        $("#progress-bar").hide();
	    },
	    error: function( jqXhr, textStatus, errorThrown ){
	        alert("Error "+errorThrown);
	        $("#progress-bar").hide();
	    }
	 });
	}
});

/*var current_page = 1;
var records_per_page = 2;

var objJson = [
{ adName: "AdName 1"},
{ adName: "AdName 2"},
{ adName: "AdName 3"},
{ adName: "AdName 4"},
{ adName: "AdName 5"},
{ adName: "AdName 6"},
{ adName: "AdName 7"},
{ adName: "AdName 8"},
{ adName: "AdName 9"},
{ adName: "AdName 10"}
]; // Can be obtained from another source, such as your objJson variable

function prevPage(){
	if (current_page > 1) {
    	current_page--;
    	changePage(current_page);
	}
}

function nextPage(){
	if (current_page < numPages()) {
    	current_page++;
    	changePage(current_page);
	}
}

function changePage(page){
	var btn_next = document.getElementById("btn_next");
	var btn_prev = document.getElementById("btn_prev");
	var listing_table = document.getElementById("innerhtml");
	//var page_span = document.getElementById("page");

	// Validate page
	if (page < 1) page = 1;
	if (page > numPages()) page = numPages();

	listing_table.innerHTML = "";

	for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
    	listing_table.innerHTML += objJson[i].adName + "<br>";
	}
	//page_span.innerHTML = page;

	if (page == 1) {
    btn_prev.style.visibility = "hidden";
	} else {
    	btn_prev.style.visibility = "visible";
	}

	if (page == numPages()) {
    	btn_next.style.visibility = "hidden";
	} else {
    	btn_next.style.visibility = "visible";
	}
}

function numPages(){
	return Math.ceil(objJson.length / records_per_page);
}

window.onload = function() {
	changePage(1);
};*/

});


