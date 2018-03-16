var recognizing;
      var recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interim = true;
      reset();
      recognition.onend = reset;

      recognition.onresult = function (event) {
        var final = "";
        var interim = "";
        for (var i = 0; i < event.results.length; ++i) {
          if (event.results[i].final) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        m.value = final;
        m.value = interim;
      }

      function reset() {
        recognizing = false;
      }

      function speak() {
        if (recognizing) {
          recognition.stop();
          reset();
        } else {
          if('webkitSpeechRecognition' in window ){
            recognition.start();
            recognizing = true;
            m.value = "";
          }else{
            m.placeholder="Your browser is not supported. If Google Chrome, please upgrade.";
          }
        }
      }
