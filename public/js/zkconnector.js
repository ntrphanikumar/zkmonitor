var zk = {
    loadServices: function(environment) {
        $('#environments-ul li').removeClass('active');
        $('#environments-ul li#env-'+environment).addClass('active');
        $.getJSON("/services?env="+environment, _.bind(function(services) {
            _.each(services, _.bind(function(service) {
                var serviceEle = $('<a href="javascript:void(0);" class="list-group-item">'+service+'</a>');
                serviceEle.click(_.bind(function(event) {
                    $('.service-names .list-group-item').removeClass('active');
                    serviceEle.addClass('active');
                    this.loadServiceInstances(environment, service);
                }, this));
                $('.service-names').append(serviceEle);
            }, this));
        }, this));
    },
    
    loadServiceInstances: function(environment, service) {
        $('#environments-ul li#env-'+environment).addClass('active');
        $('.service-data').empty();
        $.getJSON("/instances?env="+environment+"&service="+service, _.bind(function(instances) {
            _.each(instances, function(instance) {
                if(instance=="") return;
                var instanceEle = $("#instanceTemplate").tmpl(instance);
                instanceEle.appendTo('.service-data');
                instanceEle.find(".panel-heading").click(function() {
                    instanceEle.find(".collapse").collapse('toggle');
                });
                instanceEle.find(".collapse").on('show.bs.collapse', function(){
                    $.getJSON("/instance?env="+environment+"&service="+service+"&instance="+instance, function(data) {
                        var props = $('<ul></ul>');
                        _.each(_.keys(data), function(key) {
                            props.append('<li>'+key+":"+data[key]+"</li>");
                        });
                        instanceEle.find('.panel-body').append(props);
                    })
                });
            })
        }, this));
    }
}
