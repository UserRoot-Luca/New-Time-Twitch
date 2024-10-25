// ==UserScript==
// @name         New Time Twitch
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  ###
// @author       UserRoot-Luca
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @run-at       document-end
// ==/UserScript==


(function() {
    const TimeMultiplier = (seconds:number, speed:number):number => {
        return seconds / speed;
    }
    const TimeFormats = (seconds:number, speed:number):string => {
        let s:number = TimeMultiplier(seconds, speed);
        let m:number = Math.floor((s % 3600) / 60);
        let h:number = Math.floor(s / 3600);

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
    };
    const Script = () => {
        document.querySelector<HTMLParagraphElement>("[data-a-target='player-seekbar-current-time']")!.addEventListener("DOMSubtreeModified", () => {
            let video = document.querySelector<HTMLVideoElement>("video");
            if (video != null) {
                let playbackSpeed = video.playbackRate;
                let duration = video.duration;
                let currentSeconds = video.currentTime;
                let remainingTime = duration - currentSeconds;
                let endOra = new Date(new Date().getTime() + (TimeMultiplier(remainingTime, playbackSpeed) * 1000));

                document.querySelector<HTMLParagraphElement>("[data-a-target='player-seekbar-duration']")!.innerText = `${TimeFormats(duration, 1)} ( -${TimeFormats(remainingTime, playbackSpeed)} / ${endOra.getHours().toString().padStart(2, '0')}:${endOra.getMinutes().toString().padStart(2, '0')} )`;
            }
        });
    }
    let timeOut = 0;
    const AddScript = setInterval(()=>{
        if (timeOut == 600) { clearInterval(AddScript); }
        let element = document.querySelector<HTMLParagraphElement>("[data-a-target='player-seekbar-duration']")
        if ( element != null){
            Script();
            element.addEventListener('mouseover', () => {
                element!.style.backgroundColor = "#000000";
            });
            element.addEventListener('mouseleave', () => {
                element!.style.backgroundColor = "";
            });
            clearInterval(AddScript);
        }
        timeOut++;
    },300)
})();