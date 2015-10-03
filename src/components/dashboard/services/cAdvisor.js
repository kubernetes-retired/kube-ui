angular.module('k8s.components.dashboard.services').service('cAdvisorService', function($http, $q, k8sApi, k8sClusterNamespaceInfo) {
  var _baseUrl = function(minionIp) {
    // TODO: support other cAdvisor port other than default 4194
    // TODO: support other cAdvisor adress
    return '/api/clusters/' + k8sClusterNamespaceInfo.getSelectedCluster().uid + '/proxy/api/v1/proxy/nodes/' + minionIp + ':4194/api/v1.0/';
  };

  this.getMachineInfo = getMachineInfo;

  function getMachineInfo(minionIp) {
    return $http.get(_baseUrl(minionIp) + 'machine').then(function(response) {
      return response.data;
    });
  }

  // containerId optional
  this.getContainerInfo = function getContainerInfo(minionIp, containerId) {
    var fullUrl = _baseUrl(minionIp) + 'containers' + (containerId ? '/' + containerId : '');
    var request = {
      num_stats: 10,
      num_samples: 0
    };
    return $http.post(fullUrl, request).then(function(response) {
      return response.data;
    });
  }

  this.getDataForMinion = function(minionIp, isAvailable) {
    if(isAvailable) {
      var machineData = this.getMachineInfo(minionIp);
      var containerData = this.getContainerInfo(minionIp);
      return $q.all({
        machineData: machineData,
        containerData: containerData
      }).then(function(data) {
        var memoryData = parseMemory(data.machineData, data.containerData);
        var cpuData = parseCpu(data.machineData, data.containerData);
        var fsData = parseFilesystems(data.machineData, data.containerData);
        return {
          memoryData: memoryData,
          cpuData: cpuData,
          filesystemData: fsData,
          machineData: data.machineData,
          containerData: data.containerData
        };
      });
    }
    return $q.resolve({
      memoryData: {
        current: {
            memoryUsage: '',
            memoryLimit: ''
        },
        historical: {}
      },
      cpuData: { cpuPercentUsage: 0 },
      filesystemData: [],
      machineData: {},
      containerData: {}
    });
  };

  // Utils to process cadvisor data
  function humanize(num, size, units) {
    var unit;
    for (unit = units.pop(); units.length && num >= size; unit = units.pop()) {
      num /= size;
    }
    return [num, unit];
  }

  // Following the IEC naming convention
  function humanizeIEC(num) {
    var ret = humanize(num, 1024, ["TiB", "GiB", "MiB", "KiB", "Bytes"]);
    return ret[0].toFixed(2) + " " + ret[1];
  }

  // Following the Metric naming convention
  function humanizeMetric(num) {
    var ret = humanize(num, 1000, ["TB", "GB", "MB", "KB", "Bytes"]);
    return ret[0].toFixed(2) + " " + ret[1];
  }

  function hasResource(stats, resource) { return stats.stats.length > 0 && stats.stats[0][resource]; }

  // Gets the length of the interval in nanoseconds.
  function getInterval(current, previous) {
    var cur = new Date(current);
    var prev = new Date(previous);

    // ms -> ns.
    return (cur.getTime() - prev.getTime()) * 1000000;
  }

  function parseCpu(machineInfo, containerInfo) {
    var cur = containerInfo.stats[containerInfo.stats.length - 1];
    var results = [];

    var cpuUsage = 0;
    if (containerInfo.spec.has_cpu && containerInfo.stats.length >= 2) {
      var prev = containerInfo.stats[containerInfo.stats.length - 2];
      var rawUsage = cur.cpu.usage.total - prev.cpu.usage.total;
      var intervalInNs = getInterval(cur.timestamp, prev.timestamp);

      // Convert to millicores and take the percentage
      cpuUsage = Math.round(((rawUsage / intervalInNs) / machineInfo.num_cores) * 100);
      if (cpuUsage > 100) {
        cpuUsage = 100;
      }
    }

    return {
      cpuPercentUsage: cpuUsage
    };
  }

  function parseFilesystems(machineInfo, containerInfo) {
    var cur = containerInfo.stats[containerInfo.stats.length - 1];
    if (!cur.filesystem) {
      return;
    }

    var filesystemData = [];
    for (var i = 0; i < cur.filesystem.length; i++) {
      var data = cur.filesystem[i];
      var totalUsage = Math.floor((data.usage * 100.0) / data.capacity);

      var f = {
        device: data.device,
        filesystemNumber: i + 1,
        usage: data.usage,
        usageDescription: humanizeMetric(data.usage),
        capacity: data.capacity,
        capacityDescription: humanizeMetric(data.capacity),
        totalUsage: Math.floor((data.usage * 100.0) / data.capacity)
      };

      filesystemData.push(f);
    }
    return filesystemData;
  }

  var oneMegabyte = 1024 * 1024;
  var oneGigabyte = 1024 * oneMegabyte;

  function parseMemory(machineInfo, containerInfo) {
    if (containerInfo.spec.has_memory && !hasResource(containerInfo, "memory")) {
      return;
    }

    // var titles = ["Time", "Total", "Hot"];
    var data = [];
    for (var i = 0; i < containerInfo.stats.length; i++) {
      var cur = containerInfo.stats[i];

      var elements = [];
      elements.push(cur.timestamp);
      elements.push(cur.memory.usage / oneMegabyte);
      elements.push(cur.memory.working_set / oneMegabyte);
      data.push(elements);
    }

    // Get the memory limit, saturate to the machine size.
    var memory_limit = machineInfo.memory_capacity;
    if (containerInfo.spec.memory.limit && (containerInfo.spec.memory.limit < memory_limit)) {
      memory_limit = containerInfo.spec.memory.limit;
    }

    var cur = containerInfo.stats[containerInfo.stats.length - 1];

    var r = {
      current: {
        memoryUsage: cur.memory.usage,
        workingMemoryUsage: cur.memory.working_set,
        memoryLimit: memory_limit,
        memoryUsageDescription: humanizeMetric(cur.memory.usage),
        workingMemoryUsageDescription: humanizeMetric(cur.memory.working_set),
        memoryLimitDescription: humanizeMetric(memory_limit)
      },
      historical: data
    };

    return r;
  }
});