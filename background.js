var callback = function(detail){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    var url = ''
    var tabid = 0;
    var verified = 0;
    var result;
    try{
      result = tabs[0].url;
      if(result != undefined){
        url = tabs[0].url;
        tabid = tabs[0].id;
        console.log("URL: " + tabs[0].url);
        console.log("TABD ID: " + tabs[0].id);
        var flag = '';
        flag = "http://checkurl.phishtank.com/checkurl/index.php?url=" + detail.url;
        console.log("Request send to check the url: " + flag);
        var body = {
          'url': url,
          'format': 'json',
          'app_key': 'c09a4c2ad491326d32736c80c10746ef05425f7c8070f7f876a90e5be53e9c44'
        };
        try{
          xml = new XMLHttpRequest();
          xml.open("POST", flag, true);
          xml.send(body);
          xml.onreadystatechange = function () {
            if (xml.readyState == 4) {
              try{
                output = xml.responseXML;
                console.log(output);
                a = output.getElementsByTagName("results");
                var x = "undefined";
                var y = "undefined";
                var z = "undefined";
                for (i = 0; i < x.length; i++){
                  try{
                    x = a[i].childNodes[1].childNodes[3].childNodes[0].nodeValue; //<in_database>
                  }catch (err){
                    //console.log("x says: " + err.message);
                    verified = -1;
                  }
                  try{
                    y = a[i].childNodes[1].childNodes[9].childNodes[0].nodeValue; //<verified>
                  }catch (err){
                    //console.log("y says: " + err.message);
                    verified = -1;
                  }
                  try{
                    z = a[i].childNodes[1].childNodes[13].childNodes[0].nodeValue; //<valid>
                  }catch (err){
                    //console.log("z says: " + err.message);
                    verified = -1;
                  }
                  //console.log(z);
                    if((y == "true" && z =="true") || (y == "true" && z == "undefined")){
                      console.log("ALERT POTENTIAL DANGROUS WEBSITE!");
                      verified = 1;
                    }else if(x  == "false" || y == "false" || z == "false"){
                      console.log("Your are browsing safly!!");
                      verified = 0;
                    }else{
                        console.log('Unknown identifier');
                        window.stop();
                        verified = -1;
                    }
                }
              }catch (err){
                console.log('Something went wrong!');
                window.stop();
                verified = -1;
              }
            }
            console.log("Verified? " + verified + " (1 = True 'Malicious' or 0 = False 'Safe')");
            if(tabid != 0 && verified == 1){
              chrome.tabs.remove(tabid, function(){
                window.open('warning.html', "_blank");
              });
            }
          };
        }catch(err){
          console.log("MalWebExt says: " + err.message);
        }
      };
    }catch (err){
      alert("MalWebExt says: " + err.message);
    }
  });
}
var filters = {
    urls: ["<all_urls>"],
    types: ["main_frame"],
};

var extraInfoSpec = ["blocking"];

typeof chrome.webRequest.onBeforeRequest.addListener(callback, filters, extraInfoSpec);
