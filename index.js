/*eslint strict:0, no-var:0, vars-on-top:0*/
/*global moment:false, Sortable:false*/
/*exported parseData*/
'use strict'

function parseData(res) {
  var data = res.feed.entry.map(function(row) {
    
    var startDate = moment(row.gsx$eventstartdate.$t, "M/D/YYYY", true)
    if(!startDate.isValid()) {
      startDate = row.gsx$eventstartdate.$t
    }
    var endDate = moment(row.gsx$eventenddate.$t, "M/D/YYYY", true)
    if(!endDate.isValid()) {
      endDate = row.gsx$eventenddate.$t
    }
    var submissionDeadline = moment(row.gsx$submissiondeadline.$t, "M/D/YYYY", true)
    if(!submissionDeadline.isValid()) {
      submissionDeadline = row.gsx$submissiondeadline.$t
    }
    return {
      name: row.gsx$name.$t,
      startDate: startDate,
      endDate: endDate,
      website: row.gsx$website.$t,
      location: row.gsx$location.$t,
      notes: row.gsx$notes.$t,
      submissionDeadline: submissionDeadline,
      whereToSubmit: row.gsx$wheretosubmit.$t
    }
  })
  
  document.querySelector("#updated").textContent = moment(res.feed.updated.$t).fromNow()
  
  var entry = document.querySelector('.entry')
  var upcomingTable = document.querySelector('#upcoming-entries')
  var pastTable = document.querySelector('#past-entries')
  
  data.forEach(function(row) {
    var newEntry = entry.cloneNode(true)
    
    var nameCell = newEntry.querySelector('.name a')
    nameCell.textContent = row.name
    nameCell.setAttribute('href', row.website)
    
    var submissionCell = newEntry.querySelector('.submission a')
    if(moment.isMoment(row.submissionDeadline)) {
      submissionCell.textContent = row.submissionDeadline.fromNow()
      submissionCell.setAttribute('title', row.submissionDeadline.format('dddd, MMMM Do, YYYY'))
      submissionCell.parentElement.setAttribute('data-value', row.submissionDeadline.unix())
    }
    else {
      submissionCell.textContent = row.submissionDeadline
    }
    
    if(row.whereToSubmit.length > 0 && row.whereToSubmit !== 'TBD' && row.whereToSubmit !== 'TBA') {
      //Prepend "mailto:" to email addresses if it's not already there
      if(row.whereToSubmit.indexOf('@') !== -1 && row.whereToSubmit.substr(0, 'mailto:'.length) !== 'mailto:') {
        row.whereToSubmit = 'mailto:' + row.whereToSubmit
      }
      submissionCell.setAttribute('href', row.whereToSubmit)
    }
    
    var dateCell = newEntry.querySelector('.date')
    if(moment.isMoment(row.startDate)) {
      var dateText
      if(!moment.isMoment(row.endDate)) {
        dateText = row.startDate.format('MMMM D, YYYY')
      }
      else {
        dateText = row.startDate.format('MMMM D') + ' — ' + row.endDate.format('D, YYYY')
      }
      dateCell.textContent = dateText
      dateCell.setAttribute('title', row.startDate.fromNow())
      dateCell.setAttribute('data-value', row.startDate.unix())
    }
    else {
      dateCell.textContent = row.startDate
    }
    
    var locationCell = newEntry.querySelector('.location')
    locationCell.textContent = row.location
    locationCell.setAttribute('data-value', row.location.split(',').map(function(s) { return s.trim() }).reverse().join(','))
    newEntry.querySelector('.notes').textContent = row.notes
    
    if(moment.isMoment(row.startDate) && row.startDate.isBefore()) {
      submissionCell.parentElement.remove()
      pastTable.appendChild(newEntry)
    }
    else {
      upcomingTable.appendChild(newEntry)
    }
  })
  
  entry.remove()
  
  Sortable.init()
  
  var initSort = document.querySelectorAll('th[data-default-sort]')
  if(initSort.length > 0) {
    [].forEach.call(initSort, function(i) { i.click() })
  }
}
