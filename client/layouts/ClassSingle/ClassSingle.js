import { ReactiveDict } from 'meteor/reactive-dict';


Template.ClassSingle.onCreated(function() {
    //me inscrevo nas publishs necessarias
    const self = this;
    self.autorun(function() { 
        self.subscribe('classes');
    }); 

    //crio um dicionário reativo para lidar com as tabs e configuro a tab inicial
    this.state = new ReactiveDict();
    this.state.set('currentTab', 'Students');
});

//inicializo e configuro os elementos de UI do Materialize
Template.ClassSingle.onRendered(function() {
    $('.modal').modal();
    $('ul.tabs').tabs();
    $(".tabs>.indicator").css("background-color", 'green');

});


Template.ClassSingle.helpers({ 

    //retorno a tab atual
    tab: ()=> {
        const instance = Template.instance();
        var tab = instance.state.get('currentTab');
        tab = tab.charAt(0).toUpperCase() + tab.slice(1);
        console.log(tab);
        return tab;
    },

    class: ()=>{
        const id = FlowRouter.getParam('id');
        return Classes.findOne({_id: id});
    },
});

Template.ClassSingle.events({ 
    'click .tabs li': function(event, instance) { 
        instance.state.set('currentTab', event.target.id);
    },

    'click #create-report': function (event, instance) {
        const class_id = FlowRouter.getParam('id');

        Meteor.call('tests.report', class_id, function(error, success) { 
            if (error) { 
                console.log('error', error); 
            } 
            if (success) {
                if(Object.keys(success).length === 0){
                    alert('Por favor, realize no minimo dois questionários com a sua classe para que posssamos gerar os relatórios');
                    return;
                }
                 $('#test-chart').modal('open')
                 const ctx = $('#bar-chart')[0].getContext('2d');
                 var bar_chart = new Chart(ctx, {
                     type: 'bar',
                     data: {
                         labels: Object.keys(success[0]),
                         datasets: [{
                             label: 'Quantidade de acertos/Alunos',
                             data: Object.values(success[0]),
                             backgroundColor: [
                                 'rgba(255, 99, 132, 0.2)',
                                 'rgba(54, 162, 235, 0.2)',
                                 'rgba(255, 206, 86, 0.2)',
                                 'rgba(75, 192, 192, 0.2)',
                                 'rgba(153, 102, 255, 0.2)',
                                 'rgba(255, 159, 64, 0.2)'
                             ],
                             borderColor: [
                                 'rgba(255,99,132,1)',
                                 'rgba(54, 162, 235, 1)',
                                 'rgba(255, 206, 86, 1)',
                                 'rgba(75, 192, 192, 1)',
                                 'rgba(153, 102, 255, 1)',
                                 'rgba(255, 159, 64, 1)'
                             ],
                             borderWidth: 1
                         }]
                     },
                     options: {
                         scales: {
                             yAxes: [{
                                 ticks: {
                                     beginAtZero: true,
                                     stepSize: 1
                                 }
                             }]
                         }
                     }
                 });

                 const ctx2 = $('#improvement-chart')[0].getContext('2d');
                 let improvements = ["-100% ou menos", "De -100% até -50%", "De -50% até - 20%", 
                                 "De -20% até -5%", "De -5% até 5%", "De 5% até 20%", "De 20% até 50%", "De 50% até 100%", "Mais de 100%"]
                 var improvement_chart = new Chart(ctx2, {
                     type: 'bar',
                     data: {
                         labels: improvements,
                         datasets: [{
                             label: 'Melhoria em relação ao teste anterior',
                             data: Object.values(success[1]),
                             backgroundColor: [
                                 'rgba(255, 99, 132, 0.2)',
                                 'rgba(54, 162, 235, 0.2)',
                                 'rgba(255, 206, 86, 0.2)',
                                 'rgba(75, 192, 192, 0.2)',
                                 'rgba(153, 102, 255, 0.2)',
                                 'rgba(255, 159, 64, 0.2)',
                                 'rgba(255, 159, 64, 0.2)',
                                 'rgba(255, 159, 64, 0.2)',
                                 'rgba(255, 159, 64, 0.2)',
                                 'rgba(255, 159, 64, 0.2)',
                             ],
                             borderColor: [
                                 'rgba(255,99,132,1)',
                                 'rgba(54, 162, 235, 1)',
                                 'rgba(255, 206, 86, 1)',
                                 'rgba(75, 192, 192, 1)',
                                 'rgba(153, 102, 255, 1)',
                                 'rgba(255, 159, 64, 1)',
                                 'rgba(255, 159, 64, 1)',
                                 'rgba(255, 159, 64, 1)',
                                 'rgba(255, 159, 64, 1)',
                                 'rgba(255, 159, 64, 1)',
                                 'rgba(255, 159, 64, 1)'
                             ],
                             borderWidth: 1
                         }]
                     },
                     options: {
                         scales: {
                             yAxes: [{
                                 ticks: {
                                     beginAtZero: true,
                                     stepSize: 1,
                                 }
                             }]
                         }
                     }
                 });
            } 
        });
    } 
});