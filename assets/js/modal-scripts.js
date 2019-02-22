"use strict";

$("#most-engaged").click({id: "most-engaged", title: "Most Engaged of Senate"}, doGraph);
$("#least-engaged").click({id: "least-engaged", title: "Least Engaged of Senate"}, doGraph);
$("#most-engaged-house").click({id: "most-engaged-house", title: "Most Engaged of House"}, doGraph);
$("#least-engaged-house").click({id: "least-engaged-house", title: "Least Engaged of House"}, doGraph);
MicroModal.init({
  onClose: modal => undoGraph(),
  openTrigger: 'data-custom-open',
  closeTrigger: 'data-custom-close'
});
// MicroModal.show('modal-1');
