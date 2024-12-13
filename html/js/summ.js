console.log("\n %c Post-Abstract-AI 开源博客文章摘要AI生成工具 %c https://github.com/zhheo/Post-Abstract-AI \n", "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;")
var summ = '生成中，请等待开始打印摘要后重试'

function getGptKey(key) {
    return `gpt_${key}`
}

function saveDataWithTimestamp(key, data) {
    const currentTime = new Date().getTime();
    const dataToStore = {
        timestamp: currentTime,
        data: data
    };
    localStorage.setItem(getGptKey(key), JSON.stringify(dataToStore));
}

function getDataIfNotExpired(key) {
    const storedData = localStorage.getItem(getGptKey(key));
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        const storedTimestamp = parsedData.timestamp;
        const currentTime = new Date().getTime();
        const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        if (currentTime - storedTimestamp <= sevenDaysInMillis) {
            return parsedData.data;
        }
    }
    // 数据已过期，可以选择删除它
    localStorage.removeItem(getGptKey(key));
    return null;
}

function tianliGPT(usePjax) {
    var tianliGPTIsRunning = false;

    function insertAIDiv(selector) {
        // 首先移除现有的 "post-TianliGPT" 类元素（如果有的话）
        removeExistingAIDiv();

        // 获取目标元素
        const targetElement = document.querySelector(selector);

        // 如果没有找到目标元素，不执行任何操作
        if (!targetElement) {
            return;
        }

        // 创建要插入的HTML元素
        const aiDiv = document.createElement('div');
        aiDiv.className = 'post-TianliGPT';

        const aiTitleDiv = document.createElement('div');
        aiTitleDiv.className = 'tianliGPT-title';
        aiDiv.appendChild(aiTitleDiv);

        const aiIcon = document.createElement('i');
        aiIcon.className = 'tianliGPT-title-icon';
        aiTitleDiv.appendChild(aiIcon);

        // 插入 SVG 图标
        aiIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 48 48">
    <title>机器人</title>
    <g id="&#x673A;&#x5668;&#x4EBA;" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <path d="M34.717885,5.03561087 C36.12744,5.27055371 37.079755,6.60373651 36.84481,8.0132786 L35.7944,14.3153359 L38.375,14.3153359 C43.138415,14.3153359 47,18.1768855 47,22.9402569 L47,34.4401516 C47,39.203523 43.138415,43.0650727 38.375,43.0650727 L9.625,43.0650727 C4.861585,43.0650727 1,39.203523 1,34.4401516 L1,22.9402569 C1,18.1768855 4.861585,14.3153359 9.625,14.3153359 L12.2056,14.3153359 L11.15519,8.0132786 C10.920245,6.60373651 11.87256,5.27055371 13.282115,5.03561087 C14.69167,4.80066802 16.024865,5.7529743 16.25981,7.16251639 L17.40981,14.0624532 C17.423955,14.1470924 17.43373,14.2315017 17.43948,14.3153359 L30.56052,14.3153359 C30.56627,14.2313867 30.576045,14.1470924 30.59019,14.0624532 L31.74019,7.16251639 C31.975135,5.7529743 33.30833,4.80066802 34.717885,5.03561087 Z M38.375,19.4902885 L9.625,19.4902885 C7.719565,19.4902885 6.175,21.0348394 6.175,22.9402569 L6.175,34.4401516 C6.175,36.3455692 7.719565,37.89012 9.625,37.89012 L38.375,37.89012 C40.280435,37.89012 41.825,36.3455692 41.825,34.4401516 L41.825,22.9402569 C41.825,21.0348394 40.280435,19.4902885 38.375,19.4902885 Z M14.8575,23.802749 C16.28649,23.802749 17.445,24.9612484 17.445,26.3902253 L17.445,28.6902043 C17.445,30.1191812 16.28649,31.2776806 14.8575,31.2776806 C13.42851,31.2776806 12.27,30.1191812 12.27,28.6902043 L12.27,26.3902253 C12.27,24.9612484 13.42851,23.802749 14.8575,23.802749 Z M33.1425,23.802749 C34.57149,23.802749 35.73,24.9612484 35.73,26.3902253 L35.73,28.6902043 C35.73,30.1191812 34.57149,31.2776806 33.1425,31.2776806 C31.71351,31.2776806 30.555,30.1191812 30.555,28.6902043 L30.555,26.3902253 C30.555,24.9612484 31.71351,23.802749 33.1425,23.802749 Z" id="&#x5F62;&#x72B6;&#x7ED3;&#x5408;" fill="#444444" fill-rule="nonzero"></path>
    </g>
    </svg>`;

        const aiTitleTextDiv = document.createElement('div');
        aiTitleTextDiv.className = 'tianliGPT-title-text';
        aiTitleTextDiv.textContent = 'AI摘要';
        aiTitleDiv.appendChild(aiTitleTextDiv);

        const aiTagDiv = document.createElement('div');
        aiTagDiv.className = 'tianliGPT-tag';
        aiTagDiv.id = 'tianliGPT-tag';
        aiTagDiv.textContent = '播报';
        aiTitleDiv.appendChild(aiTagDiv);

        const aiExplanationDiv = document.createElement('div');
        aiExplanationDiv.className = 'tianliGPT-explanation';
        aiExplanationDiv.style.display = "block";
        aiExplanationDiv.innerHTML = 'AI分析中，请稍等...' + '<span class="blinking-cursor"></span>';
        aiDiv.appendChild(aiExplanationDiv); // 将 tianliGPT-explanation 插入到 aiDiv，而不是 aiTitleDiv

        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'tianliGPT-suggestions';
        aiDiv.appendChild(suggestionsDiv)

        // 将创建的元素插入到目标元素的顶部
        targetElement.insertBefore(aiDiv, targetElement.firstChild);
    }

    function removeExistingAIDiv() {
        // 查找具有 "post-TianliGPT" 类的元素
        const existingAIDiv = document.querySelector(".post-TianliGPT");

        // 如果找到了这个元素，就从其父元素中删除它
        if (existingAIDiv) {
            existingAIDiv.parentElement.removeChild(existingAIDiv);
        }
    }

    var tianliGPT = {
        createSuggestionItemWithAction: function (e, n) {
            const o = document.querySelector(".tianliGPT-suggestions");
            if (!o)
                return void console.error("无法找到具有class为tianliGPT-suggestions的元素");
            const t = document.createElement("div");
            t.classList.add("tianliGPT-suggestions-item"),
                t.textContent = e,
                t.addEventListener("click", (() => {
                        n()
                    }
                )),
                o.appendChild(t)
        },
        cleanSuggestions: function () {
            const e = document.querySelector(".tianliGPT-suggestions");
            e ? e.innerHTML = "" : console.error("无法找到具有class为tianliGPT-suggestions的元素")
        },
        createSuggestions: function () {
            !tianliGPTIsRunning && (tianliGPT.cleanSuggestions(),
                    tianliGPT.createSuggestionItemWithAction("😘这是个什么网站？", (() => {
                            tianliGPT.aiShowAnimation("🎉这是Pei的个人博客网站，你可以在这里看一些他分享的文章。如果你想申请友链，那你可以前往<a href='/link/'>友链页</a>，这是他的<a href='https://github.com/sgr997'>Github主页</a>，当然，你也可以去<a href='/about/'>关于页</a>查看他的相关信息。最后，祝你在本站玩的开心😄")
                        }
                    )),
                    tianliGPT.createSuggestionItemWithAction("🤔这篇文章讲了什么？", (() => {
                            tianliGPT.aiShowAnimation(summ)
                        }
                    )),
            tianliGPT.createSuggestionItemWithAction("👀带我去看看其他文章", (() => {
                tianliGPT.aiShowAnimation("正在前往其他文章，请稍后...")
                setTimeout(() => {
                    location.href = '/random.html'
                }, 2000);
            }))
            )
        },

        //读取文章中的所有文本
        getTitleAndContent: function () {
            try {
                const title = document.title;
                const container = document.querySelector(tianliGPT_postSelector);
                if (!container) {
                    console.warn('GPT：找不到文章容器。请尝试将引入的代码放入到文章容器之后。如果本身没有打算使用摘要功能可以忽略此提示。');
                    return '';
                }
                const paragraphs = container.getElementsByTagName('p');
                const headings = container.querySelectorAll('h1, h2, h3, h4, h5');
                let content = '';

                content += '标题：'
                for (let h of headings) {
                    content += h.innerText + ' ';
                }
                content += '\n'

                content += '正文：'
                for (let p of paragraphs) {
                    // 移除包含'http'的链接
                    const filteredText = p.innerText.replace(/https?:\/\/[^\s]+/g, '');
                    content += filteredText;
                }

                const combinedText = title + ' ' + content;
                let wordLimit = 1000;
                if (typeof tianliGPT_wordLimit !== "undefined") {
                    wordLimit = tianliGPT_wordLimit;
                }
                const truncatedText = combinedText.slice(0, wordLimit);
                return truncatedText;
            } catch (e) {
                console.error('GPT错误：可能由于一个或多个错误导致没有正常运行，原因出在获取文章容器中的内容失败，或者可能是在文章转换过程中失败。', e);
                return '';
            }
        },

        fetchTianliGPT: async function (content) {
            const key = getPostUrl();
            const summary = getDataIfNotExpired(key)
            if (summary) {
                console.log('from cache')
                return {
                    summary: summary,
                    audioId: '-1' // 获取音频的 ID
                };
            }
            // const apiUrl = `http://localhost:3000/summary.json?postKey=${encodeURIComponent(key)}&content=${encodeURIComponent(content)}&t=` + new Date().getTime();
            const apiUrl = `https://blogapi.goku.top/summary.json?postKey=${encodeURIComponent(key)}&content=${encodeURIComponent(content)}&t=` + new Date().getTime();

            const timeout = 60000; // 设置超时时间（毫秒）

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                const response = await fetch(apiUrl, {signal: controller.signal});
                if (response.ok) {
                    const data = await response.json();
                    saveDataWithTimestamp(key, data.summary)
                    return {
                        summary: data.summary,
                        audioId: '-1' // 获取音频的 ID
                    };
                } else {
                    if (response.status === 402 || response.status === 403) {
                        document.querySelectorAll('.post-TianliGPT').forEach(el => {
                            el.style.display = 'none';
                        });
                        return {
                            summary: '获取文章摘要失败，当前网站没有调用权限。',
                            audioId: '-1' // 获取音频的 ID
                        }
                    }
                    throw new Error('获取文章摘要超时');
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.error('请求超时');
                    return {
                        summary: '获取文章摘要超时。当你出现这个问题时，可能是因为文章过长导致的 AI 运算量过大，您可以稍等一下然后刷新页面重试。',
                        audioId: '-1' // 获取音频的 ID
                    }
                } else {
                    console.error('请求失败：', error);
                    return {
                        summary: '获取文章摘要失败，请稍候重试。',
                        audioId: '-1' // 获取音频的 ID
                    }
                }
            }
        },

        aiShowAnimation: function (text) {
            const element = document.querySelector(".tianliGPT-explanation");
            if (!element) {
                return;
            }

            if (tianliGPTIsRunning) {
                return;
            }
            tianliGPT.cleanSuggestions()

            // 检查用户是否已定义tianliGPT_typingAnimate并且其值为false
            if (typeof tianliGPT_typingAnimate !== "undefined" && !tianliGPT_typingAnimate) {
                // 如果用户已定义tianliGPT_typingAnimate并且其值为false，则立即显示完整文本
                element.innerHTML = text;
                return;
            }

            tianliGPTIsRunning = true;
            const typingDelay = 25;
            const waitingTime = 1000;
            const punctuationDelayMultiplier = 6;

            element.style.display = "block";
            element.innerHTML = "AI分析中，请稍等..." + '<span class="blinking-cursor"></span>';

            let animationRunning = true;
            let currentIndex = 0;
            let initialAnimation = true;
            let lastUpdateTime = performance.now();

            const animate = () => {
                if (currentIndex < text.length && animationRunning) {
                    const currentTime = performance.now();
                    const timeDiff = currentTime - lastUpdateTime;

                    const letter = text.slice(currentIndex, currentIndex + 1);
                    const isPunctuation = /[，。！、？,.!?]/.test(letter);
                    const delay = isPunctuation ? typingDelay * punctuationDelayMultiplier : typingDelay;

                    if (timeDiff >= delay) {
                        element.innerText = text.slice(0, currentIndex + 1);
                        lastUpdateTime = currentTime;
                        currentIndex++;

                        if (currentIndex < text.length) {
                            element.innerHTML =
                                text.slice(0, currentIndex) +
                                '<span class="blinking-cursor"></span>';
                        } else {
                            element.innerHTML = text;
                            element.style.display = "block";
                            tianliGPTIsRunning = false;
                            tianliGPT.createSuggestions()
                            observer.disconnect(); // 暂停监听
                        }
                    }
                    requestAnimationFrame(animate);
                }
            }

            // 使用IntersectionObserver对象优化ai离开视口后暂停的业务逻辑，提高性能
            const observer = new IntersectionObserver((entries) => {
                let isVisible = entries[0].isIntersecting;
                animationRunning = isVisible; // 标志变量更新
                if (animationRunning && initialAnimation) {
                    setTimeout(() => {
                        requestAnimationFrame(animate);
                    }, 200);
                }
            }, {threshold: 0});
            let post_ai = document.querySelector('.post-TianliGPT');
            observer.observe(post_ai); //启动新监听
        },
    }

    function runTianliGPT() {
        insertAIDiv(tianliGPT_postSelector);
        const content = tianliGPT.getTitleAndContent();
        if (content) {
            console.log('本次提交的内容为：' + content);
        }
        tianliGPT.fetchTianliGPT(content).then(data => {
            console.log('总结完毕')
            const summary = data.summary;
            const audioId = data.audioId;
            summ = summary
            const buttonDiv = document.querySelector('.tianliGPT-tag');
            buttonDiv.dataset.audioId = audioId; // 将音频的 ID 存储在按钮的 dataset 属性中
            tianliGPT.aiShowAnimation(summary);
        })
    }

    function getPostUrl() {
        return window.location.href.replace(/^(?:https?:\/\/)?[^/]+/, "");
    }

    function checkURLAndRun() {
        if (typeof tianliGPT_postURL === "undefined") {
            runTianliGPT(); // 如果没有设置自定义 URL，则直接执行 runTianliGPT() 函数
            return;
        }

        try {
            const wildcardToRegExp = (s) => {
                return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$');
            };

            const regExpEscape = (s) => {
                return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\{{input}}');
            };

            const urlPattern = wildcardToRegExp(tianliGPT_postURL);
            const currentURL = window.location.href;

            if (urlPattern.test(currentURL)) {
                runTianliGPT(); // 如果当前 URL 符合用户设置的 URL，则执行 runTianliGPT() 函数
            } else {
                console.log("GPT：因为不符合自定义的链接规则，我决定不执行摘要功能。");
            }
        } catch (error) {
            console.error("GPT：我没有看懂你编写的自定义链接规则，所以我决定不执行摘要功能", error);
        }
    }

    if (usePjax) {
        checkURLAndRun();
    } else {
        document.removeEventListener("DOMContentLoaded", function () {
            checkURLAndRun();
        });
        document.addEventListener("DOMContentLoaded", function () {
            checkURLAndRun();
        });
    }
}

