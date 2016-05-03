$('document').ready(function () {
    SWN_01_admin.init();
    SWN_01_admin.cursorwait();
});
var SWN_01_admin = {
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
    _landingPagePrevCount:0,
    _previousCountArray: [0],
    _previousLandingCountArray: [0],
    _dropdownCount:10,
    _optionselector:'',
    _schoolRowDisableCheck:0,
    _nextdisbleChcek:'',
    _popupWindow:null,
    _districtContext:'',
    _districtList:'',
    _editbox:$('.editpopupBox'),
    _editbutton:'',
    _globalCourseCatalog:[],
    _stateId:[],
    _stateReportId:[],
    _ditrictReportId:[],
    _stateName:[],
    _globalCourseSelection:[],
    _postId:0,
    _domainId:0,
    _result:'',
    _totalCourseArry:[],
    _globalLicensecNum:0,
    _globalSccessToken:"",
    init: function () {
        SWN_01_admin.getConfig();
        SWN_01_admin.loadingdistrict();
        SWN_01_admin.screenload();
        SWN_01_admin.htmlloading();
        SWN_01_admin.bindevent();
       
        $(".popupInputDate").each(function(){
            $(this).datepicker({
                dateFormat: "mm-dd-yy"
            });
        });
    },  
    htmlloading: function () {
        var parseJson = JSON.parse(sessionStorage.getItem('data'));
        $('.domainHead h1').html(parseJson.domainname);
        $('.breadCrumb a:eq(0)').html(parseJson.userspace);
        $('.breadCrumb a:eq(1)').html(parseJson.username);
        $('.loggerName').html(parseJson.firstname + " " + parseJson.lastname);
        $('#snwadminSearch .welcome').show().html('Welcome' + ' ' + parseJson.firstname + " " + parseJson.lastname);
        SWN_01_admin._globalSccessToken=parseJson.loginToken;
    },
    screenload: function () {
        $('.addNew,.upArrow').hide();
        $('.newDomTab li').each(function (k) {
            $('.newDomTab li').attr('id', function (k) {
                return "tab_" + k;
            });
        });
        $('.listBox').each(function () {
            $('.listBox').attr('id', function (l) {
                return "panel_" + l;
            })
        });
    },
    bindevent: function () {
        SWN_01_admin.win_height = $(window).height();
        SWN_01_admin.win_width = $(window).width();
        $('.circlePlus').off('click').on('click', function () {
            $('.grayBg').css({
                'width': SWN_01_admin.win_width,
                'height': SWN_01_admin.win_height
            }).show();
            $('.addNew').show();
        });
        var inputDomVal = '';
        var splitArry = [];
        var dataWraper = '';
        var loginPrefx = ''
        var loginUndifndChk = '';
        var loginArray = [];
        $('.loginPrefix,#snw_Enter_Login_Prefix').keyup(function () {
            loginPrefx = $.trim($(this).val());
            loginArray = loginPrefx.split('-');
            loginUndifndChk = loginArray[1] != undefined ? loginArray[1] : '';
            $('.externalId,#snw_Enter_External_ID').val(dataWraper.toLowerCase() + '-' + loginUndifndChk.toLowerCase());
        });
        $('#snw_License').off('keyup').on('keyup',function () {
            SWN_01_admin.numberValidation($(this));
        });
        $('#snw_License1').off('keyup').on('keyup',function () {
            SWN_01_admin.numberValidation($(this));
        });
        $('#licence-number').off('keyup').on('keyup',function () {
            SWN_01_admin.numberValidation($(this));
        });
        $('#snwlicense-number').off('keyup').on('keyup',function () {
            SWN_01_admin.numberValidation($(this));
        });
        $('.domainName,#snw_Enter_School').keyup(function () {
            inputDomVal = $(this).val();
            dataWraper = '';
            if ($.trim(inputDomVal.length) != 0) {
                splitArry = inputDomVal.split(" ");
                for (var t = 0; t < splitArry.length; t++) {
                    dataWraper += splitArry[t].charAt(0)
                }
                $('.loginPrefix,.externalId,#snw_Enter_Login_Prefix,#snw_Enter_External_ID').val(dataWraper.toLowerCase() + '-' + loginUndifndChk.toLowerCase());
            } else {
                $('.loginPrefix,.externalId,#snw_Enter_Login_Prefix,#snw_Enter_External_ID').val(dataWraper.toLowerCase());
            }
        });
        $('.closeAN').off('click').on('click', function () {
            $('.grayBg,.popGrayBg,.editschlpopupBox').hide();
            $('.popupBox,.editpopupBox,.addschlpopupBox').hide();
        });
        $('.popupBox .subscription-end,.editpopupBox .subscription-end').unbind('change paste keyup').bind("change paste keyup", function() {
            var startDate=$('.subscription-start:visible').val();
            var endDate=$('.subscription-end:visible').val();
            if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            {     
                var dateSplitStrat=startDate.split('-');
                startDate=dateSplitStrat[2]+'-'+dateSplitStrat[0]+'-'+dateSplitStrat[1];
                var dateSplitend=endDate.split('-');
                endDate=dateSplitend[2]+'-'+dateSplitend[0]+'-'+dateSplitend[1];
            }
            if( (new Date(startDate).getTime() < new Date(endDate).getTime()))
            {
                $('.errormsg9_1').hide(); 
            }
            else{
                $('.errormsg9_1').show();  
            }
        });
        $('.popupBox .loginPrefix').off('keydown').on("keydown", function(e) {
            if (e.keyCode === 32) {
                return false;
            }   
        });
        $('.addschlpopupBox .loginprefix').off('keydown').on("keydown", function(e) {
            if (e.keyCode === 32) {
                return false;
            }   
        });
       
        $('.submitdistrict').off('click').on('click', function () {   
            var lenght=$('.popupBox td>input[type="text"]').length;
            var trueCnt=0;
            $('.popupBox td>input[type="text"]').each(function(){                  
                if($.trim($(this).val())==='')
                {
                    $(this).next('label').show();   
                }
                else{
                    $(this).siblings('label').hide();
                    trueCnt++;     
                }
            });
            if($('#snwselectInput li>input:checkbox:checked').length===0)
            {
                trueCnt--;
                $('.errormsg6').show();
            }
            else
            {
                if($('#snwselectCourse li>input:checkbox:checked').length===0)
                {
                    trueCnt--;
                    $('.errormsg6_1').show();
                }       
            }
            var startDate=$('.popupBox').find('.subscription-start').val();
            var endDate=EndDate=$('.popupBox').find('.subscription-end').val();
            if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            {     
                var dateSplitStrat=startDate.split('-');
                startDate=dateSplitStrat[2]+'-'+dateSplitStrat[0]+'-'+dateSplitStrat[1];
                var dateSplitend=endDate.split('-');
                endDate=dateSplitend[2]+'-'+dateSplitend[0]+'-'+dateSplitend[1];
            }
            if(lenght===trueCnt)
            {              
                if( (new Date(startDate).getTime() < new Date(endDate).getTime()))
                {
                    SWN_01_admin.domainFormValidation(".popupBox","create");   
                }
                else{
                    if(EndDate==="")
                    {
                        SWN_01_admin.domainFormValidation(".popupBox","create");     
                    }
                    else{
                        $('.hidee').hide();
                        $('.errormsg9_1').show(); 
                    } 
                }
            }
       
            
        });
        $('.cancelistrict').off('click').on('click', function () {
            $('.grayBg').hide();
            $('.popGrayBg').hide();
            $('.popupBox,.editpopupBox').hide();
        });
        $('.editsubmit').off('click').on('click', function () {           
            var lenght=$('.editpopupBox td>input[type="text"]').length;
            var trueCnt=0;
            $('.editpopupBox td>input[type="text"]').each(function(){
                if($.trim($(this).val())==='')
                {
                    $(this).next('label').show();   
                }
                else{
                    trueCnt++;     
                }
            });            
            if($('#snwSelectInput li>input:checkbox:checked').length===0)
            {
                trueCnt--;
                $('.errormsg20').show();
            }
            else
            {
                if($('#snwSelectCourse li').length!=1)
                {
                    if($('#snwSelectCourse li>input:checkbox:checked').length===0)
                    {
                        trueCnt--;
                        $('.errormsg21').show();
                    }    
                }                     
            }
            if(lenght===trueCnt)
            {
                var startDate=$('.editpopupBox').find('.subscription-start').val();
                var endDate=EndDate=$('.editpopupBox').find('.subscription-end').val();
                if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
                {     
                    var dateSplitStrat=startDate.split('-');
                    startDate=dateSplitStrat[2]+'-'+dateSplitStrat[0]+'-'+dateSplitStrat[1];
                    var dateSplitend=endDate.split('-');
                    endDate=dateSplitend[2]+'-'+dateSplitend[0]+'-'+dateSplitend[1];
                }                         
                if( (new Date(startDate).getTime() < new Date(endDate).getTime()))
                {                   
                    SWN_01_admin.domainFormValidation(".editpopupBox","edit");
                    SWN_01_admin.cursorwait();  
                }
                else{
                    if(EndDate==="")
                    {
                        SWN_01_admin.domainFormValidation(".editpopupBox","edit");
                        SWN_01_admin.cursorwait();   
                    }
                    $('.hidee').hide();
                    $('.errormsg9_1').show();  
                }
               
            }            
        });
        $('.editcancel').off('click').on('click', function () {
            $('.grayBg').hide();
            $('.popGrayBg').hide();
            $('.popupBox,.editpopupBox').hide();
        });
        $('.schleditsubmit').off('click').on('click',function(){         
            var localCount=0;
            var disabledCount=0;
            $('.editschlpopupBox .formTable input[type="text"]').each(function(){
                if($.trim($(this).val())===''&&!$(this).is('[disabled=disabled]'))
                {
                    $(this).next('label').show();  
                   
                }
                else if($.trim($(this).val())!=''&&$(this).is('[disabled=disabled]')){
                    disabledCount++;
                }
                else{
                    localCount++;
                    $(this).next('label').hide();  
                }
            });           
            if(localCount===($('.editschlpopupBox .formTable input[type="text"]').length-disabledCount))
            {    
                SWN_01_admin.cursorwait();
                SWN_01_admin.saveSchool($('.editschlpopupBox'),'edit');
                
            } 
            
        });
        $('.editwelcome').off('click').on('click', function () {
            SWN_01_admin.domainWelcomeLetter();
        });
        $('.editAddSchool').off('click').on('click', function () {
            $('.grayBg,.popGrayBg,.editschlpopupBox').hide();
            $('.popupBox,.editpopupBox,.addschlpopupBox').hide();
            dId=$(this).parents('.editpopupBox').attr('data-domain-id');
            $('li#'+dId).find('li.addschool').trigger('click');
        //SWN_01_admin.domainWelcomeLetter();
        });
        //		34894868
        $('.schlsubmit').off('click').on('click', function () {
            $('.hidee').hide();
            var localCount=0;
            var disabledCount=0;
            $('.addschlpopupBox .formTable input[type="text"]').each(function(){
                if($.trim($(this).val())===''&&!$(this).is('[disabled=disabled]'))
                {
                    $(this).next('label').show();  
                   
                }
                else if($.trim($(this).val())===''&&$(this).is('[disabled=disabled]')){
                    disabledCount++;
                }
                else{
                    localCount++;
                    $(this).next('label').hide();  
                }
            });           
            if(localCount===($('.addschlpopupBox .formTable input[type="text"]').length-disabledCount))
            {    
                SWN_01_admin.cursorwait();
                SWN_01_admin.saveSchool($('.addschlpopupBox'),'create');
                
            }            
        });
        $('.schlcancel').off('click').on('click', function () {
            $('.grayBg').hide();
            $('.popGrayBg,.editschlpopupBox').hide();
            $('.addschlpopupBox').hide();
        });
        $('.loginPerson').off('click').on('click', function () {
            $('.LPMenu').toggle();
            return false;
        });
        $('.createpopupradio input,.editpopupradio input').off('change').on('change',function(){
            var data_id=$(this).attr('data-id');
            if(data_id==='select')
            {
                $('#snwselectCourse li').each(function(){
                    $(this).find('input').prop('checked',false); 
                }); 
                $('#snwSelectCourse li').each(function(){
                    $(this).find('input').prop('checked',false); 
                });
            }
            else
            {
                $('#snwselectCourse li').each(function(){
                    $(this).find('input').prop('checked',true); 
                }); 
                $('#snwSelectCourse li').each(function(){
                    $(this).find('input').prop('checked',true); 
                });       
            }
        });
        $('.disTrictList').off('click').on('click', function () {
            SWN_01_admin._districtContext='';
            SWN_01_admin._districtContext=$(this);
            SWN_01_admin.cursorwait();
            SWN_01_admin._rowView=10;
            var html = '';
            var attrId = SWN_01_admin._globalId = $(this).data('id');
            var thisContext = SWN_01_admin._globalThisContext = $(this);
            $.ajax({
                url: "config.json",
                success: function (result) {
                    $.ajax({
                        type: "GET",
                        url: result.getDomainData + '/' + attrId,                        
                        crossDomain: true,
                        contentType: "application/json",
                        success: function (res) {
                            if (res.messageType === "SUCCESS") {
                                var someDate = new Date();
                                var numberOfDaysToAdd = 365;
                                someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
                                var date= new Date(someDate);
                                var dateFormat=date.toLocaleDateString().replace(/\//g, "-");
                                var dateSplice=dateFormat.split('-');
                                var Month=dateSplice[0];
                                var Datee=dateSplice[1];
                                if(dateSplice[0].length===1)
                                {
                                    dateSplice[0]=[];
                                    dateSplice[0]='0'+Month;
                                }
                                if(dateSplice[1].length===1)
                                {
                                    dateSplice[1]=[];
                                    dateSplice[1]='0'+Datee;
                                }
                                var newDate=dateSplice.join('-');                                
                                var endDate=res.data.customization.edivatelearn.subscriptionenddate===""?newDate:res.data.customization.edivatelearn.subscriptionenddate;
                                var subscriptionData=(res.data.customization.edivatelearn.fullsubscription)?"Entire Catalog":"Selective Courses";
                                
                                $('.norecords').remove();
                                
                                SWN_01_admin._globalLicensecNum= (res.data.customization.edivatelearn.nooflicense!=null) ? res.data.customization.edivatelearn.nooflicense : 0;
                                html += '<div class="districtHeadDetails"><div class="LPSDContainer">'
                                html += '<div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">'+res.data.domain.name+'</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">'+subscriptionData+'</td><td style="width:10%;">Number of License:</td><td style="width:10%;">'+res.data.customization.edivatelearn.nooflicense+'</td></tr><tr> <td>External Id: </td><td>'+res.data.domain.reference+'</td><td>Subscription Date:</td><td>'+res.data.customization.edivatelearn.subscriptionstartdate+' '+'To'+' '+endDate+'</td><td>Pilot End Date:</td><td>'+res.data.customization.edivatelearn.pilotenddate+'</td></tr><tr> <td>Login Prefix: </td><td>'+res.data.domain.userspace+'</td><td>License Type:</td><td>'+res.data.customization.edivatelearn.licensetype+'</td><td></td><td></td></tr></tbody></table> </div> <div class="LPSDAvlList"> <div class="SASHead"><hgroup><h1>School available in '+res.data.domain.name+'</h1></hgroup></div><div class="SAList"> <table class="SAListTable"> <tbody><tr> <th>School Domain Name</th> <th>External id</th> <th>Login Prefix</th> <th>License Type</th> <th>License Pool</th> <th>Number of License</th> <th>Action</th> </tr>'
                                                                
                                $.ajax({
                                    type: "GET",
                                    url: SWN_01_admin._config.schoolList + '/' + attrId+'?querystring=0&limit='+SWN_01_admin._rowView,                        
                                    crossDomain: true,
                                    contentType: "application/json",
                                    success: function (data) {
                                        if(data.messageType==="SUCCESS")
                                        {
                                            SWN_01_admin._schoolRowDisableCheck=data.data.domains.length;
                                            for (var i = 0; i < data.data.domains.length; i++) {
                                                html += '<tr data-id="' + data.data.domains[i].id + '"> <td>' + data.data.domains[i].name + '</td><td>' + data.data.domains[i].reference + '</td><td>' + data.data.domains[i].userspace + '</td><td>' + data.data.domains[i].data.customization.edivatelearn.licensetype + '</td><td>' + data.data.domains[i].data.customization.edivatelearn.pooltype + '</td><td>' + data.data.domains[i].data.customization.edivatelearn.nooflicense + '</td><td><button class="editSchoolpop"><i class="fa fa-pencil"></i>Edit</button></td></tr>'
                                            }
                                            html += '</tbody></table> </div><div class="FootPagination"><div class="floatLeft dataleft"> Showing <span class="demo"> <select class="balck showEntry"> <option value="10">10</option> <option value="25">25 </option></select> </span>  </div><div class="dataright"> <nav> <ul class="pagination"> <li class="disabled"> <button class="PreviousCir"  aria-label="Previous"> <i class="fa fa-play LSArrow"></i> </button> </li><li> <button class="NextCir"  aria-label="Next"> <i class="fa fa-play RSArrow"></i> </button> </li></ul> </nav> </div></div></div></div></div>';
                                            thisContext.parents('.districtTabBox').append(html);
                                            SWN_01_admin.bindevent();
                                            SWN_01_admin.cursordefault();  
                                            $('.PreviousCir').prop('disabled',true).addClass('disabled');
                                            
                                        }
                                        else if (data.messageType === "ERROR") {
                                            $('.norecords').remove();
                                            SWN_01_admin.cursordefault(); 
                                            html += '<label class="norecords">No School Found</label></div>';
                                            thisContext.parents('.districtTabBox').append(html);
                                            thisContext.parents('.districtTabBox').find('.LPSDAvlList').html('<label class="norecords">No School Found</label>');
                                        }
                                        if (thisContext.parents('.districtTabBoxHead').next().is(':visible')) {
                                            $('.districtHeadDetails').slideUp('slow', function () {
                                                setTimeout(function () {
                                                    $('.districtHeadDetails').remove();
                                                }, 350);
                                            });
                                        } else {
                                            $('.districtHeadDetails').slideUp('slow');
                                            thisContext.parents('.districtTabBoxHead').next().slideDown('slow');
                                        }
                                    },
                                    beforeSend: function(xhr, settings) {
                                        xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                                    }
                                });                         
                                                             
                            }
                            else if (data.messageType === "ERROR") {
                                $('.norecords,.districtHeadDetails').remove();
                                SWN_01_admin.cursordefault();
                                html = '';
                                html += '<div class="districtHeadDetails">';

                                html += '<label class="norecords">No School Found</label>';

                                html += "</div>";

                                thisContext.parents('.districtTabBox').append(html);
                            }                            
                        },                
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });
                },
                error: function () {
                    alert('error loading page');
                }
            });
        });
        $('.showEntry').off('change').on('change', function () {
            SWN_01_admin._rowView = $(this).val();
            SWN_01_admin.cursorwait();
            var html = '';
            $.ajax({
                url: "config.json",
                success: function (result) {
                    $.ajax({
                        type: "GET",
                        url: result.schoolList + '/' + SWN_01_admin._globalId + '?querystring=' + SWN_01_admin._dataIdToshow + '&limit=' + SWN_01_admin._rowView + '',
                        crossDomain: true,
                        contentType: "application/json",
                        success: function (res) {
                            if (res.messageType === "SUCCESS") {
                                SWN_01_admin._schoolRowDisableCheck=res.data.domains.length;
                               
                                $('.SASHead,.SAList').remove();
                                html += '<div class="SASHead"><hgroup><h1>School available in '+$(this).parents('.districtTabBox').find('.disTrictList').text()+'</h1></hgroup></div><div class="SAList"> <table class="SAListTable"> <tbody><tr> <th>School Domain Name</th> <th>External id</th> <th>Login Prefix</th> <th>License Type</th> <th>License Pool</th> <th>Number of License</th> <th>Action</th> </tr>'
                                
                                for (var i = 0; i < res.data.domains.length; i++) {
                                    html += '<tr data-id="' + res.data.domains[i].id + '"> <td>' + res.data.domains[i].name + '</td><td>' + res.data.domains[i].reference + '</td><td>' + res.data.domains[i].userspace + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.licensetype + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.pooltype + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.nooflicense + '</td><td><button class="editSchoolpop"><i class="fa fa-pencil"></i>Edit</button></td></tr>'
                                }
                                html += '</tbody></table></div>';
                                SWN_01_admin._globalThisContext.parents('.districtTabBox').find('.LPSDAvlList').prepend(html);
                              
                                SWN_01_admin.bindevent();
                                SWN_01_admin.cursordefault();
                            } else if (res.messageType === "ERROR") {
                                $('.norecords').remove();
                                SWN_01_admin.cursordefault();
                                html = '';
                                html += '<div class="districtHeadDetails"><ul class="schoolView">';

                                html += '<li>No School Found</li>';

                                html += "</ul></div>";

                                SWN_01_admin._globalThisContext.parents('.districtTabBox').append(html);
                            }
                        },
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });
                },
                error: function () {
                    alert('error loading page');
                }
            });
        });
        $('.NextCir').off('click').on('click', function () {
            if(SWN_01_admin._schoolRowDisableCheck<SWN_01_admin._rowView)
            {
                $('.NextCir').prop('disabled',true).addClass('disabled');
                return false;
            }
            $('.PreviousCir').removeAttr('disabled').removeClass('disabled');
            $('.pagination li').removeClass('disabled');
            var attrId = $('.SAListTable tr:last').attr('data-id');
            SWN_01_admin._previousCount++;
            if (SWN_01_admin._previousCount === SWN_01_admin._previousCountArray.length) {
                SWN_01_admin._previousCountArray.push($('.SAListTable tr').eq(1).attr('data-id'));
            }

            SWN_01_admin.cursorwait();
            var html = '';
            $.ajax({
                url: "config.json",
                success: function (result) {
                    $.ajax({
                        type: "GET",
                        url: result.schoolList + '/' + SWN_01_admin._globalId + '?querystring=' + attrId + '&limit=' + SWN_01_admin._rowView + '',
                        crossDomain: true,
                        contentType: "application/json",
                        success: function (res) {
                            if (res.messageType === "SUCCESS") {
                                SWN_01_admin._schoolRowDisableCheck=res.data.domains.length;
                                html += ' <tbody><tr> <th>School Domain Name</th> <th>External id</th> <th>Login Prefix</th> <th>License Type</th> <th>License Pool</th> <th>Number of License</th> <th>Action</th> </tr>'

                                for (var i = 0; i < res.data.domains.length; i++) {
                                    html += '<tr data-id="' + res.data.domains[i].id + '"> <td>' + res.data.domains[i].name + '</td><td>' + res.data.domains[i].reference + '</td><td>' + res.data.domains[i].userspace + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.licensetype + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.pooltype + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.nooflicense + '</td><td><button class="editSchoolpop"><i class="fa fa-pencil"></i>Edit</button></td></tr>'
                                }
                                html += '</tbody>';
                                SWN_01_admin._globalThisContext.parents('.districtTabBox').find('.SAListTable').html(html);
                                SWN_01_admin.bindevent();
                                SWN_01_admin.cursordefault();
                            } else if (res.messageType === "ERROR") {
                                $('.norecords').remove();
                                SWN_01_admin.cursordefault();
                                html = '';
                                html += '<div class="districtHeadDetails"><ul class="schoolView">';

                                html += '<li>No School Found</li>';

                                html += "</ul></div>";

                                SWN_01_admin._globalThisContext.parents('.districtTabBox').append(html);
                            }
                        },
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });
                },
                error: function () {
                    alert('error loading page');
                }
            });
        });
        $('.PreviousCir').off('click').on('click', function () {
            //            SWN_01_admin._previousCount--;
            //            SWN_01_admin._previousCount = SWN_01_admin._previousCount == -1 ? 0 : SWN_01_admin._previousCount            
            if(SWN_01_admin._previousCount!=0)
            {
                SWN_01_admin._previousCount--;
            }
            else
            {
                $('.PreviousCir').prop('disabled',true).addClass('disabled'); 
                return false;
            }
            $('.NextCir').removeAttr('disabled').removeClass('disabled');
            SWN_01_admin.cursorwait();
            var html = '';
            $.ajax({
                url: "config.json",
                success: function (result) {
                    $.ajax({
                        type: "GET",
                        url: result.schoolList + '/' + SWN_01_admin._globalId + '?querystring=' + SWN_01_admin._previousCountArray[SWN_01_admin._previousCount] + '&limit=' + SWN_01_admin._rowView + '',
                        crossDomain: true,
                        contentType: "application/json",
                        success: function (res) {
                            if (res.messageType === "SUCCESS") {
                                SWN_01_admin._schoolRowDisableCheck=res.data.domains.length;
                                html += ' <tbody><tr> <th>School Domain Name</th> <th>External id</th> <th>Login Prefix</th> <th>License Type</th> <th>License Pool</th> <th>Number of License</th> <th>Action</th> </tr>'

                                for (var i = 0; i < res.data.domains.length; i++) {
                                    html += '<tr data-id="' + res.data.domains[i].id + '"> <td>' + res.data.domains[i].name + '</td><td>' + res.data.domains[i].reference + '</td><td>' + res.data.domains[i].userspace + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.licensetype + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.pooltype + '</td><td>' + res.data.domains[i].data.customization.edivatelearn.nooflicense + '</td><td><button class="editSchoolpop"><i class="fa fa-pencil"></i>Edit</button></td></tr>'
                                }
                                html += '</tbody>';
                                SWN_01_admin._globalThisContext.parents('.districtTabBox').find('.SAListTable').html(html);
                                SWN_01_admin.bindevent();
                                SWN_01_admin.cursordefault();
                            } else if (res.messageType === "ERROR") {
                                $('.norecords').remove();
                                SWN_01_admin.cursordefault();
                                html = '';
                                html += '<div class="districtHeadDetails"><ul class="schoolView">';

                                html += '<li>No School Found</li>';

                                html += "</ul></div>";

                                SWN_01_admin._globalThisContext.parents('.districtTabBox').append(html);
                            }
                        },
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });
                },
                error: function () {
                    alert('error loading page');
                }
            });
        });
        $('.DomainNext').off('click').on('click',function(){      
            if(SWN_01_admin._nextdisbleChcek<SWN_01_admin._dropdownCount)
            {
                $('.DomainNext').prop('disabled',true).addClass('disabled');
                return false;
            }
            SWN_01_admin._landingPagePrevCount++;
            if (SWN_01_admin._landingPagePrevCount === SWN_01_admin._previousLandingCountArray.length) {
                SWN_01_admin._previousLandingCountArray.push($('.domainContainer>ul>li:last-child').attr('id'));
            }            
            $('.DomainPrevious').removeAttr('disabled').removeClass('disabled');
            var idTrcaker=$('.domainContainer>ul>li:last-child').attr('id');            
            SWN_01_admin.cursorwait();
            var html = '';
            var idUrl = SWN_01_admin._postId;
            var schlId = '';
            $.ajax({
                url: "config.json",
                success: function (result) {
                    SWN_01_admin._baseUrl = result.DistrictList;
                    $.ajax({
                        type: "GET",
                        url: SWN_01_admin._baseUrl + '/' + idUrl+'?querystring='+idTrcaker+'&limit='+SWN_01_admin._dropdownCount+'',
                        crossDomain: true,
                        contentType: "application/json",
                        success: function (data) {
                            if (data.messageType === "SUCCESS") {
                                SWN_01_admin.cursordefault();
                                $('.districtTabBox').remove();
                                html = '<ul>';
                                SWN_01_admin._nextdisbleChcek=data.data.domains.length;
                                for (var i = 0; i < data.data.domains.length; i++) {                                    
                                    html += '<li id="'+data.data.domains[i].id+'"><section class="districtTabBox"><div class="districtTabBoxHead"><hgroup><h1 data-id="' + data.data.domains[i].id + '" class="floatLeft disTrictList">' + data.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li><li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></div></section>';
                                    html += '<div class="districtHeadDetails"><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';
                                    html += '</li>'
                                }
                                html += '</ul>';
                                $('#adminContainer .domainContainer').html(html);
                                if(data.data.domains.length>=4)
                                {
                                    $('.dummydata').css('height','10px');
                                }
                                else{
                                    $('.dummydata').css('height','222px');
                                }
                            } else {
                                SWN_01_admin.cursordefault();
                                return false;
                            }
                        },
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        complete: function () {
                            setTimeout(function () {
                                SWN_01_admin.bindevent();
                            }, 400)
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });

                }
            });
        });
        $('.DomainPrevious').off('click').on('click',function(){           
            if(SWN_01_admin._landingPagePrevCount!=0)
            {
                SWN_01_admin._landingPagePrevCount--;
            }
            else
            {
                $('.DomainPrevious').prop('disabled',true).addClass('disabled'); 
                return false;
            }
            SWN_01_admin._landingPagePrevCount = SWN_01_admin._landingPagePrevCount == -1 ? 0 : SWN_01_admin._landingPagePrevCount;         
            SWN_01_admin.cursorwait();
            $('.DomainNext').removeAttr('disabled').removeClass('disabled');
            var html = '';
            var idUrl = SWN_01_admin._postId;
            var schlId = '';
            $.ajax({
                url: "config.json",
                success: function (result) {
                    SWN_01_admin._baseUrl = result.DistrictList;
                    $.ajax({
                        type: "GET",
                        url: SWN_01_admin._baseUrl + '/' + idUrl+'?querystring='+SWN_01_admin._previousLandingCountArray[SWN_01_admin._landingPagePrevCount]+'&limit='+SWN_01_admin._dropdownCount+'',
                        crossDomain: true,
                        contentType: "application/json",
                        success: function (data) {
                            if (data.messageType === "SUCCESS") {
                                SWN_01_admin.cursordefault();
                                $('.districtTabBox').remove();
                                html = '<ul>';
                                SWN_01_admin._nextdisbleChcek=data.data.domains.length;
                                for (var i = 0; i < data.data.domains.length; i++) {

                                    //                  schlId=data.data.domains.id;
                                    html += '<li id="'+data.data.domains[i].id+'"><section class="districtTabBox"><div class="districtTabBoxHead"><hgroup><h1 data-id="' + data.data.domains[i].id + '" class="floatLeft disTrictList">' + data.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li><li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></div></section>';

                                    html += '<div class="districtHeadDetails"><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';
                                    html += '</li>'
                                }
                                html += '</ul>';
                                $('#adminContainer .domainContainer').html(html);
                                if(data.data.domains.length>=4)
                                {
                                    $('.dummydata').css('height','10px');
                                }
                                else{
                                    $('.dummydata').css('height','222px');
                                }
                            } else {
                                SWN_01_admin.cursordefault();
                                return false;                           
                            }
                        },
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        complete: function () {
                            setTimeout(function () {
                                SWN_01_admin.bindevent();
                            }, 400)
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });

                }
            });
            
        });
        $('.domain-showEntry').off('change').on('change',function(){
            SWN_01_admin._dropdownCount=$(this).val();
            SWN_01_admin.cursorwait();
            var html = '';
            var idUrl = SWN_01_admin._postId;
            var schlId = '';
            $.ajax({
                url: "config.json",
                success: function (result) {
                    SWN_01_admin._baseUrl = result.DistrictList;
                    $.ajax({
                        type: "GET",
                        url: SWN_01_admin._baseUrl + '/' + idUrl+'?querystring=0&limit='+SWN_01_admin._dropdownCount+'',
                        crossDomain: true,
                        contentType: "application/json",
                        success: function (data) {
                            if (data.messageType === "SUCCESS") {
                                SWN_01_admin.cursordefault();
                                SWN_01_admin._nextdisbleChcek=data.data.domains.length
                                $('.districtTabBox').remove();
                                html = '<ul>';
                                for (var i = 0; i < data.data.domains.length; i++) {

                                    //                  schlId=data.data.domains.id;
                                    html += '<li id="'+data.data.domains[i].id+'"><section class="districtTabBox"><div class="districtTabBoxHead"><hgroup><h1 data-id="' + data.data.domains[i].id + '" class="floatLeft disTrictList">' + data.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li><li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></div></section>';

                                    html += '<div class="districtHeadDetails"><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';
                                    html += '</li>'
                                }
                                html += '</ul>';
                                $('#adminContainer .domainContainer').html(html);
                                $('.FootPagination').show();
                            } else {
                                var length=$('.domainContainer>ul>li').length;
                                SWN_01_admin.cursordefault();
                                for (var t = 0; t <length-1; t++) {
                                    $('.domainContainer>ul>li').eq(0).remove();
                                }
                                $('.districtTabBox').html('<label class="norecords" style="">No District Found</label>');
                                $('.FootPagination').hide();
                            }
                        },
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        complete: function () {
                            setTimeout(function () {
                                SWN_01_admin.bindevent();
                            }, 400)
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });

                }
            });
        });
        $('.newDomTab li').off('click').on('click', function () {
            $('.newDomTab li').each(function () {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                }
            });
            $(this).addClass('active');
            $('.newDomTab li').each(function (g) {
                if ($(this).hasClass('active')) {
                    $('#panel_' + g + '').show();
                } else {
                    $('#panel_' + g + '').hide();
                }
            });

        });
        $('.adminNav li:eq(1)').off('click').on('click', function () {
            if ($(this).hasClass('active')) {
                $('.adminNavList ul').slideUp(500);
                $('.adminNav li').removeClass('active');
            } else {
                $('.adminNav li').removeClass('active');
                $(this).addClass('active');
                var localIndex = $(this).index();
                $('.adminNavList ul').slideDown(500);
                var cssLeft = $(this).position().left;
                var cssTop = $(this).position().top;
                $('.adminNavList ul').css({
                    'left': cssLeft,
                    'top': cssTop
                }).slideDown(500);
            }
        });
        $('#snwreportsLienceLi1').off('click').on('click', function () {
            $('.total-value-col,.user').hide();
            $('#snw-val051').prop('checked',true);
            $('.domainInput').html('<li class="massge">Please select a state first.</li>');
            $('#snw-license-usage-report02,.License').show();
            $('#snw-license-usage-report05').hide();
            $('#adminContainer').hide();
            $('.adminNavList ul').slideUp(500);
            $('#snwSubscription-end2').val('');
            $('#snwSubscription-start2').val(SWN_01_admin.getCurrentDate());
            var html='';
            $('.stateInput').html(function(){
                for(var i=0;i<SWN_01_admin._stateId.length;i++)
                {
                    html+='<li><input id="checkbox'+i+'" data-test="stateTest'+i+'" type="checkBox" data-value="'+SWN_01_admin._stateId[i]+'">'+SWN_01_admin._stateName[i]+'</li>'
                    
                }
                return html;
            });
            $('.stateDataListing Input[type="checkbox"]').off('click').on('click',function(){
                var html='';
                var stateSelctedVal=$(this).attr('data-value');
                var stateTest=$(this).attr('data-test');
                if($(this).is(':checked'))
                {                  
                    $.ajax({
                        type: "GET",
                        url: SWN_01_admin._config.DistrictList+'/'+stateSelctedVal,           
                        success: function (rslte) {                          
                            if(rslte.messageType==="SUCCESS"){
                                $('.domainInput').append(function(){
                                    for(var i=0;i<rslte.data.domains.length;i++)
                                    {
                                        html+='<li><input id="checkbox'+i+'" data-test="'+stateTest+'" type="checkBox" data-value="'+rslte.data.domains[i].id+'">'+rslte.data.domains[i].name+'</li>'
                    
                                    }
                                    return html;
                                });       
                                SWN_01_admin.cursordefault();                     
                            } 
                            SWN_01_admin.cursordefault();  
                        },
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });    
                }
                else
                {
                    $('.domainInput input[data-test~='+stateTest+']').parent().remove();      
                }
                if($('.stateDataListing Input').is(':checked'))
                {
                    $('.domainInput .massge').remove();       
                }
                else{
                    $('.domainInput').html('<li class="massge">Please select a state first.</li>');
                }
               
            });
        });
        $('#snwreportsLienceLi2').off('click').on('click', function () {
            $('.total-value-col,.user').hide();
            $('#snwSubscription-end5').val('');
            $('#snwSubscription-start5').val(SWN_01_admin.getCurrentDate());
            $('#snw-license-usage-report02').hide();
            $('#snw-license-usage-report05,.Pilot').show();
            $('#adminContainer').hide();
            $('.adminNavList ul').slideUp(500);
            var html='';
            $('.stateInput').html(function(){
                for(var i=0;i<SWN_01_admin._stateId.length;i++)
                {
                    html+='<li><input id="checkbox'+i+'" type="checkBox" data-value="'+SWN_01_admin._stateId[i]+'">'+SWN_01_admin._stateName[i]+'</li>'
                    
                }
                return html;
            });
            $('.stateInput input[type="checkbox"]').off('click').on('click',function(){             
                SWN_01_admin._stateReportId=[];
                $('.stateInput').find('Input:checkbox:checked').each(function(){                   
                    SWN_01_admin._stateReportId.push($(this).attr('data-value'));
                });               
            });
            $('#snwsubscription-start5').val(SWN_01_admin.getCurrentDate());
            
        });
       
     
        $('.reportfisrtedit').off('click').on('click', function () {
            $('iframe').contents().find(".findSolution").trigger('click');
            SWN_01_admin.cursorwait();
            var timer=500;
            if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            {
                timer=500;
            }
            setTimeout(function(){
                SWN_01_admin._ditrictReportId=[];
                $('.domainInput input').each(function(){
                    if($(this).is(':checked'))
                    {
                        SWN_01_admin._ditrictReportId.push($(this).attr('data-value'))
                    }
                });
                $()
                $('.hidee').hide();
                var startDate=$('#snwSubscription-start2').val().replace(/\-/g, '/');            
                var endDate=$('#snwSubscription-end2').val().replace(/\-/g, '/');  
                if($('.stateInput input').is(':checked'))
                {
              
                    $('.exL1').hide(); 
                    if($('.domainInput input').is(':checked'))
                    {
                        $('.exL2').hide();                 
                    }
                    else{
                        $('.exL2').show(); 
                    }                
                }
                else
                {
                    $('.exL1').show();
                }           
                if(startDate==""&&endDate=="")
                {
                    $('.bothL').show();    
                }
                if( (new Date(startDate).getTime() > new Date(SWN_01_admin.getCurrentDate()).getTime()))
                {                   
                    $('.st1').show();  
                }
                if( (new Date(endDate).getTime() < new Date(startDate).getTime()))
                {                   
                    $('.end1').show();  
                }
                var checkUrl="districtlicensereport";
                if($('#snw-val051').is(':checked'))
                {
                    checkUrl="reports/districtlicensereport"   
                }
                if($('#snw-val061').is(':checked'))
                {
                    checkUrl="reports/courselicensereport"   
                }
                if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
                {     
                    var dateSplitStrat=startDate.split('/');
                    startDate=dateSplitStrat[2]+'-'+dateSplitStrat[0]+'-'+dateSplitStrat[1];
                    var dateSplitend=endDate.split('/');
                    endDate=dateSplitend[2]+'-'+dateSplitend[0]+'-'+dateSplitend[1];
                    var cuurentDate=SWN_01_admin.getCurrentDate().split('-');
                    var cuurDt=cuurentDate[2]+'-'+cuurentDate[0]+'-'+cuurentDate[1];
                    console.log(cuurDt);
                    if( (new Date(startDate).getTime() <= new Date(cuurDt).getTime())&&(new Date(endDate).getTime() > new Date(startDate).getTime())&&$('.stateInput input').is(':checked')&&$('.domainInput input').is(':checked'))
                    {
               
                        var $baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port && (':' + window.location.port)) + '/';
                        var dataUrl=$baseURL + checkUrl+'?startdate='+startDate+'&enddate='+endDate+'&domainid='+ SWN_01_admin._ditrictReportId.join();
               
                        $('#snw-license-usage-report02').find('.value-row').html('<iframe src=""></iframe>');
                        $('#snw-value1').show();
                        console.log(dataUrl)
                        $('#snw-license-usage-report02').find('iframe').attr('src',dataUrl);
                
                    }
                }
                else{
                    if( (new Date(startDate).getTime() <= new Date(SWN_01_admin.getCurrentDate()).getTime())&&(new Date(endDate).getTime() > new Date(startDate).getTime())&&$('.stateInput input').is(':checked')&&$('.domainInput input').is(':checked'))
                    {
               
                        var $baseURL1 = window.location.protocol + '//' + window.location.hostname + (window.location.port && (':' + window.location.port)) + '/';
                        var dataUrl1=$baseURL1 + checkUrl+'?startdate='+startDate+'&enddate='+endDate+'&domainid='+ SWN_01_admin._ditrictReportId.join();
               
                        $('#snw-license-usage-report02').find('.value-row').html('<iframe src=""></iframe>');
                        $('#snw-value1').show();               
                        $('#snw-license-usage-report02').find('iframe').attr('src',dataUrl1);
                
                    }
                }
                $('#snw-license-usage-report02').find('iframe').on('load',function(){
                    var self = $(this);
                    var myVar = setInterval(function(){                        
                        if(!self.contents().find('#container').is(':empty')){
                            SWN_01_admin.cursordefault();
                            $('#snw-license-usage-report02').find('iframe').contents().find('.jrPage').css('width','100%');
                            clearInterval(myVar);
                        }
                    }, 600);                         
                    console.log('laod the iframe');                    
                });
            },timer);
            
           
        });
        $('.reportpost2').off('click').on('click', function () {            
            $('iframe').contents().find(".findSolution").trigger('click');
            SWN_01_admin.cursorwait();
            var timer=500;
            if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
            {
                timer=500;
            }
            setTimeout(function(){
                $('.hidee').hide();
                var startDate=$('#snwSubscription-start5').val().replace(/\-/g, '/');            
                var endDate=$('#snwSubscription-end5').val().replace(/\-/g, '/');  
                if($('.stateInput input').is(':checked'))
                {
                    $('.ex1').hide();    
                }
                else
                {
                    $('.ex1').show();
                }           
                if(startDate==""&&endDate=="")
                {
                    $('.both').show();    
                }
                if( (new Date(startDate).getTime() > new Date(SWN_01_admin.getCurrentDate()).getTime()))
                {                   
                    $('.ex2').show();  
                }
                if( (new Date(endDate).getTime() < new Date(startDate).getTime()))
                {                   
                    $('.ex3').show();  
                }
                if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
                {     
                    var dateSplitStrat=startDate.split('/');
                    startDate=dateSplitStrat[2]+'-'+dateSplitStrat[0]+'-'+dateSplitStrat[1];
                    var dateSplitend=endDate.split('/');
                    endDate=dateSplitend[2]+'-'+dateSplitend[0]+'-'+dateSplitend[1];
                    var cuurentDate=SWN_01_admin.getCurrentDate().split('-');
                    var cuurDt=cuurentDate[2]+'-'+cuurentDate[0]+'-'+cuurentDate[1];
                    console.log(cuurDt);
                    if( (new Date(startDate).getTime() <= new Date(cuurDt).getTime())&&(new Date(endDate).getTime() > new Date(startDate).getTime())&&$('.stateInput input').is(':checked'))
                    {
               
                        var $baseURL = window.location.protocol + '//' + window.location.hostname + (window.location.port && (':' + window.location.port)) + '/';
                        var dataUrl=$baseURL + SWN_01_admin._config.pilot_report+'?startdate='+startDate+'&enddate='+endDate+'&domainid='+ SWN_01_admin._stateReportId.join();
            
                        $('#snw-license-usage-report05').find('.value-row').html('<iframe src=""></iframe>');
                        $('#snw-value3').show();
                        console.log(dataUrl)
                        $('#snw-license-usage-report05').find('iframe').attr('src',dataUrl);
                    }
                }
                else{
                    if( (new Date(startDate).getTime() <= new Date(SWN_01_admin.getCurrentDate()).getTime())&&(new Date(endDate).getTime() > new Date(startDate).getTime())&&$('.stateInput input').is(':checked'))

                    {
               
                        var $baseURL1 = window.location.protocol + '//' + window.location.hostname + (window.location.port && (':' + window.location.port)) + '/';
                        var dataUrl1=$baseURL1 + SWN_01_admin._config.pilot_report+'?startdate='+startDate+'&enddate='+endDate+'&domainid='+ SWN_01_admin._stateReportId.join();
            
                        $('#snw-license-usage-report05').find('.value-row').html('<iframe src=""></iframe>');
                        $('#snw-value3').show();
                        console.log(dataUrl)
                        $('#snw-license-usage-report05').find('iframe').attr('src',dataUrl1);
                    }
                }
                $('#snw-license-usage-report05').find('iframe').on('load',function(){
                    var self = $(this);
                    var myVarr = setInterval(function(){
                        if(!self.contents().find('#container').is(':empty')){
                            SWN_01_admin.cursordefault();
                            $('#snw-license-usage-report05').find('iframe').contents().find('.jrPage').css('width','100%');
                            clearInterval(myVarr);
                        }
                    }, 600);                    
                    console.log('laod the iframe');                    
                });
            },timer);
           
        
        });       
        $('.adminNav li:eq(0)').off('click').on('click', function () {
            $('.adminNavList ul').slideUp(500);
            $('.adminNav li').removeClass('active');  
            $('#snw-license-usage-report02,#snw-license-usage-report05,.user').hide();
            $('#adminContainer,.welcome').show();            
        });
        $('.entireCatalog').off('click').on('click', function () {
            $('.coursSelect').attr("contenteditable", false).removeClass('disabled');
        });
        $('.SlctvCrses').off('click').on('click', function () {
            $('.coursSelect').attr("contenteditable", true).addClass('disabled');
        });
        $('.corsecatalog').off('click').on('click', function (e) {
            e.stopPropagation();
            if ($('.corsecatalogList').is(':visible')) {
                $('.corsecatalogList').hide();
            } else {
                $('.corsecatalogList').show();
                $('.corseselectList').hide();
            }
            if ($('.corsecatalog .editableCatalog .catalogList').length == 0) {
                $('.corsecatalog .editableCatalog').html('<label class="slectdemo">Select</label>');
            }
            return false;
        });
        $('.coursSelect').off('click').on('click', function (e) {
            e.stopPropagation();
            if($('.editpopupBox').is(':visible')){
                SWN_01_admin.editnewfunction();
            }
          
            if ($('.corseselectList').is(':visible')) {
                $('.corsecatalogList').hide();
            } else {
                $('.corseselectList').show();
                $('.corsecatalogList').hide();
            }
            return false;
        });
        $('.stateListing').off('click').on('click', function (e) {
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
        });        
        $('.domainListing').off('click').on('click', function (e) {
            e.stopPropagation();          
            if ($('.domainDataListing').is(':visible')) {
                $('.domainDataListing').hide();
            } else {
                $('.domainDataListing').show();               
            }
            return false;
        });
        $('.searchbox').off('keypress').on('keypress',function(e){
            if(e.keyCode==13){
                $('.SearchClick').trigger('click');
            }
        });
        $('.SearchClick').off('click keyup').on('click keyup', function (e) {
            var srchData = $('.searchbox').val();
            if($.trim(srchData)===""){
                alert("Please enter search value");
                return false;
            }
            SWN_01_admin.cursorwait();
            var html = '';
            $.ajax({
                url: "config.json",
                success: function (result) {
                    $.ajax({
                        type: "GET",
                        //url: result.DistrictList + '/0?querystring=0&searchtext=' + srchData + '&limit=' + SWN_01_admin._rowView + '',
                        url: result.DistrictList + '/'+SWN_01_admin._postId+'?querystring=0&searchtext=' + srchData + '&limit=' + SWN_01_admin._rowView + '',
                        crossDomain: true,
                        contentType: "application/json",
                        success: function (res) {
                            /* if (res.messageType === "SUCCESS") {
                                $('.districtTabBox').remove();
                                html += '<section class="districtTabBox"><div class="districtTabBoxHead"><div class="districtHeadDetails" style="display:block;"><div class="LPSDContainer">'
                                html += '<div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div><div class="LPSDAvlList"> <div class="SASHead"><hgroup><h1>School available in '+res.data.domain.name+'</h1></hgroup></div><div class="SAList"> <table class="SAListTable"> <tbody><tr> <th>School Domain Name</th> <th>External id</th> <th>Login Prefix</th> <th>License Type</th> <th>License Pool</th> <th>Number of License</th> <th>Action</th> </tr>'

                                for (var i = 0; i < res.data.domains.length; i++) {
                                    html += '<tr data-id="' + res.data.domains[i].id + '"> <td>' + res.data.domains[i].name + '</td><td>' + res.data.domains[i].reference + '</td><td>' + res.data.domains[i].userspace + '</td><td>Pear seat</td><td>Fixed</td><td>100</td><td><button class="editSchoolpop"><i class="fa fa-pencil"></i>Edit</button></td></tr>'
                                }
                                //                                html+='</tbody></table> </div><div class="FootPagination"> <div class="floatLeft"> Showing <span class="demo"> <select class="balck showEntry"> <option>1</option> <option>2 </option> <option>3</option> <option>4</option> <option>5</option> </select> </span> entries | showing 1 to 3 of 3 </div><div class="floatRight"> <nav> <ul class="pagination"> <li class="disabled"> <a class="PreviousCir" href="#" aria-label="Previous"> <i class="fa fa-play LSArrow"></i> </a> </li><li> <a class="NextCir" href="#" aria-label="Next"> <i class="fa fa-play RSArrow"></i> </a> </li></ul> </nav> </div></div></div></div></div>';
                                html += '</tbody></table> </div><div class="FootPagination"> <div class="floatLeft"> Showing <span class="demo"> <select class="balck showEntry"> <option value="1">1</option> <option value="2">2 </option> <option value="3">3</option> <option value="4" selected>4</option> <option value="5">5</option> </select> </span>  </div><div class="floatRight"> <nav> <ul class="pagination"> <li class="disabled"> <a class="globalprev"  aria-label="Previous"> <i class="fa fa-play LSArrow"></i> </a> </li><li> <a class="globalnext"  aria-label="Next"> <i class="fa fa-play RSArrow"></i> </a> </li></ul> </nav> </div></div></div></div></div></div></scetion>';
                                $('#adminContainer .domainContainer').html(html);
                                SWN_01_admin.bindevent();
                                SWN_01_admin.cursordefault();
                            } else if (res.messageType === "ERROR") {
                                $('.districtTabBox,.norecords').remove();
                                SWN_01_admin.cursordefault();
                                html = '';
                                html += '<section class="districtTabBox"><div class="districtTabBoxHead"><div class="districtHeadDetails" style="display:block;"><ul class="schoolView">';

                                html += '<li>No Domain Found</li>';

                                html += '</ul></div></div><section class="districtTabBox">';

                                $('#adminContainer .domainContainer').html(html);
                            }*/
                            if (res.messageType === "SUCCESS") {
                                schoolId = res.data.domains[0].id;
                                SWN_01_admin.cursordefault();
                                $('.districtTabBox').remove();
                                html = '<ul>';
                                SWN_01_admin._nextdisbleChcek=res.data.domains.length;
                                for (var i = 0; i < res.data.domains.length; i++) {
                                    html += '<li id="'+res.data.domains[i].id+'" ><section class="districtTabBox"><div class="districtTabBoxHead"><hgroup><h1 data-id="' + res.data.domains[i].id + '" class="floatLeft disTrictList">' + res.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li><li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></section>';
                                    html += '<div class="districtHeadDetails"><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';
                                    html += '</li>'
                                }                    
                                html += "</ul>";
                                $('#adminContainer .domainContainer').html(html);
                                if(res.data.domains.length>=4){
                                    $('.dummydata').css('height','10px');
                                }
                                else{
                                    $('.dummydata').css('height','222px');
                                }
                                SWN_01_admin.bindevent();
                                $('.FootPagination').show();
                            } else {
                                $('.districtTabBox,.norecords').remove();
                                SWN_01_admin.cursordefault();
                                html = '';
                                html += '<section class="districtTabBox"><div class="districtTabBoxHead"><div class="districtHeadDetails" style="display:block;"><ul class="schoolView">';
                                html += '<li>No District Found</li>';
                                html += '</ul></div></div><section class="districtTabBox">';
                                $('#adminContainer .domainContainer').html(html);
                                /*SWN_01_admin.cursordefault();
                                        for (var t = 0; t < ($('.domainContainer>ul>li').length); t++) {
                                            $('.domainContainer>ul>li').eq(0).remove();
                                        }
                                        $('.norecords').remove();
                                        $('.districtTabBox').html('<label class="norecords" style="">No District Found</label>');*/
                                $('.FootPagination').hide();
                            }

                        },
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });
                },
                error: function () {
                    alert('error loading page');
                }
            });
        });
        $(document.body).off("click tap").on("click tap", function (e) {           
           
            if('loginPerson'!=$(e.target).attr('class'))
            {
                if('loggerName'!=$(e.target).attr('class'))
                {
                    $('#snwLPMenu').hide();  
                }
                else{
                    $('#snwLPMenu').show();  
                }
                
            }
            if('loggerName'!=$(e.target).attr('class'))
            {
                if('loginPerson'!=$(e.target).attr('class'))
                {
                    $('#snwLPMenu').hide();  
                }
                else{
                    $('#snwLPMenu').show();  
                }
            }
        
            if ($('.corseselectList').has(e.target).length === 0) {
                $('.corseselectList').hide();
            }
            if ($('.corsecatalogList').has(e.target).length === 0) {
                $('.corsecatalogList').hide();
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

        });
        $('.distrctadd').off('click').on('click', function () {
            $('.popupBox').find('.entire-catalog').prop( "checked", true );
            $('.popupBox').find('.inputTracker input').prop( "checked", false );
            $('.hidee').hide();
            $('.createdomainlist').html($('.statename').html());
            $('[data-toggle="tooltip"]').tooltip();
            $('.popupBox').fadeIn('slow');
            $('.grayBg,.popGrayBg').css({
                'height': $('body').height()
            });
            $('.popupBox .formTable input').each(function(){
                $(this).val(''); 
            });
            $('.createdomainlist').val(SWN_01_admin._optionselector);
            SWN_01_admin.getProviderList();
            $('#snwsubscription-start,#snwpilotenddate').val(SWN_01_admin.getCurrentDate());
            
        });
        $('.catalog-list input').off('change').on('change', function () {
            var inputVal = $(this).parent().text();
            var thisId = $(this).attr('id');
            if ($(this).is(":checked")) {
                if ($('.corsecatalog .slectdemo').length > 0) {
                    $('.corsecatalog .editableCatalog').html('<label id="' + thisId + '" class="catalogList">' + inputVal + '</label>');
                } else {
                    $('.corsecatalog .editableCatalog').append('<label id="' + thisId + '" class="catalogList">' + ',' + ' ' + inputVal + '</label>');
                }
            } else {
                $('.editableCatalog #' + thisId).remove();
            }
            var lcalText = $('.corsecatalog .editableCatalog .catalogList').eq(0).text();
            $('.corsecatalog .editableCatalog .catalogList').eq(0).text(lcalText.replace(/,/g, ""));

        });
        $('.edit').off('click').on('click', function () {
            $('.editpopupBox').find('.inputTrackerEdit input').prop( "checked", false );
            $('.editdomainlist').html($('.statename').html());
            $('.editpopupBox').fadeIn('slow');
            $('.grayBg,.popGrayBg').css({
                'height': $('body').height()
            });
            $('.hidee').hide();                   
            $('.formTable .domain-name').val($(this).parents('.districtTabBox').find('.disTrictList').text());
            $('.formTable .domain-name').attr('value',$(this).parents('.districtTabBox').find('.disTrictList').text());
            $('.editpopupBox').find('.editwelcome').data("domain-id", $(this).closest(".districtTabBox").find("h1.disTrictList").data("id"));
            $('.editpopupBox').find('.editsubmit').data("domain-id", $(this).closest(".districtTabBox").find("h1.disTrictList").data("id"));
            $('.editpopupBox').attr("data-domain-id", $(this).closest(".districtTabBox").find("h1.disTrictList").data("id"));
            SWN_01_admin.cursorwait();
            SWN_01_admin.getProviderList();
            SWN_01_admin._editbutton=$(this);
            //            SWN_01_admin.domainEditForm('.editpopupBox');
            $('.editdomainlist').val(SWN_01_admin._optionselector);       
            $('.editdomainlist').attr('value',SWN_01_admin._optionselector);       
        });
        $('.addschool').off('click').on('click', function () {
            $('.hidee').hide();
            var attrId=$(this).parents('.districtTabBoxHead').find('.disTrictList').data('id');
            $('#snw_Enter_Login_Prefix,#snw_Enter_External_ID,#snw_Enter_School').val('');
            SWN_01_admin.cursorwait();
            $('.addschoollist').html($('.statename').html());
            $('.addschlpopupBox,.grayBg').show();
            $('.grayBg,.popGrayBg').css({
                'height': $('body').height()
            });
            $('.addschoollist').val(SWN_01_admin._optionselector);   
            $('.schooldistrictlist').val(attrId);
            $('#snw_popupInputDate1').val(SWN_01_admin.getCurrentDate());
            SWN_01_admin.addSchool(SWN_01_admin._optionselector,attrId);                      
        });
        $('.addschlpopupBox .addschoollist').off('change').on('change',function(){
            SWN_01_admin.cursorwait();
            var dataVal=$(this).val();
            SWN_01_admin.addSchool(dataVal,0);           
        });
        $('.editschlpopupBox .addschoollist').off('change').on('change',function(){
            SWN_01_admin.cursorwait();
            var dataVal=$(this).val();
            SWN_01_admin.addSchool(dataVal,0);           
        });
        $('.addschlpopupBox .schooldistrictlist').off('change').on('change',function(){
            SWN_01_admin.cursorwait();
            var dataVal=$(this).val();
            SWN_01_admin.schoolPopupData(dataVal);           
        });
        $('.editschlpopupBox .schooldistrictlist').off('change').on('change',function(){
            SWN_01_admin.cursorwait();
            var dataVal=$(this).val();
            SWN_01_admin.schoolPopupData(dataVal);           
        });
        $('.corsecatalogList input[type="checkbox"]').off().on("click", function () {            
            var data_domain_id=$(this).attr('data-domain-id');
            if($(this).is(':checked'))
            { 
                $('#example'+data_domain_id+':visible').prop( "checked", true );
                $('#demo'+data_domain_id+':visible').prop( "checked", true );              
                if($('input[data-domain-id='+self.model.get('_customCatalogId')+']').is(':checked'))
                {
                    $('.inputTracker input').prop( "checked", false ); 
                    $('.inputTrackerEdit input').prop( "checked", false );        
                }                               
                if($(this).attr('data-domain-id')==self.model.get('_customCatalogId'))
                {
                    $('.inputTracker input').prop( "checked", false ); 
                    $('.inputTrackerEdit input').prop( "checked", false );        
                }           
            }
            else
            {
                $('#example'+data_domain_id+':visible').prop( "checked", false );
                $('#demo'+data_domain_id+':visible').prop( "checked", false );
                if($(this).attr('data-domain-id')==self.model.get('_customCatalogId'))
                {
                    var localLength=$('#snwselectInput Input:checkbox:checked').length;
                    var lclLngthEdit=$('#snwSelectInput Input:checkbox:checked').length;                    
                    var indexArray=[];
                    var indexArrayEdit=[];   
                    for(var i=0;i<localLength;i++)
                    {
                        indexArray.push($('#snwselectInput Input:checkbox:checked:eq('+i+')').attr('data-domain-id'));
                        $('#demo'+indexArray[i]).prop( "checked", true );                       
                    }
                    for(var i=0;i<lclLngthEdit;i++)
                    {
                        $('#snwCorsecatalogList').hide()                   
                        indexArrayEdit.push($('#snwSelectInput Input:checkbox:checked:eq('+i+')').attr('data-domain-id'));
                        $('#example'+indexArrayEdit[i]).prop( "checked", true );
                    }
                }           
            }
           
            SWN_01_admin.updateCourseList();
        });        
        $('#snwselectCourse input').off('change').on('change',function(){
            SWN_01_admin.radioButton('popupBox');
        });
        $('#snwSelectCourse input').off('change').on('change',function(){
            SWN_01_admin.radioButton('editpopupBox');
        });
        $('.editSchoolpop').off('click').on('click',function(){
            var stateSelctedVal=$('.statename').val();
            $('.hidee').hide();       
            $('.addschoollist').html($('.statename').html());
            SWN_01_admin.cursorwait();
            SWN_01_admin._domainId=$(this).parents('tr').attr('data-id');
            $('.addschoollist').val(stateSelctedVal);
            SWN_01_admin.editSchool($('.editschlpopupBox'),$(this).parents('tr').attr('data-id'),stateSelctedVal);  
            
        });
        SWN_01_admin.loginoutevent();
        
    },   
    editSchool:function(fromselector,data_id,stateSelctedVal){
        var editScholPrntId='';
        $.ajax({
            type: "GET",
            url: SWN_01_admin._config.getDomainData+'/'+data_id,           
            success: function (rslt) {
                $('.editschlpopupBox,.popGrayBg').show();
                if(rslt.messageType==="SUCCESS"){
                    editScholPrntId=rslt.data.domain.parentid;
                    fromselector.find('.schldomainname').val(rslt.data.domain.name);
                    fromselector.find('.loginprefix').val(rslt.data.domain.userspace);
                    fromselector.find('.externalid').val(rslt.data.domain.reference);
                    fromselector.find('.licensetype').val(rslt.data.customization.edivatelearn.licensetype);
                    fromselector.find('.license-number').val(rslt.data.customization.edivatelearn.nooflicense);
                    fromselector.find('.license-pool').val(rslt.data.customization.edivatelearn.pooltype);
                    fromselector.find('.popupInputDate').val(rslt.data.customization.edivatelearn.pilotenddate);
                    if(rslt.data.customization.edivatelearn.pooltype==='Fixed')
                    {
                        $('#snw_License1').removeAttr('disabled');  
                    }
                    else{
                        $('#snw_License1').attr('disabled',"disabled");
                    }
                    if(rslt.data.customization.edivatelearn.pilot)
                    {
                        fromselector.find('.pilot-domain').prop('checked',true);   
                    }
                    else{
                        fromselector.find('.pilot-domain').prop('checked',false);
                    }
                    $.ajax({
                        type: "GET",
                        url: SWN_01_admin._config.DistrictList+'/'+stateSelctedVal,           
                        success: function (rslte) {                          
                            if(rslt.messageType==="SUCCESS"){
                                var html='';
                                fromselector.find('.schooldistrictlist').html(function(){
                                    for(var i=0;i<rslte.data.domains.length;i++)
                                    {
                                        html+='<option value="'+rslte.data.domains[i].id+'">'+rslte.data.domains[i].name +'</option>'  
                                    } 
                                    return html;
                                }).promise().done(function(){
                                    fromselector.find('.schooldistrictlist').val(editScholPrntId); 
                                });                               
                                SWN_01_admin.cursordefault();                     
                            } 
                            SWN_01_admin.cursordefault();  
                        },
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });                                      
                }                
                else
                {                   
                    SWN_01_admin.cursordefault(); 
                }               
            },
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
            },
            error: function () {
                alert('error loading page');
            }
        });   
    },
    saveSchool:function(formElementSelector,data){
        var urlChecker='';
        var createdDomainObj={};       
        if(data==='create')
        {
            createdDomainObj = {
                disrict: formElementSelector.find(".schooldistrictlist").val(),
                name: formElementSelector.find(".schldomainname").val(),
                loginPrefix: formElementSelector.find(".loginprefix").val(),
                externalId: formElementSelector.find(".externalid").val(),
                licenseType: formElementSelector.find(".licensetype").val(),            
                licensePool: formElementSelector.find('.license-pool').val(),
                numbersOfLicense: formElementSelector.find(".license-number").val(),            
                pilotDomain: formElementSelector.find(".pilot-domain").is(":checked"),
                pilotEndDate: formElementSelector.find(".date-field").val()
            };
            urlChecker=SWN_01_admin._config.createSchool;      
        }
        if(data==='edit')
        {
            createdDomainObj = {
                domainid:SWN_01_admin._domainId,
                disrict: formElementSelector.find(".schooldistrictlist").val(),
                name: formElementSelector.find(".schldomainname").val(),
                loginPrefix: formElementSelector.find(".loginprefix").val(),
                externalId: formElementSelector.find(".externalid").val(),
                licenseType: formElementSelector.find(".licensetype").val(),            
                licensePool: formElementSelector.find('.license-pool').val(),
                numbersOfLicense: formElementSelector.find(".license-number").val(),            
                pilotDomain: formElementSelector.find(".pilot-domain").is(":checked"),
                pilotEndDate: formElementSelector.find(".date-field").val()
            };
            urlChecker=SWN_01_admin._config.eidtSchool;      
        }
        $.ajax({
            type: "POST",
            url: urlChecker,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(createdDomainObj),
            success: function (rslt) {
                if(rslt.messageType==="SUCCESS"){
                    alert(rslt.message)  
                    $('.grayBg,.popGrayBg').hide();
                    $('.addschlpopupBox,.editschlpopupBox').hide();
                    SWN_01_admin.cursordefault();                     
                    SWN_01_admin._districtContext.trigger('click');
                    SWN_01_admin._districtContext.parents('.districtTabBoxHead').next().show();
                }
                else if(rslt.messageType === "ERROR")
                {
                    alert(rslt.message)  
                    SWN_01_admin.cursordefault();       
                }
                else
                {
                    alert(rslt.messageType);
                    $('.grayBg,.popGrayBg').hide();
                    $('.addschlpopupBox,.editschlpopupBox').hide();
                    SWN_01_admin.cursordefault(); 
                    SWN_01_admin._districtContext.trigger('click');
                    SWN_01_admin._districtContext.parents('.districtTabBoxHead').next().show();
                }
                
               
            },
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
            },
            error: function () {
                alert('error loading page');
            }
        }); 
    },
    radioButton:function(dataClass){      
        $('.'+dataClass).find('.selective-course').prop( "checked", true ); 
        $('.'+dataClass).find('.entire-catalog').prop( "checked", false ); 
    },
    loginoutevent: function () {
        $('.LogOuticon').off('click').on('click', function () {
            $.ajax({
                url: "config.json",
                success: function (result) {
                    SWN_01_admin._baseUrl = result.Logouturl;
                    $.ajax({
                        type: "GET",
                        url: SWN_01_admin._baseUrl,
                        crossDomain: true,
                        contentType: "application/json",
                        success: function () {
                            window.location.href = "index.html";
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });

                }
            });
        });
    },
    sortingDistrict:function(){
        //create global variable and give it start value 1
        var sortBy = ""
        var asc = true
        function sortUsingNestedText(parent, childSelector, keySelector) {
            //if (sortBy == keySelector) { asc = !asc } else { asc = true }
            sortBy = keySelector
            var items = parent.children(childSelector).sort(function(a, b) {
                var vA = $.trim($(keySelector, a).text());
                var vB = $.trim($(keySelector, b).text());        
                return ((vA < vB) ? -1 : (vA > vB) ? 1 : 0) * (asc ? 1 : -1);          
            });
            parent.empty().append(items);
        }
        sortUsingNestedText($('.domainContainer > ul'), $('.domainContainer > ul > li'), ".disTrictList");

    },
    loadingdistrict: function () {
        $('.districtTabBox').remove();
        var html = "";
        var state_list = "";
        var split_data = {};
        var schoolId = '';
        $.ajax({
            url: "config.json",
            success: function (result) {
                SWN_01_admin._baseUrl = result.Domainlist;
                var urlStore = result.DistrictList;
                
                $.ajax({
                    type: "GET",
                    url: SWN_01_admin._baseUrl,
                    crossDomain: true,
                    contentType: "application/json",
                    success: function (res) {
                        			
                        if (res.messageType === "SUCCESS") {
                            $('.dummydata').html();
                            $('.statename').html(function () {
                                $.each(res.data.domains, function (i, v) {
                                    split_data = v.userspace.split('-');
                                    state_list += '<option value=' + v.id + '>' + split_data[1].toUpperCase() + ' ' + v.name + '</option>'
                                    SWN_01_admin._stateId.push(v.id);
                                    SWN_01_admin._stateName.push(split_data[1].toUpperCase() + ' ' + v.name);                                    
                                });
                                return state_list;
                            });
                            SWN_01_admin._postId=res.data.domains[0].id;
                            SWN_01_admin._optionselector=$('.statename option:first').val();
                            $.ajax({
                                type: "GET",
                                url: urlStore + '/' + res.data.domains[0].id+'?querystring=0&limit='+SWN_01_admin._dropdownCount+'',
                                crossDomain: true,
                                contentType: "application/json",
                                success: function (data) {
                                    if (data.messageType === "SUCCESS") {
                                        schoolId = data.data.domains[0].id;
                                        SWN_01_admin.cursordefault();
                                        $('.districtTabBox').remove();
                                        html = '<ul>';
                                        SWN_01_admin._nextdisbleChcek=data.data.domains.length;
                                        for (var i = 0; i < data.data.domains.length; i++) {
                                            html += '<li id="'+data.data.domains[i].id+'" ><section class="districtTabBox"><div class="districtTabBoxHead"><hgroup><h1 data-id="' + data.data.domains[i].id + '" class="floatLeft disTrictList">' + data.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li><li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></section>';

                                            html += '<div class="districtHeadDetails"><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';

                                            html += '</li>'
                      
                                        }                    
                    
                                        html += "</ul>";
                                        $('#adminContainer .domainContainer').html(html);
                                        if(data.data.domains.length>=4)
                                        {
                                            $('.dummydata').css('height','10px');
                                        }
                                        else{
                                            $('.dummydata').css('height','222px');
                                        }
                                        SWN_01_admin.sortingDistrict();
                                        SWN_01_admin.bindevent();
                                        $('.FootPagination').show();
                                    } else {
                                        SWN_01_admin.cursordefault();
                                        for (var t = 0; t < ($('.domainContainer>ul>li').length); t++) {
                                            $('.domainContainer>ul>li').eq(0).remove();
                                        }
                                        $('.norecords').remove();
                                        $('.districtTabBox').html('<label class="norecords" style="">No District Found</label>');
                                        $('.FootPagination').hide();
                                    }
                                },
                                beforeSend: function(xhr, settings) {
									
                                    xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                                },
                                error: function () {
                                    alert('error loading page');
                                }
                            });
                            SWN_01_admin.statelistchange();
                        } else {
                            SWN_01_admin.cursordefault();
                            $('.norecords').remove();
                            $('.dummydata').html('<label class="norecords" style="">No Record Found</label>');
                        }

                    },
                    beforeSend: function(xhr, settings) {
						
                        xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                    },
                    error: function () {
                        alert('error loading page');
                    }
                });

            }
        });
    },
    statelistchange: function () {
        $('.statename').off('change').on('change', function () {
            SWN_01_admin.cursorwait();            
            SWN_01_admin._dropdownCount=10;
            $('.domain-showEntry').val(SWN_01_admin._dropdownCount);
            var html = '';
            var idUrl=SWN_01_admin._postId=SWN_01_admin._optionselector= $(this).val();
            var schlId = '';
            $.ajax({
                url: "config.json",
                success: function (result) {
                    SWN_01_admin._baseUrl = result.DistrictList;
                    $.ajax({
                        type: "GET",
                        url: SWN_01_admin._baseUrl + '/' + idUrl+'?querystring=0&limit='+SWN_01_admin._dropdownCount+'',
                        crossDomain: true,
                        contentType: "application/json",
                        success: function (data) {
                            if (data.messageType === "SUCCESS") {
                                SWN_01_admin._nextdisbleChcek=data.data.domains.length;
                                SWN_01_admin.cursordefault();
                                $('.districtTabBox').remove();
                                html = '<ul>';
                                for (var i = 0; i < data.data.domains.length; i++) {

                                    //                  schlId=data.data.domains.id;
                                    html += '<li id="'+data.data.domains[i].id+'"><section class="districtTabBox"><div class="districtTabBoxHead"><hgroup><h1 data-id="' + data.data.domains[i].id + '" class="floatLeft disTrictList">' + data.data.domains[i].name + '</h1></hgroup><p class="floatRight"><ul class="schoolBttns floatRight"> <li id="snwEdit" class="edit"><i class="fa fa-pencil"></i><a id="snwEdit_Link" href="#">Edit</a></li><li id="snwaddschool" class="addschool"><i class="fa fa-plus"></i><a id="snwAdd_School" href="#">Add School</a></li></ul></p><div class="floatRight"><div class="numSchools"><ul class="numSchoolsDet"><li></li><li></li></ul></div></div></div></section>';

                                    html += '<div class="districtHeadDetails"><div class="LPSDContainer"><div class="LPSDTopTableBox"> <table class="LPSDTopTable"> <tbody><tr> <td style="width:8%;">Name: </td><td style="width:12%;">Sample District 1</td><td style="width:10%;">Subscription Type: </td><td style="width:16%;">Entire Catalog</td><td style="width:10%;">Number of License:</td><td style="width:10%;">100</td></tr><tr> <td>External Id: </td><td>21536</td><td>Subscription Date:</td><td>07/09/2015 to 07/09/2016</td><td>Pilot End Date:</td><td>07/09/2016</td></tr><tr> <td>Login Prefix: </td><td>lm-test1</td><td>License Type:</td><td>Pre Seat</td><td></td><td></td></tr></tbody></table> </div> </div>';
                                    html += '</li>'
                                }
                                html += '</ul>';
                                $('#adminContainer .domainContainer').html(html);
                                $('.DomainPrevious').prop('disabled',true).addClass('disabled'); 
                                $('.DomainNext').prop('disabled',false).removeClass('disabled');
                               
                                if(data.data.domains.length>=4)
                                {
                                    $('.dummydata').css('height','10px');
                                }
                                else{
                                    $('.dummydata').css('height','222px');
                                }
                                $('.FootPagination').show();
                                SWN_01_admin.sortingDistrict();
                            } else {
                                var length=$('.domainContainer>ul>li').length;
                                SWN_01_admin.cursordefault();
                                for (var t = 0; t <length-1; t++) {
                                    $('.domainContainer>ul>li').eq(0).remove();
                                }
                                $('.norecords').remove();
                                $('.districtTabBox').html('<label class="norecords" style="">No District Found</label>');
                                $('.FootPagination').hide();
                            }
                        },
                        beforeSend: function(xhr, settings) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                        },
                        complete: function () {
                            setTimeout(function () {
                                SWN_01_admin.bindevent();
                            }, 400);
                        },
                        error: function () {
                            alert('error loading page');
                        }
                    });

                }
            });
        })
    },
    cursorwait: function () {
        $('body').css('cursor', 'wait');
        $('.grayBg,.snwLoader').show();
        $('.grayBg,.popGrayBg').css({
            'height': $('body').height()
        });
    },
    cursordefault: function () {
        $('body').css('cursor', 'default');
        $('.grayBg,.snwLoader').hide();
    },
    getProviderList: function () {
        var html = '';
        $.ajax({
            url: "config.json",
            success: function (result) {
                $.ajax({
                    type: "GET",
                    url: result.New_District_Popup_Provider,
                    crossDomain: true,
                    contentType: "application/json",
                    success: function (res) {
                        $('.popupBox .inputTracker').empty();
                        $('.editpopupBox').find('.inputTrackerEdit').empty();
                        if (res.messageType) {
                        	var count = 0;
                            for (var t = 0; t < res.data.domains.length; t++) {
                                html += '<li><input id="checkbox' + t + '" type="checkBox" data-domain-id="' + res.data.domains[t].id + '" data-course-list=""/>' + res.data.domains[t].name + '</li>'
                                if(res.data.domains[t].id!=self.model.get('_customCatalogId'))
                                {
                                    $('.popupBox .inputTracker').append('<input type="checkbox" disabled="disabled" value="" name="Add Subdomain" id="demo'+res.data.domains[t].id+'" class="demo">' + res.data.domains[t].name + '&nbsp;&nbsp;');
                                    $('.editpopupBox .inputTrackerEdit').append('<input type="checkbox" disabled="disabled" value="" name="Add Subdomain" id="example'+res.data.domains[t].id+'" class="example">' + res.data.domains[t].name + '&nbsp;&nbsp;');
                                    if ((count + 1) % 2 == 0) {
                                		$('.popupBox .inputTracker').append('</br>');
                                		$('.editpopupBox .inputTrackerEdit').append('</br>');
                                	}
                                    count++;
                                }                                
                            }

                            $('.corsecatalogList ul').html(html);
                            SWN_01_admin.cursordefault();
                            SWN_01_admin.bindevent();
                        } else {
                            $('.corsecatalogList ul').html('<li><input type="checkBox"/>No Data Found</li>');
                            SWN_01_admin.cursordefault();
                        }
                        SWN_01_admin.bindevent();
                        $('.popGrayBg').show();
                        if($(SWN_01_admin._editbutton).hasClass('edit'))
                        {
                            SWN_01_admin.domainEditForm(SWN_01_admin._editbox);     
                        }
                    },
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                    },
                    error: function () {
                        alert('error loading page');
                    }
                });

            }
        });
    },
    getCourseList: function (courseID) {
        var courseListObj;
        var courseListURI = SWN_01_admin._config.courseList + "/" + courseID;
        $.when($.ajax({
            url:courseListURI,
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
            }
        }))
        .then(function (data, txtStatus, jqXHR) {
            courseListObj = data;
        });
        return courseListObj;
    },
    getConfig: function () {
        $.when($.ajax("config.json"))
        .then(function (data, txtStatus, jqXHR) {
            SWN_01_admin._config = data;
        });
    },
    updateCourseList: function () {
        var selectedCourseCatalog = $('.catalog-list:visible').find('input[type="checkbox"]').filter(":checked");
        var totalCourses = [];
        var courseSelectListHTML = "";
        if (selectedCourseCatalog.length > 0) {
            $(selectedCourseCatalog).each(function (ind) {
                var courseListURI = SWN_01_admin._config.courseList + "/" + $(this).data("domain-id");
                $.ajax({
                    url:courseListURI,
                    success:function(res){
                        totalCourses = totalCourses.concat(res.data.domain);
                        if (totalCourses.length) {
                            if (ind === selectedCourseCatalog.length - 1) {
                                if ($(".entire-catalog").is(":checked")) {
                                    $.each(totalCourses, function (index, course) {
                                        courseSelectListHTML += '<li><input type="checkbox" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '" checked="true"/>' + course.title + '</li>'
                                    });
                                    $(".course-list ul").html(courseSelectListHTML);
                                }
                                else {
                                    $.each(totalCourses, function (index, course) {
                                        courseSelectListHTML += '<li><input type="checkbox" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '"/>' + course.title + '</li>'
                                    });
                                    $(".corseselectList ul").html(courseSelectListHTML);
                                }
                            }
                            SWN_01_admin.bindevent();
                        }
                        else {
                            courseSelectListHTML = '<li>Please select a Course Catalog first.</li>'
                            $(".corseselectList ul").html(courseSelectListHTML);
                        }
                    },
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                    }
                });

            });
        }
        else {
            courseSelectListHTML = '<li>Please select a Course Catalog first.</li>'
            $(".corseselectList ul").html(courseSelectListHTML);
        }
    },
    domainWelcomeLetter: function () {
        var name = SWN_01_admin._sessionData.firstname + " " + SWN_01_admin._sessionData.lastname
        var welcomeLetterURI = SWN_01_admin._config.welcomeLetter + '/' + $('.editwelcome').data("domain-id") + '/' + name;
        var form = $('<form></form>').attr('action', welcomeLetterURI).attr('method', 'get');
        form.appendTo('body').submit().remove();
    },
    domainFormValidation: function (formElementSelector,requestType) {
       
        formElementSelector = $(formElementSelector);       
        SWN_01_admin.domainFormSubmit(formElementSelector,requestType);
    },
    domainFormSubmit: function (formElementSelector,requestType) {
        
        SWN_01_admin.cursorwait();
        formElementSelector = $(formElementSelector);
        var catalogListArr = [];
        var courseListArr = [];
        formElementSelector.find('.catalog-list input[type="checkbox"]').filter(":checked").each(function () {
            catalogListArr.push($(this).data("domain-id"));
        });
        formElementSelector.find('.course-list input[type="checkbox"]').filter(":checked").each(function () {
            courseListArr.push($(this).data("course-id"));
        });  
        var endPilot_Date=formElementSelector.find(".pilot-end").eq(0).val();
        if(formElementSelector.find(".pilot-domain").is(":checked")&&formElementSelector.find(".pilot-end").eq(0).val()=="")
        {
            var someDate = new Date();
            var numberOfDaysToAdd = 90;
            someDate.setDate(someDate.getDate() + numberOfDaysToAdd); 
            var date= new Date(someDate);
            var dateFormat=date.toLocaleDateString().replace(/\//g, "-");
            var dateSplice=dateFormat.split('-');
            var Month=dateSplice[0];
            var Datee=dateSplice[1];
            if(dateSplice[0].length===1)
            {
                dateSplice[0]=[];
                dateSplice[0]='0'+Month;
            }
            if(dateSplice[1].length===1)
            {
                dateSplice[1]=[];
                dateSplice[1]='0'+Datee;
            }
            dateSplice.join('-');
            console.log(dateSplice.join('-'))
            endPilot_Date=dateSplice.join('-');       
        }        
        SWN_01_admin._globalCourseCatalog=catalogListArr;
        SWN_01_admin._globalCourseSelection=courseListArr;
        var createdDomainObj = {
            state: formElementSelector.find(".state-code").val(),
            name: formElementSelector.find(".domain-name").val(),
            loginPrefix: formElementSelector.find(".login-prefix").val(),
            externalId: formElementSelector.find(".external-id").val(),
            fullSubscription: formElementSelector.find(".entire-catalog").is(":checked"),
            courseCatalogs: catalogListArr,
            courseSelection: courseListArr,
            subscriptionStartDate: formElementSelector.find(".popupInputDate").eq(0).val(),
            subscriptionEndDate: formElementSelector.find(".popupInputDate").eq(1).val(),
            ltiHashCode: "",
            licenseType: formElementSelector.find('.license-type').val(),
            numbersOfLicense: formElementSelector.find(".license-number").val(),
            licensePool: formElementSelector.find(".license-pool").val(),
            pilotDomain: formElementSelector.find(".pilot-domain").is(":checked"),
            pilotEndDate: endPilot_Date
        };
    
        var domainRequestURI = "";
        if(requestType==="create"){
            domainRequestURI = SWN_01_admin._config.createDomain;
        }
        else if(requestType==="edit"){
            domainRequestURI = SWN_01_admin._config.editDomain + '/' + formElementSelector.attr("data-domain-id");
        }
    
        $.ajax({
            type: "POST",
            url: domainRequestURI,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(createdDomainObj),
            headers: {
                "token": SWN_01_admin._sessionData.token
            },
            success: function (res) {
                
                if(res.messageType==="SUCCESS")
                {   
                    SWN_01_admin.cursordefault();
                    alert(res.message);                    
                    $('.statename').trigger('change');
                    $('.grayBg').hide();
                    $('.popGrayBg').hide();
                    $('.popupBox,.editpopupBox').hide();  
                }
                else
                {
                    SWN_01_admin.cursordefault();   
                    alert(res.message)  
                }
                
            },
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
            },
            error: function (err) {
                SWN_01_admin.cursordefault();
                alert('Encountered an error while createdistrict')
                console.log("Encountered an error while createdistrict", err);
                $('.grayBg,.popGrayBg').hide();
                $('.popupBox,.editpopupBox').hide();
            }
        });
    },
    domainEditForm:function(formElementSelector){
        SWN_01_admin.cursorwait();
        SWN_01_admin.updateCourseList();
        formElementSelector = $(formElementSelector);  
        
        $.ajax({
            url:SWN_01_admin._config.getDomainData + '/' + formElementSelector.attr("data-domain-id"),
            success:function(res){            
                SWN_01_admin._result=res;
                SWN_01_admin.cursorwait();
                formElementSelector.find('select.editdomainlist').val(res.data.domain.parentid);
                formElementSelector.find('select.editdomainlist').attr('value',res.data.domain.parentid);
                //                formElementSelector.find('input.domain-name').val(res.data.domain.name);
                formElementSelector.find('input.login-prefix').val(res.data.domain.userspace).attr('disabled','disabled');
                formElementSelector.find('input.login-prefix').attr('value',res.data.domain.userspace);
                formElementSelector.find('input.external-id').val(res.data.domain.reference);
                formElementSelector.find('input.external-id').attr('value',res.data.domain.reference);
                formElementSelector.find('select.license-type').val(res.data.customization.edivatelearn.licensetype);
                formElementSelector.find('select.license-type').attr('value',res.data.customization.edivatelearn.licensetype);
                formElementSelector.find('select.license-pool').val(res.data.customization.edivatelearn.pooltype);
                formElementSelector.find('select.license-pool').attr('value',res.data.customization.edivatelearn.pooltype);
                formElementSelector.find('input.license-number').val(res.data.customization.edivatelearn.nooflicense);
                formElementSelector.find('input.license-number').attr('value',res.data.customization.edivatelearn.nooflicense);	
                formElementSelector.find('input.pilot-end').val(res.data.customization.edivatelearn.pilotenddate);
                formElementSelector.find('input.pilot-end').attr('value',res.data.customization.edivatelearn.pilotenddate);
                formElementSelector.find('#snwSubscription-start').val(res.data.customization.edivatelearn.subscriptionstartdate);
                formElementSelector.find('#snwSubscription-start').attr('value',res.data.customization.edivatelearn.subscriptionstartdate);
                formElementSelector.find('#snwSubscription-end').val(res.data.customization.edivatelearn.subscriptionenddate);
                formElementSelector.find('#snwSubscription-end').attr('value',res.data.customization.edivatelearn.subscriptionenddate);
                if(res.data.customization.pilot){
                    formElementSelector.find('input.pilot').attr("checked","true");
                }
                else{
                    formElementSelector.find('input.pilot').attr("checked","false");
                }
                if(res.data.customization.edivatelearn.fullsubscription){
                    formElementSelector.find('#snwEntire_Catalog').prop("checked",true);
                    formElementSelector.find('#snwselective-course').prop("checked",false);
                }
                else{
                    formElementSelector.find('#snwEntire_Catalog').prop("checked",false);
                    formElementSelector.find('#snwselective-course').prop("checked",true);
                }
                //                if($('#snwSelectInput').)
                var totalCourses=[];
           
                $('.editpopupBox .corsecatalogList').find('li').each(function (i) {                         
                    if(res.data.subscribedproviderlist==null){
                        SWN_01_admin.cursordefault();
                        $('.popGrayBg').show();
                        SWN_01_admin.bindevent();
                    }else{
                        //if($(this).find('input').attr('data-domain-id')===res.data.subscribedproviderlist[i]){
                        if(res.data.subscribedproviderlist.indexOf($(this).find('input').attr('data-domain-id'))!=-1){
                            $(this).find('input').prop( "checked", true );
                            $('#example'+$(this).find('input').attr('data-domain-id')).prop( "checked", true );
                            var courseListURI = SWN_01_admin._config.courseList + "/" + $(this).find('input').attr('data-domain-id');
                            
                            $.ajax({
                                url:courseListURI,
                                success:function(data){								 
                                  
                                    totalCourses = totalCourses.concat(data.data.domain);
                                
                                    SWN_01_admin._totalCourseArry=totalCourses;
                                    //TODO      
                                  
                                    SWN_01_admin.cursordefault();
                                    $('.popGrayBg').show();
                                    SWN_01_admin.bindevent();
                                },
                                beforeSend: function(xhr, settings) {
                                    xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
                                }
                            });
                        }else{
                            SWN_01_admin.cursordefault();
                            $('.popGrayBg').show();
                            SWN_01_admin.bindevent();
                        }
                    }
                });
                
            },
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
            },
            error:function(err){
                SWN_01_admin.cursordefault();
                alert("Error fetching domain data for",formElementSelector.data("domain-id"));
            }
        });
    },
    editnewfunction:function()
    {
        $('.editpopupBox').find(".course-list ul").empty();
        var courseSelectListHTML='';
        $.each(SWN_01_admin._totalCourseArry, function(courseIdx, course){
            courseSelectListHTML += '<li><input type="checkbox" data-course-id="' + course.id + '" data-course-name="' + course.title + '" data-domain-id="' + course.domainid + '" />' + course.title + '</li>'       
        });
        $('.editpopupBox').find(".course-list ul").html(courseSelectListHTML); 
       
        $('.editpopupBox').find(".course-list ul li").each(function(){
            var courseListElId = $(this).find('input').attr('data-course-id');
            var courseFound = false;
            $.each(SWN_01_admin._result.data.subscribedcourselist, function(subidx, subCourseId){               
                if(courseListElId == subCourseId){
                    courseFound = true;
                }
                
            });
            
            if(courseFound)
            { 
                $(this).find('input').prop('checked',true);  
          
            }
            else{
                $(this).find('input').prop('checked',false);
            }
                        
        });
        
       
    }
    ,    
    addSchool:function(data_param,eqNo){
        var localArray=[];
        $.ajax({
            type: "GET",
            url: SWN_01_admin._config.DistrictList+'/'+data_param,
            crossDomain: true,
            contentType: "application/json",
            success: function (res) {
                var state_list='';
                if (res.messageType === "SUCCESS") {   
                    
                    $('#snw_schooldistrictlist1') 
                   
                    for(var i=0;i<res.data.domains.length;i++)
                    {
                        state_list += '<option value=' + res.data.domains[i].id + '>'+ res.data.domains[i].name + '</option>'
                    }
                    $('#snw_schooldistrictlist').html(state_list);
                    $('#snw_schooldistrictlist1').html(state_list);
                    if(eqNo==0){
                        $('.editschlpopupBox .schooldistrictlist').val(res.data.domains[0].id);
                        $('.addschlpopupBox .schooldistrictlist').val(res.data.domains[0].id);
                        SWN_01_admin.schoolPopupData(res.data.domains[0].id);
                    }else{
                        $('.addschlpopupBox .schooldistrictlist').val(eqNo);
                        SWN_01_admin.schoolPopupData(eqNo);
                    }
                //SWN_01_admin.schoolPopupData(res.data.domains[0].id);
                //SWN_01_admin.schoolPopupData(eqNo);
                } else {
                    $('.norecords').remove(); 
                    SWN_01_admin.cursordefault();
                    $('.schooldistrictlist').html('<option class="norecords" style="">No Record Found</option>');                                      
                }
            },
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
            },
            error: function () {
                alert('error loading page');
            }
        });  
        
    },
    schoolPopupData:function(dataParam){       
        $.ajax({
            type: "GET",
            url: SWN_01_admin._config.getDomainData+'/'+dataParam,                        
            crossDomain: true,
            contentType: "application/json",
            success: function (res) {
                $('.editschlpopupBox .schooldistrictlist').val(dataParam);
                $('.addschlpopupBox .schooldistrictlist').val(dataParam);
                if (res.messageType === "SUCCESS") {    
                    SWN_01_admin._globalLicensecNum= (res.data.customization.edivatelearn.nooflicense!=null) ? res.data.customization.edivatelearn.nooflicense : 0;
                    $('.editschlpopupBox .licensetype').val(res.data.customization.edivatelearn.licensetype);
                    $('.addschlpopupBox .licensetype').val(res.data.customization.edivatelearn.licensetype);  
                    if(res.data.customization.edivatelearn.pooltype==='Fixed')
                    {
                        $('#snw_License').val('').removeAttr('disabled');  
                        $('#snw_License1').val('').removeAttr('disabled');  
                    }
                    else{
                        $('#snw_License').val('').attr('disabled',"disabled");
                        $('#snw_License1').val('').attr('disabled',"disabled");
                    }
                    $('#snw_balck_data').val(res.data.customization.edivatelearn.pooltype);
                    $('#snw_balck_data1').val(res.data.customization.edivatelearn.pooltype);
                    $('#snw_popupInputDate_edit').val(res.data.customization.edivatelearn.pilotenddate);
                    if(res.data.customization.edivatelearn.pilot){
                        $('#snw_checkbox').attr("checked","true");
                        $('#snw_checkbox_edit').attr("checked","true");
                    }
                    else{
                        $('#snw_checkbox').attr("checked","false");
                        $('#snw_checkbox_edit').attr("checked","false");
                    }
                    SWN_01_admin.cursordefault();
                    $('.popGrayBg').show();
                }                     
            },
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + SWN_01_admin._globalSccessToken);
            },
            error: function () {
                alert('error loading page');
            }
         
             
            
        });
    },
    numberValidation:function(context){

        var localData=(context.val());
        var localstrin='';
        if(!$.isNumeric(localData)) 
        {
            var str =localData;
            str =parseInt(str.substring(0, str.length - 1));  
            if(isNaN(str)) {
                var str = '';
            }            
            context.val((str));
            context.parent().find('.hidee:eq(1)').show();
            localstrin=(str);
        }
        else{
            localstrin=localData;
            context.parent().find('.hidee:eq(1)').hide();
        }
        
        if(context.attr('data-id')==="on"){
            if(localstrin>parseInt(SWN_01_admin._globalLicensecNum,10))
            {
                var strN =localstrin;
                strN = strN.substring(0, strN.length - 1);  
                context.val(strN);
                context.next('label').next('label').next('label').show();     
            }
            else{
                context.next('label').next('label').next('label').hide();  
            }  
        }
        
    },
    
    getCurrentDate:function()
    {
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var output = ((''+month).length<2 ? '0' : '') + month + '-' +((''+day).length<2 ? '0' : '') + day+ '-'+d.getFullYear();
        return output;
    }
};
