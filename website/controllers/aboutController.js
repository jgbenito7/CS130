rescueApp.controller('aboutCtrl', function($scope,$http) {
  $(".about").addClass("active");
  var names = {
    joey:"Joey Gomez-Benito",
    chloe:"Chloe Drazen",
    jake:"Jake Moghtader",
    christian:"Christian Youngers",
    david:"David Scheibe"
  }

  var bios = {
    joey:"Joey enjoys long walks on the beach, snuggling with seals, and frolicking through the sand.",
    chloe:"Chloe once thought that she wanted to be a dolphin, so she attached a cardboard fin to her back and jumped in the ocean. Three minutes later she decided that the dolphin life is difficult, and returned to her normal human life.",
    jake:"Jake owns three pet seals. He calls them his 'Sea Dogs' and walks them several times a day.",
    christian:"Christian is currently training for the 32nd national Seal Races. People often mistake this event as a race in which people train seals, but in reality it is a race in which people dress up like seals and try to swim a mile with their hands duct taped to their torso.",
    david:"David believed he had gills and was a fish. RIP David."
  }

  $(document).ready(function(){
    $(".about-image").click(function(){
      $(".about-image").removeClass("active");
      $(this).addClass("active")

      var person = $(this).children()[0].innerHTML;
      var name = names[person];
      var bio = bios[person];

      $(".bio-panel").slideDown();
      $(".bio-text-name").html(name);
      $(".bio-text").html(bio);

    });
  });
});
