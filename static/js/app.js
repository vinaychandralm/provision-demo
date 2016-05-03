$('document').ready(function(){
  SWN_01.init();
});
var SWN_01={
  _baseUrl:'',
  _userName:'',
  _password:'',
  _splitArray:{},
  _setItemJson:{},
  _loginPostData:{},
  _useRName:'',
  _passWord:'',
  _addAnd:'',
  init:function()
  {
    SWN_01.loginevent();
  },
  ajaxcall:function(){
    $.ajax({
      url: "config.json",
      success: function(result){
        SWN_01._baseUrl=result.Loginurl;
        $.ajax({
          type: "POST",
          url: SWN_01._baseUrl,
          crossDomain: true,
          contentType: "application/json",
          data: JSON.stringify(SWN_01._loginPostData),
          success: function(response){
            if(response.messageType == 'SUCCESS') {
              if(response.data.domain.flags === -1) {
                 sessionStorage.clear();
                SWN_01._setItemJson ={
					"loginToken":response.data.token,
                  'token':response.data.user.token,
                  'userid':response.data.user.userid,
                  'firstname':response.data.user.firstname,
                  'lastname':response.data.user.lastname,
                  'email':response.data.user.email,
                  'userspace':response.data.user.userspace,
                  'domainid':response.data.user.domainid,
                  'domainname':response.data.user.domainname,
                  'username':response.data.user.username,
                  'flags':response.data.domain.flags
                }
				
				sessionStorage.setItem("data",JSON.stringify(SWN_01._setItemJson));
                if (typeof Storage === "undefined")
                {
                  sessionStorage.setItem("data",JSON.stringify(SWN_01._setItemJson));
                }
                window.location.href = "adminSection.html";
                $('.loginBtn').css('cursor','default');
              } else {
                $('.loginBtn').css('cursor','default');
                $('.alert-danger').show(function(){
                  $('.errorMsg').html('<strong>You are not authorized to use this application. Please contact Edivate Learn team.</strong>');
                  SWN_01.bindevent();
                });
              }
            } else {
              $('.loginBtn').css('cursor','default');
              $('.alert-danger').show(function(){
                $('.errorMsg').html('<strong>Invalid login credentials. Please provide valid Username & Password</strong>');
                SWN_01.bindevent();
              });
            }
          },
          error:function(){
            $('.loginBtn').css('cursor','default');
            $('.alert-danger').show(function(){
              $('.errorMsg').html('<strong>Invalid login credentials. Please provide valid Username & Password</strong>');
              SWN_01.bindevent();
            });
          }
        });

      }
    });
  },
  loginevent:function()
  {
    $('.loginBtn').on('click',function(e){
      SWN_01._useRName="";
      SWN_01._passWord="";
      SWN_01._addAnd="";
      SWN_01._password=$.trim($('.indexLogin li:eq(1) input').val());
      SWN_01._userName=$.trim($('.indexLogin li:eq(0) input').val());
      SWN_01._loginPostData={};
      SWN_01._loginPostData["userName"] =SWN_01._userName;
      SWN_01._loginPostData["userPassword"]=SWN_01._password;
      $('.login input:eq(0),.login input:eq(1)').css('border','medium none');
      if(SWN_01._password!=''&& SWN_01._userName!='')
      {
        $('.loginBtn').css('cursor','wait');
        e.preventDefault();
        SWN_01.ajaxcall();
      }
      else
      {
        if(SWN_01._password==="")
        {
          $('.login input:eq(1)').css('border','1px solid red');
          $('.errorMsg').html('Password required. Please input valid Password.');
        }
        if(SWN_01._userName==="")
        {
          $('.login input:eq(0)').css('border','1px solid red');
          $('.errorMsg').html('Username required. Please input valid Username.');
        }
        if(SWN_01._userName===""&&SWN_01._password==="")
        {
          $('.login input:eq(0),.login input:eq(1)').css('border','1px solid red');
          $('.errorMsg').html('Username & Password cannot be empty. Please input valid Username & Password.');
        }

        $('.alert-danger').show(400);
        $('#snwuserNameIcon,#snwpasswordIcon').on('focus',function(){
          $('.close').trigger('click');
        });
        SWN_01.bindevent();
      }
    });
    $('#snwindexLogin').keypress(function(event){
      if ( event.which == 13 ) {
        $('.loginBtn').trigger('click');
      }
    });
  },
  bindevent:function()
  {
    $('.close').off('click').on('click',function(){
      $('.alert-danger').hide(100);
      $('.login input:eq(0),.login input:eq(1)').css('border','medium none');
    });
  }
};
$(window).resize(function(){

  });
