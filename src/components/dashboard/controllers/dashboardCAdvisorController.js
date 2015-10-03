angular.module('k8s.components.dashboard.controllers').controller('DashboardCAdvisorController', function($scope, k8sApi, cAdvisorService, $q, $interval, k8sApiNodes, k8sClusterNamespaceInfo) {
  $scope.k8sApi = k8sApi;

  $scope.activeNodeDataById = {};
  $scope.maxDataByById = {};

  var cluster = k8sClusterNamespaceInfo.getSelectedCluster();

  $scope.getData = function() {
    $scope.loading = true;

    k8sApiNodes(cluster.uid).getList().then(function(nodes) {
      $scope.nodes = nodes;
      var nodesByName = _.indexBy(nodes, function(n) {
        return n.metadata.name;
      });

      var promises = {};
      _.forEach(nodes, function(node) {
        promises[node.metadata.name] = cAdvisorService.getDataForMinion(node.metadata.name, (node.status.conditions[0].status === 'True'));
      })
      
      return $q.all(promises).then(function(promiseData) {
        _.forEach(promiseData, function(data, nodeName) {
          var node = nodesByName[nodeName];
          var maxData = maxMemCpuInfo(nodeName, data.memoryData, data.cpuData, data.filesystemData);

          if(node.status.addresses) {
            hostname = node.status.addresses[0].address;
          }

          $scope.activeNodeDataById[node.metadata.name] = transformMemCpuInfo(data.memoryData, data.cpuData, data.filesystemData, maxData, hostname);
        });

      });
    }).finally(function() {
      $scope.loading = false;
    });
  };

  // d3
  function getColorForIndex(i, percentage) {
    // var colors = ['red', 'blue', 'yellow', 'pink', 'purple', 'green', 'orange'];
    // return colors[i];
    var c = "color-" + (i + 1);
    if (percentage && percentage >= 90)
      c = c + ' color-critical';
    else if (percentage && percentage >= 80)
      c = c + ' color-warning';

    return c;
  }

  function getMaxColorForIndex(i, percentage) {
    // var colors = ['red', 'blue', 'yellow', 'pink', 'purple', 'green', 'orange'];
    // return colors[i];
    var c = "color-max-" + (i + 1);
    if (percentage && percentage >= 90)
      c = c + ' color-max-critical';
    else if (percentage && percentage >= 80)
      c = c + ' color-max-warning';

    return c;
  }

  function maxMemCpuInfo(mId, mem, cpu, fsDataArray) {
    $scope.maxDataByById[mId] = $scope.maxDataByById[mId] || {};

    var currentMem = mem.current;
    var currentCpu = cpu;

    var items = [];

    if ($scope.maxDataByById[mId]['cpu'] === undefined ||
        $scope.maxDataByById[mId]['cpu'] < currentCpu.cpuPercentUsage) {
      // console.log("New max cpu " + mId, $scope.maxDataByById[mId].cpu, currentCpu.cpuPercentUsage);
      $scope.maxDataByById[mId]['cpu'] = currentCpu.cpuPercentUsage;
    }
    items.push({
      maxValue: $scope.maxDataByById[mId]['cpu'],
      maxTickClassNames: getColorForIndex(0, $scope.maxDataByById[mId]['cpu']),
      maxClassNames: getMaxColorForIndex(0, $scope.maxDataByById[mId]['cpu'])
    });

    var memPercentage = Math.floor((currentMem.memoryUsage * 100.0) / currentMem.memoryLimit);
    if ($scope.maxDataByById[mId]['mem'] === undefined || $scope.maxDataByById[mId]['mem'] < memPercentage)
      $scope.maxDataByById[mId]['mem'] = memPercentage;
    items.push({
      maxValue: $scope.maxDataByById[mId]['mem'],
      maxTickClassNames: getColorForIndex(1, $scope.maxDataByById[mId]['mem']),
      maxClassNames: getMaxColorForIndex(1, $scope.maxDataByById[mId]['mem'])
    });

    for (var i = 0; i < fsDataArray.length; i++) {
      var f = fsDataArray[i];
      var fid = 'FS #' + f.filesystemNumber;
      if ($scope.maxDataByById[mId][fid] === undefined || $scope.maxDataByById[mId][fid] < f.totalUsage)
        $scope.maxDataByById[mId][fid] = f.totalUsage;
      items.push({
        maxValue: $scope.maxDataByById[mId][fid],
        maxTickClassNames: getColorForIndex(2 + i, $scope.maxDataByById[mId][fid]),
        maxClassNames: getMaxColorForIndex(2 + i, $scope.maxDataByById[mId][fid])
      });
    }
    return items;
  }

  function transformMemCpuInfo(mem, cpu, fsDataArray, maxData, hostName) {
    var currentMem = mem.current;
    var currentCpu = cpu;

    var items = [];

    items.push({
      label: 'CPU',
      stats: currentCpu.cpuPercentUsage + '%',
      value: currentCpu.cpuPercentUsage,
      classNames: getColorForIndex(0, currentCpu.cpuPercentUsage),
      maxData: maxData[0],
      hostName: hostName
    });

    var memPercentage = Math.floor((currentMem.memoryUsage * 100.0) / currentMem.memoryLimit);
    items.push({
      label: 'Memory',
      stats: currentMem.memoryUsageDescription + ' / ' + currentMem.memoryLimitDescription,
      value: memPercentage,
      classNames: getColorForIndex(1, memPercentage),
      maxData: maxData[1],
      hostName: hostName
    });

    for (var i = 0; i < fsDataArray.length; i++) {
      var f = fsDataArray[i];

      items.push({
        label: 'Filesystem #' + f.filesystemNumber,
        stats: f.usageDescription + ' / ' + f.capacityDescription,
        value: f.totalUsage,
        classNames: getColorForIndex(2 + i, f.totalUsage),
        maxData: maxData[2 + i],
        hostName: hostName

      });
    }

    var a = [];
    var segments = {
      segments: items
    };
    a.push(segments);
    return a;
  };

  // end d3
  var promise = $interval($scope.getData, 3000);

  // Cancel interval on page changes
  $scope.$on('$destroy', function() {
    if (angular.isDefined(promise)) {
      $interval.cancel(promise);
      promise = undefined;
    }
  });

  $scope.getData();
});