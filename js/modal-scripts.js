"use strict";

$("#most-engaged").click({id: "most-engaged", title: "Most Engaged of Senate", legend: "% of Missed Votes"}, doGraph);
$("#least-engaged").click({id: "least-engaged", title: "Least Engaged of Senate",legend: "% of Missed Votes"}, doGraph);
$("#most-engaged-house").click({id: "most-engaged-house", title: "Most Engaged of House", legend: "% of Missed Votes"}, doGraph);
$("#least-engaged-house").click({id: "least-engaged-house", title: "Least Engaged of House", legend: "% of Missed Votes"}, doGraph);
$("#most-loyal").click({id: "most-loyal", title: "Most Loyal of Senate", legend: "% of Votes With Party"}, doGraph);
$("#least-loyal").click({id: "least-loyal", title: "Least Loyal of Senate", legend: "% of Votes With Party"}, doGraph);
$("#most-loyal-house").click({id: "most-loyal-house", title: "Most Loyal of House", legend: "% of Votes With Party"}, doGraph);
$("#least-loyal-house").click({id: "least-loyal-house", title: "Least Loyal of House", legend: "% of Votes With Party"}, doGraph);


MicroModal.init({
  onClose: modal => undoGraph(),
  openTrigger: 'data-custom-open',
  closeTrigger: 'data-custom-close'
});
// MicroModal.show('modal-1');
