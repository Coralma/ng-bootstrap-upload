angular.module('ng-bootstrap-upload', ['ngFileUpload'])
    .directive('ngUpload', ['Upload', function (Upload) {
        var IMG_TYPE = ["bmp","gif","jpeg","jpg","png"];
        var FILE_TYPE = ["xls","xlsx","doc","docx","ppt","pptx","pdf","txt","wav","mp3","wmv","asf","rm","rmvb","avi","dat","mpg","mpeg","mp4","3gp","mov","swf"];

        return {
            restrict: 'E',
            replace: true,
            scope: {
                options: '=',
                onDelete: '=',
                onUpload: '='
            },
            link: function (scope, element, attrs) {
                scope.options.displaySize = scope.options.displaySize || 10;
                scope.options.caption = scope.options.caption || '附件上传';
                scope.options.uploadBtnCaption = scope.options.uploadBtnCaption || '上传';
                scope.options.deleteBtnCaption = scope.options.deleteBtnCaption || '删除';
                scope.init = function() {
                    var dataSize = scope.options.data.length;
                    var pageSize = scope.options.data.length / scope.options.displaySize;
                    _.forEach(scope.options.data, function(item) {
                        item._class= "img-div";
                        item._selection = false;
                        item[scope.options.widthField] = item[scope.options.widthField] || "600";
                        /*if(scope.options.imageName)
                        if(_.includes(img_type, ))*/
                    })
                    // separate group
                    var loopId = 0, groupId = 1;
                    scope.groups = _.groupBy(scope.options.data, function(n) {
                        if(loopId < scope.options.displaySize) {
                            loopId++;
                        } else {
                            loopId = 1;
                            groupId++;
                        }
                        return groupId;
                    });
                    scope.currentGroupNum = 1;
                    scope.currentGroup = scope.groups[scope.currentGroupNum];
                    scope.groupSize = _.size(scope.groups);
                    genEmptyData(scope.currentGroup.length);
                }
                scope.prev = function() {
                    if(scope.currentGroupNum > 1) {
                        scope.currentGroupNum = scope.currentGroupNum - 1;
                        scope.currentGroup = scope.groups[scope.currentGroupNum];
                    }
                    genEmptyData(scope.currentGroup.length);
                }
                scope.next = function() {
                    if(scope.currentGroupNum < scope.groupSize) {
                        scope.currentGroupNum = scope.currentGroupNum + 1;
                        scope.currentGroup = scope.groups[scope.currentGroupNum];
                    }
                    genEmptyData(scope.currentGroup.length);
                }
                var genEmptyData = function(existedSize) {
                    var emptyDataNum = scope.options.displaySize - existedSize;
                    if(emptyDataNum > 0) {
                        scope.emptyData = _.range(emptyDataNum);
                    } else {
                        scope.emptyData = [];
                    }
                }
                scope.imgClick = function(item) {
                    item._selection = !item._selection;
                }
                scope.imgDblclick =function(item) {
                    scope.selectedItem = item;
                    angular.element("#gallery-bg").css("display" , "block");
                    var showDiv = angular.element("#gallery-show");
                    showDiv.css("display", "block");
                    var size = $(window).width() - parseInt(item[scope.options.widthField]);
                    showDiv.css("left", size / 2);
                    console.log("window width: " + (size / 2));
                }
                scope.hideFancyImg = function() {
                    angular.element("#gallery-bg").css("display" , "none");
                    angular.element("#gallery-show").css("display", "none");
                }
                scope.init();
            },
            template:
                '<div class="bootstrap-upload-gallery">' +
                '<span>{{options.caption}}</span>' +
                '<button class="btn btn-default upload-act-btn" type="button" ngf-select ngf-change="upload($files)" ngf-multiple="true">' +
                '   <span class="glyphicon glyphicon-upload"></span> {{ options.uploadBtnCaption }}' +
                '</button>' +
                '<button class="btn btn-default upload-del-btn" type="button">' +
                '   <span class="glyphicon glyphicon-remove-circle"></span> {{ options.deleteBtnCaption }}' +
                '</button>' +
                '<table class="image-gallery">'+
                '   <tr>' +
                '       <td class="nav-td"><span ng-class="currentGroupNum > 1 ? \'prev\' : \'prev-disable\'" ng-click="prev()"></span></td>' +
                '       <td width="10%" ng-repeat="item in currentGroup">' +
                '           <div>' +
                '               <div ng-class="item._selection ? \'img-div-selected\' : \'img-div\'">' +
                '                   <img ng-src="{{item[options.imageUrlField]}}" width="100%" height="100px" ng-click="imgClick(item)" ng-dblclick="imgDblclick(item)">' +
                '               </div>' +
                '               <div class="image-name" title="{{ item[options.imageNameField] }}">{{ item[options.imageNameField] }}</div>' +
                '           </div>' +
                '       </td>' +
                '       <td width="10%" ng-repeat="ed in emptyData"></td>' +
                '       <td class="nav-td"><span ng-class="(currentGroupNum < groupSize) ? \'next\' : \'next-disable\'" ng-click="next()"></span></td>' +
                '   </tr>' +
                '</table>' +
                '<div id="gallery-bg" ng-click="hideFancyImg()"></div>' +
                '<div id="gallery-show">' +
                '       <img src="{{ selectedItem[options.imageUrlField] }}" height="{{selectedItem[options.heightField]}}" width="{{selectedItem[options.widthField]}}">' +
                '       <a id="fbplus-close" style="display: block;" ng-click="hideFancyImg()"></a>' +
                '</div>' +
                '</div>'
        }
    }]);