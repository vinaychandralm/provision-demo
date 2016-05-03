var AdminModel = function() {
	var self = this;
	this.defaults = {
		_sessionData: JSON.parse(sessionStorage.getItem('data')),
		_config: {},
		win_height: '',
		win_width: '',
		_baseUrl: '',
		_globalUrlStore: '',
		_rowView: 10,
		_dataIdToshow: 0,
		_globalId: 0,
		_globalThisContext: '',
		_previousCount: 0,
		_landingPagePrevCount: 0,
		_previousCountArray: [0],
		_previousLandingCountArray: [0],
		_dropdownCount: 10,
		_optionselector: '',
		_schoolRowDisableCheck: 0,
		_nextdisbleChcek: '',
		_selectedCatalogs: [],
		_allCoorsesList: {},
		_popupWindow: null,
		_districtContext: '',
		_stateNameMap: {},
		_districtList: '',
		_editbox: $('.editpopupBox'),
		_editbutton: '',
		_globalCourseCatalog: [],
		_stateId: [],
		_stateReportId: [],
		_ditrictReportId: [],
		_stateName: [],
		_sessionExpired: false,
		deselectAll: false,
		_customCatalogId: '34816208',
		_globalCourseSelection: [],
		_postId: 0,
		_domainId: 0,
		_result: '',
		_totalCourseArry: [],
		_globalLicensecNum: 0,
		_globalSccessToken: "",
        _demoDomainUrl:'http://localhost:9090/provision/domain/list/all/47583342',
        _copyDomainUrl:'http://localhost:9090/provision/domain/create/demo?'
	}
	this.get = function(parameter) {
		return this.defaults[parameter];
	};

	this.set = function(parameter1, parameter2) {
		var parameter;
		if (typeof parameter1 === 'object') {
			for (parameter in parameter1) {
				this.defaults[parameter] = parameter1[parameter];
			}
		} else if (typeof parameter1 === 'string') {
			this.defaults[parameter1] = parameter2;
		}
	};

	this.ajaxCalConfig = function(url) {
		var view = self.get('view');
		$.ajax({
			url: "config.json",
			success: function(result) {
				self.set('configResult', result);
				view.loadPage()
			},
			error: function() {
				console.log('error loading page');
			},
			beforeSend: function(xhr, settings) {
				// console.log(xhr);
				view.beforeSendEventHandler(xhr, settings);
			}
		});
	};

	this.quickSearchResult = function(form, welcomeLetterURI) {
		// $('#allSiteSource').val(source);
		var queryString = form.serialize(),
			view = self.get('view');
		console.log(queryString);
		console.log(form)
		$.ajax({
			type: "get",
			url: welcomeLetterURI,
			success: function(result) {
				console.log(result);
				// $('#' + source + 'ResultContent').html(result);
			},
			beforeSend: function(xhr, settings) {
				// console.log(xhr);
				view.beforeSendEventHandler(xhr, settings);
			}
		});
	};

	this.ajaxObjCall = function(ajaxParam, successHandler, errorHandler, completeHandler, functionObject) {

		var view = self.get('view'),
			defaultAjaxParam = {
				url: ajaxParam.url,
				success: function(response) {
					if (successHandler) {
						successHandler(response, functionObject.successVal);
					}
				},
				error: function(response) {
					if (response.responseText.indexOf('JWT') > -1 || response.responseText.indexOf('Missing') > -1 || response.responseText.indexOf('jwt') > -1) {
						if (self.get('_sessionExpired') === false) {
							self.set('_sessionExpired', true);
							alert("Session has expired or some data is missing.");
							view.logout();
						}
					} else if (errorHandler) {
						errorHandler(response, functionObject.errorVal);
					}
				},
				complete: function(response) {
					// console.log(response.getResponseHeader('Authorization'));
					if (response.getResponseHeader('Authorization')) {
						self.set('_globalSccessToken', response.getResponseHeader('Authorization'));
					}
					if (completeHandler) {
						completeHandler(response, functionObject.completeVal);
					}
				},
				beforeSend: function(xhr, settings) {
					// console.log(xhr);
					view.beforeSendEventHandler(xhr, settings);
				}
			}
		defaultAjaxParam = $.extend(true, defaultAjaxParam, ajaxParam);
		$.ajax(defaultAjaxParam);
	};


}