angular.module('starter.controllers', [])

.controller('menuController', function ($scope) {
  $scope.items = {
    nama: 'thoni'
  };
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller("CameraCtrl", function($scope, $cordovaCamera, $ionicLoading, $cordovaFileTransfer, $ionicPopup) {

    $scope.takePicture = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;

            var url = "http://192.168.99.230:1337/cameraServ/uploadFoto";
            var targetPath = "data:image/jpeg;base64," + imageData;

            document.getElementById('test').value = targetPath;

            var filename = targetPath.split("/").pop();

            var options = {
                fileKey: "gambar",
                fileName: filename,
                chunkedMode: false,
                mimeType: "image/jpg"
            };

            $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
                var alertPopup = $ionicPopup.alert({
                 title: 'success',
                 template: JSON.stringify(result.response)
               });
            }, function(err) {
                // console.log("ERROR: " + JSON.stringify(err));
                var alertPopup = $ionicPopup.alert({
                 title: 'failed',
                 template: JSON.stringify(err)
               });
            }, function (progress) {
                // constant progress updates
                $timeout(function () {
                    document.getElementById('progressBar').value = (progress.loaded / progress.total) * 100;
                })
            });

        }, function(err) {
            // An error occured. Show a message to the user
        });
    };

    $scope.selectPicture = function() { 
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit : true,
        targetWidth: 300,
        targetHeight: 300
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {

          var url = "http://192.168.99.230:1337/cameraServ/uploadFoto";
          //target path may be local or url
          var targetPath = imageData;
          $scope.imgURI  = targetPath;

          document.getElementById('test').value = targetPath;

          var filename = targetPath.split("/").pop();

          var options = {
              fileKey: "gambar",
              fileName: filename,
              chunkedMode: false,
              mimeType: "image/jpg"
          };

          $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
              var alertPopup = $ionicPopup.alert({
               title: 'success',
               template: JSON.stringify(result.response)
             });
          }, function(err) {
              // console.log("ERROR: " + JSON.stringify(err));
              var alertPopup = $ionicPopup.alert({
               title: 'failed',
               template: JSON.stringify(err)
             });
          }, function (progress) {
              // constant progress updates
              $timeout(function () {
                  document.getElementById('progressBar').value = (progress.loaded / progress.total) * 100;
              })
          });

      }, function(err) {
          // error
          console.log(err);
      });
    };

});

