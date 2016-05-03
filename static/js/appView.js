$('document').ready(function() {

	var logModel = new AppLoginModel();
	var logView = new AppLoginView(logModel);
	logView.init();
});

var AppLoginView = function(model) {
	var self = this;
	this.model = model;
	this.init = function() {
		this.model.set('view', this);
		this.loginevent();
	};
	this.loginevent = function() {
		$('.loginBtn').on('click', function(e) {
			self.model.set({
				'_password': $.trim($('.indexLogin li:eq(1) input').val()),
				'_userName': $.trim($('.indexLogin li:eq(0) input').val())
			});
			self.model.set({
				'_loginPostData': {
					userName: self.model.get('_userName'),
					userPassword: self.model.get('_password')
				}
			});
			$('.login input:eq(0),.login input:eq(1)').css('border', 'medium none');
			self.validate(e);
		});
		$('#snwindexLogin').keypress(function(event) {
			if (event.which == 13) {
				$('.loginBtn').trigger('click');
			}
		});
	};

	this.validate = function(e) {
		if (self.model.get('_password') != '' && self.model.get('_userName') != '') {
			$('.loginBtn').css('cursor', 'wait');
			e.preventDefault();
			self.model.ajaxCalConfig("config.json");
		} else {
			if (self.model.get('_password') === "") {
				$('.login input:eq(1)').css('border', '1px solid red');
				$('.errorMsg').html('Password required. Please input valid Password.');
			}
			if (self.model.get('_userName') === "") {
				$('.login input:eq(0)').css('border', '1px solid red');
				$('.errorMsg').html('Username required. Please input valid Username.');
			}
			if (self.model.get('_userName') === "" && self.model.get('_password') === "") {
				$('.login input:eq(0),.login input:eq(1)').css('border', '1px solid red');
				$('.errorMsg').html('Username & Password cannot be empty. Please input valid Username & Password.');
			}

			$('.alert-danger').show(400);
			$('#snwuserNameIcon,#snwpasswordIcon').on('focus', function() {
				$('.close').trigger('click');
			});
			self.bindevent();
		}
	};

	this.bindevent = function() {
		$('.close').off('click').on('click', function() {
			$('.alert-danger').hide(100);
			$('.login input:eq(0),.login input:eq(1)').css('border', 'medium none');
		});
	};

	this.ajaxcallSuccess = function(response) {
		var _setItemJson;
		if (response.messageType == 'SUCCESS') {
			if (response.data.domain.flags === -1) {
				sessionStorage.clear();
				_setItemJson = {
					"loginToken": response.data.token,
					'token': response.data.user.token,
					'userid': response.data.user.userid,
					'firstname': response.data.user.firstname,
					'lastname': response.data.user.lastname,
					'email': response.data.user.email,
					'userspace': response.data.user.userspace,
					'domainid': response.data.user.domainid,
					'domainname': response.data.user.domainname,
					'username': response.data.user.username,
					'flags': response.data.domain.flags
				}
				self.model.set('_setItemJson', _setItemJson);
				sessionStorage.setItem("data", JSON.stringify(self.model.get('_setItemJson')));
				if (typeof Storage === "undefined") {
					sessionStorage.setItem("data", JSON.stringify(self.model.get('_setItemJson')));
				}
				window.location.href = "adminSection.html";
				$('.loginBtn').css('cursor', 'default');
			} else {
				
				$('.loginBtn').css('cursor', 'default');
				$('.alert-danger').show(function() {
					$('.errorMsg').html('<strong>You are not authorized to use this application. Please contact Edivate Learn team.</strong>');
					self.bindevent();
				});
			}
		} else {
			//console.log(response);
			$('.loginBtn').css('cursor', 'default');
			$('.alert-danger').show(function() {
				if(response.message.indexOf('permission')>-1){
					$('.errorMsg').html('<strong>User does not have permission for Course Catalog and Customer domains. Please contact Edivate Learn team.</strong>');
				}else if (response.message.indexOf('authorized')>-1){
					$('.errorMsg').html('<strong>You are not authorized to use this application. Please contact Edivate Learn team.</strong>');
				}else{
					$('.errorMsg').html('<strong>Invalid login credentials. Please provide valid Username & Password</strong>');
				}
				
				self.bindevent();
			});
		}
	};

	this.ajaxcallError = function() {
		$('.loginBtn').css('cursor', 'default');
		$('.alert-danger').show(function() {
			$('.errorMsg').html('<strong>Invalid login credentials. Please provide valid Username & Password</strong>');
			self.bindevent();
		});
	}
}