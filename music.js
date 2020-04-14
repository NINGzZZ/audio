const log = console.log.bind(console)

const e = function (selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
    } else {
        return element
    }
}
const es = selector => document.querySelectorAll(selector)


const showCurrentTime = function(audio) {
    setInterval(function() {
        let currentLabel = e('#id-span-current')
        let durationLabel = e('#id-span-duration')
        let current = parseInt(audio.currentTime, 10) + 1
        let duration = parseInt(audio.duration, 10) + 1
        let s = `当前时间：${current}/总时间：${duration}`
        currentLabel.innerHTML = s
    }, 1000)
}

const bindEventPlay = function(audio) {
    let button = e('#id-button-play')
    button.addEventListener('click', function() {
        audio.play()
        showCurrentTime(audio)
    })
}

const bindEventPause = function(audio) {
    let button = e('#id-button-pause')
    button.addEventListener('click', function() {
        audio.pause()
    })
}

const bindEventChange = function(audio) {
    let container = e('#id-div-music')
    container.addEventListener('click', function(event) {
        let self = event.target
        let path = self.dataset.path
        audio.src = path
    })
}

const bindEventCanplay = function(audio) {
    audio.addEventListener('canplay', function() {
        // 注意, 因为 Chrome 的限制, 直接调用下面的语句会在 console 里面出现如下报错
        // Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD
        // 但是并不影响功能
        // audio.play()
        // showCurrentTime(audio)

        // 如果想解决这个问题, 可以考虑使用下面的方案而不是调用上面的语句, 记住结论就好, 不要关心为什么
        let promise = audio.play()
        if (promise !== undefined) {
            promise.then(() => {
                // 进入这个函数说明音乐已经自动播放
                //log('可以自动播放')
                audio.play()
            }).catch(() => {
                // 进入这个函数说明音乐不能自动播放
                //log('音乐不能自动播放')
                showCurrentTime(audio)
            })
        }
    })
}
const bindEventEnd1 = function(audio) {
    audio.addEventListener('ended', function() {
        let s = audio.src
        audio.src = s
    })
}
const allSongs = function() {
    let musics = es('.music')
    let songs = []
    for (let i = 0; i < musics.length; i++) {
        let m = musics[i]
        let path = m.dataset.path
        songs.push(path)
    }
    return songs
}

const nextSong = function(audio) {
    let songs = allSongs()
    let src = audio.src.split('/').slice(-1)[0]
    let index = songs.indexOf(src)
    index = (index + 1) % songs.length
    return songs[index]
}
const bindEventNext = function(audio) {
    let button = e('#id-button-next')
    button.addEventListener('click', function() {
        log('next')
        let song = nextSong(audio)
        audio.src = song
    })
}

const bindEventEnd2 = function(audio) {
    audio.addEventListener('ended', function(event) {
        let self = event.target
        let index = Number(self.dataset.id)
        log('id', index)
        let songs = allSongs()
        index = (index + 1)
        log('index', index)
        let song = songs[index]
        audio.src = song
    })
}
const choice = function(array) {
    // 1. 得到  0 - 1 之间的小数 a
    // 2. 把 a 转成 0 - array.length 之间的小数
    // 3. 得到 0 - array.length - 1 之间的整数作为下标
    // 4. 得到 array 中的随机元素
    let a = Math.random()
    a = a * array.length
    let index = Math.floor(a)
    log('index', index)
    return array[index]
}

const randomSong = function() {
    let songs = allSongs()
    let s = choice(songs)
    return s
}

const bindEventEnd3 = function(audio) {
    audio.addEventListener('ended', function() {
        let song = randomSong()
        audio.src = song
    })
}
const bindEventMode1 = function(audio) {
    let button = e('#id-button-rethis')
    button.addEventListener('click', function() {
        log('1')
        //let audio = e('#id-audio-player')
        bindEvents(audio)
        bindEventEnd1(audio)
    })
}
const bindEventMode2 = function(audio) {
    let button = e('#id-button-relist')
    button.addEventListener('click', function() {
        log('2')
        //let audio = e('#id-audio-player')
        bindEvents(audio)
        bindEventEnd2(audio)
    })
}
const bindEventMode3 = function(audio) {
    let button = e('#id-button-random')
    button.addEventListener('click', function() {
        log('3')
        //let audio = e('#id-audio-player')
        bindEvents(audio)
        bindEventEnd3(audio)
    })
}

const bindEvents = function(audio) {
    //let audio = e('#id-audio-player')
    bindEventPlay(audio)
    bindEventNext(audio)
    bindEventPause(audio)
    bindEventChange(audio)
    bindEventCanplay(audio)
}

const __main = function() {
    let audio = e('#id-audio-player')
    bindEvents(audio)
    bindEventMode1(audio)
    bindEventMode2(audio)
    bindEventMode3(audio)
}

__main()