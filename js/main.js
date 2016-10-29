(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const STREAM_NAME = 'keryja';
const TWITCH_CLIENT_ID = '21s2ji9ilhk9hq1o5a7sg954ktak250';

const streamWrapper = document.getElementById('stream');
const streamVideo = document.getElementById('stream-video');
const streamChat = document.getElementById('stream-chat');
let resizeTimeout = null;

const navItems = document.querySelectorAll('#navbar-main > ul > li');

function updateStreamHeight() {
  const windowWidth = window.innerWidth;
  let width = document.querySelector('body > .container').offsetWidth;

  // 992 = Bootstrap Medium Width Pixels
  if (windowWidth > 992) {
    width = width / 12 * 8;
  }

  // Ratio is 16:9
  streamWrapper.style.height = Math.round(width / 16 * 9) + 'px';
}

function onApiResponse() {
  const channelInfo = JSON.parse(this.responseText);

  if (!channelInfo['stream']) {
    // Stream is offline, do nothing
    return;
  }

  renderStreamHtml();
  updateStreamHeight();

  window.addEventListener('resize', onWindowResize, true);
}

function onWindowResize() {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(updateStreamHeight, 100);
}

function renderStreamHtml() {
  streamVideo.innerHTML = `
    <iframe
    src='http://player.twitch.tv/?channel=` + STREAM_NAME + `&autoplay=false'
    frameborder='0'
    scrolling='no'
    allowfullscreen='true'>
    </iframe>
  `;

  streamChat.innerHTML = `
    <iframe frameborder='0'
    scrolling='no'
    id='chat_embed'
    src='http://www.twitch.tv/` + STREAM_NAME + `/chat'
    height='{HEIGHT}'
    width='{WIDTH}'>
    </iframe>
  `;
}

function onToggleClick(evt) {
  const curNode = this.parentNode;
  navItems.forEach(node => node !== curNode && node.classList.remove('open'));
  curNode.classList.toggle('open');

  evt.preventDefault();
}

function main() {
  const checkStreamReq = new XMLHttpRequest();
  checkStreamReq.addEventListener('load', onApiResponse);
  checkStreamReq.open('GET', 'https://api.twitch.tv/kraken/streams/' + STREAM_NAME);
  checkStreamReq.setRequestHeader('Client-ID', TWITCH_CLIENT_ID);
  checkStreamReq.send();

  const toggles = document.querySelectorAll('.dropdown-toggle');
  for (let i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener('click', onToggleClick);
  }

  const hardwarePhoto = document.querySelector('.hardware-photo');
  if (hardwarePhoto) {
    hardwarePhoto.addEventListener('click', function () {
      hardwarePhoto.classList.toggle('show-overlay');
    });
  }
}

main();

},{}]},{},[1]);
