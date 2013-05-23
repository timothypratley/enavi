angular.module("enavi", ["ngGrid"]);

var zoneEntities = [{Type: "Zone",
                     Name: "All"}];

var moveEntities = [{Type: "Move",
                     ContainerNo: "TIMP1234567",
                     CurrentLocation: {Type: "Yard", Block: "A", Row: "01", Stack: "01", Tier: "01"},
                     PlannedLocation: {Type: "Rail", Railcar: "RENA01", Bay: "02", Well: "01"},
                     size: 100},
                    {Type: "Move",
                     ContainerNo: "TRLU1234123",
                     CurrentLocation: {Type: "Yard", Block: "B", Row: "02", Stack: "01", Tier: "01"},
                     PlannedLocation: {Type: "Rail", Railcar: "RTNB01", Bay: "02", Well: "01"},
                     size: 200},
                    {Type: "Move",
                     ContainerNo: "TRLU1111111",
                     CurrentLocation: {Type: "Yard", Block: "B", Row: "02", Stack: "01", Tier: "02"},
                     PlannedLocation: {Type: "Rail", Railcar: "RTNA01", Bay: "02", Well: "01"},
                     size: 200},
                    {Type: "Move",
                     ContainerNo: "TRLU2222222",
                     CurrentLocation: {Type: "Yard", Block: "B", Row: "02", Stack: "01", Tier: "03"},
                     PlannedLocation: {Type: "Rail", Railcar: "RCNA01", Bay: "02", Well: "02"},
                     size: 200},
                    {Type: "Move",
                     ContainerNo: "KBHU1234123",
                     CurrentLocation: {Type: "Yard", Block: "C", Row: "03", Stack: "01", Tier: "01"},
                     PlannedLocation: {Type: "Rail", Railcar: "RCNA01", Bay: "02", Well: "01"},
                     size: 1000}];

var segmentEntities = [{Type: "Segment",
                        ContainerNo: "TIMP1234567",
                        FromLocation: {},
                        ToLocation: {},
                        Assigned: ["UTR1"],
                        OnUTR: "UTR1",
                        Name: "C",
                        Chassis: "UNKNOWN"},
                       {Type: "Segment",
                        ContainerNo: "TIMP1234567",
                        FromLocation: {},
                        ToLocation: {},
                        Assigned: ["UTR1"],
                        OnEquipment: "UTR1",
                        Name: "U"},
                       {Type: "Segment",
                        ContainerNo: "TIMP1234567",
                        FromLocation: {},
                        ToLocation: {},
                        Assigned: ["RTG2"],
                        Name: "Y"},
                       {Type: "Segment",
                        ContainerNo: "TRLU1234123",
                        FromLocation: {},
                        ToLocation: {},
                        Assigned: ["RTG2"],
                        Name: "Y"}];

var equipmentEntities = [{Type: "Equipment", EquipmentNo: "RTG1"},
                         {Type: "Equipment", EquipmentNo: "RTG2"},
                         {Type: "Equipment", EquipmentNo: "UTR1"},
                         {Type: "Equipment", EquipmentNo: "UTR2"}];

// do we want these?
var hitchedRelations = {UTR1: "KBHU1234123"};
var liftedRelations = {RTG2: "TRLU1234123"};

var children = function(entity) {
  if (entity.Type === "Zone") {
    return moveEntities;
  } else if (entity.Type === "Move") {
    return segmentEntities.filter(function (s) {
      return s.ContainerNo === entity.ContainerNo;
    });
  } else if (entity.Type === "Equipment") {
    return segmentEntities.filter(function(s) {
      return s.Assigned.indexOf(entity.EquipmentNo) !== -1;
    });
  } else if (entity.Type === "Segment") {
    return equipmentEntities.filter(function(e) {
      return entity.Assigned.indexOf(e.EquipmentNo) !== -1;
    });
  }
  return moveEntities;
};

var parent = function(entity) {
  if (isZone(entity)) {
    return zones;
  } else if (isMove(entity)) {
    return zone(entity);
  } else if (isEquipment(entity)) {
    return equipment;
  } else if (isSegment(entity)) {
    return move(entity);
  } else {
    return entity;
  }
};

var getRelated = {
  Move: function(move) {
    move.related = {MoveSegments: ["C", "U", "Y"]};
  },
  Equipment: function(equipment) {
    equipment.related = {MoveSegments: segmentEntities};
  }
};

var getKeys = function(obj) {
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
};

function EnaviCtrl($scope) {
  $scope.commands = [];
  $scope.selected = [];
  $scope.entities = [];
  $scope.columns = [];
  $scope.grid = {data: "entities",
                 selectedItems: $scope.selected,
                 keepLastSelected: true,
                 showGroupPanel: true,
                 showFilter: true,
                 columnDefs: "columns",
                 //showColumnMenu: true,
                 //jqueryUIDraggable: true
                };

  // retrieve related information when entities are selected
  $scope.$watch('selected', function(newArray, oldArray) {
    var added = newArray.filter(function(item) {
      return oldArray.indexOf(item) === -1;
    });
    angular.forEach(added, function(e) {
      e.related = children(e);
    });
    $scope.commands = added.length > 0 ? ["hold"] : [];
  }, true);

  // navigating to new layers
  $scope.focus = function(focal) {
    var fields;
    $scope.focal = focal;
    $scope.selected.length = 0;  // TODO: this doesn't unselect though
    $scope.entities = children(focal);
    fields = getKeys($scope.entities[0]).filter(function(c) {
      return c !== "Type" && c !== "previous" && c !== "related" && c !== "$$hashKey";
    });
    $scope.columns = fields.map(function(f) {
      return {field: f};
    });
  }
  $scope.focus(zoneEntities[0]);

  $scope.down = function(entity) {
    entity.previous = $scope.focal;
    $scope.focus(entity);
  };

  $scope.up = function() {
    if ($scope.focal.previous) {
      $scope.focus($scope.focal.previous);
    }
  };

  $scope.name = function(entity) {
    if (entity.Type === "Move") {
      return entity.ContainerNo;
    } else if (entity.Type === "Segment") {
      return entity.ContainerNo;
    } else if (entity.Type === "Equipment") {
      return entity.EquipmentNo;
    } else if (entity.Type === "Zone") {
      return entity.Name;
    } else {
      return entity;
    }
  }
}
