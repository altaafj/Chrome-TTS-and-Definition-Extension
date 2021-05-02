

/**
* Check if command is called
*/
chrome.commands.onCommand.addListener(function(command) {
  switch (command) {
      case 'tts_Function':
          ttsFunc();
          break;
      case 'definition_Check':
          defFunc();
          break;
      default:
          console.log(`Command ${command} not found`);
  }
});



/**
* tts Function Code
*/
function ttsFunc() {
   const query = { active: true, currentWindow: true };
   chrome.tabs.query(query, (tabs) => {
       chrome.tabs.create({ url: tabs[0].url, active: false });
   });
  console.log("Running TTS Function.");
}




/**
* word definition Function Code
*/
function defFunc() {
  
  console.log("Running Definition Function.");
  
  const selectedWord = text;

  fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${selectedWord}?key=87df3d18-6eb6-43d0-a9b0-0215a6894e19`)
  .then(response => response.json())
  .then(defInfo => {
    const dil = defInfo.length;
    let sdl = [];
    for (var i = 0; i < dil; i++) {
      sdl.push(defInfo[i].shortdef.length);
      //console.log(sdl);
    }
    
    var j, k;
    
    console.log(`Definition of ${selectedWord}:`)

    for (j = 0; j < dil; j++) {

      if (defInfo[j].shortdef.length <= 0) {
        break;
      }

      console.log("     Definition #" + (j+1) + " ("+ defInfo[j].fl + ") :");
      
      for (k = 0; k < sdl[j]; k++) {
        console.log("          " + (k+1) + ": " + defInfo[j].shortdef[k]);
      }

    } 

    //console.log(defInfo);

  })
  .catch(error => console.error('Valid Word Not Highlighted.')); 

}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Event recieved in background");
    text = request.txt;
    defFunc();
    chrome.tts.speak(txt);
    sendResponse({success: true});
  }
)