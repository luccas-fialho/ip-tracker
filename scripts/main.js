import { ApiToken } from "./apiToken.js";

const input = document.querySelector(".ip_input");
const submitBtn = document.querySelector(".button_container");
const modalMobile = document.querySelector(".hidden");

const ip_address_field = document.querySelector(".ip_address__number");
const location_field = document.querySelector(".location__name");
const timezone_field = document.querySelector(".timezone__time");
const isp_field = document.querySelector(".isp__name");

let map = L.map("map").setView([51.505, -0.09], 17);

const apiKey = ApiToken;

let url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`;

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

submitBtn.addEventListener("click", () => {
  showModal();
  console.log(isIpNumber(input.value));
});

async function getApiData() {
  const inputValue = input.value || "";

  if(isIpNumber(inputValue) || inputValue == '') {
    url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${inputValue}`;
  } else {
    url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&domain=${inputValue}`;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function showModal() {
  const infos = await getApiData();

  ip_address_field.innerHTML = infos.ip;

  location_field.innerHTML =
    infos.location.city +
    ", " +
    infos.location.region +
    " " +
    infos.location.postalCode;

  timezone_field.innerHTML = "UTC " + infos.location.timezone;

  isp_field.innerHTML = infos.isp;

  modalMobile.classList.remove("hidden");
  modalMobile.classList.add("location_infos");

  let lat = infos.location.lat;
  let long = infos.location.lng;

  map.setView([lat, long], 17);
  let marker = L.marker([lat, long]).addTo(map);
}

function isIpNumber(input) {
  let regex = /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/i;
  return regex.test(input);
}

showModal();
