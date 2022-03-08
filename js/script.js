// Cache jQuery DOM pointer object variables
const localStorage_city_code = localStorage.getItem("vaktija-city-code"),
      nav_clock = $("#nav-clock"),
      cities_modal = $("#cities-modal"),
      cities_modal_btn = $("#cities-modal-btn"),
      cities_modal_searchbox = $("#cities-modal-searchbox"),
      info_city_name = $("#info-city-name"),
      info_date = $("#info-date"),
      salat_times = $(".salat-times"),
      salat_relative_times = $(".salat-relative-times"),
      preloader = $(".preloader"),
      salat_tiles = $(".salat-tile"),
      dzuma_title = $("#dzuma-title");

let cities_modal_open = false;

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
   
   // PRIJE i TRENUTNO
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
   // POSLIJE
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

// DOM to update every second
function updateSec(json) {
   // Update variables
   let now = new Date(), nowDay, nowHour, nowMinute, nowSecond, currentSalatIndex, timeDelta = [];
   nowDay = now.getDay();
   nowHour = now.getHours();
   nowMinute = now.getMinutes();
   nowSecond = now.getSeconds();
   currentSalatIndex = currentSalat(now, json.vakat);

   // Current Salat highlighting
   salat_tiles.each(function(i) {
      if(i == (currentSalatIndex-1)) {
         $(this).addClass("current-salat-highlighter");
      }
      else {
         $(this).removeClass("current-salat-highlighter");
      }
   });

   // Update nav clock
   nav_clock.text( (nowHour<10 ? "0"+nowHour : nowHour) + ":" + (nowMinute<10 ? "0"+nowMinute : nowMinute) );

   // Update time deltas
   for(let i = 0; i < 6; i++) {
      let dateObj = new Date(json.godina, json.mjesec, json.dan, parseInt(json.vakat[i].split(":")), parseInt(json.vakat[i].slice(-2)), 0);
      timeDelta[i] = dateObj - now;
   }

   // Update relative times DOM
   salat_relative_times.each(function(i) {
      $(this).text(setRelativeTime(timeDelta[i], currentSalatIndex, i));
   });

   // Checkers
   if(nowHour === 0 && nowMinute === 0 && nowSecond === 1) { location.reload(); }
   else if(nowDay === 5) { dzuma_title.text("Džuma"); }
}

// Get API data trough jQuery getJSON
function getAPI(city_code) {
   preloader.show();

   localStorage.setItem('vaktija-city-code', city_code);

   cities_modal.css("transform", "translateX(-100%)");
   cities_modal_searchbox.val('');
   cities_modal_searchbox.trigger("keyup");
   cities_modal_open = false;
   
   let URLTime = new Date();
   let URLTimeYear = URLTime.getFullYear();
   let URLTimeMonth = URLTime.getMonth();
   let URLTimeDay = URLTime.getDate();

   let url = "https://api.vaktija.ba/vaktija/v1/" + city_code + "/" + URLTimeYear + "/" + (URLTimeMonth + 1) + "/" + URLTimeDay;
   
   $.getJSON(url, function(data) {
      preloader.hide();

      salat_times.each(function(i) {
         $(this).text(data.vakat[i].length==4 ? "0"+data.vakat[i] : data.vakat[i]);
      });
      info_city_name.text(data.lokacija);
      info_date.text(data.datum[1] + " - " + data.datum[0]);
      document.title = "Vaktija | " + data.lokacija;

      updateSec(data);
      setInterval(() => {
         updateSec(data);
      }, 1000);
   });
}

// On document loaded
$(document).ready(function () {

   alert("BA: Stranica nije potpuno zavrsena te ima nekoliko bugova!\nEN: This page is not completely finished and has some bugs!");

   // Call API based on info from localStorage
   switch(localStorage_city_code) {
      case null:
         getAPI(77);
         break;
      default:
         getAPI(localStorage_city_code);
         break;
   }
   
   // Cities modal event listener
   cities_modal_btn.click(function() { 
      if(!cities_modal_open) {
         cities_modal_open = true;
         cities_modal.css("transform", "translateX(0)");
         cities_modal_searchbox.select();
      }
      else {
         cities_modal.css("transform", "translateX(-100%)");
         cities_modal_searchbox.val('');
         cities_modal_searchbox.trigger("keyup");
         cities_modal_open = false;
      }
   });

   // Cities modal close on Escape button click event listener
   $(document).keydown(function(e) {
      if (e.key === "Escape" && cities_modal_open) {
         cities_modal.css("transform", "translateX(-100%)");
         cities_modal_searchbox.val('');
         cities_modal_searchbox.trigger("keyup");
         cities_modal_open = false;
      }
   });

   // Cities modal search jQuery filter 
   cities_modal_searchbox.on("keyup", function() {
      let cities_searchbox_value = $(this).val().toLowerCase();
      cities_modal.children("p").filter(function() {
         $(this).toggle($(this).text().toLowerCase().indexOf(cities_searchbox_value) > -1);
      });
   });

});