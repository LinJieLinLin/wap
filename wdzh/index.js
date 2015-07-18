/**
 * Created by LinLin on 2015/7/16.
 */
var wdzh = angular.module('wdzh', []);
wdzh.controller('wdzhCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.back = function () {
        location.href = "../home/index.html";
    }
}]);

