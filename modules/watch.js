module.exports = function(zkhost) {
    return {
        services: function(path, callback) {
            var zkclient = require('node-zookeeper-client').createClient(zkhost);
            zkclient.once('connected', function () {
                zkclient.getChildren(path, null,
                        function (error, children, stat) {
                            if (error) {
                                console.log('Failed to list children of %s due to: %s.', path, error);
                                return;
                            }
                            callback(children);
                        }
                    );
            });
            zkclient.connect();
        },
        
        getData: function(path, callback) {
            var zkclient = require('node-zookeeper-client').createClient(zkhost);
            zkclient.once('connected', function () {
                zkclient.getData(path, null,
                        function (error, data, stat) {
                            if (error) {
                                console.log('Failed to get data of %s due to: %s.', path, error);
                                return;
                            }
                            callback(data);
                        }
                    );
            });
            zkclient.connect();
        }
    };
}