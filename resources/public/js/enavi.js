angular.module("enavi", ["ngGrid"]);


function EnaviCtrl($scope) {
  $scope.selected = [];
  $scope.entities = [{name: "Arena", size: 100},
                     {name: "RuPsarn", size: 200},
                     {name: "CoraTyl", size: 1000}];
  $scope.grid = {data: "entities",
                 selectedItems: $scope.selected,
                 keepLastSelected: true};
}
