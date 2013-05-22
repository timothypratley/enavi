angular.module("enavi", ["ngGrid"]);

var zoneEntities = [{Name: "All"}];

var moveEntities = [{ContainerNo: "TIMP1234567",
                     CurrentLocation: {Type: "Yard", Block: "A", Row: "01", Stack: "01", Tier: "01"},
                     PlannedLocation: {Type: "Rail", Railcar: "RTNA01", Bay: "02", Well: "01"},
                     size: 100},
                    {ContainerNo: "TRLU1234123",
                     CurrentLocation: {Type: "Yard", Block: "B", Row: "02", Stack: "01", Tier: "01"},
                     PlannedLocation: {Type: "Rail", Railcar: "RTNA01", Bay: "02", Well: "01"},
                     size: 200},
                    {ContainerNo: "TRLU1111111",
                     CurrentLocation: {Type: "Yard", Block: "B", Row: "02", Stack: "01", Tier: "02"},
                     PlannedLocation: {Type: "Rail", Railcar: "RTNA01", Bay: "02", Well: "01"},
                     size: 200},
                    {ContainerNo: "TRLU2222222",
                     CurrentLocation: {Type: "Yard", Block: "B", Row: "02", Stack: "01", Tier: "03"},
                     PlannedLocation: {Type: "Rail", Railcar: "RTNA01", Bay: "02", Well: "01"},
                     size: 200},
                    {ContainerNo: "KBHU1234123",
                     CurrentLocation: {Type: "Yard", Block: "C", Row: "03", Stack: "01", Tier: "01"},
                     PlannedLocation: {Type: "Rail", Railcar: "RTNA01", Bay: "02", Well: "01"},
                     size: 1000}];

var segmentEntities = [{ContainerNo: "TIMP1234567",
                        FromLocation: {},
                        ToLocation: {},
                        Name: "C",
                        Chassis: "UNKNOWN"},
                       {ContainerNo: "TIMP1234567",
                        FromLocation: {},
                        ToLocation: {},
                        Name: "U"},
                       {ContainerNo: "TIMP1234567",
                        FromLocation: {},
                        ToLocation: {},
                        Name: "Y"}];

var equipmentEntities = [{EquipmentNo: "RTG1"},
                         {EquipmentNo: "RTG2"},
                         {EquipmentNo: "UTR1"},
                         {EquipmentNo: "UTR2"}];

var hitchedRelations = {UTR1: "KBHU1234123"};

var liftedRelations = {RTG2: "TRLU1234123"};

var children = function(entity) {
  return moveEntities;
};

var parent = function(entity) {
  return entity;
};

var childType = function (entity) {
  return "Move";
};

var getRelated = {
  Move: function(move) {
    move.related = {MoveSegments: ["C", "U", "Y"]};
  },
  Equipment: function(equipment) {
    equipment.related = {MoveSegments: segmentEntities};
  }
};

function EnaviCtrl($scope) {
  $scope.commands = [];
  $scope.selected = [];
  $scope.entities = [];
  $scope.grid = {data: "entities",
                 selectedItems: $scope.selected,
                 keepLastSelected: true,
                 showGroupPanel: true,
                 showFilter: true,
                 //showColumnMenu: true,
                 //jqueryUIDraggable: true
                };

  $scope.focus = function(focal) {
    $scope.focal = focal;
    $scope.selected.length = 0;  // TODO: this doesn't unselect though
    $scope.entities = children(focal);
  }
  $scope.focus(zoneEntities[0]);

  $scope.$watch('selected', function(newArray, oldArray) {
    var added = newArray.filter(function(item) { return oldArray.indexOf(item) === -1; });
    angular.forEach(added, getRelated[childType($scope.focal)]);
    $scope.commands = added.length > 0 ? ["hold"] : [];
  }, true);

  $scope.up = function() {
    $scope.focus(parent($scope.focal));
  };
}
