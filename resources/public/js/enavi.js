angular.module("enavi", ["ngGrid"]);


function EnaviCtrl($scope) {
  $scope.selected = [];
  $scope.entities = [{name: "Arena", size: 100},
                     {name: "RuPsarn", size: 200},
                     {name: "CoraTyl", size: 1000, type: "Move", ContainerNo: "CBHU1234567"}];
  $scope.grid = {data: "entities",
                 selectedItems: $scope.selected,
                 keepLastSelected: true};
  $scope.$watch('selected', function(newValue, oldValue) {
    angular.forEach(newValue.filter(function(x) { return oldValue.indexOf(x) === -1; }),
                    function(x) {
                      if (x.type == "Move") {
                        x.MoveSegments = ["C", "U", "Y"];
                      }
                    });
  }, true);
}
