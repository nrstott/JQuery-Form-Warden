var fieldsEntered = {};

$(function(){	
	$.fn.validation = function() {
    var validationForm = this;

    var processErrors = function(result, fieldsEntered){
      var validationSummary = $(".validation_summary",validationForm);     
      validationSummary.html("");
      $("[name]",validationForm).parents("p").removeClass("invalid");
      $("span.star").remove();
      for(var fieldname in result.fields){
        if (fieldsEntered[fieldname]){
          if (!result.fields[fieldname].valid){
            var parent = $("[name=" + fieldname + "]",validationForm).parents("p:first");
            parent.append("<span class='star'>*</span>");
            parent.addClass("invalid");
            validationSummary.append("<li>"+ result.fields[fieldname].error+"</li>");  
          }          
        }
      }     
    }
    var processVisibility = function(results){
      for(var fieldname in results.fields){
        var item = $("[name=" + fieldname+"]");
        if(results.fields[fieldname].visible){
          item.parent().parent().show();
          item.removeAttr('disabled');
        }else{
          item.parent().parent().hide();
          item.attr('disabled', 'disabled');
        }
      }
    }

	  var log =  function (message){
		if (console && console.log){
			console.log(message);
		}
	  };
	  var options = arguments[0] ? jQuery.extend({enableBlur:true},arguments[0]) : {};
	  if (this[0].tagName !=="FORM"){
	  	alert("must be a form element");
      return;
	  }
	  var validators = {
      required: function(value){        
        return value.length || value !== "";
      },
		  email: function(value){return value.match(/\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i);},
		  ssn: function(value){return value.match(/\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b/);},
      date: function(value){return value.match(/(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)[0-9]{2}/);},
      iso8601: function(value){return value.match(/^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/);}
      };
	  options.validators = options.validators ? jQuery.extend(validators, options.validators) : validators;
    options.processErrors = options.processErrors ? options.processErrors : processErrors;
    options.processVisibility = options.processVisibility ? options.processVisibility : processVisibility;
	  var getForm = function(){
      var form = {};
      $("[name]",validationForm).each(function(index, item){
        var val = $(this).val();
        var name = item.name;

        if(item.type == "radio")
        {
          if($("[name='"+name+"']:checked").length === 0) {
            val = "";
          }
        }

        if(item.type == "checkbox")
        {          
          var els = $("[name="+name+"]:checked");
          if(els.length === 0) {
            val = "";
          }else{
            val= els.map(function(){return this.value;}).toArray();
          }
        }

        if(item.type == "select-multiple")
        {          
          var els = $("[name="+name+"] option:selected");
          if(els.length === 0) {
            val = "";
          }else{
            val= els.map(function(){return this.value;}).toArray();
          }
        }

        form[item.name] = val;
      });
      return form;
    };

    var validate = function(e){
			//get all the field value pairs
      var form = getForm();
			var results = validateForm(form, options, fieldsEntered);      
      options.processErrors(results, fieldsEntered);    
      options.processVisibility(results);
      return results.validForm;
		};
		$(this).submit(function(){
      fieldsEntered  = getForm();
      return 
       validate();
    });
		if (options.enableBlur){
      var updateFunction = function(){       
        fieldsEntered[this.name]= true;
        return validate();
      };

      $("select[name]", validationForm).change(updateFunction);
      $("select multiple[name]", validationForm).change(updateFunction);
      $("[type='radio'][name]", validationForm).change(updateFunction);
      $("[type='checkbox'][name]", validationForm).change(updateFunction);
			$("[name]", validationForm).blur(updateFunction);	       
		}		
	};	
});