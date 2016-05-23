$('document').ready(function () {
    var adminModel = new AdminModel();
    var adminView = new AdminView(adminModel);
    adminView.init();
    adminView.cursorwait();



    $('.spinner .btn:first-of-type').on('click', function () {
         if(parseInt($('.spinner input').val(), 10) <1){
            $('.spinner input').val(1);
        }else{
        $('.spinner input').val(parseInt($('.spinner input').val(), 10) + 1);
        }
    });
    $('.spinner .btn:last-of-type').on('click', function () {
        if(parseInt($('.spinner input').val(), 10) <=1){
            $('.spinner input').val(1);
        }else{
            $('.spinner input').val(parseInt($('.spinner input').val(), 10) - 1);
        }
    });
    
     $('#domainNumber').on('blur', function () {
        if(parseInt($('.spinner input').val(), 10) <1 ||  isNaN(parseInt($('.spinner input').val(), 10) )){
             $('.spinner input').val(1);
        }
     });

});
var AdminView = function (model) {
    var self = this;
    this.model = model;

    this.init = function () {
        if (!sessionStorage.getItem('data')) {
            self.logout();
            return;
        }
        this.model.set('view', self);
        this.model.ajaxCalConfig();
    };

    this.loadPage = function () {

        var parseJson = JSON.parse(sessionStorage.getItem('data'));
        self.model.set('_globalSccessToken', parseJson.loginToken);
        self.getConfig();
        self.loadingdistrict();
        self.screenload();
        self.htmlloading();
        self.bindevent();
        $(".popupInputDate").each(function () {
            $(this).datepicker({
                dateFormat: "mm-dd-yy"
            });
        });
    };

    this.htmlloading = function () {
        var parseJson = JSON.parse(sessionStorage.getItem('data'));
        $('.domainHead h1').html(parseJson.domainname);
        $('.breadCrumb a:eq(0)').html(parseJson.userspace);
        $('.breadCrumb a:eq(1)').html(parseJson.username);
        $('.loggerName').html(parseJson.firstname + " " + parseJson.lastname);
        $('#snwadminSearch h1').html('Welcome' + ' ' + parseJson.firstname + " " + parseJson.lastname);
        $('#snwadminSearch .welcome').show();
        self.model.set('_globalSccessToken', parseJson.loginToken);
    };

    this.screenload = function () {
        $('.addNew,.upArrow').hide();
        $('.newDomTab li').each(function (k) {
            $('.newDomTab li').attr('id', function (k) {
                return "tab_" + k;
            });
        });
        $('.listBox').each(function () {
            $('.listBox').attr('id', function (l) {
                return "panel_" + l;
            });
        });
    };

    this.bindevent = function () {
        this.model.set({
            'win_height': $(window).height(),
            'win_width': $(window).width()
        });
        $('.circlePlus').off('click').on('click', function () {
            self.circlePlusHandler();
        });
        var result = self.model.get('configResult'),
            inputDomVal = '',
            splitArry = [],
            dataWraper = '',
            loginPrefx = '',
            loginUndifndChk = '',
            loginArray = [];
        $('input.domain-name,input.login-prefix,input.external-id,input.license-number,input.schldomainname,input.loginprefix,input.externalid,input.license-number').off('keyup').on('keyup', function () {
            self.applyMaxLimit($(this));
        });
        $('.loginPrefix,#snw_Enter_Login_Prefix').keyup(function () {
            self.loginKeyUpPrefix($(this));
        });
        $('#snw_License').off('keyup').on('keyup', function () {

            self.numberValidation($(this));
        });
        $('#snw_License1').off('keyup').on('keyup', function () {
            self.numberValidation($(this));
        });
        $('#licence-number').off('keyup').on('keyup', function (event) {
            self.numberValidation($(this));
        });
        $('#snwlicense-number').off('keyup').on('keyup', function () {
            self.numberValidation($(this));
        });
        $('.domainName,#snw_Enter_School').keyup(function () {
            self.domainNameKeyUp($(this), loginArray);
        });
        $('.closeAN').off('click').on('click', function () {
            self.saveProviderListData();
            $('.grayBg,.popGrayBg,.editschlpopupBox').hide();
            $('.popupBox,.editpopupBox,.addschlpopupBox').hide();
            self.cursordefault();
        });
        $('.popupBox .subscription-end,.editpopupBox .subscription-end').unbind('change paste keyup').bind("change paste keyup", function () {
            self.popupBoxHandler();
        });
        $('.popupBox .loginPrefix').off('keydown').on("keydown", function (e) {
            if (e.keyCode === 32) {
                return false;
            }
        });
        $('.addschlpopupBox .loginprefix').off('keydown').on("keydown", function (e) {
            if (e.keyCode === 32) {
                return false;
            }
        });
        $('.submitdistrict').off('click').on('click', function () {
            self.submitDistrictHandler($(this));
        });
        $('.cancelistrict').off('click').on('click', function () {
            self.saveProviderListData();
            $('.grayBg').hide();
            $('.popGrayBg').hide();
            $('.popupBox,.editpopupBox').hide();
        });
        $('.editsubmit').off('click').on('click', function () {
            self.editSubmitHandler($(this));
        });
        $('.editcancel').off('click').on('click', function () {
            self.saveProviderListData();
            $('.grayBg').hide();
            $('.popGrayBg').hide();
            $('.popupBox,.editpopupBox').hide();
        });
        $('.schleditsubmit').off('click').on('click', function () {
            self.schlEditSubmitHandler($(this));
        });
        $('.editwelcome').off('click').on('click', function () {
            self.domainWelcomeLetter();
        });
        $('.editschoolwelcome').off('click').on('click', function () {
            self.schoolWelcomeLetter();
        });
        $('.editAddSchool').off('click').on('click', function () {
            self.editAddSchool($(this))
        });
        //      34894868
        $('.schlsubmit').off('click').on('click', function () {
            self.schlsubmitHandler($(this));
        });
        $('.schlcancel').off('click').on('click', function () {
            self.saveProviderListData();
            $('.grayBg').hide();
            $('.popGrayBg,.editschlpopupBox').hide();
            $('.addschlpopupBox').hide();
        });
        $('.loginPerson').off('click').on('click', function () {
            $('.LPMenu').toggle();
            return false;
        });
        $('.createpopupradio input,.editpopupradio input').off('change').on('change', function () {
            self.createPopupRadio($(this))
        });
        $('.disTrictList').off('click').on('click', function () {
            self.disTrictListHandler($(this));
        });
        $('.showEntry').off('change').on('change', function () {
            self.showEntryHandler($(this));
        });
        $('.NextCir').off('click').on('click', function () {
            self.NextCirHandler($(this));
        });
        $('.PreviousCir').off('click').on('click', function () {
            self.PreviousCirHandler($(this));
        });
        $('.DomainNext').off('click').on('click', function () {
            self.DomainNextHandler($(this));
        });
        $('.DomainPrevious').off('click').on('click', function () {
            self.DomainPreviousHandler($(this));
        });
        $('.domain-showEntry').off('change').on('change', function () {
            self.domainShowEntryHandler($(this));
        });
        $('.newDomTab li').off('click').on('click', function () {
            self.newDomTabHandler($(this));
        });
        $('.adminNav li').off('click').on('click', function () {
            self.adminNav($(this));
        });
        $('.adminNav li:eq(1)').off('click').on('click', function () {
            console.log("District - 202");
            self.adminNavFirst($(this));
        });
        $('.entire-catalog').off('click').on('click', function () {

            self.entireCatalogSelected($(this));
        });
        $('.selective-course').off('click').on('click', function () {
            self.selectiveCourseCatalogSelected($(this))
        });
        $('.corsecatalog').off('click').on('click', function (e) {
            self.courseCatalogHandler(e)
        });
        $('.coursSelect').off('click').on('click', function (e) {
            self.courseSelectHandler(e);
        });
        $('.searchbox').off('keypress').on('keypress', function (e) {
            if (e.keyCode == 13) {
                $('.SearchClick').trigger('click');
            }
        });
        $('.SearchClick').off('click keyup').on('click keyup', function (e) {
            self.SearchClickHandler();
        });
        $(document.body).off("click tap").on("click tap", function (e) {
            self.documentClickHandler(e);
        });
        $('.distrctadd').off('click').on('click', function () {
            self.distrctAddHandler($(this));
        });
        $('.catalog-list input').off('change').on('change', function () {
            self.catalogListInputHandler($(this));
        });
        $('.edit').off('click').on('click', function () {
            self.editDistrictHandler($(this));
        });
        $('.addschool').off('click').on('click', function () {
            self.addSchoolHandler($(this));
        });
        $('.addschlpopupBox .addschoollist').off('change').on('change', function () {
            self.addSchlPopupBox($(this));
        });
        $('.editschlpopupBox .addschoollist').off('change').on('change', function () {
            self.addSchlPopupBox($(this));
        });
        $('.addschlpopupBox .schooldistrictlist').off('change').on('change', function () {
            self.editSchoolDistrictList($(this));
        });
        $('.editschlpopupBox .schooldistrictlist').off('change').on('change', function () {
            self.editSchoolDistrictList($(this));
        });
        $('.corsecatalogList input[type="checkbox"]').off().on("click", function () {
            self.courseCatalogListInput($(this));
        });
        $('#snwselectCourse input').off('change').on('change', function () {
            self.radioButton('popupBox');
        });
        $('#snwSelectCourse input').off('change').on('change', function () {
            self.radioButton('editpopupBox');
        });
        // $('')
        $('.editSchoolpop').off('click').on('click', function () {
            self.editSchoolPopHandler($(this));
        });
        $('#snwreportsLienceLi1').off('click').on('click', function () {
            self.snwReportsLienceLiFirst($(this));
        });
        $('#snwreportsLienceLi2').off('click').on('click', function () {
            self.snwreportsLienceLiSec($(this));
        });
        $('.reportfisrtedit').off('click').on('click', function () {
            self.reportfisrteditHandler()
        });
        $('.reportpost2').off('click').on('click', function () {
            self.reportPostSec();
        });
        $('.adminNav li:eq(0)').off('click').on('click', function () {
            self.adminNavZero();
            console.log("District - 279");
            $('.adminNav li:eq(2)').removeClass('demoSetupActive');
        });
        $('.stateListing').off('click').on('click', function (e) {
            self.stateListingHandler(e);
        });
        $('.domainListing').off('click').on('click', function (e) {
            self.domainListingHandler(e);
        });
        $("#snwselectInput, #snwselectCourse, #snwSelectInput, #snwSelectCourse").select2({
            placeholder: "Select Catalogs"
        });
        $("#snwselectInput, .catalog-list .selectInput").off("select2:select").on("select2:select", function (e) {
            self.courseCatalogsSelected($(e.params.data.element));
        });
        $("#snwselectInput, .catalog-list .selectInput").off("select2:unselect").on("select2:unselect", function (e) {

            if ($(e.params.data.element).hasClass('newEle') || $(e.params.data.element).parents('.addschlpopupBox').length > 0 || $(e.params.data.element).parents('.popupBox').length > 0
                || ($.inArray($(e.params.data.element).attr('data-domain-id'), self.model.get('_domain').data.subscribedproviderlist)) == -1) {
                self.courseCatalogsUnSelected($(e.params.data.element));
            } else {
                $(e.params.data.element).prop('selected', 'selected');
                self.bindevent();
                alert('You cannot remove course(s) from course catalogs selection.');
            }
        });
        $("#snwselectCourse, .course-list .selectCourse").off("select2:select").on("select2:select", function (e) {
            self.courseSelectedAction($(e.params.data.element));
        });

        $("#snwselectCourse, .course-list .selectCourse").off("select2:unselect").on("select2:unselect", function (e) {

            if ($(e.params.data.element).hasClass('newEle') || $(e.params.data.element).parents('.addschlpopupBox').length > 0 || $(e.params.data.element).parents('.popupBox').length > 0
                || ($.inArray($(e.params.data.element).attr('data-course-id'), self.model.get('_domain').data.subscribedcourselist)) == -1) {
                self.courseUnSelectedAction($(e.params.data.element));
            } else {
                $(e.params.data.element).prop('selected', 'selected');
                self.bindevent();
                alert('You cannot remove this course from course list selection.');
            }
        });

        //Attaching event handler of Demo Setup.
        $('.adminNav li:eq(2)').off('click').on('click', function () {
            if ($('.adminNav li:eq(2)').hasClass('demoSetupActive')) {
                return
            } else {
                $('.adminNav li:eq(2)').addClass('demoSetupActive');
                $('.panel-group').remove();
            }

            self.showDemoSetUp();
        });
        this.callCopyDomainAjax = function (distID, domainNumbers) {
            //domainid=47583453&noofdomain=2


            self.cursorwait();
            console.log(self.model.get('_copyDomainUrl') + 'domainid=' + distID + '&noofdomain=' + domainNumbers);

            $.ajax({
                type: "POST",
                url: self.model.get('_copyDomainUrl') + 'domainid=' + distID + '&noofdomain=' + domainNumbers,
                contentType: "application/json",
                success: function (response) {
                    // crossDomain: true,
                    console.log(response)
                    if (response.messageType === "SUCCESS") {
                        
                        var modalHtml=  self.getModalHtml(response );
                        console.log(modalHtml);
                        $('#popUpModal .modal-body').html(modalHtml);
                        $('#modalDownloadBtn').show();
                        $('#popUpModal').modal('show');

                        // $('#popUpModal .modal-body').text('Copy Successfull');
                        // $('#popUpModal').modal('show');
                    }
                    else if (response.messageType === "ERROR") {
                        $('#popUpModal .modal-body').text('Copy Unsuccessfull');
                        $('#modalDownloadBtn').hide();
                        $('#popUpModal').modal('show');
                    }
                    self.cursordefault();

                },
                error: function (response) {

                    $('#popUpModal .modal-body').text('Copy Unsuccessfull');
                    $('#modalDownloadBtn').hide();
                    $('#popUpModal').modal('show');



                    console.log("Error  ", response);
                    self.cursordefault();
                },
                beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + self.model.get('_globalSccessToken'));
                }
            });

        };
        
        this.getModalHtml=function(res ){
            var len = res.data.domains.length;
            var liEmenets = '';
            self.model.downloadCourseId = [];
            for(var i=0;i<len;i++){
                liEmenets += '<li>(ID:'+res.data.domains[i].domainId +') '+ res.data.domains[i].name  +'</li>';
                self.model.downloadCourseId.push(res.data.domains[i].domainId);
            }
            
            var msg = '<p>Demo domains are created successfully</p>';
            var ulElem =msg+ '<div id="copiedListDiv"><ul>'+liEmenets+'<ul></div>';
            
           // $('#modalDownloadBtn').attr('href', self.model.get('_reportDownload')+self.model.downloadCourseId.join());
 
            $('#modalDownloadBtn').attr('href', self.model.get('_reportDownload'));

            return ulElem;
        };
        
         $('#modalDownloadBtn').off('click').on('click', function () {
		 
           $('#popUpModal').modal('hide');

             
            //  $.ajax({
            //     type: "GET",
            //     url: self.model.get('__reportDownload') +self.model.downloadCourseId.join() ,
            //     contentType: "application/json",
            //     success: function (response) {
            //         // crossDomain: true,
            //         console.log(response)
                  
            //     },
            //     error: function (response) {

            //     },
               
            // });
             
             
         });
         
        $('#createLaunchBtn').off('click').on('click', function () {

            // console.log($('input[name=radio1]:checked', '.box_content').data('distid'));
            var selectedRadioLen = $('input[name=radio1]:checked', '.box_content').length;
            var domainNumbers = parseInt($('.spinner input').val());
            console.log(selectedRadioLen, domainNumbers)
            if (domainNumbers > 0 && selectedRadioLen > 0) {
                var selectedDistId = $('input[name=radio1]:checked', '.box_content').data('distid');
                self.callCopyDomainAjax(selectedDistId, domainNumbers);
            }else{
               // alert("Please Select the Domai First");
                
                 $('#popUpModal .modal-body').text('Please Select the Domain First');
                        $('#modalDownloadBtn').hide();
                        $('#popUpModal').modal('show');
            }

        //     var res = {
        //         "messageType": "SUCCESS",
        //         "message": "Domain created successfully",
        //         "data": {
        //             "domains": [
        //                 {
        //                     "domainId": "48268605",
        //                     "name": "Edivate Learn Demo District-163239",
        //                     "userspace": null,
        //                     "parentId": null,
        //                     "reference": null
        //                 },
        //                 {
        //                     "domainId": "48269681",
        //                     "name": "Edivate Learn Demo School 1",
        //                     "userspace": null,
        //                     "parentId": null,
        //                     "reference": null
        //                 },
        //                 {
        //                     "domainId": "48269682",
        //                     "name": "Edivate Learn Demo School 2",
        //                     "userspace": null,
        //                     "parentId": null,
        //                     "reference": null
        //                 }
        //             ]
        //         }
        //     }
            
            
        //    var modalHtml=  self.getModalHtml(res );
        //    console.log(modalHtml);
        //     $('#popUpModal .modal-body').html(modalHtml);
        //     $('#popUpModal').modal('show');

        });


        self.loginoutevent();
    };

    this.showDemoSetUp = function () {
        console.log("Demo Setup triggered");
        $('#adminContainer').hide();
        $('#snw-license-usage-report02').hide();
        $('#snw-license-usage-report05').hide();
        $('#demoSetupPage').show();

        this.callDemoSetUpDataAjax();
        console.log("Ajax Called");

    };
    this.getDistrctDatas = function () {

        var domainModal = self.model.get('_demoDomainData');
        console.log(domainModal);
        var len = domainModal.length;
        var distObjArray = [];
        for (var i = 0; i < len; i++) {
            //   console.log(i);
            //  var domaintype = domainModal[i].data.customization.edivatelearn.domaintype;
            // console.log(domainModal[i])
            domaintypeobj = domainModal[i].data.customization;
            if (domaintypeobj != undefined && domaintypeobj != null && domaintypeobj.edivatelearn != null && domaintypeobj.edivatelearn != undefined
                && domaintypeobj.edivatelearn.domaintype != null && domaintypeobj.edivatelearn.domaintype != undefined) {
                var domaintype = domaintypeobj.edivatelearn.domaintype;
                if (domaintype === 'district') {
                    var tempDeepCloned = $.extend(true, {}, domainModal[i]);
                    distObjArray.push(tempDeepCloned);
                }
            }
        }
        //   console.log(distObjArray);
        return distObjArray;


    };
    this.getDistrictSchool = function (distObject) {
        var distId = distObject.id;
        var domainModal = self.model.get('_demoDomainData')
        var len = domainModal.length;
        var schoolObjArray = [];
        for (var i = 0; i < len; i++) {

            if (distId === domainModal[i].parentid) {
                var tempDeepCloned = $.extend(true, {}, domainModal[i]);
                schoolObjArray.push(tempDeepCloned);
            }

        }
        return schoolObjArray;
    };
    this.filterDataForRadioList = function () {

        var districtDomainObj = this.getDistrctDatas();
        var len = districtDomainObj.length;
        for (var i = 0; i < len; i++) {
            var scholldata = this.getDistrictSchool(districtDomainObj[i]);
            districtDomainObj[i].listOfSchool = scholldata;
        }

        //setting final Modal to be parsed by view for Demo domain radio list box
        self.model.set('_distSchlDomainFilterData', districtDomainObj);

        this.updateDemoDomainRadioList();

    };
    this.getDistricPanelHtml = function (distObj) {


        console.log(distObj);
        return ('<div class="panel-heading" id=panel_' + distObj.id + '><h4 class="panel-title"><div class="chkboxWrap"> <div class="radio"><input type="radio"  value="option8" name="radio1" id = ' + 'radio_' + distObj.id + ' Data-distid =' + distObj.id + ' ><label for=' + 'radio_' + distObj.id + '> </label></div></div><a href=' + '#collapse_' + distObj.id + ' data-toggle="collapse" class="" aria-expanded="true"><span> <i class="fa fa-caret-down"></i></span><div>' + distObj.name + '</div></a></h4></div>');
    };

    this.getCollapableRowHtml = function (distObj) {

        var len = distObj.listOfSchool.length;
        if (len > 0) {
            var collapsablelistRow = '<div class="panel-collapse collapse" id=' + 'collapse_' + distObj.id + ' aria-expanded="false" style="height: 0px;"><ul class="list-group">';
            var listRow = ''
            for (var i = 0; i < len; i++) {
                listRow = '<li class="list-group-item"><span class="txt_list">' + distObj.listOfSchool[i].name + '</span></li>';
            }
            collapsablelistRow = collapsablelistRow + listRow + ' </ul></div>';

            return collapsablelistRow;
        } else {
            return '';
        }





        //        <div class="panel-collapse collapse" id="collapse5" aria-expanded="false" style="height: 0px;">
        //                        <ul class="list-group">
        //                              <li class="list-group-item"> <span class="chkboxWrap" style="visibility:hidden;">
        //                                <div class="radio">
        //                                <input type="radio" checked="" value="option2" id="radio2" name="radio1">
        //                                <label for="radio2"> </label>
        //                              </div>
        //                                </span><span class="txt_list">School A School A School A School ASchool ASchool A</span></li>
        //                              <li class="list-group-item"><span class="chkboxWrap" style="visibility:hidden;">
        //                                <div class="radio">
        //                                <input type="radio" checked="" value="option3" id="radio3" name="radio1">
        //                                <label for="radio3"> </label>
        //                              </div>
        //                                </span><span class="txt_list">School B School B School B School B</span></li>
        //                            </ul>
        //                      </div>
    }
    this.updateDemoDomainRadioList = function () {
        console.log("Update Domain Radio Button view");

        console.log(self.model.get('_distSchlDomainFilterData'))

        var distSchlArrayRef = self.model.get('_distSchlDomainFilterData');
        var distLen = distSchlArrayRef.length;
        for (var i = 0; i < distLen; i++) {
            var radioPanelRow = ' <div class="panel-group"><div class="panel panel-default">'
            var distTopCollapseablePanel = this.getDistricPanelHtml(distSchlArrayRef[i]);
            radioPanelRow = radioPanelRow + distTopCollapseablePanel + '</div></div>';

            $('.box_content').append(radioPanelRow);
            var collapsableRow = this.getCollapableRowHtml(distSchlArrayRef[i]);

            //   $(collapsableRow).insertAfter('.panel-heading');
            console.log(distSchlArrayRef[i].id);
            $(collapsableRow).insertAfter('#panel_' + distSchlArrayRef[i].id)
        }



        //        <div class="panel-group">
        //                    <div class="panel panel-default">
        //                          <div class="panel-heading">
        //                        <h4 class="panel-title">
        //                              <div class="chkboxWrap">
        //                            <div class="radio">
        //                                  <input type="radio" checked="" value="option8" id="radio8" name="radio1">
        //                                  <label for="radio8"> </label>
        //                                </div>
        //                          </div>
        //                              <a href="#collapse5" data-toggle="collapse" class="" aria-expanded="true"> <span> <i class="fa fa-caret-down"></i></span>
        //                          <div>District</div>
        //                          </a> </h4>
        //                      </div>
        //                          <div class="panel-collapse collapse in" id="collapse5" aria-expanded="true">
        //                        <ul class="list-group">
        //                              <li class="list-group-item"> <span class="chkboxWrap" style="visibility:hidden;">
        //                                <div class="radio">
        //                                <input type="radio" checked="" value="option2" id="radio2" name="radio1">
        //                                <label for="radio2"> </label>
        //                              </div>
        //                                </span><span class="txt_list">School A School A School A School ASchool ASchool A</span></li>
        //                              <li class="list-group-item"><span class="chkboxWrap" style="visibility:hidden;">
        //                                <div class="radio">
        //                                <input type="radio" checked="" value="option3" id="radio3" name="radio1">
        //                                <label for="radio3"> </label>
        //                              </div>
        //                                </span><span class="txt_list">School B School B School B School B</span></li>
        //                            </ul>
        //                      </div>
        //                        </div>
        //                  </div>
        //        



    }
    this.callDemoSetUpDataAjax = function () {
        self.cursorwait();

        $.ajax({
            type: "GET",
            url: self.model.get('_demoDomainUrl'),
            crossDomain: true,
            contentType: "application/json",
            success: function (response) {
                console.log(response)
                if (response.messageType === "SUCCESS") {

                    self.model.set('_demoDomainData', response.data.domains);
                    self.filterDataForRadioList();
                }
                else if (response.messageType === "ERROR") {

                }
                self.cursordefault();

            },
            error: function (response) {
                console.log("Error  ", response);
                self.cursordefault();
            },
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + self.model.get('_globalSccessToken'));
            }
        });

    };

    this.saveProviderListData = function () {
        var html = "",
            result = self.model.get('configResult');
        self.model.ajaxObjCall({ //NKN
            type: "GET",
            url: result.New_District_Popup_Provider,
            crossDomain: true,
            contentType: "application/json"
        }, self.saveProviderListDataCall, self.commonError, void 0, {
                successVal: {}
            });
    };

    this.entireCatalogSelected = function ($element) {
        var selectedCourses = [];

        if (self.model.get('_selectedCatalogs').length > 0) {
            $element.parents('.formTable').find('.course-list .selectCourse option').prop('selected', 'selected');

            $element.parents('.formTable').find('.course-list .selectCourse option').each(function () {
                selectedCourses.push($(this).attr('data-course-id'));
            });
        }

        self.model.set('selectedCourses', selectedCourses);
        self.bindevent();

    };

    this.selectiveCourseCatalogSelected = function ($element) {
        //Reset the selection
        var subscourselist = [], domainData;

        $('.course-list .selectCourse option').prop('selected', false);
        self.bindevent();
        self.model.set('selectedCourses', []);

        domainData = self.model.get('_domain');

        if (domainData != null) {
            subscourselist = domainData.SelectiveBoxReset == true ? [] : domainData.data.subscribedcourselist;
        }

        if (subscourselist.length != 0)
            self.setSelectiveCourseRetrieved(subscourselist);
    };

    this.setSelectiveCourseRetrieved = function (valueArray) {
        //select the subscribed course
        self.setSelectCourseDropdown(valueArray);
        self.model.set('selectedCourses', valueArray);
        self.bindevent();
    };

    this.setSelectCourseDropdown = function (valuesArray) {
        var selectedCourses = $.unique((self.model.get('selectedCourses')).sort());
        selectedCourses = selectedCourses.concat(valuesArray);
        $.each(selectedCourses, function (index, value) {
            $(".course-list .selectCourse option[data-course-id='" + value + "']").prop('selected', true);
        });
        self.model.set('selectedCourses', $.unique(selectedCourses.sort()));
    };

    this.setCatalogDropdown = function (valuesArray) {
        $.each(valuesArray, function (index, value) {
            $(".catalog-list option[data-domain-id='" + value + "']").prop('selected', true);
        });
    };

    this.unsetSelectCourseDropdown = function (valuesArray) {
        var selectedCourses = $.unique((self.model.get('selectedCourses')).sort());
        $.each(valuesArray, function (index, value) {
            $(".course-list .selectCourse option[data-course-id='" + value + "']").prop('selected', false);
            selectedCourses = $.grep(selectedCourses, function (selectedCoursesValue) {
                return selectedCoursesValue != value;
            });
        });
        self.model.set('selectedCourses', selectedCourses);
    };

    this.setSelectiveCourseRetrieved = function (valueArray) {
        //select the subscribed course
        self.setSelectCourseDropdown(valueArray);
        self.model.set('selectedCourses', valueArray);
        self.bindevent();
    };

    //This method is used to prepare the catalog vs course 
    this.cataLogVsCourseForSchool = function () {
        var _selectedCatalog = [], _selectedCourse = [];
        if (self.model.get('_parentDomain') != null) {
            _selectedCatalog = self.model.get('_parentDomain').data.subscribedproviderlist;
            _selectedCourse = self.model.get('_parentDomain').data.subscribedcourselist;
        }
        //catalog vs all course of catalog map
        var _districtCatalogAllCourse = self.model.get('_allCoorsesListDistrict'),
            catalogVsCourse = {};
        $.each(_selectedCatalog, function (index, _catalogValue) {
            var filteredCourse = [];
            var catalogAllCourse = _districtCatalogAllCourse[_catalogValue];
            $.each(catalogAllCourse, function (key, courseValue) {
                $.each(_selectedCourse, function (index, _selectedCoursevalue) {
                    if (_selectedCoursevalue == courseValue.id) {
                        filteredCourse.push(courseValue);
                    }
                });
            });
            catalogVsCourse[_catalogValue] = $.unique(filteredCourse.sort());
        });
        self.model.set('catalogVsCourse', catalogVsCourse);
    };

    this.toggleEntireSelectiveRadio = function (_courselength, selector) {
        var _selectedCatalog = self.model.get('_selectedCatalogs'),
            _selectedCatalogLength = 0;

        $.each(_selectedCatalog, function (index, catalogValue) {
            if (!($.isEmptyObject(self.model.get('catalogVsCourse')))) {
                _selectedCatalogLength = _selectedCatalogLength + ((self.model.get('catalogVsCourse'))[catalogValue]).length;
            }
        });

        if (_courselength == _selectedCatalogLength) {
            self.setEntireSelectiveradio(selector, true, false);
        }
        else {
            self.setEntireSelectiveradio(selector, false, true);
        }

    };

    this.toggleDistrictEntireSelectiveRadio = function (selectedCatalogArray, selectedCoursesLength, selector) {
        var selectedCatalogLength = 0,
            allCatalogList = self.model.get('_allCoorsesList');

        $.each(selectedCatalogArray, function (index, selectedCatalogValue) {
            $.each(allCatalogList, function (key, value) {
                if (key == selectedCatalogValue) {
                    selectedCatalogLength += value.length;
                }
            });
        });

        if (selectedCoursesLength == selectedCatalogLength) {
            self.setEntireSelectiveradio(selector, true, false);
        }
        else {
            self.setEntireSelectiveradio(selector, false, true);
        }
    };

    this.setEntireSelectiveradio = function (selector, entireVal, selectiveVal) {
        selector.find('.entire-catalog').prop('checked', entireVal);
        selector.find('.selective-course').prop('checked', selectiveVal);
    };

    //This method is specific to edit school Entire/selective radio button selection 
    this.setEditSchoolEntireSelectiveRadio = function (parentCourselist, Childcourselist, selector) {
        var uniqueDistrictCourse = $.unique(parentCourselist.sort());
        if (uniqueDistrictCourse.length == Childcourselist.length) {
            self.setEntireSelectiveradio(selector, true, false);
        }
        else {
            self.setEntireSelectiveradio(selector, false, true);
        }
    };

    this.courseSelectedAction = function ($element) {
        var selectedCourses = self.model.get('selectedCourses'),
            totalElements = $element.parents('select').find('option').length,
            selectedElements = $element.parents('select').find(':selected').length,
            dataCourseId = $element.attr('data-course-id'),
            selectedCatalog = self.model.get('_selectedCatalogs');
        self.cataLogVsCourseForSchool();

        if (selectedCourses.indexOf(dataCourseId) === -1) {
            selectedCourses.push(dataCourseId);
        }

        $element.addClass('newEle');
        self.model.set('selectedCourses', selectedCourses);

        if (self.model.get('isSchoolPopup'))
            self.toggleEntireSelectiveRadio(selectedElements, $element.parents('.formTable'));
        else
            self.toggleDistrictEntireSelectiveRadio(selectedCatalog, selectedElements, $element.parents('.formTable'));
    };

    this.courseUnSelectedAction = function ($element) {
        var selectedCourses = self.model.get('selectedCourses'), selectedElements = $element.parents('select').find(':selected').length,
            dataCourseId = $element.attr('data-course-id'), selectedCatalog = self.model.get('_selectedCatalogs');

        self.cataLogVsCourseForSchool();

        while (selectedCourses.indexOf(dataCourseId) > -1) {
            selectedCourses.splice(selectedCourses.indexOf(dataCourseId), 1);
        }

        self.model.set('selectedCourses', selectedCourses);
        if (self.model.get('isSchoolPopup'))
            self.toggleEntireSelectiveRadio(selectedElements, $element.parents('.formTable'));
        else
            self.toggleDistrictEntireSelectiveRadio(selectedCatalog, selectedElements, $element.parents('.formTable'));
    };

    this.prepareSchoolCourseDropDown = function (selectedCatalogs) {
        var _selectedCatalogCourse = [], courseSelectListHTML = "";
        $.each(selectedCatalogs, function (index, catalogValue) {
            _selectedCatalogCourse.push(self.model.get('catalogVsCourse')[catalogValue]);
        });

        $.each(_selectedCatalogCourse, function (index, ListOfcourse) {
            $.each(ListOfcourse, function (key, course) {
                courseSelectListHTML += '<option type="checkbox" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '" >' + course.title + '</option>';
            });
        });
        $(".corseselectList select").html(courseSelectListHTML);
        self.setSelectCourseDropdown(self.model.get('selectedCourses'));
    };

    this.editSchool = function (fromselector, data_id, stateSelctedVal) {
        var editScholPrntId = '';
        self.model.ajaxObjCall({ //1060
            type: "GET",
            url: self.model.get('_config').getDomainData + '/' + data_id
        }, self.editSchoolData, self.commonError, void 0, {
                successVal: {
                    stateSelctedVal: stateSelctedVal,
                    fromselector: fromselector
                }
            });
    };

    this.saveSchool = function (formElementSelector, data) {
        var urlChecker = '',
            someDate,
            numberOfDaysToAdd,
            date,
            dateFormat,
            dateSplice,
            Month,
            dateSplitStrat,
            catalogListArr,
            courseListArr,
            Datee,
            cuurentDate,
            dateSplitend,
            pilotenddate,
            subscriptionstartdate,
            endPilot_Date;
        createdDomainObj = {};
        subscriptionstartdate = self.model.get('subscriptionstartdate');
        pilotenddate = self.model.get('pilotenddate');
        currentDate = formElementSelector.find(".date-field").val();
        catalogListArr = self.model.get('_selectedCatalogs');
        courseListArr = self.model.get('selectedCourses');
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            dateSplitStrat = currentDate.split('-');
            currentDate = dateSplitStrat[2] + '-' + dateSplitStrat[0] + '-' + dateSplitStrat[1];
            dateSplitend = subscriptionstartdate.split('-');
            subscriptionstartdate = dateSplitend[2] + '-' + dateSplitend[0] + '-' + dateSplitend[1];
            cuurentDate = pilotenddate.split('-');
            pilotenddate = cuurentDate[2] + '-' + cuurentDate[0] + '-' + cuurentDate[1];
            if (new Date(currentDate).getTime() < new Date(subscriptionstartdate).getTime() || new Date(currentDate).getTime() > new Date(pilotenddate).getTime()) {
                self.cursordefault();
                alert('Pilot date should not be less than Subscription Start Date Or School Pilot End date cannot be greater than District Pilot End date.');
                return;
            }
        } else {
            if (new Date(currentDate).getTime() < new Date(subscriptionstartdate).getTime() || new Date(currentDate).getTime() > new Date(pilotenddate).getTime()) {
                self.cursordefault();
                alert('Pilot date should not be less than Subscription Start Date Or School Pilot End date cannot be greater than District Pilot End date.');
                return;
            }
        }
        if (data === 'create') {
            endPilot_Date = formElementSelector.find(".date-field").val();
            if (formElementSelector.find(".pilot-domain").is(":checked") && formElementSelector.find(".date-field").val() == "") {
                someDate = new Date();
                numberOfDaysToAdd = 90;
                someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
                date = new Date(someDate);
                endPilot_Date = date.toLocaleDateString().replace(/\//g, "-");

            }
            if (endPilot_Date) {
                endPilot_Date = self.createDataFormat(endPilot_Date);
            }
            createdDomainObj = {
                disrict: formElementSelector.find(".schooldistrictlist").val(),
                name: formElementSelector.find(".schldomainname").val(),
                loginPrefix: formElementSelector.find(".loginprefix").val(),
                externalId: formElementSelector.find(".externalid").val(),
                licenseType: formElementSelector.find(".licensetype").val(),
                licensePool: formElementSelector.find('.license-pool').val(),
                fullSubscription: formElementSelector.find(".entire-catalog").is(":checked"),
                courseCatalogs: catalogListArr,
                courseSelection: courseListArr,
                numbersOfLicense: formElementSelector.find(".license-number").val(),
                pilotDomain: formElementSelector.find(".pilot-domain").is(":checked"),
                pilotEndDate: endPilot_Date
            };
            urlChecker = self.model.get('_config').createSchool;
        }
        if (data === 'edit') {
            createdDomainObj = {
                domainid: self.model.get('_domainId'),
                disrict: formElementSelector.find(".schooldistrictlist").val(),
                name: formElementSelector.find(".schldomainname").val(),
                loginPrefix: formElementSelector.find(".loginprefix").val(),
                externalId: formElementSelector.find(".externalid").val(),
                fullSubscription: formElementSelector.find(".entire-catalog").is(":checked"),
                courseCatalogs: catalogListArr,
                courseSelection: courseListArr,
                licenseType: formElementSelector.find(".licensetype").val(),
                licensePool: formElementSelector.find('.license-pool').val(),
                numbersOfLicense: formElementSelector.find(".license-number").val(),
                pilotDomain: formElementSelector.find(".pilot-domain").is(":checked"),
                pilotEndDate: formElementSelector.find(".date-field").val()
            };
            urlChecker = self.model.get('_config').eidtSchool;
        }
        self.model.ajaxObjCall({ //1142
            type: "POST",
            url: urlChecker,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(createdDomainObj)
        }, self.saveSchoolData, self.commonError, void 0, {
                successVal: {}
            });
    };

    this.createDataFormat = function (dateValue) {
        var dateSplice,
            Month,
            Datee;
        if (dateValue.indexOf('-') > 0) {
            dateSplice = dateValue.split('-');
            Month = dateSplice[0];
            Datee = dateSplice[1];

            if (dateSplice[0].length === 1) {
                dateSplice[0] = [];
                dateSplice[0] = '0' + Month;
            }
            if (dateSplice[1].length === 1) {
                dateSplice[1] = [];
                dateSplice[1] = '0' + Datee;
            }
            return dateSplice.join('-');
        }
        return dateValue
    };

    this.radioButton = function (dataClass) {
        $('.' + dataClass).find('.selective-course').prop("checked", true);
        $('.' + dataClass).find('.entire-catalog').prop("checked", false);
    };

    this.loginoutevent = function () {
        var result = self.model.get('configResult');
        $('.LogOuticon').off('click').on('click', function () {
            self.loginoutIconClick(result)
        });
    };


    this.loginoutIconClick = function (result) {
        self.model.set('_baseUrl', result.Logouturl);
        self.model.ajaxObjCall({ //1182
            type: "GET",
            url: self.model.get('_baseUrl'),
            crossDomain: true,
            contentType: "application/json",
        }, self.logout, self.commonError, void 0, {
                successVal: {}
            });
    };



    this.sortingDistrict = function () {
        //create global variable and give it start value 1
        var sortBy = "",
            parent = $('.domainContainer > ul'),
            keySelector = ".disTrictList",
            childSelector = $('.domainContainer > ul > li'),
            asc = true;
        var items = parent.children(childSelector).sort(function (a, b) {
            var vA = $.trim($(keySelector, a).text());
            var vB = $.trim($(keySelector, b).text());
            return ((vA < vB) ? -1 : (vA > vB) ? 1 : 0) * (asc ? 1 : -1);
        });
        parent.empty().append(items);

    };

    this.loadingdistrict = function () {
        $('.districtTabBox').remove();
        var html = "",
            result = self.model.get('configResult'),
            state_list = "",
            split_data = {},
            schoolId = '',
            urlStore = result.DistrictList;
        self.model.set('_rowView', 10);
        $('#footer .domain-showEntry option:first').prop('selected', 'selected');
        self.model.set('_baseUrl', result.Domainlist);
        self.model.ajaxObjCall({ //1227
            type: "GET",
            url: self.model.get('_baseUrl'),
            crossDomain: true,
            contentType: "application/json",
        }, self.districtOptionLoading, self.commonError, void 0, {
                successVal: {
                    html: html,
                    split_data: split_data,
                    state_list: state_list,
                    urlStore: urlStore
                }
            });
        self.model.ajaxObjCall({ //NKN
            type: "GET",
            url: result.New_District_Popup_Provider,
            crossDomain: true,
            contentType: "application/json"
        }, self.saveProviderListDataCall, self.commonError, void 0, {
                successVal: {}
            });
    };
    this.saveProviderListDataCall = function (res) {
        var allCatalogs = [],
            loopVar, catalogId;
        if (res && res.data) {
            for (loopVar = 0; loopVar < res.data.domains.length; loopVar++) {
                allCatalogs.push(res.data.domains[loopVar]);
                catalogId = res.data.domains[loopVar].id;
                self.getCatalogCourse(catalogId, res);
                self.model.set('allCatalogsListDistrict', allCatalogs);
                self.model.set('allCatalogsList', allCatalogs);
            }
        }
    };

    this.getCatalogCourse = function (catalogId, res) {
        self.cursorwait();
        var courseListURI = self.model.get('_config').courseList + "/" + catalogId;
        // $('#example' + $(this).attr('data-domain-id')).attr('checked', true);
        self.model.ajaxObjCall({ //1567
            url: courseListURI
        }, self.courseListDataToModel, self.commonError, void 0, {
                successVal: {
                    res: res,
                    elementId: catalogId
                }
            });
    };

    this.courseListDataToModel = function (rest, parametersObj) {
        var _allCoorsesList = self.model.get('_allCoorsesList'),
            elementId = parametersObj.elementId,
            courses;
        if (rest.data) {
            courses = rest.data.domain
            _allCoorsesList[elementId] = courses;
        }
        self.model.set('_allCoorsesListDistrict', _allCoorsesList);
        self.model.set('_allCoorsesList', _allCoorsesList);
        self.cursordefault();
    };
    this.statelistchange = function () {
        $('.statename').off('change').on('change', function (e) {
            if ($(this).val() === 'Select State') {
                return;
            }
            self.cursorwait();
            $('#snwadminSearch .search input').val('');
            $('.FootPagination').show();
            self.model.set('_dropdownCount', 10);
            self.model.set('_landingPagePrevCount', 0);
            self.model.set('_previousLandingCountArray', [0])
            $('.domain-showEntry').val(self.model.get('_dropdownCount'));
            var html = '',
                result = self.model.get('configResult'),
                idUrl = $(this).val(),
                schlId = '';
            self.model.set({
                '_postId': $(this).val(),
                '_optionselector': $(this).val()
            });
            self.model.set('_baseUrl', result.DistrictList);
            self.model.ajaxObjCall({ //1317
                type: "GET",
                url: self.model.get('_baseUrl') + '/' + idUrl + '?querystring=0&limit=' + self.model.get('_dropdownCount') + '',
                crossDomain: true,
                contentType: "application/json"
            }, self.districtOptionLoadingData, self.commonError, self.nextDomainCallComplete, {
                    successVal: {}
                });
        });
    };

    this.cursorwait = function () {
        $('body').css('cursor', 'wait');
        $('.grayBg,.snwLoader').show();
        $('.grayBg,.popGrayBg').css({
            'height': $('body').height()
        });
    };

    this.cursordefault = function () {
        $('body').css('cursor', 'default');
        $('.grayBg,.snwLoader').hide();
        // $('td').trigger('hover');
    };

    this.getProviderList = function () {
        var html = '',
            result = self.model.get('configResult');
        self.model.ajaxObjCall({ //NKN
            type: "GET",
            url: result.New_District_Popup_Provider,
            crossDomain: true,
            contentType: "application/json"
        }, self.getProviderListDataCall, self.commonError, void 0, {
                successVal: {}
            });
    };

    this.getConfig = function () {
        $.when($.ajax("config.json"))
            .then(function (data, txtStatus, jqXHR) {
                self.model.set('_config', data);
            });
    };

    this.courseCatalogsSelected = function ($element) {
        var localLength,
            lclLngthEdit,
            _customCatalogId = self.model.get('_customCatalogId'),
            indexArray, data_domain_id,
            indexArrayEdit,
            totalElements = $element.parents('select').find('option').length,
            selectedElements = $element.parents('select').find(':selected').length,
            selectedCourses = self.model.get('selectedCourses'),
            selectiveCourses = self.model.get('selectiveCourses'),
            _selectedCatalogs = self.model.get('_selectedCatalogs')
            ;
        $element.addClass('newEle');

        if (_selectedCatalogs.length > 0 && !($(".entire-catalog:visible").is(":checked"))) {
            if (!selectiveCourses) {
                selectiveCourses = [];
            }
            selectiveCourses = selectiveCourses.concat(selectedCourses);
            self.model.set('selectiveCourses', selectiveCourses);
        } else if (_selectedCatalogs.length === 0) {
            self.model.set('selectiveCourses', []);
        }
        data_domain_id = $element.attr('data-domain-id');
        if (data_domain_id == self.model.get('_customCatalogId')) {
            _selectedCatalogs.unshift(data_domain_id);
        } else {
            _selectedCatalogs.push(data_domain_id);
        }
        self.model.set('_selectedCatalogs', _selectedCatalogs);
        $('#example' + data_domain_id + ':visible').prop("checked", true);
        $('#demo' + data_domain_id + ':visible').prop("checked", true);
        if ($('input[data-domain-id=' + self.model.get('_customCatalogId') + ']').is(':checked')) {
            $('.inputTracker input').prop("checked", false);
            $('.inputTrackerEdit input').prop("checked", false);
        }
        $('#demo' + data_domain_id).attr('checked', 'checked');
        if ($element.attr('data-domain-id') == self.model.get('_customCatalogId') || _selectedCatalogs.indexOf(self.model.get('_customCatalogId')) > -1) {
            $('.inputTracker input').prop("checked", false);
            $('.inputTrackerEdit input').prop("checked", false);
        }
        if (self.model.get('isSchoolPopup') === false) {
            self.updateCourseList();
        }
        else {
            self.prepareSchoolCourseDropDown(_selectedCatalogs);
            if ($(".entire-catalog:visible").is(":checked")) {
                _allCourseListDistrict = self.model.get('_allCoorsesListDistrict');
                _deselectedCatalogAllCourse = _allCourseListDistrict[data_domain_id].map(function (value) { return value.id });
                self.setSelectCourseDropdown(_deselectedCatalogAllCourse);
                self.bindevent();
            }
        }

    };

    //This method is for updating/selecting the course textarea when a catalog is unselected 
    this.updateCourseListForSchool = function (catalogId) {
        _allCourseListDistrict = self.model.get('_allCoorsesListDistrict');
        _deselectedCatalogAllCourse = _allCourseListDistrict[catalogId].map(function (value) { return value.id });
        if (self.model.get('_domain') != null)
            _domainSelectedCourse = self.model.get('_domain').data.subscribedcourselist;
        _deselectedCatalogCourse = [];

        $.each(_domainSelectedCourse, function (index, domainSelectedCourse) {
            $.each(_deselectedCatalogAllCourse, function (index, deselectedCatalogAllCourse) {
                if (domainSelectedCourse != deselectedCatalogAllCourse) {
                    _deselectedCatalogCourse.push(domainSelectedCourse);
                }
            });
        });

        self.unsetSelectCourseDropdown(_deselectedCatalogCourse);
        self.bindevent();
    };



    this.courseCatalogsUnSelected = function ($element) {
        var localLength,
            lclLngthEdit,
            indexArray, data_domain_id,
            indexArrayEdit,
            selectedCourses = self.model.get('selectedCourses'),
            selectiveCourses = self.model.get('selectiveCourses'),
            _selectedCatalogs = self.model.get('_selectedCatalogs');

        if (_selectedCatalogs.length > 0 && !($(".entire-catalog:visible").is(":checked"))) {
            if (!selectiveCourses) {
                selectiveCourses = [];
            }
            selectiveCourses = selectiveCourses.concat(selectedCourses);
            self.model.set('selectiveCourses', selectiveCourses);
        } else if (_selectedCatalogs.length === 0) {
            self.model.set('selectiveCourses', []);
        }
        data_domain_id = $element.attr('data-domain-id');
        _selectedCatalogs.splice(_selectedCatalogs.indexOf(data_domain_id), 1);
        self.model.set('_selectedCatalogs', _selectedCatalogs);
        $('#example' + data_domain_id + ':visible').prop("checked", false);
        $('#demo' + data_domain_id + ':visible').prop("checked", false);
        if ($element.attr('data-domain-id') == self.model.get('_customCatalogId')) {
            localLength = _selectedCatalogs.length;
            lclLngthEdit = _selectedCatalogs.length;
            indexArray = [];
            indexArrayEdit = [];
            for (i = 0; i < localLength; i++) {
                indexArray.push(_selectedCatalogs[i]);
                $('#demo' + _selectedCatalogs[i]).prop("checked", true);
            }
            for (i = 0; i < lclLngthEdit; i++) {
                // $('#snwCorsecatalogList').hide();
                indexArrayEdit.push(_selectedCatalogs[i]);
                $('#example' + _selectedCatalogs[i]).prop("checked", true);
            }
        }
        $('#demo' + data_domain_id).removeAttr('checked');
        if (self.model.get('isSchoolPopup') === false)
            self.updateCourseList();
        else {
            self.prepareSchoolCourseDropDown(_selectedCatalogs);
            self.bindevent();
            //if($(".entire-catalog:visible").is(":checked")){
            _allCourseListDistrict = self.model.get('_allCoorsesListDistrict');
            _deselectedCatalogAllCourse = _allCourseListDistrict[data_domain_id].map(function (value) { return value.id });
            self.unsetSelectCourseDropdown(_deselectedCatalogAllCourse);
            self.bindevent();
            self.setSelectCourseDropdown(self.model.get('selectedCourses'));
            self.bindevent();
            //self.updateCourseListForSchool(data_domain_id);
            self.toggleEntireSelectiveRadio($element.parents('.formTable').find('.course-list').find('.select2-selection__choice').length, $element.parents('.formTable'));
        }
    };
    this.updateCourseList = function () {
        var selectedCourseCatalog = $('.catalog-list:visible').find('input[type="checkbox"]').filter(":checked"),
            totalCourses = [],
            courseListURI,
            loopVar,
            tempArr = [],
            addHTML,
            _selectedCatalogsLength,
            _selectedCatalogs = self.model.get('_selectedCatalogs'),
            courseSelectListHTML = "";
        self.model.set('totalCoursesForDist', []);
        self.model.set('currentresponsecount', 0);
        self.model.set('selectedCourses', []);
        _selectedCatalogsLength = _selectedCatalogs.length;
        if (_selectedCatalogs.length > 0) {
            self.cursorwait();
            for (loopVar = 0; loopVar < _selectedCatalogs.length; loopVar++) {
                if (tempArr.indexOf(_selectedCatalogs[loopVar]) === -1) {
                    tempArr.push(_selectedCatalogs[loopVar]);
                    courseListURI = self.model.get('_config').courseList + "/" + _selectedCatalogs[loopVar];
                    if (loopVar === _selectedCatalogs.length - 1) {
                        addHTML = true;
                    }
                    self.model.ajaxObjCall({ //1447
                        url: courseListURI
                    }, self.updateCourseData, self.commonError, void 0, {
                            successVal: {
                                selectedCourseCatalog: selectedCourseCatalog,
                                ind: loopVar,
                                addHTML: addHTML,
                                courseSelectListHTML: courseSelectListHTML,
                                _selectedCatalogsLength: _selectedCatalogsLength,
                                _selectedCatalogs: _selectedCatalogs
                            }
                        });
                }
            }
        } else {
            courseSelectListHTML = '';
            $(".corseselectList select").html(courseSelectListHTML);
        }
        self.bindevent();
    };

    this.domainWelcomeLetter = function () {
        var name,
            welcomeLetterURI,
            form;
        name = self.model.get('_sessionData').firstname + " " + self.model.get('_sessionData').lastname;
        welcomeLetterURI = self.model.get('_config').welcomeLetter + '/' + $('.editwelcome').data("domain-id") + '/' + name;
        form = $('<form></form>').attr('action', welcomeLetterURI).attr('method', 'get');
        form.appendTo('body').submit().remove();
    };

    this.schoolWelcomeLetter = function () {
        var name,
            welcomeLetterURI,
            form;
        name = self.model.get('_sessionData').firstname + " " + self.model.get('_sessionData').lastname;
        welcomeLetterURI = self.model.get('_config').schoolWelcomeLetter + '/' + $('.editschoolwelcome').data("domain-id") + '/' + name;
        form = $('<form></form>').attr('action', welcomeLetterURI).attr('method', 'get');
        form.appendTo('body').submit().remove();
    };

    this.domainFormValidation = function (formElementSelector, requestType) {
        formElementSelector = $(formElementSelector);
        self.domainFormSubmit(formElementSelector, requestType);
    };

    this.domainFormSubmit = function (formElementSelector, requestType) {
        var catalogListArr,
            Month,
            Datee,
            courseListArr,
            endPilot_Date,
            someDate,
            numberOfDaysToAdd,
            createdDomainObj,
            date,
            subscriptionStartDate,
            subscriptionEndDate,
            dateFormat,
            dateSplice,
            domainRequestURI;
        self.cursorwait();
        formElementSelector = $(formElementSelector);
        catalogListArr = [];
        courseListArr = [];
        // formElementSelector.find('.catalog-list input[type="checkbox"]').filter(":checked").each(function() {
        //     catalogListArr.push($(this).data("domain-id"));
        // });
        // formElementSelector.find('.course-list input[type="checkbox"]').filter(":checked").each(function() {
        //     courseListArr.push($(this).data("course-id"));
        // });
        endPilot_Date = formElementSelector.find(".pilot-end").eq(0).val();

        catalogListArr = self.model.get('_selectedCatalogs');
        courseListArr = self.model.get('selectedCourses');
        if (formElementSelector.find(".pilot-end").eq(0).val() == "") {
            someDate = new Date();
            numberOfDaysToAdd = 90;
            someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
            date = new Date(someDate);
            endPilot_Date = date.toLocaleDateString().replace(/\//g, "-");

        }
        endPilot_Date = self.createDataFormat(endPilot_Date);
        subscriptionStartDate = self.createDataFormat(formElementSelector.find(".popupInputDate").eq(0).val());
        subscriptionEndDate = self.createDataFormat(formElementSelector.find(".popupInputDate").eq(1).val());
        self.model.set('_globalCourseCatalog', catalogListArr);
        self.model.set('_globalCourseSelection', courseListArr);
        createdDomainObj = {
            state: formElementSelector.find(".state-code").val(),
            name: formElementSelector.find(".domain-name").val(),
            loginPrefix: formElementSelector.find(".login-prefix").val(),
            externalId: formElementSelector.find(".external-id").val(),
            fullSubscription: formElementSelector.find(".entire-catalog").is(":checked"),
            courseCatalogs: catalogListArr,
            courseSelection: courseListArr,
            subscriptionStartDate: subscriptionStartDate,
            subscriptionEndDate: subscriptionEndDate,
            ltiHashCode: "",
            licenseType: formElementSelector.find('.license-type').val(),
            numbersOfLicense: formElementSelector.find(".license-number").val(),
            licensePool: formElementSelector.find(".license-pool").val(),
            pilotDomain: formElementSelector.find(".pilot-domain").is(":checked"),
            pilotEndDate: endPilot_Date
        };

        domainRequestURI = "";
        if (requestType === "create") {
            domainRequestURI = self.model.get('_config').createDomain;
        } else if (requestType === "edit") {
            domainRequestURI = self.model.get('_config').editDomain + '/' + formElementSelector.attr("data-domain-id");
        }
        self.model.ajaxObjCall({ //1529
            type: "POST",
            url: domainRequestURI,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(createdDomainObj),
            headers: {
                "token": self.model.get('_sessionData').token
            }
        }, self.submitDomainFromData, self.domainFromError, void 0, {
                successVal: {}
            });
    };

    this.domainEditForm = function (formElementSelector) {
        self.cursorwait();
        self.updateCourseList();
        formElementSelector = $(formElementSelector);

        self.model.ajaxObjCall({ //1567
            url: self.model.get('_config').getDomainData + '/' + formElementSelector.attr("data-domain-id"),
        }, self.editDomainFromData, self.editDomainFromError, void 0, {
                successVal: {
                    formElementSelector: formElementSelector
                },
                errorVal: {
                    formElementSelector: formElementSelector
                }
            });
    };

    this.editnewfunction = function () {
        $('.editpopupBox').find(".course-list selected").empty();
        var courseSelectListHTML = '';
        $.each(self.model.get('_totalCourseArry'), function (courseIdx, course) {
            courseSelectListHTML += '<option type="checkbox" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '" >' + course.title + '</option>'
        });
        $('.editpopupBox').find(".course-list select").html(courseSelectListHTML);

        $('.editpopupBox').find(".course-list select option").each(function () {
            self.courseListEach($(this));
        });
    };

    this.courseListEach = function ($element) {
        var courseListElId = $element.attr('data-course-id');
        var courseFound = false;
        $.each(self.model.get('_result').data.subscribedcourselist, function (subidx, subCourseId) {
            if (courseFound === false) {
                courseFound = self.eachsubscribedcourse(subidx, subCourseId, courseListElId, courseFound);
            }
        });
        if (courseFound) {
            $element.prop('selected', true);

        } else {
            $element.prop('selected', false);
        }
    };

    this.eachsubscribedcourse = function (subidx, subCourseId, courseListElId, courseFound) {
        if (courseListElId === subCourseId) {
            return true;
        } else {
            return false;
        }
    };

    this.addSchool = function (data_param, eqNo) {
        var localArray = [];
        self.model.ajaxObjCall({ //1656
            type: "GET",
            url: self.model.get('_config').DistrictList + '/' + data_param,
            crossDomain: true,
            contentType: "application/json"
        }, self.addSchoolData, self.commonError, void 0, {
                successVal: {
                    eqNo: eqNo
                }
            });

    };

    this.schoolPopupData = function (dataParam) {
        self.model.ajaxObjCall({ //1697
            type: "GET",
            url: self.model.get('_config').getDomainData + '/' + dataParam,
            crossDomain: true,
            contentType: "application/json"
        }, self.schoolPopupDataCall, self.commonError, void 0, {
                successVal: {
                    dataParam: dataParam
                }
            });
    };

    this.numberValidation = function (context) {
        var localData,
            localstrin,
            str,
            strN;
        localData = (context.val());
        localstrin = '';
        if (!$.isNumeric(localData)) {
            str = localData;
            str = parseInt(str.substring(0, str.length - 1));
            if (isNaN(str)) {
                str = '';
            }
            context.val((str));
            context.parent().find('.hidee:eq(1)').show();
            localstrin = (str);
        } else {
            localstrin = localData;
            context.parent().find('.hidee:eq(1)').hide();
        }

        if (context.attr('data-id') === "on") {
            if (localstrin > parseInt(self.model.get('_globalLicensecNum'), 10)) {
                strN = localstrin;
                strN = strN.substring(0, strN.length - 1);
                context.val(strN);
                context.next('label').next('label').next('label').show();
            } else {
                context.next('label').next('label').next('label').hide();
            }
        }

    };

    this.getCurrentDate = function () {
        var d,
            month,
            day,
            output;
        d = new Date();
        month = d.getMonth() + 1;
        day = d.getDate();
        output = (('' + month).length < 2 ? '0' : '') + month + '-' + (('' + day).length < 2 ? '0' : '') + day + '-' + d.getFullYear();
        return output;
    };

    //new methods sushant  312
    this.districtTabBoxData = function (res, parametersObj) {
        var thisContext,
            attrId,
            someDate,
            html,
            numberOfDaysToAdd,
            date,
            allCatalogsListDistrict = self.model.get('allCatalogsListDistrict'),
            _allCoorsesListDistrict = self.model.get('_allCoorsesListDistrict'),
            tempArrCourse = {},
            tempArrCatalogs = [],
            currentCatalog,
            subscribedcourselist = res.data.subscribedcourselist,
            subscribedproviderlist = res.data.subscribedproviderlist,
            dateSplice,
            dateFormat,
            endDate,
            Month,
            loopVar, loopVar2,
            Datee,
            newDate,
            parentid,
            statename,
            subscriptionData;
        thisContext = parametersObj.thisContext;
        for (loopVar = 0; loopVar < allCatalogsListDistrict.length; loopVar++) {
            if (subscribedproviderlist && subscribedproviderlist.indexOf(allCatalogsListDistrict[loopVar].id) > -1) {
                currentCatalog = allCatalogsListDistrict[loopVar].id;
                tempArrCatalogs.push(allCatalogsListDistrict[loopVar]);
                if (currentCatalog == self.model.get('_customCatalogId')) { } else {
                    if (_allCoorsesListDistrict[currentCatalog]) {
                        for (loopVar2 = 0; loopVar2 < _allCoorsesListDistrict[currentCatalog].length; loopVar2++) {
                            if (!tempArrCourse[currentCatalog]) {
                                tempArrCourse[currentCatalog] = [];
                            }
                            if (subscribedcourselist && subscribedcourselist.indexOf(_allCoorsesListDistrict[currentCatalog][loopVar2].id) > -1) {
                                tempArrCourse[currentCatalog].push(_allCoorsesListDistrict[currentCatalog][loopVar2]);
                            }
                        }
                    }
                }
            }
        }
        self.model.set('allCatalogsList', tempArrCatalogs);
        self.model.set('_allCoorsesList', tempArrCourse);
        parentid = thisContext.parents('.districtTabBoxHead').attr('parentid');
        if (parentid) {
            statename = self.model.get('_stateNameMap')[parentid.toString()];
        }
        attrId = parametersObj.attrId;
        if (res.messageType === "SUCCESS") {
            someDate = new Date();
            html = '';
            numberOfDaysToAdd = 365;
            someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
            date = new Date(someDate);
            dateFormat = date.toLocaleDateString().replace(/\//g, "-");
            dateSplice = dateFormat.split('-');
            Month = dateSplice[0];
            Datee = dateSplice[1];
            if (dateSplice[0].length === 1) {
                dateSplice[0] = [];
                dateSplice[0] = '0' + Month;
            }
            if (dateSplice[1].length === 1) {
                dateSplice[1] = [];
                dateSplice[1] = '0' + Datee;
            }
            newDate = dateSplice.join('-');
            self.model.set('_rowView', 10);
            self.model.set('_previousCount', 0);
            self.model.set('_previousCountArray', [0]);
            endDate = res.data.customization.edivatelearn.subscriptionenddate === "" ? dateFormat : res.data.customization.edivatelearn.subscriptionenddate;
            subscriptionData = (res.data.customization.edivatelearn.fullsubscription) ? "Entire Catalog" : "Selective Courses";
            self.model.set('subscriptionstartdate', res.data.customization.edivatelearn.subscriptionstartdate);
            $('.norecords').remove();
            self.model.set('_globalLicensecNum', (res.data.customization.edivatelearn.nooflicense != null) ? res.data.customization.edivatelearn.nooflicense : 0);
            if (parentid) {
                html += '<div class="districtHeadDetails" startDate="' + res.data.customization.edivatelearn.subscriptionstartdate + '" pilotDate="' + res.data.customization.edivatelearn.pilotenddate + '"><div class="LPSDContainer">';
                html += '<div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">' + res.data.domain.name + '</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">' + subscriptionData + '</td><td style="width:10%;">Number of License:</td><td style="width:10%;">' + res.data.customization.edivatelearn.nooflicense + '</td></tr><tr> <td>External Id: </td><td>' + res.data.domain.reference + '</td><td>Subscription Date:</td><td>' + res.data.customization.edivatelearn.subscriptionstartdate + ' ' + 'To' + ' ' + endDate + '</td><td>Pilot End Date:</td><td>' + res.data.customization.edivatelearn.pilotenddate + '</td></tr><tr> <td>Login Prefix: </td><td>' + res.data.domain.userspace + '</td><td>License Type:</td><td>' + res.data.customization.edivatelearn.licensetype + '</td><td>State Name:</td><td>' + statename + '</td></tr></tbody></table> </div> <div class="LPSDAvlList"> <div class="SASHead"><hgroup><h1>School available in ' + res.data.domain.name + '</h1></hgroup></div><div class="SAList"> <table class="SAListTable"> <tbody><tr> <th>School Domain Name</th> <th>External Id</th> <th>Login Prefix</th> <th>License Type</th> <th>License Pool</th> <th>Number of License</th> <th>Action</th> </tr>';
            } else {

                html += '<div class="districtHeadDetails" startDate="' + res.data.customization.edivatelearn.subscriptionstartdate + '" pilotDate="' + res.data.customization.edivatelearn.pilotenddate + '"><div class="LPSDContainer">';
                html += '<div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">' + res.data.domain.name + '</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">' + subscriptionData + '</td><td style="width:10%;">Number of License:</td><td style="width:10%;">' + res.data.customization.edivatelearn.nooflicense + '</td></tr><tr> <td>External Id: </td><td>' + res.data.domain.reference + '</td><td>Subscription Date:</td><td>' + res.data.customization.edivatelearn.subscriptionstartdate + ' ' + 'To' + ' ' + endDate + '</td><td>Pilot End Date:</td><td>' + res.data.customization.edivatelearn.pilotenddate + '</td></tr><tr> <td>Login Prefix: </td><td>' + res.data.domain.userspace + '</td><td>License Type:</td><td>' + res.data.customization.edivatelearn.licensetype + '</td><td></td><td></td></tr></tbody></table> </div> <div class="LPSDAvlList"> <div class="SASHead"><hgroup><h1>School available in ' + res.data.domain.name + '</h1></hgroup></div><div class="SAList"> <table class="SAListTable"> <tbody><tr> <th>School Domain Name</th> <th>External Id</th> <th>Login Prefix</th> <th>License Type</th> <th>License Pool</th> <th>Number of License</th> <th>Action</th> </tr>';
            }
            self.model.ajaxObjCall({ //312
                type: "GET",
                url: self.model.get('_config').schoolList + '/' + attrId + '?querystring=0&limit=' + self.model.get('_rowView'),
                crossDomain: true,
                contentType: "application/json"
            }, self.schoolListData, self.commonError, void 0, {
                    successVal: {
                        thisContext: thisContext,
                        html: html
                    }
                });

        } else if (data.messageType === "ERROR") {
            $('.norecords,.districtHeadDetails').remove();
            self.cursordefault();
            html = '';
            html += '<div class="districtHeadDetails">';

            html += '<label class="norecords">No School Found</label>';

            html += "</div>";

            thisContext.parents('.districtTabBox').append(html);
        }
    };

    this.schoolListData = function (data, parametersObj) {
        var thisContext,
            html,
            i;
        thisContext = parametersObj.thisContext;
        html = parametersObj.html;
        if (data.messageType === "SUCCESS") {
            self.model.set('_schoolRowDisableCheck', data.data.domains.length);
            for (i = 0; i < data.data.domains.length; i++) {
                html += '<tr data-id="' + data.data.domains[i].id + '"> <td>' + data.data.domains[i].name + '</td><td>' + data.data.domains[i].reference + '</td><td>' + data.data.domains[i].userspace + '</td><td>' + data.data.domains[i].data.customization.edivatelearn.licensetype + '</td><td>' + data.data.domains[i].data.customization.edivatelearn.pooltype + '</td><td>' + data.data.domains[i].data.customization.edivatelearn.nooflicense + '</td><td><button class="editSchoolpop"><i class="fa fa-pencil"></i>Edit</button></td></tr>';
            }
            html += '</tbody></table> </div><div class="FootPagination"><div class="floatLeft dataleft"> Showing <span class="demo"> <select class="balck showEntry"> <option value="10">10</option> <option value="25">25</option> </select> </span>  </div><div class="dataright"> <nav> <ul class="pagination"> <li class="disabled"> <button class="PreviousCir"  aria-label="Previous"> <i class="fa fa-play LSArrow"></i> </button> </li><li> <button class="NextCir"  aria-label="Next"> <i class="fa fa-play RSArrow"></i> </button> </li></ul> </nav> </div><div class="school-pagination-text"></div></div></div></div></div>';
            thisContext.parents('.districtTabBox').append(html);
            self.bindevent();
            self.cursordefault();
            $('.PreviousCir').prop('disabled', true).addClass('disabled');
            $('.school-pagination-text').html('Showing results 1 to ' + data.data.domains.length);

        } else if (data.messageType === "ERROR") {
            $('.norecords').remove();
            self.cursordefault();
            html += '<label class="norecords">No School Found</label></div>';
            thisContext.parents('.districtTabBox').append(html);
            thisContext.parents('.districtTabBox').find('.LPSDAvlList').html('<label class="norecords">No School Found</label>');
        }
        if (thisContext.parents('.districtTabBoxHead').next().is(':visible')) {
            // self.saveProviderListData();
            $('.districtHeadDetails').slideUp('slow', function () {

                setTimeout(function () {
                    $('.districtHeadDetails').remove();
                }, 350);
            });
        } else {
            $('.districtHeadDetails').slideUp('slow');
            thisContext.parents('.districtTabBoxHead').next().slideDown('slow');
        }

    };

    //399
    this.displayEntry = function (res, parametersObj) {
        var html = parametersObj.html,
            i;
        if (res.messageType === "SUCCESS") {
            self.model.set('_schoolRowDisableCheck', res.data.domains.length);
            $('.SASHead,.SAList').remove();
            html += '<div class="SASHead"><hgroup><h1>School available in ' + $(this).parents('.districtTabBox').find('.disTrictList').text() + '</h1></hgroup></div><div class="SAList"> <table class="SAListTable"> <tbody><tr> <th>School Domain Name</th> <th>External Id</th> <th>Login Prefix</th> <th>License Type</th> <th>License Pool</th> <th>Number of License</th> <th>Action</th> </tr>';

            for (i = 0; i < res.data.domains.length; i++) {
                html += '<tr data-id="' + res.data.domains[i].id + '"> <td>' + res.data.domains[i].name + '</td><td>' + res.data.domains[i].reference + '</td><td>' + res.data.domains[i].userspace + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.licensetype + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.pooltype + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.nooflicense + '</td><td><button class="editSchoolpop"><i class="fa fa-pencil"></i>Edit</button></td></tr>';
            }
            // for (i = 0; i < res.data.domains.length; i++) {
            //     html += '<tr data-id="' + res.data.domains[i].id + '"> <td>' + res.data.domains[i].name + '</td><td>' + res.data.domains[i].reference + '</td><td>' + res.data.domains[i].userspace + '</td><td>' + 'test' + '</td><td>' + '' + '</td><td>' + '' + '</td><td><button class="editSchoolpop"><i class="fa fa-pencil"></i>Edit</button></td></tr>';
            // }
            html += '</tbody></table></div>';
            self.model.get('_globalThisContext').parents('.districtTabBox').find('.LPSDAvlList').prepend(html);
            self.model.set('_previousCountArray', [0]);
            $('.school-pagination-text').html('Showing results 1 to ' + res.data.domains.length);
            self.model.set('_previousCount', 0);

            // self.model.set('_rowView',)
            self.bindevent();
            self.cursordefault();
        } else if (res.messageType === "ERROR") {
            $('.norecords').remove();
            self.cursordefault();
            html = '';
            html += '<div class="districtHeadDetails"><ul class="schoolView">';

            html += '<li>No School Found</li>';

            html += "</ul></div>";

            self.model.get('_globalThisContext').parents('.districtTabBox').append(html);
        }
    };

    //459   //514
    this.displayNextSchoolEntry = function (res, parametersObj) {
        var html = parametersObj.html,
            _previousCount = self.model.get('_previousCount'),
            _rowView = self.model.get('_rowView'),
            lowerLimit, upperLimit,
            i;
        if (res.messageType === "SUCCESS") {
            self.model.set('_schoolRowDisableCheck', res.data.domains.length);
            html += ' <tbody><tr> <th>School Domain Name</th> <th>External Id</th> <th>Login Prefix</th> <th>License Type</th> <th>License Pool</th> <th>Number of License</th> <th>Action</th> </tr>';

            for (i = 0; i < res.data.domains.length; i++) {
                html += '<tr data-id="' + res.data.domains[i].id + '"> <td>' + res.data.domains[i].name + '</td><td>' + res.data.domains[i].reference + '</td><td>' + res.data.domains[i].userspace + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.licensetype + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.pooltype + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.nooflicense + '</td><td><button class="editSchoolpop"><i class="fa fa-pencil"></i>Edit</button></td></tr>';
            }
            html += '</tbody>';
            self.model.get('_globalThisContext').parents('.districtTabBox').find('.SAListTable').html(html);
            self.bindevent();
            lowerLimit = _rowView * (_previousCount) + 1;
            upperLimit = lowerLimit + res.data.domains.length - 1;
            $('.school-pagination-text').html('Showing results ' + lowerLimit + ' to ' + upperLimit);
            self.cursordefault();
        } else if (res.messageType === "ERROR") {
            $('.norecords').remove();
            self.cursordefault();
            html = '';
            html += '<div class="districtHeadDetails"><ul class="schoolView">';

            html += '<li>No School Found</li>';

            html += "</ul></div>";

            self.model.get('_globalThisContext').parents('.districtTabBox').append(html);
        }
    };

    //572    //630
    this.displayNextDomain = function (data, parametersObj) {
        var html = parametersObj.html,
            lowerLimit, upperLimit,
            i;
        if (data.messageType === "SUCCESS") {
            self.cursordefault();
            $('.districtTabBox').remove();
            html = '<ul>';
            self.model.set('_nextdisbleChcek', data.data.domains.length);
            for (i = 0; i < data.data.domains.length; i++) {
                html += '<li id="' + data.data.domains[i].id + '"><section class="districtTabBox"><div class="districtTabBoxHead"><hgroup><h1 data-id="' + data.data.domains[i].id + '" class="floatLeft disTrictList">' + data.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li><li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></div></section>';
                html += '<div class="districtHeadDetails"><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';
                html += '</li>'
            }
            html += '</ul>';
            lowerLimit = self.model.get('_landingPagePrevCount') * self.model.get('_dropdownCount') + 1;
            upperLimit = lowerLimit + data.data.domains.length - 1;
            $('#adminContainer .domainContainer').html(html);
            $('.domain-pagination-text').html('Showing results ' + lowerLimit + ' to ' + upperLimit);
            if (data.data.domains.length >= 4) {
                $('.dummydata').css('height', '10px');
            } else {
                $('.dummydata').css('height', '222px');
            }
        } else {
            self.cursordefault();
            return false;
        }
    };

    this.nextDomainCallComplete = function () {
        setTimeout(function () {
            self.bindevent();
        }, 400)
    };

    //685
    this.domainShowEntry = function (data, parametersObj) {
        var html = parametersObj.html,
            i,
            length,
            t;
        if (data.messageType === "SUCCESS") {
            self.cursordefault();
            self.model.set('_nextdisbleChcek', data.data.domains.length);
            $('.districtTabBox').remove();
            html = '<ul>';
            for (i = 0; i < data.data.domains.length; i++) {

                //                  schlId=data.data.domains.id;
                html += '<li id="' + data.data.domains[i].id + '"><section class="districtTabBox"><div class="districtTabBoxHead"><hgroup><h1 data-id="' + data.data.domains[i].id + '" class="floatLeft disTrictList">' + data.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li><li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></div></section>';

                html += '<div class="districtHeadDetails"><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';
                html += '</li>'
            }
            html += '</ul>';
            $('.domain-pagination-text').html('Showing results ' + 1 + ' to ' + data.data.domains.length);
            $('#adminContainer .domainContainer').html(html);
            $('.FootPagination').show();
        } else {
            length = $('.domainContainer>ul>li').length;
            self.cursordefault();
            for (t = 0; t < length - 1; t++) {
                $('.domainContainer>ul>li').eq(0).remove();
            }
            $('.districtTabBox').html('<label class="norecords" style="">No District Found</label>');
            $('.FootPagination').hide();
        }
    };
    this.setStateNameMap = function (parentid) {
        var result = self.model.get('configResult');
        self.model.ajaxObjCall({ //809
            type: "GET",
            // url: result.DistrictList + '/' + self.model.get('_postId') + '?querystring=0&searchtext=' + srchData + '&limit=' + self.model.get('_rowView') + '',
            url: result.getDomainData + '/' + parentid,
            crossDomain: true,
            contentType: "application/json"
        }, self.setStateNameMapSuccess, self.commonError, void 0, {
                successVal: {
                    parentid: parentid
                }
            });
    };

    this.setStateNameMapSuccess = function (res, parametersObj) {
        var _stateNameMap = self.model.get('_stateNameMap'),
            parentid = parametersObj.parentid,
            parentidStr = parentid.toString();
        _stateNameMap[parentidStr] = res.data.domain.name;
    };
    ////809
    this.searchDataDisplay = function (res, parametersObj) {
        var html = parametersObj.html,
            schoolId, length,
            i;
        if (res.messageType === "SUCCESS") {
            schoolId = res.data.domains[0].id;
            self.cursordefault();
            $('.districtTabBox').remove();
            html = '<ul>';
            self.model.set('_nextdisbleChcek', res.data.domains.length);
            for (i = 0; i < res.data.domains.length; i++) {
                if (res.data.domains[i].data.customization.edivatelearn.domaintype === 'district') {
                    self.setStateNameMap(res.data.domains[i].parentid);
                    html += '<li id="' + res.data.domains[i].id + '" ><section class="districtTabBox"><div class="districtTabBoxHead" parentid="' + res.data.domains[i].parentid + '"><hgroup><h1 data-id="' + res.data.domains[i].id + '" class="floatLeft disTrictList">' + res.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li><li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></section>';
                    html += '<div class="districtHeadDetails" ><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';
                    html += '</li>';
                }
            }
            html += "</ul>";

            $('.domain-pagination-text').html('Showing results ' + 1 + ' to ' + res.data.domains.length);
            $('#adminContainer .domainContainer').html(html);
            if (res.data.domains.length >= 4) {
                $('.dummydata').css('height', '10px');
            } else {
                $('.dummydata').css('height', '222px');
            }
            self.bindevent();
            $('.FootPagination').hide();
        } else {
            length = $('.domainContainer>ul>li').length;
            self.cursordefault();
            for (t = 0; t < length - 1; t++) {
                $('.domainContainer>ul>li').eq(0).remove();
            }
            $('.norecords').remove();
            $('.districtTabBox').html('<label class="norecords" style="">No District Found</label>');
            $('.FootPagination').hide();
            self.cursordefault();
        }
    };

    ////1060
    this.editSchoolData = function (rslt, parametersObj) {
        var stateSelctedVal = parametersObj.stateSelctedVal,
            editScholPrntId,
            fromselector = parametersObj.fromselector;
        $('.editschlpopupBox,.popGrayBg').show();
        if (rslt.messageType === "SUCCESS") {
            self.resetDomainVar(rslt, '_domain');
            editScholPrntId = rslt.data.domain.parentid;
            fromselector.find('.schldomainname').val(rslt.data.domain.name);
            fromselector.find('.loginprefix').val(rslt.data.domain.userspace);
            fromselector.find('.externalid').val(rslt.data.domain.reference);
            fromselector.find('.licensetype').val(rslt.data.customization.edivatelearn.licensetype);
            fromselector.find('.license-number').val(rslt.data.customization.edivatelearn.nooflicense);
            fromselector.find('.license-pool').val(rslt.data.customization.edivatelearn.pooltype);
            fromselector.find('.popupInputDate').val(rslt.data.customization.edivatelearn.pilotenddate);
            if (rslt.data.customization.edivatelearn.pooltype === 'Fixed') {
                $('#snw_License1').removeAttr('disabled');
            } else {
                $('#snw_License1').attr('disabled', "disabled");
            }
            //Not required as per scenraio -1
            //            if (rslt.data.customization.edivatelearn.pilot) {
            //                fromselector.find('.pilot-domain').prop('checked', true);
            //            } else {
            //                fromselector.find('.pilot-domain').prop('checked', false);
            //            }
            if (rslt.data.customization.edivatelearn.fullsubscription) {
                self.setEntireSelectiveradio(fromselector, true, false);
            }
            else {
               	self.setEntireSelectiveradio(fromselector, false, true);
            }

            self.populateCatalogsCourses(rslt, 'edit');
            self.model.ajaxObjCall({
                type: "GET",
                url: self.model.get('_config').DistrictList + '/' + stateSelctedVal,
            }, self.editSchoolDistrictData, self.commonError, void 0, {
                    successVal: {
                        stateSelctedVal: stateSelctedVal,
                        fromselector: fromselector,
                        rslt: rslt,
                        editScholPrntId: editScholPrntId
                    }
                });
        } else {
            self.cursordefault();
        }
    };

    this.editSchoolDistrictData = function (rslte, parametersObj) {
        var fromselector = parametersObj.fromselector,
            rslt = parametersObj.rslt,
            html,
            i,
            editScholPrntId = parametersObj.editScholPrntId;

        if (rslt.messageType === "SUCCESS") {
            html = '';
            fromselector.find('.schooldistrictlist').html(function () {
                for (i = 0; i < rslte.data.domains.length; i++) {
                    html += '<option value="' + rslte.data.domains[i].id + '">' + rslte.data.domains[i].name + '</option>';
                }
                return html;
            }).promise().done(function () {
                fromselector.find('.schooldistrictlist').val(editScholPrntId);
            });
            self.cursordefault();
        }
        self.cursordefault();
    };

    ////1142
    this.saveSchoolData = function (rslt, parametersObj) {
        var stateSelctedVal = parametersObj.stateSelctedVal,
            fromselector = parametersObj.fromselector;
        if (rslt.messageType === "SUCCESS") {
            alert(rslt.message)
            $('.grayBg,.popGrayBg').hide();
            $('.addschlpopupBox,.editschlpopupBox').hide();
            self.cursordefault();
            if (self.model.get('_districtContext')) {
                self.model.get('_districtContext').trigger('click');
                self.model.get('_districtContext').parents('.districtTabBoxHead').next().show();
            }
        } else if (rslt.messageType === "ERROR") {
            alert(rslt.message);
            self.cursordefault();
        } else {
            alert(rslt.messageType);
            $('.grayBg,.popGrayBg').hide();
            $('.addschlpopupBox,.editschlpopupBox').hide();
            self.cursordefault();
            self.model.get('_districtContext').trigger('click');
            self.model.get('_districtContext').parents('.districtTabBoxHead').next().show();
        }
    };

    ////1182
    this.logout = function (rslt, parametersObj) {
        window.location.href = "index.html";
        sessionStorage.clear();
    };

    //1227
    this.districtOptionLoading = function (res, parametersObj) {
        var split_data = parametersObj.split_data,
            html = parametersObj.html,
            state_list = parametersObj.state_list,
            urlStore = parametersObj.urlStore,
            defaultSelect = '';
        state_list = '<option class="selectState">Select State</option>';
        if (res.messageType === "SUCCESS") {
            $('.dummydata').html();
            $('.statename').html(function () {
                $.each(res.data.domains, function (i, v) {
                    split_data = v.userspace.split('-');
                    state_list += '<option value=' + v.id + ' class="' + v.name + '">' + split_data[1].toUpperCase() + ' ' + v.name + '</option>';

                    if (i === 0) {
                        defaultSelect = v.name;
                    }
                    self.model.get('_stateId').push(v.id);
                    self.model.get('_stateName').push(split_data[1].toUpperCase() + ' ' + v.name);
                });
                return state_list;
            });
            $('.statename option.' + defaultSelect).prop('selected', 'selected');
            self.model.set('_postId', res.data.domains[0].id);
            self.model.set('_optionselector', $('.statename option').eq(1).val());
            self.model.ajaxObjCall({ //1182

                type: "GET",
                url: urlStore + '/' + res.data.domains[0].id + '?querystring=0&limit=' + self.model.get('_dropdownCount') + '',
                crossDomain: true,
                contentType: "application/json"
            }, self.districtDataLoading, self.commonError, void 0, {
                    successVal: {
                        html: html

                    }
                })
            self.statelistchange();
        } else {
            self.cursordefault();
            $('.norecords').remove();
            $('.dummydata').html('<label class="norecords" style="">No Record Found</label>');
        }
    };

    this.districtDataLoading = function (data, parametersObj) {
        var html = parametersObj.html,
            schoolId,
            i,
            t;
        if (data.messageType === "SUCCESS") {
            schoolId = data.data.domains[0].id;
            self.cursordefault();
            $('.districtTabBox').remove();
            html = '<ul>';
            self.model.set('_nextdisbleChcek', data.data.domains.length);
            for (i = 0; i < data.data.domains.length; i++) {
                html += '<li id="' + data.data.domains[i].id + '" ><section class="districtTabBox"><div class="districtTabBoxHead"><hgroup><h1 data-id="' + data.data.domains[i].id + '" class="floatLeft disTrictList">' + data.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li><li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></section>';

                html += '<div class="districtHeadDetails"><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';

                html += '</li>';
            }
            html += "</ul>";
            $('.domain-pagination-text').html('Showing results' + 1 + ' to ' + data.data.domains.length);
            $('#adminContainer .domainContainer').html(html);
            if (data.data.domains.length >= 4) {
                $('.dummydata').css('height', '10px');
            } else {
                $('.dummydata').css('height', '222px');
            }
            self.sortingDistrict();
            self.bindevent();
            $('.FootPagination').show();
        } else {
            self.cursordefault();
            for (t = 0; t < ($('.domainContainer>ul>li').length); t++) {
                $('.domainContainer>ul>li').eq(0).remove();
            }
            $('.norecords').remove();
            $('.districtTabBox').html('<label class="norecords" style="">No District Found</label>');
            $('.FootPagination').hide();
        }
    };

    ////1317
    this.districtOptionLoadingData = function (data, parametersObj) {
        var split_data = parametersObj.split_data,
            i,
            html,
            length,
            t,
            state_list = parametersObj.state_list;
        if (data.messageType === "SUCCESS") {
            self.model.set('_nextdisbleChcek', data.data.domains.length);
            self.cursordefault();
            $('.districtTabBox').remove();
            html = '<ul>';
            for (i = 0; i < data.data.domains.length; i++) {

                //                  schlId=data.data.domains.id;
                html += '<li id="' + data.data.domains[i].id + '"><section class="districtTabBox"><div class="districtTabBoxHead"><hgroup><h1 data-id="' + data.data.domains[i].id + '" class="floatLeft disTrictList">' + data.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li><li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></div></section>';

                html += '<div class="districtHeadDetails"><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';
                html += '</li>'
            }
            html += '</ul>';
            $('#adminContainer .domainContainer').html(html);
            $('.DomainPrevious').prop('disabled', true).addClass('disabled');
            $('.DomainNext').prop('disabled', false).removeClass('disabled');
            $('.domain-pagination-text').html('Showing results ' + 1 + ' to ' + data.data.domains.length);
            if (data.data.domains.length >= 4) {
                $('.dummydata').css('height', '10px');
            } else {
                $('.dummydata').css('height', '222px');
            }
            $('.FootPagination').show();
            self.sortingDistrict();
        } else {
            length = $('.domainContainer>ul>li').length;
            self.cursordefault();
            for (t = 0; t < length - 1; t++) {
                $('.domainContainer>ul>li').eq(0).remove();
            }
            $('.norecords').remove();
            $('.districtTabBox').html('<label class="norecords" style="">No District Found</label>');
            $('.FootPagination').hide();
        }
    };

    ////1447
    this.updateCourseData = function (res, parametersObj) {
        var selectedCourseCatalog = parametersObj.selectedCourseCatalog,
            state_list = parametersObj.state_list,
            _allCoorsesList = self.model.get('_allCoorsesList'),
            ind = parametersObj.ind,
            loopVar,
            elementClass,
            originalCourseData = self.model.get('originalCourseData'),
            selectiveCourses = self.model.get('selectiveCourses'),
            addHTML = parametersObj.addHTML,
            _selectedCatalogs = parametersObj._selectedCatalogs,
            totalCourses = self.model.get('totalCoursesForDist'),
            courseSelectListHTML,
            selectedCourses = self.model.get('selectedCourses'),
            _selectedCatalogsLength = parametersObj._selectedCatalogsLength;
        self.model.set('currentresponsecount', self.model.get('currentresponsecount') + 1);
        if (res.data) {
            totalCourses = totalCourses.concat(res.data.domain);
        }

        courseSelectListHTML = parametersObj.courseSelectListHTML;
        self.model.set('totalCoursesForDist', totalCourses);


        if (totalCourses.length) {
            if (_selectedCatalogsLength === self.model.get('currentresponsecount')) {
                self.cursordefault();
                if ($(".entire-catalog").is(":checked")) {
                    $.each(totalCourses, function (index, course) {
                        if (originalCourseData && originalCourseData.indexOf(course.id) > -1) {
                            elementClass = 'oldEle';
                        } else {
                            elementClass = 'newEle';
                        }

                        courseSelectListHTML += '<option type="checkbox" class="' + elementClass + '" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '" selected="selected">' + course.title + '</option>';
                        if (selectedCourses.indexOf(course.id) === -1) {
                            selectedCourses.push(course.id);
                        }
                    });
                    self.model.set('selectedCourses', selectedCourses)
                    $(".course-list select").html(courseSelectListHTML);
                } else {
                    $.each(totalCourses, function (index, course) {
                        if (selectiveCourses.indexOf(course.id) > -1) {
                            if (originalCourseData && originalCourseData.indexOf(course.id) > -1) {
                                elementClass = 'oldEle';
                            } else {
                                elementClass = 'newEle';
                            }
                            courseSelectListHTML += '<option type="checkbox" class="' + elementClass + '" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '" selected="selected">' + course.title + '</option>';
                            if (selectedCourses.indexOf(course.id) === -1) {
                                selectedCourses.push(course.id);
                            }
                        } else {
                            if (originalCourseData && originalCourseData.indexOf(course.id) > -1) {
                                elementClass = 'oldEle';
                            } else {
                                elementClass = 'newEle';
                            }
                            courseSelectListHTML += '<option type="checkbox" class="' + elementClass + '" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '">' + course.title + '</option>';
                        }
                    });
                    $(".corseselectList select").html(courseSelectListHTML);
                    self.model.set('selectiveCourses', selectedCourses);
                }
            }
            self.bindevent();
        } else {
            self.cursordefault();
            courseSelectListHTML = '';
            $(".corseselectList select").html(courseSelectListHTML);
        }
        parametersObj.courseSelectListHTML = courseSelectListHTML;
        if (self.model.get('_domain') != null)
            self.setSelectCourseDropdown(self.model.get('_domain').data.subscribedcourselist);
        self.bindevent();
    };

    //1529
    this.submitDomainFromData = function (res, parametersObj) {
        var selectedCourseCatalog = parametersObj.selectedCourseCatalog,
            state_list = parametersObj.state_list;
        self.cursordefault();
        if (res.messageType === "SUCCESS") {
            alert(res.message);
            $('.statename').trigger('change');
            $('.grayBg').hide();
            $('.popGrayBg').hide();
            $('.popupBox,.editpopupBox').hide();
        } else {
            alert(res.message);
        }
        self.cursordefault();
    };

    this.domainFromError = function (err) {
        self.cursordefault();
        alert('Encountered an error while createdistrict');
        $('.grayBg').hide();
        $('.popupBox,.editpopupBox').hide();
    };

    //1567
    this.editDomainFromData = function (res, parametersObj) {
        var formElementSelector = parametersObj.formElementSelector,
            totalCourses,
            courseListURI,
            loopVar,
            _selectedCatalogs,
            state_list = parametersObj.state_list;
        self.resetDomainVar(res, '_domain');
        self.cursorwait();
        self.model.set('_result', res);
        formElementSelector.find('select.editdomainlist').val(res.data.domain.parentid);
        formElementSelector.find('select.editdomainlist').attr('value', res.data.domain.parentid);
        //                formElementSelector.find('input.domain-name').val(res.data.domain.name);
        formElementSelector.find('input.login-prefix').val(res.data.domain.userspace).attr('disabled', 'disabled');
        formElementSelector.find('input.login-prefix').attr('value', res.data.domain.userspace);
        formElementSelector.find('input.external-id').val(res.data.domain.reference);
        formElementSelector.find('input.external-id').attr('value', res.data.domain.reference);
        formElementSelector.find('select.license-type').val(res.data.customization.edivatelearn.licensetype);
        formElementSelector.find('select.license-type').attr('value', res.data.customization.edivatelearn.licensetype);
        formElementSelector.find('select.license-pool').val(res.data.customization.edivatelearn.pooltype);
        formElementSelector.find('select.license-pool').attr('value', res.data.customization.edivatelearn.pooltype);
        formElementSelector.find('input.license-number').val(res.data.customization.edivatelearn.nooflicense);
        formElementSelector.find('input.license-number').attr('value', res.data.customization.edivatelearn.nooflicense);
        formElementSelector.find('input.pilot-end').val(res.data.customization.edivatelearn.pilotenddate);
        formElementSelector.find('input.pilot-end').attr('value', res.data.customization.edivatelearn.pilotenddate);
        formElementSelector.find('#snwSubscription-start').val(res.data.customization.edivatelearn.subscriptionstartdate);
        formElementSelector.find('#snwSubscription-start').attr('value', res.data.customization.edivatelearn.subscriptionstartdate);
        formElementSelector.find('#snwSubscription-end').val(res.data.customization.edivatelearn.subscriptionenddate);
        formElementSelector.find('#snwSubscription-end').attr('value', res.data.customization.edivatelearn.subscriptionenddate);
        if (res.data.customization.edivatelearn.pilot) {
            formElementSelector.find('input.pilot-domain').prop("checked", true);
        } else {
            formElementSelector.find('input.pilot-domain').prop("checked", false);
        }
        if (res.data.customization.edivatelearn.fullsubscription) {
            formElementSelector.find('#snwEntire_Catalog').prop("checked", true);
            formElementSelector.find('#snwselective-course').prop("checked", false);
        } else {
            formElementSelector.find('#snwEntire_Catalog').prop("checked", false);
            formElementSelector.find('#snwselective-course').prop("checked", true);
        }
        //                if($('#snwSelectInput').)
        totalCourses = [];
        self.model.set('totalCoursesForDist', []);
        self.model.set('selectedCourses', []);
        self.model.set('_selectedCatalogs', res.data.subscribedproviderlist);
        self.model.set('originalCourseData', res.data.subscribedcourselist);
        $('.editpopupBox .corsecatalogList').find('option').each(function (i) {
            if (res.data.subscribedproviderlist == null) {
                self.cursordefault();
                $('.popGrayBg').show();
                self.bindevent();
            } else {
                if (res.data.subscribedproviderlist.indexOf($(this).attr('data-domain-id')) != -1) {
                    $(this).prop("selected", true);
                    var catalogID = $(this).attr('data-domain-id');
                    courseListURI = self.model.get('_config').courseList + "/" + catalogID;
                    $('#example' + $(this).attr('data-domain-id')).attr('checked', true);
                    self.model.ajaxObjCall({ //1567
                        url: courseListURI
                    }, self.courseListData, self.commonError, void 0, {
                            successVal: {
                                res: res,
                                catalogId: catalogID
                            }
                        });
                } else {
                    self.cursordefault();
                    $('.popGrayBg').show();
                    self.bindevent();
                }
            }
        });
        $('.editpopupBox').find(".course-list ul input").attr('checked', 'checked');
    };

    this.editDomainFromError = function (err) {
        var formElementSelector = parametersObj.formElementSelector;
        self.cursordefault();
        alert("Error fetching domain data for", formElementSelector.data("domain-id"));
    };

    //update _allCoorsesList map with the catalogId and its course
    this.updateCatalogCourse = function (data, catalogID) {
        var totalCoursesForDist = self.model.get('_allCoorsesList');
        if (self.model.get('_allCoorsesList')[catalogID]) {
            var catalogvsCourse = {};
            catalogvsCourse[catalogID] = data.data.domain;
            $.extend(self.model.get('_allCoorsesList'), catalogvsCourse);
        }
    };

    this.courseListData = function (data, parametersObj) {
        self.updateCatalogCourse(data, parametersObj.catalogId);
        var courseSelectListHTML = '',
            res = parametersObj.res,
            selectedCourses = self.model.get('selectedCourses'),
            totalCourses = self.model.get('totalCoursesForDist'),
            selectedCatalog = self.model.get('_selectedCatalogs'),
            totalCourses = totalCourses.concat(data.data.domain), allDropDownCourses = [];

        self.model.set('totalCoursesForDist', totalCourses);
        self.model.set('_totalCourseArry', totalCourses);
        $.each(totalCourses, function (index, course) {
            if (res.data.subscribedcourselist.indexOf(course.id) > -1) {
                courseSelectListHTML += '<option type="checkbox" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '" selected="selected">' + course.title + '</option>';
                if (selectedCourses.indexOf(course.id) === -1) {
                    selectedCourses.push(course.id);
                    allDropDownCourses.push(course.id);
                }
            } else {
                courseSelectListHTML += '<option type="checkbox" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '" >' + course.title + '</option>';
                allDropDownCourses.push(course.id);
            }
        });
        self.model.set('selectedCourses', selectedCourses);
        $('.editpopupBox').find(".course-list select").html(courseSelectListHTML);
        if (res.data.customization.edivatelearn.fullsubscription) {
            self.setEntireSelectiveradio($('.editpopupBox'), true, false);
            self.setSelectCourseDropdown(selectedCourses);
            self.setSelectCourseDropdown(allDropDownCourses);
        }
        else {
           	self.setEntireSelectiveradio($('.editpopupBox'), false, true);
        }
        self.cursordefault();
        $('.popGrayBg').show();
        self.bindevent();
    };

    this.addSchoolData = function (res, parametersObj) {
        var eqNo = parametersObj.eqNo,
            i,
            state_list = parametersObj.state_list;
        state_list = '';
        if (res.messageType === "SUCCESS") {

            $('#snw_schooldistrictlist1');

            for (i = 0; i < res.data.domains.length; i++) {
                state_list += '<option value=' + res.data.domains[i].id + '>' + res.data.domains[i].name + '</option>';
            }
            $('#snw_schooldistrictlist').html(state_list);
            $('#snw_schooldistrictlist1').html(state_list);
            if (eqNo == 0) {
                $('.editschlpopupBox .schooldistrictlist').val(res.data.domains[0].id);
                $('.addschlpopupBox .schooldistrictlist').val(res.data.domains[0].id);
                self.schoolPopupData(res.data.domains[0].id);
            } else {
                $('.addschlpopupBox .schooldistrictlist').val(eqNo);
                self.schoolPopupData(eqNo);
            }

        } else {
            $('.norecords').remove();
            self.cursordefault();
            $('.schooldistrictlist').html('<option class="norecords" style="">No Record Found</option>');
        }
    };

    this.resetDomainVar = function (res, domain) {
        if (self.model.get(domain)) {
            self.model.set(domain, {})
        }
        self.model.set(domain, res)
    };


    //1697
    this.schoolPopupDataCall = function (res, parametersObj) {
        var dataParam = parametersObj.dataParam,
            state_list = parametersObj.state_list;
        state_list = '';

        self.model.set('subscriptionstartdate', res.data.customization.edivatelearn.subscriptionstartdate)
        self.model.set('pilotenddate', res.data.customization.edivatelearn.pilotenddate)
        $('.editschlpopupBox .schooldistrictlist').val(dataParam);
        $('.addschlpopupBox .schooldistrictlist').val(dataParam);
        if (res.messageType === "SUCCESS") {
            //This parameter is a flag to reset course selection box to blank
            res['SelectiveBoxReset'] = true;
            self.resetDomainVar(res, '_domain');
            self.model.set('_globalLicensecNum', (res.data.customization.edivatelearn.nooflicense != null) ? res.data.customization.edivatelearn.nooflicense : 0)
            $('.editschlpopupBox .licensetype').val(res.data.customization.edivatelearn.licensetype);
            $('.addschlpopupBox .licensetype').val(res.data.customization.edivatelearn.licensetype);
            if (res.data.customization.edivatelearn.pooltype === 'Fixed') {
                $('#snw_License').val('').removeAttr('disabled');
                $('#snw_License1').val('').removeAttr('disabled');
            } else {
                $('#snw_License').val('').attr('disabled', "disabled");
                $('#snw_License1').val('').attr('disabled', "disabled");
            }
            self.setEntireSelectiveradio($('.addschlpopupBox'), true, false);
            $('#snw_balck_data').val(res.data.customization.edivatelearn.pooltype);
            $('#snw_balck_data1').val(res.data.customization.edivatelearn.pooltype);
            $('#snw_popupInputDate').val(res.data.customization.edivatelearn.pilotenddate);
            //update the course list of a catalog when add of a school domain is called
            $.each(res.data.subscribedproviderlist, function (index, val) {
                self.getCatalogCourse(val, undefined);
            });
            self.populateCatalogsCourses(res, 'create');
            $('#snw_checkbox').removeAttr("checked");
            $('#snw_checkbox_edit').removeAttr("checked");
            // }
            self.cursordefault();
            $('.popGrayBg').show();
        }
    };

    this.populateCatalogsCourses = function (resultdistrict, type) {
        var allCatalogs = self.model.get('allCatalogsList'),
            allCatalogsListDistrict = self.model.get('allCatalogsListDistrict'),
            _allCoorsesListDistrict = self.model.get('_allCoorsesListDistrict'),
            popup,
            loopVar, loopVar2,
            tempArrCourse = {},
            tempArrCatalogs = [],
            currentCatalog,
            subscribedcourselist = resultdistrict.data.subscribedcourselist,
            subscribedproviderlist = resultdistrict.data.subscribedproviderlist,
            loopVar, html = '',
            districtDomain = '';
        self.model.set('originalCourseData', subscribedcourselist);

        if (type === 'create') {
            for (loopVar = 0; loopVar < allCatalogsListDistrict.length; loopVar++) {
                if (subscribedproviderlist && subscribedproviderlist.indexOf(allCatalogsListDistrict[loopVar].id) > -1) {
                    currentCatalog = allCatalogsListDistrict[loopVar].id;
                    tempArrCatalogs.push(allCatalogsListDistrict[loopVar]);
                    if (currentCatalog == self.model.get('_customCatalogId')) { } else {
                        if (_allCoorsesListDistrict[currentCatalog]) {
                            for (loopVar2 = 0; loopVar2 < _allCoorsesListDistrict[currentCatalog].length; loopVar2++) {
                                if (!tempArrCourse[currentCatalog]) {
                                    tempArrCourse[currentCatalog] = [];
                                }
                                if (subscribedcourselist && subscribedcourselist.indexOf(_allCoorsesListDistrict[currentCatalog][loopVar2].id) > -1) {
                                    tempArrCourse[currentCatalog].push(_allCoorsesListDistrict[currentCatalog][loopVar2]);
                                }
                            }
                        }
                    }
                }
            }
            self.model.set('allCatalogsList', tempArrCatalogs);
            allCatalogs = tempArrCatalogs;
            self.model.set('_allCoorsesList', tempArrCourse);
            popup = $('.addschlpopupBox');
            districtDomain = resultdistrict.data.domain.id;
        } else {
            popup = $('.editschlpopupBox');
            districtDomain = resultdistrict.data.domain.parentid;
        }
        self.model.set('_selectedCatalogs', []);
        self.model.set('selectedCourses', []);
        self.model.set('totalCoursesForDist', []);
        for (loopVar = 0; loopVar < allCatalogs.length; loopVar++) {
            if (subscribedproviderlist && subscribedproviderlist.indexOf(allCatalogs[loopVar].id) > -1) {
                html += '<option id="checkbox' + loopVar + '" type="checkBox" data-domain-id="' + allCatalogs[loopVar].id + '" data-course-list="" selected="selected">' + allCatalogs[loopVar].name + '</option>';
                self.model.get('_selectedCatalogs').push(allCatalogs[loopVar].id);

            } else {
                html += '<option id="checkbox' + loopVar + '" type="checkBox" data-domain-id="' + allCatalogs[loopVar].id + '" data-course-list="">' + allCatalogs[loopVar].name + '</option>';
            }

        }

        var courseListURI = self.model.get('_config').getDomainData + "/" + districtDomain;
        self.model.ajaxObjCall({ //1567
            url: courseListURI
        }, self.addCourseListData, self.commonError, void 0, {
                successVal: {
                    popup: popup,
                    type: type,
                    subscribedcourselist: subscribedcourselist,
                    schoolDomain: resultdistrict,
                    allCatalogs: allCatalogs,
                    subscribedproviderlist: subscribedproviderlist
                }
            });

        if (subscribedproviderlist && subscribedproviderlist.length === 0) {
            popup.find(".course-list select").html('');
            self.cursordefault();
        }
        popup.find('.catalog-list select').html(html);
        self.cursordefault();
        self.bindevent();
    };

    //For school
    this.addCourseListData = function (districtData, parametersObj) {
        var courseSelectListHTML = '',
            popup = parametersObj.popup,
            type = parametersObj.type,
            loopVar,
            subscribedcourselist,
            _selectedCatalogs = self.model.get('_selectedCatalogs'),
            _allCoorsesList = self.model.get('_allCoorsesList'),
            selectedCourses = self.model.get('selectedCourses'),
            totalCourses = self.model.get('totalCoursesForDist'),
            totalCourses = [],
            subscribedcourselist = parametersObj.subscribedcourselist,
            distSubsCourseList = districtData.data.subscribedcourselist,
            distCourseProviderList = districtData.data.subscribedproviderlist,
            selector, allCatalogs = parametersObj.allCatalogs,
            districtCatalogObject = [], html = "",
            subscribedproviderlist = parametersObj.subscribedproviderlist;

        $.each(distCourseProviderList, function (index, provider) {
            $.each(allCatalogs, function (key, catalogValue) {
                if (provider == catalogValue.id) {
                    districtCatalogObject.push(catalogValue);
                }
            });
        });

        $.each(districtCatalogObject, function (index, val) {
            html += '<option id="checkbox' + index + '" type="checkBox" data-domain-id="' + val.id + '" data-course-list="" >' + val.name + '</option>';
        });

        self.resetDomainVar(districtData, '_parentDomain');
        for (loopVar = 0; loopVar < distCourseProviderList.length; loopVar++) {
            //Commented due to a bug reported,no course is displayed during adding a school in a district
            //if (_selectedCatalogs[loopVar] != self.model.get('_customCatalogId')) {
            totalCourses = totalCourses.concat(_allCoorsesList[distCourseProviderList[loopVar]]);
            //}
        }
        self.model.set('totalCoursesForDist', totalCourses);
        self.model.set('_totalCourseArry', totalCourses);
        $.each(totalCourses, function (index, course) {
            if (type === 'create') {
                selector = 'addschlpopupBox';
                if (distSubsCourseList.indexOf(course.id) > -1) {
                    courseSelectListHTML += '<option type="checkbox" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '" selected="selected">' + course.title + '</option>';

                    if (distSubsCourseList.indexOf(course.id) === -1) {
                        selectedCourses.push(course.id);
                    }
                }
            } else {
                selector = 'editschlpopupBox';
                if (distSubsCourseList.indexOf(course.id) > -1) {
                    courseSelectListHTML += '<option type="checkbox" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '" >' + course.title + '</option>';
                }
            }
        });


        self.model.set('selectedCourses', subscribedcourselist);
        popup.find(".course-list select").html(courseSelectListHTML);
        popup.find('.catalog-list select').html(html);
        self.setCatalogDropdown(subscribedproviderlist);
        self.cataLogVsCourseForSchool();
        self.prepareSchoolCourseDropDown(_selectedCatalogs);
        self.setSelectCourseDropdown(subscribedcourselist);
        //fix for scnario-1
        if (type === 'edit') {
            self.toggleEntireSelectiveRadio((parametersObj.schoolDomain.data.subscribedcourselist).length, $('.' + selector));
            //self.setEditSchoolEntireSelectiveRadio(districtData.data.subscribedcourselist,parametersObj.schoolDomain.data.subscribedcourselist,$('.'+selector));
        }
        //self.toggleEntireSelectiveRadio((parametersObj.schoolDomain.data.subscribedcourselist).length, $('.'+selector));
        self.cursordefault();
        $('.popGrayBg').show();
        self.bindevent();
    };

    this.getProviderListDataCall = function (res, parametersObj) {
        var dataParam = parametersObj.dataParam,
            t,
            html,
            state_list = parametersObj.state_list;
        html = '';
        state_list = '';
        $('.popupBox .inputTracker').empty();
        $('.editpopupBox').find('.inputTrackerEdit').empty();
        var count = 0;
        if (res.messageType) {
            for (t = 0; t < res.data.domains.length; t++) {
                html += '<option id="checkbox' + t + '" type="checkBox" data-domain-id="' + res.data.domains[t].id + '" data-course-list="">' + res.data.domains[t].name + '</option>';
                if (res.data.domains[t].id != self.model.get('_customCatalogId')) {
                    $('.popupBox .inputTracker').append('<input type="checkbox" disabled="disabled" value="" name="Add Subdomain" id="demo' + res.data.domains[t].id + '" class="demo">' + res.data.domains[t].name + '&nbsp;&nbsp;');
                    $('.editpopupBox .inputTrackerEdit').append('<input type="checkbox" disabled="disabled" value="" name="Add Subdomain" id="example' + res.data.domains[t].id + '" class="example">' + res.data.domains[t].name + '&nbsp;&nbsp;');
                    if ((count + 1) % 2 == 0) {
                        $('.popupBox .inputTracker').append('</br>');
                        $('.editpopupBox .inputTrackerEdit').append('</br>');
                    }
                    count++;
                }
            }
            $('.corsecatalogList select').html(html);
            self.cursordefault();
            self.bindevent();
        } else {
            $('.corsecatalogList select').html('<option type="checkBox"/>No Data Found</option>');
            self.cursordefault();
        }
        self.bindevent();
        $('.popGrayBg').show();
        if ($(self.model.get('_editbutton')).hasClass('edit')) {
            self.domainEditForm(self.model.get('_editbox'));
        }

    };

    this.commonError = function () {
        alert('Error page loading.');
    };

    //Handler functions
    this.circlePlusHandler = function () {
        $('.grayBg').css({
            'width': self.model.get('win_width'),
            'height': self.model.set('win_height')
        }).show();
        $('.addNew').show();
    };

    this.loginKeyUpPrefix = function ($element) {
        var loginPrefx = $.trim($element.val()),
            loginArray = loginPrefx.split('-'),
            loginUndifndChk = loginArray[1] != undefined ? loginArray[1] : '',
            htmlVal = $('.loginPrefix,#snw_Enter_Login_Prefix').val();
        dataWraper = htmlVal.split('-')[0];
        $('.externalId,#snw_Enter_External_ID').val(dataWraper.toLowerCase() + '-' + loginUndifndChk.toLowerCase());
    };

    this.domainNameKeyUp = function ($element, loginArray) {
        var inputDomVal = $element.val(),
            splitArry,
            maxCharLength = 50,
            t,
            loginUndifndChk = loginArray[1] != undefined ? loginArray[1] : '',
            dataWraper = '';
        if ($element.val().length > maxCharLength) {
            inputDomVal = inputDomVal.substr(0, maxCharLength - 1);
            $element.val(inputDomVal);
        }
        if ($.trim(inputDomVal.length) != 0) {
            splitArry = inputDomVal.split(" ");
            for (t = 0; t < splitArry.length; t++) {
                dataWraper += splitArry[t].charAt(0);
            }
            $('.loginPrefix,.externalId,#snw_Enter_Login_Prefix,#snw_Enter_External_ID').val(dataWraper.toLowerCase() + '-' + loginUndifndChk.toLowerCase());
        } else {
            $('.loginPrefix,.externalId,#snw_Enter_Login_Prefix,#snw_Enter_External_ID').val(dataWraper.toLowerCase());
        }
    };

    this.applyMaxLimit = function ($element) {
        var inputDomVal = $element.val(),
            limaxCharLength = 5,
            maxCharLength = 50;

        if ($element.hasClass('license-number') && $element.val().length > limaxCharLength) {
            inputDomVal = inputDomVal.substr(0, limaxCharLength - 1);
            $element.val(inputDomVal);
        } else if ($element.val().length > maxCharLength) {
            inputDomVal = inputDomVal.substr(0, maxCharLength - 1);
            $element.val(inputDomVal);
        }
    };

    this.popupBoxHandler = function () {
        var startDate,
            endDate;
        startDate = $('.subscription-start:visible').val();
        endDate = $('.subscription-end:visible').val();
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            var dateSplitStrat = startDate.split('-');
            startDate = dateSplitStrat[2] + '-' + dateSplitStrat[0] + '-' + dateSplitStrat[1];
            var dateSplitend = endDate.split('-');
            endDate = dateSplitend[2] + '-' + dateSplitend[0] + '-' + dateSplitend[1];
        }
        if ((new Date(startDate).getTime() < new Date(endDate).getTime())) {
            $('.errormsg9_1').hide();
        } else {
            $('.errormsg9_1').show();
        }
    };

    this.submitDistrictHandler = function ($element) {
        var lenght,
            trueCnt,
            startDate,
            endDate,
            errormsg,
            dateSplitStrat,
            dateSplitend;
        lenght = $('.popupBox td>input[type="text"]').length;
        trueCnt = 0;
        $('.popupBox td>input[type="text"]').each(function () {
            if ($.trim($(this).val()) === '') {
                $(this).next('label').show();
            } else {
                errormsg = self.isContentsValid($(this));
                $(this).next('label').hide();
                if (errormsg) {
                    $(this).siblings('.content-invalid').show().html(errormsg);
                } else {
                    $(this).siblings('.content-invalid').hide();
                    trueCnt++;
                }
            }
        });
        if (self.model.get('_selectedCatalogs').length === 0) {
            trueCnt--;
            $('.errormsg6').show();
        } else if (self.model.get('_selectedCatalogs').length > 0) {
            $('.errormsg6').hide();
        }
        if (self.model.get('selectedCourses').length === 0) {
            trueCnt--;
            $('.errormsg6_1').show();
        } else if (self.model.get('selectedCourses').length > 0) {
            $('.errormsg6_1').hide();
        }

        startDate = $('.popupBox').find('.subscription-start').val();
        endDate = EndDate = $('.popupBox').find('.subscription-end').val();
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            dateSplitStrat = startDate.split('-');
            startDate = dateSplitStrat[2] + '-' + dateSplitStrat[0] + '-' + dateSplitStrat[1];
            dateSplitend = endDate.split('-');
            endDate = dateSplitend[2] + '-' + dateSplitend[0] + '-' + dateSplitend[1];
        }
        if (lenght === trueCnt) {
            if ((new Date(startDate).getTime() < new Date(endDate).getTime())) {
                self.domainFormValidation(".popupBox", "create");
            } else {
                if (EndDate === "") {
                    self.domainFormValidation(".popupBox", "create");
                } else {
                    $('.hidee').hide();
                    $('.errormsg9_1').show();
                }
            }
        }
    };

    this.isContentsValid = function ($element) {
        var noSpecialChar = $element.attr('no-spcl-char'),
            contents = ($element.val()).toString(),
            spclCharArr = [],
            pattern = /\W/g,
            emptyHyphen,
            capitalLetters,
            charLengthLimit = $element.attr('max-char');
        if (contents.length > charLengthLimit) {
            return '*Character limit exceeded. Max limit is ' + charLengthLimit + '.';
        }
        if (noSpecialChar) {
            spclCharArr = contents.match(pattern);
            if (spclCharArr) {
                while (spclCharArr.indexOf('-') > -1) {
                    spclCharArr.splice(spclCharArr.indexOf('-'), 1);
                }
                if (spclCharArr.length > 0) {
                    return '*Only alpha numeric and hyphen is allowed.';
                }

            }
            if (contents[contents.length - 1] == '-') {
                return '*Last element in text should not be hyphen.';
            }
            emptyHyphen = contents.replace(/\-/g, '');
            if (!isNaN(emptyHyphen)) {
                return '*There should be at least one alphabet in text.';
            }
            capitalLetters = contents.match(/[A-Z]/g);
            if (capitalLetters && capitalLetters.length > 0) {
                return '*Capital letters are not allowed.';
            }
        }
        return false;

    };
    this.editSubmitHandler = function ($element) {
        var lenght,
            trueCnt,
            startDate,
            endDate,
            errormsg,
            pilotenddate,
            dateSplitStrat,
            dateSplitPilot,
            dateSplitend;
        lenght = $('.editpopupBox td>input[type="text"]').length;
        trueCnt = 0;
        $('.editpopupBox td>input[type="text"]').each(function () {
            if ($.trim($(this).val()) === '') {
                $(this).next('label').show();
            } else {
                errormsg = self.isContentsValid($(this));
                $(this).next('label').hide();
                if (errormsg) {
                    $(this).siblings('.content-invalid').show().html(errormsg);
                } else {
                    $(this).siblings('.content-invalid').hide();
                    trueCnt++;
                }
            }
        });
        if (self.model.get('_selectedCatalogs').length === 0) {
            trueCnt--;
            $('.errormsg20').show();
        } else if (self.model.get('_selectedCatalogs').length > 0) {
            $('.errormsg20').hide();
        }
        if (self.model.get('selectedCourses').length === 0) {
            trueCnt--;
            $('.errormsg21').show();
        } else if (self.model.get('selectedCourses').length > 0) {
            $('.errormsg21').hide();
        }
        if (lenght === trueCnt) {
            startDate = $('.editpopupBox').find('.subscription-start').val();
            endDate = EndDate = $('.editpopupBox').find('.subscription-end').val();
            pilotenddate = $('.editpopupBox').find('.pilotenddate').val();
            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                dateSplitStrat = startDate.split('-');
                startDate = dateSplitStrat[2] + '-' + dateSplitStrat[0] + '-' + dateSplitStrat[1];
                dateSplitend = endDate.split('-');
                endDate = dateSplitend[2] + '-' + dateSplitend[0] + '-' + dateSplitend[1];
                if (pilotenddate && pilotenddate !== '') {
                    dateSplitPilot = pilotenddate.split('-');
                    pilotenddate = dateSplitPilot[2] + '-' + dateSplitPilot[0] + '-' + dateSplitPilot[1];
                }
            }
            if ((new Date(startDate).getTime() < new Date(endDate).getTime())) {
                if (pilotenddate && (new Date(startDate).getTime() < new Date(pilotenddate).getTime())) {
                    self.domainFormValidation(".editpopupBox", "edit");
                    self.cursorwait();
                } else if (pilotenddate === '' || !pilotenddate) {
                    self.domainFormValidation(".editpopupBox", "edit");
                    self.cursorwait();
                } else {
                    alert('Pilot Date should not be less than Subscription Start Date.')
                }
            } else {
                if (EndDate === "") {
                    self.domainFormValidation(".editpopupBox", "edit");
                    self.cursorwait();
                }
                $('.hidee').hide();
                $('.errormsg9_1').show();
            }
        }
    };

    this.schlEditSubmitHandler = function ($element) {
        var localCount = 0,
            errormsg,
            disabledCount = 0;
        $('.editschlpopupBox .formTable input[type="text"]').each(function () {
            if ($.trim($(this).val()) === '' && !$(this).is('[disabled=disabled]')) {
                $(this).next('label').show();

            } else if ($.trim($(this).val()) != '' && $(this).is('[disabled=disabled]')) {
                disabledCount++;
            } else {
                // localCount++;
                // $(this).next('label').hide();
                errormsg = self.isContentsValid($(this));
                $(this).next('label').hide();
                if (errormsg) {
                    $(this).siblings('.content-invalid').show().html(errormsg);
                } else {
                    $(this).siblings('.content-invalid').hide();
                    localCount++;
                }
            }
        });

        if (self.model.get('_selectedCatalogs').length === 0) {
            localCount--;
            $('.errormsg20').show();
        } else if (self.model.get('_selectedCatalogs').length > 0) {
            $('.errormsg20').hide();
        }
        if (self.model.get('selectedCourses').length === 0) {
            localCount--;
            $('.errormsg21').show();
        } else if (self.model.get('selectedCourses').length > 0) {
            $('.errormsg21').hide();
        }
        if (localCount === ($('.editschlpopupBox .formTable input[type="text"]').length - disabledCount)) {
            self.cursorwait();
            self.saveSchool($('.editschlpopupBox'), 'edit');
        }
    };

    this.editAddSchool = function ($element) {
        var dId;
        $('.grayBg,.popGrayBg,.editschlpopupBox').hide();
        $('.popupBox,.editpopupBox,.addschlpopupBox').hide();
        dId = $element.parents('.editpopupBox').attr('data-domain-id');
        $('li#' + dId).find('li.addschool').trigger('click');
    };

    //      34894868
    this.schlsubmitHandler = function ($element) {
        var localCount,
            errormsg,
            disabledCount;
        $('.hidee').hide();
        localCount = 0;
        disabledCount = 0;
        $('.addschlpopupBox .formTable input[type="text"]').each(function () {
            if ($.trim($(this).val()) === '' && !$(this).is('[disabled=disabled]')) {
                $(this).next('label').show();

            } else if ($.trim($(this).val()) === '' && $(this).is('[disabled=disabled]')) {
                disabledCount++;
            } else {
                // localCount++;
                // $(this).next('label').hide();
                errormsg = self.isContentsValid($(this));
                $(this).next('label').hide();
                if (errormsg) {
                    $(this).siblings('.content-invalid').show().html(errormsg);
                } else {
                    $(this).siblings('.content-invalid').hide();
                    localCount++;
                }
            }
        });
        if (self.model.get('_selectedCatalogs').length === 0) {
            localCount--;
            $('.errormsg6').show();
        } else if (self.model.get('_selectedCatalogs').length > 0) {
            $('.errormsg6').hide();
        }
        if (self.model.get('selectedCourses').length === 0) {
            localCount--;
            $('.errormsg6_1').show();
        } else if (self.model.get('selectedCourses').length > 0) {
            $('.errormsg6_1').hide();
        }
        if (localCount === ($('.addschlpopupBox .formTable input[type="text"]').length - disabledCount)) {
            self.cursorwait();
            self.saveSchool($('.addschlpopupBox'), 'create');
        }
    };

    this.createPopupRadio = function ($element) {
        var data_id = $element.attr('data-id');
        if (data_id === 'select') {
            $('#snwselectCourse li').each(function () {
                $(this).find('input').prop('checked', false);
            });
            $('#snwSelectCourse li').each(function () {
                $(this).find('input').prop('checked', false);
            });
        } else {
            $('#snwselectCourse li').each(function () {
                $(this).find('input').prop('checked', true);
            });
            $('#snwSelectCourse li').each(function () {
                $(this).find('input').prop('checked', true);
            });
        }
    };

    this.disTrictListHandler = function ($element) {
        var html,
            result,
            attrId,
            thisContext;
        self.model.set('_rowView', 10);
        self.cursorwait();
        html = '';
        result = self.model.get('configResult');
        attrId = $element.data('id');
        thisContext = $element;
        self.model.set({
            '_districtContext': $element,
            '_globalId': attrId,
            '_globalThisContext': $element
        });
        if (thisContext.parents('.districtTabBoxHead').next().is(':visible')) {
            self.saveProviderListData();
        }
        //312
        self.model.ajaxObjCall({ //312
            type: "GET",
            url: result.getDomainData + '/' + attrId,
            crossDomain: true,
            contentType: "application/json"
        }, self.districtTabBoxData, self.commonError, void 0, {
                successVal: {
                    thisContext: thisContext,
                    attrId: attrId
                }
            });
    };

    this.showEntryHandler = function ($element) {
        var result,
            html;
        self.model.set('_rowView', $element.val());
        self.cursorwait();
        result = self.model.get('configResult');
        html = '';
        self.model.ajaxObjCall({ //399
            type: "GET",
            url: self.model.get('_config').schoolList + '/' + self.model.get('_globalId') + '?querystring=0&limit=' + self.model.get('_rowView'),
            crossDomain: true,
            contentType: "application/json"
        }, self.displayEntry, self.commonError, void 0, {
                successVal: {
                    html: html
                }
            });
    };

    this.NextCirHandler = function ($element) {
        var result,
            html,
            _previousCountArray = self.model.get('_previousCountArray'),
            attrId;
        result = self.model.get('configResult');
        if (self.model.get('_schoolRowDisableCheck') < self.model.get('_rowView')) {
            $('.NextCir').prop('disabled', true).addClass('disabled');
            return false;
        }
        $('.PreviousCir').removeAttr('disabled').removeClass('disabled');
        $('.pagination li').removeClass('disabled');
        attrId = $('.SAListTable tr:last').attr('data-id');
        self.model.set('_previousCount', self.model.get('_previousCount') + 1)
        if (self.model.get('_previousCount') === _previousCountArray.length) {
            _previousCountArray.push($('.SAListTable tr').eq(1).attr('data-id'));
        }
        self.model.set('_previousCountArray', _previousCountArray);
        self.cursorwait();
        html = '';
        self.model.ajaxObjCall({ //459
            type: "GET",
            url: result.schoolList + '/' + self.model.get('_globalId') + '?querystring=' + attrId + '&limit=' + self.model.get('_rowView') + '',
            crossDomain: true,
            contentType: "application/json",
        }, self.displayNextSchoolEntry, self.commonError, void 0, {
                successVal: {
                    html: html
                }
            });
    };

    this.PreviousCirHandler = function ($element) {
        var result,
            html;
        result = self.model.get('configResult');
        if (self.model.get('_previousCount') !== 0) {
            self.model.set('_previousCount', self.model.get('_previousCount') - 1);
        } else {
            $('.PreviousCir').prop('disabled', true).addClass('disabled');
            return false;
        }
        $('.NextCir').removeAttr('disabled').removeClass('disabled');
        self.cursorwait();
        html = '';
        self.model.ajaxObjCall({ //514
            type: "GET",
            url: result.schoolList + '/' + self.model.get('_globalId') + '?querystring=' + self.model.get('_previousCountArray')[self.model.get('_previousCount')] + '&limit=' + self.model.get('_rowView') + '',
            crossDomain: true,
            contentType: "application/json",
        }, self.displayNextSchoolEntry, self.commonError, void 0, {
                successVal: {
                    html: html
                }
            })
    };

    this.DomainNextHandler = function ($element) {
        var result,
            html,
            idUrl,
            idTrcaker,
            schlId;
        result = self.model.get('configResult');
        if (self.model.get('_nextdisbleChcek') < self.model.get('_dropdownCount')) {
            $('.DomainNext').prop('disabled', true).addClass('disabled');
            return false;
        }

        idTrcaker = Math.max.apply(Math, $('.domainContainer>ul>li').map(function () {
            return this.id;
        }));

        self.model.set('_landingPagePrevCount', self.model.get('_landingPagePrevCount') + 1);
        if (self.model.get('_landingPagePrevCount') === self.model.get('_previousLandingCountArray').length) {
            self.model.get('_previousLandingCountArray').push(idTrcaker);
        }
        $('.DomainPrevious').removeAttr('disabled').removeClass('disabled');
        self.cursorwait();
        html = '';
        idUrl = self.model.get('_postId');
        schlId = '';
        self.model.set('_baseUrl', result.DistrictList);
        self.model.ajaxObjCall({ //572
            type: "GET",
            url: self.model.get('_baseUrl') + '/' + idUrl + '?querystring=' + idTrcaker + '&limit=' + self.model.get('_dropdownCount') + '',
            crossDomain: true,
            contentType: "application/json"
        }, self.displayNextDomain, self.commonError, self.nextDomainCallComplete, {
                successVal: {
                    html: html
                }
            });
    };

    this.DomainPreviousHandler = function ($element) {
        var result,
            html,
            idUrl,
            schlId;
        _landingPagePrevCount = self.model.get('_landingPagePrevCount') - 1;
        result = self.model.get('configResult');
        if (self.model.get('_landingPagePrevCount') != 0) {
            self.model.set('_landingPagePrevCount', _landingPagePrevCount);
        } else {
            $('.DomainPrevious').prop('disabled', true).addClass('disabled');
            return false;
        }
        self.model.set('_landingPagePrevCount', self.model.get('_landingPagePrevCount') == -1 ? 0 : self.model.get('_landingPagePrevCount'));
        self.cursorwait();
        $('.DomainNext').removeAttr('disabled').removeClass('disabled');
        html = '';
        idUrl = self.model.get('_postId');
        schlId = '';
        self.model.set('_baseUrl', result.DistrictList);
        self.model.ajaxObjCall({ //630
            type: "GET",
            url: self.model.get('_baseUrl') + '/' + idUrl + '?querystring=' + self.model.get('_previousLandingCountArray')[self.model.get('_landingPagePrevCount')] + '&limit=' + self.model.get('_dropdownCount') + '',
            crossDomain: true,
            contentType: "application/json"
        }, self.displayNextDomain, self.commonError, self.nextDomainCallComplete, {
                successVal: {
                    html: html
                }
            });
    };

    this.domainShowEntryHandler = function ($element) {
        var result,
            html,
            idUrl,
            schlId;
        result = self.model.get('configResult');
        self.model.set('_dropdownCount', $element.val());
        self.cursorwait();
        html = '';
        idUrl = self.model.get('_postId');
        schlId = '';

        self.model.set('_baseUrl', result.DistrictList);
        self.model.ajaxObjCall({ //685
            type: "GET",
            url: self.model.get('_baseUrl') + '/' + idUrl + '?querystring=0&limit=' + self.model.get('_dropdownCount') + '',
            crossDomain: true,
            contentType: "application/json"
        }, self.domainShowEntry, self.commonError, self.nextDomainCallComplete, {
                successVal: {
                    html: html
                }
            });
    };

    this.newDomTabHandler = function ($element) {
        $('.newDomTab li').each(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
        });
        $element.addClass('active');
        $('.newDomTab li').each(function (g) {
            if ($(this).hasClass('active')) {
                $('#panel_' + g + '').show();
            } else {
                $('#panel_' + g + '').hide();
            }
        });
    };

    this.adminNav = function ($element) {
        if ($element.hasClass('active')) {
            $('.adminNavList ul').slideUp(500);
            $('.adminNav li').removeClass('active');
        } else {
            $('.adminNav li').removeClass('active');
            $element.addClass('active');
            var localIndex = $element.index();
            $('.adminNavList ul').slideUp(500);
            var cssLeft = $element.position().left;
            var cssTop = $element.position().top;
            $('.adminNavList ul:eq(' + localIndex + ')').css({
                'left': cssLeft,
                'top': cssTop
            }).slideDown(500);
        }
    };
    this.adminNavFirst = function ($element) {
        var localIndex, cssLeft, cssTop;
        if ($element.hasClass('active')) {
            $('.adminNavList ul').slideUp(500);
            $('.adminNav li').removeClass('active');
        } else {
            $('.adminNav li').removeClass('active');
            $element.addClass('active');
            localIndex = $element.index();
            $('.adminNavList ul').slideDown(500);
            cssLeft = $element.position().left;
            cssTop = $element.position().top;
            $('.adminNavList ul').css({
                'left': cssLeft,
                'top': cssTop
            }).slideDown(500);
        }

        console.log("3202- first");
    };
    this.adminNavZero = function () {
        $('.adminNavList ul').slideUp(500);
        $('.adminNav li').removeClass('active');
        $('#snw-license-usage-report02,#snw-license-usage-report05,.user').hide();
        $('#adminContainer,.welcome').show();

        console.log("3210- zero");
    }
    this.courseCatalogHandler = function (e) {
        e.stopPropagation();
        if ($('.corsecatalogList').is(':visible')) {
            // $('.corsecatalogList').hide();
        } else {
            $('.corsecatalogList').show();
            // $('.corseselectList').hide();
        }
        if ($('.corsecatalog .editableCatalog .catalogList').length == 0) {
            $('.corsecatalog .editableCatalog').html('<label class="slectdemo">Select</label>');
        }
        return false;
    };

    this.courseSelectHandler = function (e) {
        e.stopPropagation();
        if ($('.editpopupBox').is(':visible')) {
            self.editnewfunction();
        }
        if ($('.corseselectList').is(':visible')) {
            // $('.corsecatalogList').hide();
        } else {
            $('.corseselectList').show();
            // $('.corsecatalogList').hide();
        }
        return false;
    };

    this.SearchClickHandler = function () {
        var result,
            srchData,
            searchLimit = 25,
            html;
        result = self.model.get('configResult');
        srchData = $('.searchbox').val();
        if ($.trim(srchData) === "") {
            alert("Please enter search value");
            return false;
        }
        $('#snwstatename option.selectState').prop('selected', 'selected')
        self.cursorwait();
        html = '';
        self.model.ajaxObjCall({ //809
            type: "GET",
            // url: result.DistrictList + '/' + self.model.get('_postId') + '?querystring=0&searchtext=' + srchData + '&limit=' + self.model.get('_rowView') + '',
            url: result.DistrictList + '/school/0?querystring=0&searchtext=' + srchData + '&limit=' + searchLimit + '',
            crossDomain: true,
            contentType: "application/json"
        }, self.searchDataDisplay, self.commonError, void 0, {
                successVal: {
                    html: html
                }
            });
    };

    this.documentClickHandler = function (e) {
        if ('loginPerson' != $(e.target).attr('class')) {
            if ('loggerName' != $(e.target).attr('class')) {
                $('#snwLPMenu').hide();
            } else {
                $('#snwLPMenu').show();
            }
        }
        if ('loggerName' != $(e.target).attr('class')) {
            if ('loginPerson' != $(e.target).attr('class')) {
                $('#snwLPMenu').hide();
            } else {
                $('#snwLPMenu').show();
            }
        }
        if ($('.corseselectList').has(e.target).length === 0) {
            // $('.corseselectList').hide();
        }
        if ($('.corsecatalogList').has(e.target).length === 0) {
            // $('.corsecatalogList').hide();
        }
        if ($('.stateDataListing').has(e.target).length === 0) {
            $('.stateDataListing').hide();
        }
        if ($('.domainDataListing').has(e.target).length === 0) {
            $('.domainDataListing').hide();
        }
        if ($('.corsecatalog .editableCatalog .catalogList').length == 0) {
            $('.corsecatalog .editableCatalog').html('<label class="slectdemo">Select</label>');
        }
    };

    this.distrctAddHandler = function ($element) {
        self.model.set('_selectedCatalogs', []);
        self.model.set('_domain', null);
        self.setEntireSelectiveradio($('.popupBox'), true, false);
        $('.popupBox').find('.inputTracker input').prop("checked", false);
        $('.hidee').hide();
        $('.createdomainlist').html($('.statename').html());
        $('[data-toggle="tooltip"]').tooltip();
        $('.popupBox').fadeIn('slow');
        $('.grayBg,.popGrayBg').css({
            'height': $('body').height()
        });
        self.model.set('isSchoolPopup', false);
        self.model.set('allCatalogsList', self.model.get('allCatalogsListDistrict'));
        self.model.set('_allCoorsesList', self.model.get('_allCoorsesListDistrict'));
        $('.popupBox .formTable input').each(function () {
            $(this).val('');
        });
        $('.course-list').html('<select id="snwselectCourse" class="selectCourse js-example-placeholder-multiple" multiple>' + '<option>Please select a Course Catalog first.</option>' + '<option></option>' + '</select>');
        $('.createdomainlist').val(self.model.get('_optionselector'));
        $('.popupBox .pilot-domain').removeAttr('checked');
        self.model.set('_editbutton', $(''));
        self.model.set('selectedCourses', []);
        self.getProviderList();

        $('#snwsubscription-start,#snwpilotenddate').val(self.getCurrentDate());
    };


    this.catalogListInputHandler = function ($element) {
        var inputVal,
            thisId,
            domainId,
            lcalText;
        inputVal = $element.parent().text();
        thisId = $element.attr('id');
        domainId = $element.attr('data-domain-id');
        if ($element.is(":checked")) {
            if ($('.corsecatalog .slectdemo').length > 0) {
                $('.corsecatalog .editableCatalog').html('<label id="' + thisId + '" class="catalogList">' + inputVal + '</label>');
            } else {
                $('.corsecatalog .editableCatalog').append('<label id="' + thisId + '" class="catalogList">' + ',' + ' ' + inputVal + '</label>');
            }
            $('#demo' + domainId).attr('checked', 'checked');
        } else {
            $('#demo' + domainId).removeAttr('checked');
            $('.editableCatalog #' + thisId).remove();
        }
        lcalText = $('.corsecatalog .editableCatalog .catalogList').eq(0).text();
        $('.corsecatalog .editableCatalog .catalogList').eq(0).text(lcalText.replace(/,/g, ""));
    };


    this.editDistrictHandler = function ($element) {
        $('.editpopupBox').find('.inputTrackerEdit input').prop("checked", false);
        $('.editdomainlist').html($('.statename').html());
        $('.editpopupBox').fadeIn('slow');
        $('.grayBg,.popGrayBg').css({
            'height': $('body').height()
        });
        $('.hidee').hide();
        self.model.set('isSchoolPopup', false);
        self.model.set('allCatalogsList', self.model.get('allCatalogsListDistrict'));
        self.model.set('_allCoorsesList', self.model.get('_allCoorsesListDistrict'));
        $('.formTable .domain-name').val($element.parents('.districtTabBox').find('.disTrictList').text());
        $('.formTable .domain-name').attr('value', $element.parents('.districtTabBox').find('.disTrictList').text());
        $('.editpopupBox').find('.editwelcome').data("domain-id", $element.closest(".districtTabBox").find("h1.disTrictList").data("id"));
        $('.editpopupBox').find('.editsubmit').data("domain-id", $element.closest(".districtTabBox").find("h1.disTrictList").data("id"));
        $('.editpopupBox').attr("data-domain-id", $element.closest(".districtTabBox").find("h1.disTrictList").data("id"));
        self.cursorwait();
        self.getProviderList();
        self.model.set('_editbutton', $element);
        $('.editdomainlist').val(self.model.get('_optionselector'));
        $('.editdomainlist').attr('value', self.model.get('_optionselector'));
    };

    this.addSchoolHandler = function ($element) {
        $('.hidee').hide();
        var stateSelctedVal = $('.statename').val(),
            startDate, pilotDate;
        stateSelctedVal = $element.parents('.districtTabBox').find('.districtTabBoxHead').attr('parentid');
        if (!stateSelctedVal) {
            stateSelctedVal = $('.statename').val();
        }
        var attrId = $element.parents('.districtTabBoxHead').find('.disTrictList').data('id');
        $('#snw_Enter_Login_Prefix,#snw_Enter_External_ID,#snw_Enter_School').val('');
        self.cursorwait();
        self.model.set('isSchoolPopup', true);
        $('.addschoollist').html($('.statename').html());
        $('.addschlpopupBox,.grayBg').show();
        $('.grayBg,.popGrayBg').css({
            'height': $('body').height()
        });
        if (stateSelctedVal) {
            $('.addschoollist').val(stateSelctedVal);
        } else {
            $('.addschoollist').val(self.model.get('_optionselector'));
        }

        $('.schooldistrictlist').val(attrId);
        $('#snw_popupInputDate1').val(self.getCurrentDate());
        $('.addschlpopupBox .pilot-domain').removeAttr('checked');
        if (stateSelctedVal) {
            self.addSchool(stateSelctedVal, attrId);
        } else {
            self.addSchool(self.model.get('_optionselector'), attrId);
        }
    };

    this.addSchlPopupBox = function ($element) {
        self.cursorwait();
        var dataVal = $element.val();
        self.addSchool(dataVal, 0);
    };

    this.editSchoolDistrictList = function ($element) {
        self.cursorwait();
        var dataVal = $element.val();
        self.schoolPopupData(dataVal);
    };

    this.courseCatalogListInput = function ($element) {
        var localLength,
            lclLngthEdit,
            indexArray, data_domain_id,
            indexArrayEdit,
            i;
        data_domain_id = $element.attr('data-domain-id');
        if ($element.is(':checked')) {
            $('#example' + data_domain_id + ':visible').prop("checked", true);
            $('#demo' + data_domain_id + ':visible').prop("checked", true);
            if ($('input[data-domain-id=' + self.model.get('_customCatalogId') + ']').is(':checked')) {
                $('.inputTracker input').prop("checked", false);
                $('.inputTrackerEdit input').prop("checked", false);
            }
            if ($element.attr('data-domain-id') == self.model.get('_customCatalogId')) {
                $('.inputTracker input').prop("checked", false);
                $('.inputTrackerEdit input').prop("checked", false);
            }
            $('#demo' + data_domain_id).attr('checked', 'checked');
        } else {
            $('#example' + data_domain_id + ':visible').prop("checked", false);
            $('#demo' + data_domain_id + ':visible').prop("checked", false);
            if ($element.attr('data-domain-id') == self.model.get('_customCatalogId')) {
                localLength = $('#snwselectInput Input:checkbox:checked').length;
                lclLngthEdit = $('#snwSelectInput Input:checkbox:checked').length;
                indexArray = [];
                indexArrayEdit = [];
                for (i = 0; i < localLength; i++) {
                    indexArray.push($('#snwselectInput Input:checkbox:checked:eq(' + i + ')').attr('data-domain-id'));
                    $('#demo' + indexArray[i]).prop("checked", true);
                }
                for (i = 0; i < lclLngthEdit; i++) {
                    // $('#snwCorsecatalogList').hide();
                    indexArrayEdit.push($('#snwSelectInput Input:checkbox:checked:eq(' + i + ')').attr('data-domain-id'));
                    $('#example' + indexArrayEdit[i]).prop("checked", true);
                }
            }
            $('#demo' + data_domain_id).removeAttr('checked');
        }
        self.updateCourseList();
    };

    this.editSchoolPopHandler = function ($element) {
        var stateSelctedVal = $('.statename').val(),
            startDate, pilotDate;
        stateSelctedVal = $element.parents('.districtTabBox').find('.districtTabBoxHead').attr('parentid');

        if (!stateSelctedVal) {
            stateSelctedVal = $('.statename').val();
        }
        self.model.set('isSchoolPopup', true);
        $('.hidee').hide();
        $('.addschoollist').html($('.statename').html());
        self.cursorwait();
        self.model.set('_domainId', $element.parents('tr').attr('data-id'));
        $('.editschoolwelcome').data("domain-id", $element.parents('tr').attr('data-id'));
        $('.addschoollist').val(stateSelctedVal);
        startDate = $element.parents('.districtHeadDetails').attr('startDate');
        pilotDate = $element.parents('.districtHeadDetails').attr('pilotDate');
        self.model.set('subscriptionstartdate', startDate);
        self.model.set('pilotenddate', pilotDate);
        self.editSchool($('.editschlpopupBox'), $element.parents('tr').attr('data-id'), stateSelctedVal);
    };

    this.beforeSendEventHandler = function (xhr, settings) {
        var _sessionData = self.model.get('_sessionData');
        if (_sessionData) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + self.model.get('_globalSccessToken'));
            xhr.setRequestHeader('token', _sessionData.token);
        }
    };


    //reports start

    this.snwReportsLienceLiFirst = function ($element) {
        var html, i;
        $('.total-value-col,.user').hide();
        $('#snw-val051').prop('checked', true);
        $('.domainInput').html('<li class="massge">Please select a state first.</li><li><input type="checkbox" class="allSelect">Select All</li>');
        $('#snw-license-usage-report02,.License').show();
        $('#snw-license-usage-report05').hide();
        $('#adminContainer').hide();
        $('.adminNavList ul').slideUp(500);
        $('#snwSubscription-end2').val('');
        $('#snwSubscription-start2').val(self.getCurrentDate());
        html = '<li><input type="checkbox" class="allSelect">Select All</li>';
        $('.stateInput').html(function () {
            for (i = 0; i < self.model.get('_stateId').length; i++) {
                html += '<li><input id="checkbox' + i + '" data-test="stateTest' + i + '" type="checkBox" data-value="' + self.model.get('_stateId')[i] + '"  statename="' + self.model.get('_stateName')[i] + '">' + self.model.get('_stateName')[i] + '</li>';

            }
            return html;
        });
        $('.stateDataListing Input[type="checkbox"]').off('click').on('click', function () {
            self.stateDataListingInput($(this));
            if ($(this).prop('checked') != 'checked') {
                $('.stateInput input.allSelect').prop('checked', false);
            }
        });
        $('.stateInput input.allSelect').off('click').on('click', function () {

            if ($(this).prop('checked') == true) {
                $('.stateInput input[type="checkbox"]').prop('checked', 'checked');
                $('.stateInput').find('Input:checkbox:checked').each(function () {
                    self.stateDataListingInput($(this));
                });
                self.cursorwait();
                self.model.set('deselectAll', false);
            } else {
                $('.stateInput input[type="checkbox"]').prop('checked', false);
                $('.stateInput').find('Input:checkbox').each(function () {
                    self.stateDataListingInput($(this));
                });
                self.model.set('deselectAll', true);
                $('.domainInput').html('<li class="massge">Please select a state first.</li><li><input type="checkbox" class="allSelect">Select All</li>');
            }
        });
        $('.adminNav li:eq(2)').removeClass('demoSetupActive');
        console.log("3539");
    };

    this.stateDataListingInput = function ($element) {
        var html = '',
            i,
            statename = $element.attr('statename'),
            stateSelctedVal = $element.attr('data-value'),
            stateTest = $element.attr('data-test');
        if (stateSelctedVal) {
            if ($element.is(':checked')) {
                self.model.ajaxObjCall({ //repo685
                    type: "GET",
                    url: self.model.get('_config').DistrictList + '/' + stateSelctedVal
                }, self.stateDataListingInputSucc, self.commonError, void 0, {
                        successVal: {
                            stateTest: stateTest,
                            html: html,
                            statename: statename
                        }
                    });
            } else {
                $('.domainInput input[data-test=' + stateTest + ']').parent().remove();
                $('.domainInput li.' + statename.replace(' ', '')).remove();
            }
            if ($('.stateDataListing Input').is(':checked')) {
                $('.domainInput .massge').remove();
            } else {
                $('.domainInput').html('<li class="massge">Please select a state first.</li><li><input type="checkbox" class="allSelect">Select All</li>');
            }
        }
    };

    //repo685
    this.stateDataListingInputSucc = function (rslte, parametersObj) {
        var i,
            stateTest = parametersObj.stateTest,
            statename = parametersObj.statename,
            html = '<li class="' + statename.replace(/ /i, '') + '"><span style="font-weight:bold; margin-left: -13px;">' + statename + '</span></li>';
        if (rslte.messageType === "SUCCESS") {
            $('.domainInput').append(function () {
                for (i = 0; i < rslte.data.domains.length; i++) {
                    html += '<li><input id="checkbox' + i + '" data-test="' + stateTest + '" type="checkBox" data-value="' + rslte.data.domains[i].id + '">' + rslte.data.domains[i].name + '</li>';
                }
                return html;
            });
            setTimeout(function () {
                self.cursordefault();
            }, 8000);

        }
        $('.domainInput Input[type="checkbox"]').off('click').on('click', function () {
            if ($(this).prop('checked') != 'checked') {
                $('.domainInput input.allSelect').prop('checked', false);
            }
        });
        $('.domainInput input.allSelect').off('click').on('click', function () {
            if ($(this).prop('checked') == true) {
                $('.domainInput input[type="checkbox"]').prop('checked', 'checked');

            } else {
                $('.domainInput input[type="checkbox"]').prop('checked', false);
            }
        });
        setTimeout(function () {
            self.cursordefault();
        }, 8000);
    };


    this.removeDuplicates = function (arr) {
        var uniqueArr = [],
            arrLength = arr.length,
            elementFromArr,
            loopVar;
        for (loopVar = 0; loopVar < arr.length; loopVar++) {
            elementFromArr = arr[loopVar];
            if (uniqueArr.indexOf(arr[loopVar]) > -1); {
                uniqueArr.push(arr[loopVar]);
            }
        }
        return uniqueArr;
    };

    this.snwreportsLienceLiSec = function ($element) {
        var html = '<li><input type="checkbox" class="allSelect">Select All</li>',
            stateIds = self.model.get('_stateId'),
            i;
        stateIds = self.removeDuplicates(stateIds);
        $('.total-value-col,.user').hide();
        $('#snwSubscription-end5').val('');
        $('#snwSubscription-start5').val(self.getCurrentDate());
        $('#snw-license-usage-report02').hide();
        $('#snw-license-usage-report05,.Pilot').show();
        $('#adminContainer').hide();
        $('.hidee').hide();
        $('.adminNavList ul').slideUp(500);
        html = '<li><input type="checkbox" class="allSelect">Select All</li>';
        $('.stateInput').html(function () {
            for (i = 0; i < stateIds.length; i++) {
                html += '<li><input id="checkboxPilot' + i + '" data-test="stateTest' + i + '" type="checkBox" data-value="' + self.model.get('_stateId')[i] + '" statename="' + self.model.get('_stateName')[i] + '">' + self.model.get('_stateName')[i] + '</li>';
            }
            return html;
        });
        $('.stateInput input[type="checkbox"]').off('click').on('click', function () {
            self.model.set('_stateReportId', []);

            $('.stateInput').find('Input:checkbox:checked').each(function () {
                self.model.get('_stateReportId').push($(this).attr('data-value'));
            });
            if ($(this).prop('checked') != 'checked') {
                $('.stateInput input.allSelect').prop('checked', false);
            }
        });
        $('.stateInput input.allSelect').off('click').on('click', function () {
            self.model.set('_stateReportId', []);
            if ($(this).prop('checked') == true) {
                $('.stateInput input[type="checkbox"]').prop('checked', 'checked');
                $('.stateInput').find('Input:checkbox:checked').each(function () {
                    self.model.get('_stateReportId').push($(this).attr('data-value'));
                });
            } else {
                $('.stateInput input[type="checkbox"]').prop('checked', false);
                $('.stateInput').find('Input:checkbox:checked').each(function () {
                    self.model.get('_stateReportId').splice($(this).attr('data-value'), 1);
                });
            }
        });
        $('#snwsubscription-start5').val(self.getCurrentDate());
        $('.adminNav li:eq(2)').removeClass('demoSetupActive');
        console.log('3668');
    };


    this.reportfisrteditHandler = function () {
        $('iframe').contents().find(".findSolution").trigger('click');
        $('.hidee').hide();
        self.cursorwait();
        var timer = 500;
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            timer = 500;
        }
        setTimeout(function () {
            self.reportFisrtEditTimeOut();
        }, timer);
    }



    this.reportFisrtEditTimeOut = function () {
        var startDate,
            endDate,
            checkUrl;
        self.model.set('_ditrictReportId', []);
        $('.domainInput input').each(function () {
            if ($(this).is(':checked')) {
                if ($(this).attr('data-value')) {
                    self.model.get('_ditrictReportId').push($(this).attr('data-value'));
                }
            }
        });
        $('.hidee').hide();
        startDate = $('#snwSubscription-start2').val().replace(/\-/g, '/');
        endDate = $('#snwSubscription-end2').val().replace(/\-/g, '/');
        if ($('.stateInput input').is(':checked')) {

            $('.exL1').hide();
            if ($('.domainInput input').is(':checked')) {
                $('.exL2').hide();
            } else {
                $('.exL2').show();
                self.cursordefault();
            }
        } else {
            $('.exL1').show();
            self.cursordefault();
        }
        if (startDate == "" || endDate == "") {
            $('.bothL').show();
            self.cursordefault();
        }
        if ((new Date(startDate).getTime() > new Date(self.getCurrentDate()).getTime())) {
            $('.st1').show();
            self.cursordefault();
        }
        if ((new Date(endDate).getTime() < new Date(startDate).getTime())) {
            $('.end1').show();
            self.cursordefault();
        }
        checkUrl = "districtlicensereport";
        if ($('#snw-val051').is(':checked')) {
            checkUrl = "reports/districtlicensereport";
        }
        if ($('#snw-val061').is(':checked')) {
            checkUrl = "reports/courselicensereport";
        }
        self.firefoxTimeOut(startDate, endDate, checkUrl);
        $('#snw-license-usage-report02').find('iframe').on('load', function () {
            self.snwLicenseUsageReportFunc($(this));
        });
    };


    this.firefoxTimeOut = function (startDate, endDate, checkUrl) {
        var startdateCopy,
            endDateCopy,
            $baseURL,
            dateSplitStrat,
            dataUrl,
            dateSplitend,
            $baseURL1,
            dataUrl1,
            cuurentDate,
            cuurDt;
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            startdateCopy = startDate,
                endDateCopy = endDate;
            dateSplitStrat = startDate.split('/');
            startDate = dateSplitStrat[2] + '-' + dateSplitStrat[0] + '-' + dateSplitStrat[1];
            dateSplitend = endDate.split('/');
            endDate = dateSplitend[2] + '-' + dateSplitend[0] + '-' + dateSplitend[1];
            cuurentDate = self.getCurrentDate().split('-');
            cuurDt = cuurentDate[2] + '-' + cuurentDate[0] + '-' + cuurentDate[1];
            if ((new Date(startDate).getTime() <= new Date(cuurDt).getTime()) && (new Date(endDate).getTime() > new Date(startDate).getTime()) && $('.stateInput input').is(':checked') && $('.domainInput input').is(':checked')) {

                $baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port && (':' + window.location.port)) + '/';
                dataUrl = $baseURL + checkUrl + '?startdate=' + startdateCopy + '&enddate=' + endDateCopy + '&domainid=' + self.model.get('_ditrictReportId').join();

                $('#snw-license-usage-report02').find('.value-row').html('<iframe src=""></iframe>');
                $('#snw-value1').show();
                $('#snw-license-usage-report02').find('iframe').attr('src', dataUrl);

            }
        } else {
            if ((new Date(startDate).getTime() <= new Date(self.getCurrentDate()).getTime()) && (new Date(endDate).getTime() > new Date(startDate).getTime()) && $('.stateInput input').is(':checked') && $('.domainInput input').is(':checked')) {

                $baseURL1 = window.location.protocol + '//' + window.location.hostname + (window.location.port && (':' + window.location.port)) + '/';
                dataUrl1 = $baseURL1 + checkUrl + '?startdate=' + startDate + '&enddate=' + endDate + '&domainid=' + self.model.get('_ditrictReportId').join();

                $('#snw-license-usage-report02').find('.value-row').html('<iframe src=""></iframe>');
                $('#snw-value1').show();
                $('#snw-license-usage-report02').find('iframe').attr('src', dataUrl1);

            }
        }
    };


    this.snwLicenseUsageReportFunc = function ($element) {
        var dataElement = $element,
            myVar = setInterval(function () {
                if (!dataElement.contents().find('#container').is(':empty')) {
                    self.cursordefault();
                    $('#snw-license-usage-report02').find('iframe').contents().find('.jrPage').css('width', '100%');
                    clearInterval(myVar);
                }
            }, 600);
    };


    this.reportPostSec = function () {
        $('iframe').contents().find(".findSolution").trigger('click');
        self.cursorwait();
        var timer = 500;
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            timer = 500;
        }
        setTimeout(function () {
            self.reportPost2TimeOut()
        }, timer);
    }


    this.reportPost2TimeOut = function () {

        $('.hidee').hide();
        var startDate = $('#snwSubscription-start5').val().replace(/\-/g, '/'),
            endDate = $('#snwSubscription-end5').val().replace(/\-/g, '/');
        if ($('.stateInput input').is(':checked')) {
            $('.ex1').hide();
        } else {
            $('.ex1').show();
            self.cursordefault();
        }
        if (startDate == "" || endDate == "") {
            $('.both').show();
            self.cursordefault();
        }
        if ((new Date(startDate).getTime() > new Date(self.getCurrentDate()).getTime())) {
            $('.ex2').show();
            self.cursordefault();
        }
        if ((new Date(endDate).getTime() < new Date(startDate).getTime())) {
            $('.ex3').show();
            self.cursordefault();
        }
        self.reportpost2Firefox(startDate, endDate);
        $('#snw-license-usage-report05').find('iframe').on('load', function () {
            self.snwLicenseUsageReportFifth($(this));
        });

    };


    this.reportpost2Firefox = function (startDate, endDate) {
        var startdateCopy,
            endDateCopy,
            dateSplitStrat,
            $baseURL,
            dataUrl,
            $baseURL1,
            dataUrl1,
            dateSplitend,
            cuurentDate, cuurDt;
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            startdateCopy = startDate;
            endDateCopy = endDate;
            dateSplitStrat = startDate.split('/');
            startDate = dateSplitStrat[2] + '-' + dateSplitStrat[0] + '-' + dateSplitStrat[1];
            dateSplitend = endDate.split('/');
            endDate = dateSplitend[2] + '-' + dateSplitend[0] + '-' + dateSplitend[1];
            cuurentDate = self.getCurrentDate().split('-');
            cuurDt = cuurentDate[2] + '-' + cuurentDate[0] + '-' + cuurentDate[1];
            if ((new Date(startDate).getTime() <= new Date(cuurDt).getTime()) && (new Date(endDate).getTime() > new Date(startDate).getTime()) && $('.stateInput input').is(':checked')) {

                $baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port && (':' + window.location.port)) + '/';
                dataUrl = $baseURL + self.model.get('_config').pilot_report + '?startdate=' + startdateCopy + '&enddate=' + endDateCopy + '&domainid=' + self.model.get('_stateReportId').join();

                $('#snw-license-usage-report05').find('.value-row').html('<iframe src=""></iframe>');
                $('#snw-value3').show();
                $('#snw-license-usage-report05').find('iframe').attr('src', dataUrl);
            }
        } else {
            if ((new Date(startDate).getTime() <= new Date(self.getCurrentDate()).getTime()) && (new Date(endDate).getTime() > new Date(startDate).getTime()) && $('.stateInput input').is(':checked')) {

                $baseURL1 = window.location.protocol + '//' + window.location.hostname + (window.location.port && (':' + window.location.port)) + '/';
                dataUrl1 = $baseURL1 + self.model.get('_config').pilot_report + '?startdate=' + startDate + '&enddate=' + endDate + '&domainid=' + self.model.get('_stateReportId').join();

                $('#snw-license-usage-report05').find('.value-row').html('<iframe src=""></iframe>');
                $('#snw-value3').show();
                $('#snw-license-usage-report05').find('iframe').attr('src', dataUrl1);
            }
        }
    };

    this.snwLicenseUsageReportFifth = function ($element) {
        var dataElement = $element,
            myVarr = setInterval(function () {
                if (!dataElement.contents().find('#container').is(':empty')) {
                    self.cursordefault();
                    $('#snw-license-usage-report05').find('iframe').contents().find('.jrPage').css('width', '100%');
                    clearInterval(myVarr);
                }
            }, 800);
    };
    this.stateListingHandler = function (e) {
        e.stopPropagation();
        if ($('.stateDataListing').is(':visible')) {
            $('.stateDataListing').hide();
        } else {
            $('.stateDataListing').show();
        }
        if ($('.domainDataListing').is(':visible')) {
            $('.domainDataListing').hide();
        }
        return false;
    };
    this.domainListingHandler = function (e) {
        e.stopPropagation();
        if ($('.domainDataListing').is(':visible')) {
            $('.domainDataListing').hide();
        } else {
            $('.domainDataListing').show();
        }
        return false;
    };


};