tianliGPT(false);

document.addEventListener('pjax:complete', function () {
    // 查找具有 "post-TianliGPT" 类的元素
    const existingAIDiv = document.querySelector(".post-TianliGPT");

    if (!existingAIDiv) {
        tianliGPT(true);
    }
})

// document.addEventListener('click', function (event) {
//     const target = event.target;
//     if (target.classList.contains('tianliGPT-tag')) {
//         console.log(1)
//         playAudioByText();
//     }
// });

var audioPlayer = null; // 用于存储音频播放器对象
function playAudio() {
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
    } else {
        if (!audioPlayer) {
            const buttonDiv = document.querySelector('.tianliGPT-tag');
            const audioId = buttonDiv.dataset.audioId;

            if (!audioId) {
                console.error('未找到音频 ID');
                return;
            }

            const audioUrl = `https://summary.tianli0.top/audio?id=${encodeURIComponent(audioId)}&key=${encodeURIComponent(tianliGPT_key)}`;

            audioPlayer = new Audio(audioUrl);
            audioPlayer.addEventListener('ended', () => {
                buttonDiv.classList.remove('playing');
            });

            audioPlayer.addEventListener('play', () => {
                buttonDiv.classList.add('playing');
            });

            audioPlayer.addEventListener('pause', () => {
                buttonDiv.classList.remove('playing');
            });
        }

        setTimeout(() => {
            audioPlayer.play().catch(error => {
                console.error('播放音频失败:', error);
            });
        }, 100); // 添加延迟以确保播放请求能够正常执行
    }

    const buttonDiv = document.querySelector('.tianliGPT-tag');

    buttonDiv.addEventListener('click', function () {
        buttonDiv.classList.toggle('playing');
    });

    const svgAnimation = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1692880829044" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2346" data-darkreader-inline-fill="" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M512 1024a512 512 0 1 0 0-1024 512 512 0 1 0 0 1024z m0-704a192 192 0 1 1 0 384 192 192 0 1 1 0-384z" p-id="2347"></path></svg>';

    if (buttonDiv.classList.contains('playing')) {
        buttonDiv.innerHTML = svgAnimation;
        buttonDiv.style.animation = '';
        buttonDiv.style.color = '#ff0000';
        buttonDiv.style.backgroundColor = 'transparent';
        buttonDiv.style.padding = '0';
    } else {
        buttonDiv.innerHTML = svgAnimation;
        buttonDiv.style.animation = '';
        buttonDiv.style.color = '#000000';
        buttonDiv.style.backgroundColor = 'transparent';
        buttonDiv.style.padding = '0';
    }
}

