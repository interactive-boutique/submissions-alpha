function parseData(res) {
  var data = res.feed.entry.map(function(row) {
    return {
      name: row.gsx$name.$t,
      date: row.gsx$date.$t,
      website: row.gsx$website.$t,
      location: row.gsx$location.$t,
      notes: row.gsx$notes.$t,
      submissionDeadline: row.gsx$submissiondeadline.$t,
      whereToSubmit: row.gsx$wheretosubmit.$t
    }
  })
  
  document.querySelector("#updated").textContent = moment(res.feed.updated.$t).fromNow()
  
  var entry = document.querySelector('.entry')
  var table = document.querySelector('#entries')
  
  data.forEach(function(row) {
    var newEntry = entry.cloneNode(true)
    
    var name = newEntry.querySelector('.name a')
    name.textContent = row.name
    name.setAttribute('href', row.website)
    
    var submission = newEntry.querySelector('.submission a')
    submission.textContent = row.submissionDeadline
    
    if(row.whereToSubmit.length > 0 && row.whereToSubmit !== 'TBD' && row.whereToSubmit !== 'TBA') {
      //Prepend "mailto:" to email addresses if it's not already there
      if(row.whereToSubmit.indexOf('@') !== -1 && row.whereToSubmit.substr(0, 'mailto:'.length) !== 'mailto:') {
        row.whereToSubmit = 'mailto:' + row.whereToSubmit
      }
      submission.setAttribute('href', row.whereToSubmit)
    }
    
    newEntry.querySelector('.date').textContent = row.date
    newEntry.querySelector('.location').textContent = row.location
    newEntry.querySelector('.notes').textContent = row.notes
        
    table.appendChild(newEntry)
  })
}
