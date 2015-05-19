<!-- include Google hosted jQuery Library -->


<!-- Start jQuery code -->

$(document).ready(function() {
    $(".submit-btn").click(function() { 
       
        var proceed = true;
        //simple validation at client's end
        //loop through each field and we simply change border color to red for invalid fields       
        $(".contact-form-container input, .contact-form-container textarea").each(function(){
            $(this).css('border-color',''); 
            if(!$.trim($(this).val())){ //if this field is empty 
                $(this).css('border-color','red'); //change border color to red   
                proceed = false; //set do not proceed flag
            }
            //check invalid email
            var email_reg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; 
            if($(this).attr("name")=="email" && !email_reg.test($.trim($(this).val()))){
                $(this).css('border-color','red'); //change border color to red   
                proceed = false; //set do not proceed flag              
            }   
        });
       
        if(proceed) //everything looks good! proceed...
        {
            //get input field values data to be sent to server
            post_data = {
                'user_name'     : $('input[name=name]').val(), 
                'user_email'    : $('input[name=email]').val(), 
                'subject'       : $('input[name=sujet]').val(), 
                'msg'           : $('textarea[name=textarea]').val()
            };
            
            //Ajax post data to server
            $.post('contact-me.php', post_data, function(response){  
                if(response.type == 'error'){ //load json data from server and output message     
                    output = '<p class="error">'+response.text+'</p>';
                }else{
                    output = '<p class="success">'+response.text+'</p>';
                    //reset values in all input fields
                    $(".contact-form-container  input, .contact-form-container textarea").val(''); 
                    //$(".contact-form-container #contact_body").slideUp(); //hide form after success
                }
                $(".contact-form-container").html(output);
            }, 'json');
        }
    });
    
    //reset previously set border colors and hide all message on .keyup()
    $("#contact_form  input[required=true], #contact_form textarea[required=true]").keyup(function() { 
        $(this).css('border-color',''); 
        $("#result").slideUp();
    });
});