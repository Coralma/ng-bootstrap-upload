insuranceCompanyApp.factory('insurRepairFacAgreementService', ['Restangular', '$q', 'urlUtils','Upload',
    function(Restangular, $q, urlUtils, Upload){
        return {
            uploadFiles : function(files, companyId, $scope) {
                var that = this;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    var pathUrl = '/admin/uploadFiles/' + companyId;
                    Upload.upload({
                        url: urlUtils.getPath(pathUrl),
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function (data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                        $scope.uploadOptions.data.push(data);
                        $scope.uploadApi.refresh();
                    }).error(function (data, status, headers, config) {
                        console.log('error status: ' + status);
                    })
                }
            },

            downloadFile : function(item) {
                $.fileDownload(urlUtils.getPath("/admin/downloadFile"),{
                    httpMethod: "POST",
                    data: $.param(item)
                });
            },

            deleteFiles : function(files) {
                var path =urlUtils.getPath("/admin/deleteFiles");
                Restangular.all(path).post(files).then(function(data) {
                    console.log(data);
                });
            }
        }
    }
]);