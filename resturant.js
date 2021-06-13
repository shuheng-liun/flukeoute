$(document).ready(function(){

  //Handle inputs from the input box on enter
  $("input").on("keypress",function(e){
    e.stopPropagation();
    if(e.keyCode ==  13){
      var value = $(this).val();
      $(".enter-button").removeClass("enterhit");
      $(".enter-button").width($(".enter-button").width());
      $(".enter-button").addClass("enterhit");
      if(value){
        handleInput(value);
      }
      return false;
    }
  })

  //Add tooltips
  $(".table").on("mouseover","*",function(e){
    $(".hovered").removeClass("hovered");
    e.stopPropagation();
    var helper = $(".helper");
    el = $(this);
    var pos = $(this).offset();
    helper.css("top",pos.top - 65);
    helper.css("left",pos.left + ($(this).width()/2));
    el.attr("data-hovered",true);

    var helpertext;

    var elType = el.get(0).tagName;
    elType = elType.toLowerCase();
    helpertext = '<' + elType;

    var elClass = el.attr("class");
    if(elClass) {
      helpertext = helpertext + ' class="' + el.attr("class") + '"';
    }

    var id = el.attr("id");
    if(id) {
      helpertext = helpertext + ' id="' + id + '"';
    }

    helpertext = helpertext + '> </' + elType + '>';
    helper.show();
    helper.text(helpertext);

  });

  $(".table").on("mouseout","*",function(e){
    $("[data-hovered]").removeAttr("data-hovered");
    $(".helper").hide();
    e.stopPropagation();
  });

  loadLevel();

});

var level;
var currentLevel = parseInt(localStorage.currentLevel) || 0;

var levelTimeout = 1000;


//Parses text from the input field
function handleInput(text){


  if(parseInt(text) > 0 && parseInt(text) < levels.length+1) {
    currentLevel = parseInt(text) -1;
    loadLevel();
    return;
  }

  if(text == "help") {
    showHelp();
  } else {
    fireRule(text);
  }
}

//Shows help
function showHelp() {
  $(".display-help").css("opacity", "1");
  var helpTitle = level.helpTitle || "";
  var help = level.help || "";
  var selector = level.selector || "";
  $(".display-help .title").html(helpTitle);
  $(".display-help .hint").html(help);
  $(".display-help .selector").text(selector);
}

function resetTable(){
  $(".clean,.strobe").removeClass("clean,strobe");

  $(".table *").each(function(){
    $(this).width($(this).width());
    $(this).css("width","");
  });
  $(".table-edge").width($(".table").outerWidth() + 10);
}

function fireRule(rule) {

  $(".shake,.strobe").removeClass("shake").removeClass("strobe");

  $(".strobe,.clean,.shake").each(function(){
    $(this).width($(this).width());
  })

  var ruleSelected = $(".table " + rule);
  var levelSelected = $(".table " + level.selector);

  var win = false;

  if(ruleSelected.length == levelSelected.length && ruleSelected.length > 0){
    win = checkResults(ruleSelected,levelSelected);
  }

  $(".result").show();

  if(win){
    ruleSelected.addClass("clean");
    $(".result").text("Good job!");
    $("input").val("");
    $(".input-wrapper").css("opacity",.2);

    // $(".display-help").hide();
    window.setTimeout(function(){
      currentLevel++;
      loadLevel();
    },levelTimeout);
  } else {

    continueRule();
    ruleSelected.addClass("shake");
    window.setTimeout(function(){
      $(".shake").removeClass("shake");
    },500);

    $(".result").text("Wrong! Try again :D");
    $(".result").fadeOut();

  }

}

function checkResults(ruleSelected,levelSelected){
  for(var i = 0; i < ruleSelected.length; i++) {
    if(ruleSelected[i] == levelSelected[i]){
    } else {
      return false;
    }
  }
  return true;
}

var d = 2;
function continueRule() {
  console.log(new Array(d++).join(decodeURIComponent('3%3D%3D%3DD ')));
}


function loadBoard(){

  var boardString = level.board;
  boardMarkup = "";
  for(var i = 0;i < boardString.length;i++){
    var c = boardString.charAt(i);
    if(c == "A") { boardMarkup = boardMarkup + '<apple/>'}
    if(c == "O") { boardMarkup = boardMarkup + '<orange/>'}
    if(c == "P") { boardMarkup = boardMarkup + '<pickle/>'}
    if(c == "a") { boardMarkup = boardMarkup + '<apple class="small" />'}
    if(c == "o") { boardMarkup = boardMarkup + '<orange class="small" />'}
    if(c == "p") { boardMarkup = boardMarkup + '<pickle class="small" />'}

    if(c == "{") { boardMarkup = boardMarkup + '<plate id="fancy">'}
    if(c == "(") { boardMarkup = boardMarkup + '<plate>'}
    if(c == ")") { boardMarkup = boardMarkup + '</plate>'}
    if(c == "[") { boardMarkup = boardMarkup + '<bento>'}
    if(c == "]") { boardMarkup = boardMarkup + '</bento>'}
  }
  $(".table").html(boardMarkup);
}


//Loads up a level
function loadLevel(){



  level = levels[currentLevel];
  localStorage.setItem("currentLevel",currentLevel);

  loadBoard();
  resetTable();


  $(".level-header").text("Level " + (currentLevel+1) + "/" + levels.length);
  $(".order").text(level.doThis);
  $("input").val("").focus();

  $(".display-help").css("opacity",0);



  $(".input-wrapper").css("opacity",1);
  $(".result").text("");


  //Strobe what's supposed to be selected
  $(".table " + level.selector).addClass("strobe");
  window.setTimeout(function(){
    // $(".strobe").removeClass("strobe");
  },1000);

}