function playAudioByText() {
    console.log('pause status', window.speechSynthesis.paused)
    if (audioPlayer && !window.speechSynthesis.paused) {
        console.log('暂停', audioPlayer)
        window.speechSynthesis.pause();
    } else {
        if (!audioPlayer) {
            console.log('播放')
            const buttonDiv = document.querySelector('.tianliGPT-tag');
            const textContent = (summ ? summ : document.querySelector('.tianliGPT-explanation').textContent).replace('AI:', '');
            audioPlayer = new SpeechSynthesisUtterance(textContent);
            // 从列表中选择一个音声，例如第一个音声
            // 将 utterance 的 voice 属性设置为选中的音声
            // audioPlayer.voice = allVoices[0];
            //audioPlayer.lang = 'zh-CN'
            // 语速
            audioPlayer.rate = 1.1
            audioPlayer.onend = () => {
                audioPlayer = null
                console.log('end')
                buttonDiv.classList.remove('playing');
                buttonDiv.style = '';
                buttonDiv.innerHTML = '播报';
            };

            audioPlayer.onstart = () => {
                console.log('start')
                buttonDiv.classList.add('playing');
            };

            audioPlayer.onpause = () => {
                console.log('paused')
                buttonDiv.classList.remove('playing');
                buttonDiv.style = '';
                buttonDiv.innerHTML = '继续';
            };

            audioPlayer.onresume = () => {
                console.log('resume')
                buttonDiv.classList.add('playing');
            };
            console.log(audioPlayer)
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(audioPlayer);
        } else {
            window.speechSynthesis.resume();
        }
    }

    const buttonDiv = document.querySelector('.tianliGPT-tag');

    buttonDiv.addEventListener('click', function () {
        buttonDiv.classList.toggle('playing');
    });

    const svgAnimation = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1692880829044" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2346" data-darkreader-inline-fill="" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path d="M512 1024a512 512 0 1 0 0-1024 512 512 0 1 0 0 1024z m0-704a192 192 0 1 1 0 384 192 192 0 1 1 0-384z" p-id="2347"></path></svg>';

    if (buttonDiv.classList.contains('playing')) {
        buttonDiv.innerHTML = svgAnimation;
        buttonDiv.style.animation = '';
        buttonDiv.style.color = '#ff0000';
        buttonDiv.style.backgroundColor = 'transparent';
        buttonDiv.style.padding = '0';
    } else {
        buttonDiv.innerHTML = svgAnimation;
        buttonDiv.style.animation = '';
        buttonDiv.style.color = '#000000';
        buttonDiv.style.backgroundColor = 'transparent';
        buttonDiv.style.padding = '0';
    }
}


document.addEventListener('click', function (event) {
     const target = event.target;
     const buttonDiv = document.querySelector('.tianliGPT-tag');

     buttonDiv.addEventListener('click', function () {
         buttonDiv.classList.toggle('playing');
     });

     if (target === buttonDiv || buttonDiv.contains(target)) {
         console.log(2)
         playAudioByText();
     }
});