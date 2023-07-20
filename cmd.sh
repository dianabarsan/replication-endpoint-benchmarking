set -e

createUsers() {
  node ./src/create-hierarchy.js log 100,10,10 yes
  node ./src/create-hierarchy.js log2 100,10,10 yes
  node ./src/create-hierarchy.js log3 100,10,10 yes
  node ./src/create-hierarchy.js log4 100,10,10 yes
  node ./src/create-hierarchy.js log5 100,10,10 yes
  node ./src/create-hierarchy.js log6 100,10,10 yes
  node ./src/create-hierarchy.js log7 100,10,10 yes
  node ./src/create-hierarchy.js log8 100,10,10 yes
  node ./src/create-hierarchy.js log9 100,10,10 yes
  node ./src/create-hierarchy.js log10 100,10,10 yes
}

addContacts() {
  node ./src/request-docs.js log

  node ./src/add-contacts.js log2
  node ./src/request-docs.js log2

  node ./src/add-contacts.js log3 100,20
  node ./src/request-docs.js log3

  node ./src/add-contacts.js log4 100,40
  node ./src/request-docs.js log4

  node ./src/add-contacts.js log5 100,50
  node ./src/request-docs.js log5

  node ./src/add-contacts.js log6 100,60
  node ./src/request-docs.js log6

  node ./src/add-contacts.js log7 100,70
  node ./src/request-docs.js log7

  node ./src/add-contacts.js log8 100,80
  node ./src/request-docs.js log8

  node ./src/add-contacts.js log9 100,90
  node ./src/request-docs.js log9
}


addReports() {
  node ./src/add-reports.js log $1
  node ./src/request-docs.js log

  node ./src/add-reports.js log2 $1
  node ./src/request-docs.js log2

  node ./src/add-reports.js log3 $1
  node ./src/request-docs.js log3

  node ./src/add-reports.js log4 $1
  node ./src/request-docs.js log4

  node ./src/add-reports.js log5 $1
  node ./src/request-docs.js log5

  node ./src/add-reports.js log6 $1
  node ./src/request-docs.js log6

  node ./src/add-reports.js log7 $1
  node ./src/request-docs.js log7

  node ./src/add-reports.js log8 $1
  node ./src/request-docs.js log8

  node ./src/add-reports.js log9 $1
  node ./src/request-docs.js log9
}

createUsers
addContacts

addReports
addReports 2000
addReports 3000
addReports 3000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
addReports 5000
