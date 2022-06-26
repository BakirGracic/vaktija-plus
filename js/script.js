// Update city code in local storage
function setCity(code) {
   localStorage.setItem('vaktija-city-code', code);
   location.reload();
}

// Current salat function
function currentSalat(date, intervals) {
   let intv = intervals.map(t=>+t.replace(":",""));
   let i = 0, n = 100 * date.getHours() + date.getMinutes();
   while(n >= intv[i] && i<intv.length) i++;
   if((i % intv.length) == 0) {
      return 6;
   } else {
      return i % intv.length;
   }
}

// Format relative time output
function setRelativeTime(timeDelta, currentSalatIndex, settingSalatIndex) {
   let str = "";
   let h = Math.floor((timeDelta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
   let m = Math.floor((timeDelta % (1000 * 60 * 60)) / (1000 * 60));
   let hB = (23-h);
   let mB = (59-m);

   if(settingSalatIndex <= (currentSalatIndex-1)) {
      if(hB==0 && mB==0) {
         str += "prije par sekundi";
      }
      else if(hB==0) {
         str += `prije ${mB}m`;
      }
      else if(hB>0 && mB==0) {
         str += `prije ${hB}h`;
      }
      else {
         str += `prije ${hB}h i ${mB}m`;
      }
   }
   else if(settingSalatIndex > (currentSalatIndex-1)) {
      if(h==0 && m==0) {
         str += "za par sekundi";
      }
      else if(h==0) {
         str += `za ${m}m`;
      }
      else if(h>0 && m==0) {
         str += `za ${h}h`;
      }
      else {
         str += `za ${h}h i ${m}m`;
      }
   }
   
   return str;
}

// updater and setter function
function update(json) {
   let now = new Date(), 
   nowDay = now.getDay(),
   nowHour = now.getHours(),
   nowMinute = now.getMinutes(),
   nowSecond = now.getSeconds(),
   timeDelta = [],
   currentSalatIndex = currentSalat(now, json.vakat);

   // Current Salat highlighting
   for(let i=0; i<6; i++) {
      if(i == (currentSalatIndex-1)) {
         $(".s"+i).addClass("current-salat");
      }
      else {
         $(".s"+i).removeClass("current-salat");
      }
   }

   // Update time deltas
   for(let i = 0; i < 6; i++) {
      let dateObj = new Date(json.godina, json.mjesec, json.dan, parseInt(json.vakat[i].split(":")), parseInt(json.vakat[i].slice(-2)), 0);
      timeDelta[i] = dateObj - now;
   }

   // Update relative times DOM
   for(let i=0; i<6; i++) {
      $(".s"+i+" .relative-time").text(setRelativeTime(timeDelta[i], currentSalatIndex, i));
   }

   // Checkers
   if(nowHour === 0 && nowMinute === 0 && nowSecond === 1) { location.reload(); }
   else if(nowDay === 5) { dzuma_title.text("Džuma"); }
}

// Get API data
function getAPI() {
   let URLTime = new Date();
   let url = `https://api.vaktija.ba/vaktija/v1/${localStorage.getItem("vaktija-city-code")}/${URLTime.getFullYear()}/${URLTime.getMonth()+1}/${URLTime.getDate()}`;
   $.getJSON(url, function(data) {
      // Update fixed data
      $(".city-and-date .city").text(data.lokacija);
      document.title = "Vaktija • " + data.lokacija;
      $(".city-and-date .date").text(data.datum[1] + " / " + data.datum[0]);
      for (let i = 0; i < 6; i++) {
         $(".salat-tiles .s"+i+" .time").text(data.vakat[i].length==4 ? "0"+data.vakat[i] : data.vakat[i]);
      }
      // Update variable data
      update(data);
      setInterval(() => {
         update(data);
      }, 1000);
      $(".preloader").hide();
   });
}

$(document).ready(function () {
   // If no city set - set to Sarajevo (code 77)
   if(localStorage.getItem("vaktija-city-code") == null) localStorage.setItem('vaktija-city-code', 77);
   
   // Run main function
   getAPI();

   // Select City Modal open/close
   $("#openSelectCityModal").click(function() {
      $(".select-city-modal").css("opacity", "1");
      $(".select-city-modal").css("pointer-events", "auto");
      $(".body-wrap").css("pointer-events", "none");
      $("#selectCityInput").val("");
      $("#selectCityInput").keyup();
      $("#selectCityInput").focus();
   });
   $(".select-city-modal").click(function (e) {
      if($(e.target).is($(".select-city-modal"))) {
         $(".select-city-modal").css("opacity", "0");
         $(".select-city-modal").css("pointer-events", "none");
         $(".body-wrap").css("pointer-events", "auto");
      }
   });

   // Search functionality of cities search bar
   $("#selectCityInput").on("keyup", function() {
      let keyword = $(this).val().toLowerCase();
      $(".cities").children("div").filter(function() {
         $(this).toggle($(this).text().toLowerCase().indexOf(keyword) > -1);
      });
   });
});
