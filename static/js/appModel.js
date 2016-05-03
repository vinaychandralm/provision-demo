var AppLoginModel = function() {
	var self = this;
	this.defaults = {
		_baseUrl: '',
		_userName: '',
		_password: '',
		_splitArray: {},
		_setItemJson: {},
		_loginPostData: {},
		_useRName: '',
		_passWord: '',
		_addAnd: ''
	};
	this.get = function(parameter) {
		return this.defaults[parameter];
	};

	this.set = function(parameter1, parameter2) {
		var parameter;
		if (typeof parameter1 === 'object') {
			for (parameter in parameter1) {
				this.defaults[parameter] = parameter1[parameter];
			}
		} else if (typeof parameter1 === 'string' && parameter2) {
			this.defaults[parameter1] = parameter2;
		}
	};
	this.ajaxCalConfig = function(url) {
		$.ajax({
			url: "config.json",
			success: function(result) {
				self.set('_baseUrl', result.Loginurl);
				self.ajaxCallPost("POST", self.get('_baseUrl'), true, "application/json")
			}
		});
	};
	this.ajaxCallPost = function(type, url, crossDomain, contentType) {
		var view = self.get('view');
		$.ajax({
			type: type,
			url: url,
			crossDomain: crossDomain,
			contentType: contentType,
			data: JSON.stringify(self.get('_loginPostData')),
			success: function(response) {

				view.ajaxcallSuccess(response);
			},
			error: function() {
				view.ajaxcallError();
			}
		});
	}
}