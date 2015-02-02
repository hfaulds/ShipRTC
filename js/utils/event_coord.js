var _ = require('lodash');

module.exports = function() {
  var subjects = Array.prototype.slice.call(arguments);
  var doneSubjects = [];

  function hasSubjectEmitted(subject) {
    return !_.contains(doneSubjects, subject);
  }

  function haveAllSubjectsEmitted() {
    return _.isEqual(doneSubjects, subjects);
  }

  function unsubscribeAll() {
    _.each(subjects, function(subject) {
      subject.off(event);
    });
  }

  function onEvent(subject, callback) {
    if(hasSubjectEmitted(subject)) {
      doneSubjects.push(subject);
      if(haveAllSubjectsEmitted()) {
        callback();
        unsubscribeAll();
      }
    }
  }

  function subscribeAll(subjects, event, callback) {
    _.each(subjects, function(subject) {
      subject.on(event, function() {
        onEvent(subject, callback);
      });
    });
  }

  return {
    onAll: function(event, callback) {
      subscribeAll(subjects, event, callback);
    }
  };
};
