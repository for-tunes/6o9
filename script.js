const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbwpZmFzL1kBdwtah0kDx8chT8EyJFlNoUvuF1GpO0vhXMz4lU93IIOWbf_Y7wEpLAXXtg/exec';

document.addEventListener('DOMContentLoaded', () => {
    initDateSelects();
    const form = document.getElementById('fortune-form');
    const inputSec = document.getElementById('input-section');
    const resultSec = document.getElementById('result-section');
    const loading = document.getElementById('loading');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        inputSec.classList.add('hidden');
        loading.classList.remove('hidden');

        const y = document.getElementById('year').value;
        const m = document.getElementById('month').value;
        const d = document.getElementById('day').value;

        try {
            // 通信部分
            const response = await fetch(`${GAS_API_URL}?year=${y}&month=${m}&day=${d}`);
            const res = await response.json();

            if (res.data) {
                // ここで表示関数を呼び出し
                displayResult(res.data);
            } else {
                alert("鑑定エラー: " + res.error);
                inputSec.classList.remove('hidden');
            }
        } catch (err) {
            console.error(err);
            alert("通信エラーが発生しました。GASのURLが正しいか、公開設定が『全員』になっているか確認してください。");
            inputSec.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
        }
    });

    document.getElementById('retry-btn').addEventListener('click', () => {
        location.reload();
    });
});

// 表示に関する関数（1つにまとめました）
function displayResult(d) {
    // 1. 基本特性
    document.getElementById('res-group').textContent = d.basic.group;
    document.getElementById('res-type').textContent = d.basic.type;
    document.getElementById('res-soul').textContent = d.basic.soul;
    document.getElementById('res-mission').textContent = d.basic.mission;
    document.getElementById('res-ability').textContent = d.basic.ability;

    // 2. 能力傾向
    const skillMap = [
        { label: "瞬発力・リスク対応力", val: d.skills.shunpatsu },
        { label: "堅実性・安定力", val: d.skills.kenjitsu },
        { label: "計画性・構造化力", val: d.skills.keikaku },
        { label: "協調・他者との連携", val: d.skills.kyōchō },
        { label: "周囲との関係性や柔軟性", val: d.skills.flex },
        { label: "目的に応じた推進力", val: d.skills.suishin },
        { label: "環境に合わせたバランス力", val: d.skills.balance }
    ];
    document.getElementById('res-skills').innerHTML = skillMap.map(s => `
        <div class="skill-item">
            <span class="label">${s.label}</span>
            <span class="val">${s.val}</span>
        </div>
    `).join('');

    // 3. 総合能力
    document.getElementById('res-charisma').textContent = d.total_power.charisma;
    document.getElementById('res-analysis').textContent = d.total_power.analysis;
    document.getElementById('res-communication').textContent = d.total_power.communication;

    // 4. 鑑定文
    document.getElementById('res-catchcopy').textContent = d.reading.catchcopy;
    document.getElementById('res-essence').textContent = d.reading.essence;
    document.getElementById('res-life-character').textContent = d.reading.life_character;

    // 5. SNSボタンの設定を呼び出す
    setupShareButtons(d);

    // 6. 結果画面を表示
    document.getElementById('result-section').classList.remove('hidden');
}

// SNSシェアの設定
function setupShareButtons(d) {
    const title = "【精密運命鑑定】";
    const shareText = `${title}\n私の魂の性質は「${d.basic.soul}」、タイプは「${d.basic.type}」でした！\n${d.reading.catchcopy}\n`;
    const shareUrl = window.location.href; 
    const fullText = shareText + shareUrl;

    // X (Twitter)
    document.getElementById('share-x').onclick = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;
        window.open(url, '_blank');
    };

    // Threads
    document.getElementById('share-threads').onclick = () => {
        const url = `https://www.threads.net/intent/post?text=${encodeURIComponent(fullText)}`;
        window.open(url, '_blank');
    };

    // LINE
    document.getElementById('share-line').onclick = () => {
        const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
    };

    // Instagram
    document.getElementById('share-inst').onclick = () => {
        navigator.clipboard.writeText(fullText).then(() => {
            alert("鑑定結果をコピーしました！Instagramを開きますので、ストーリーズや投稿に貼り付けてください。");
            window.location.href = "instagram://camera";
        }).catch(() => {
            window.location.href = "https://www.instagram.com/";
        });
    };
}

// 日付セレクトボックスの初期化
function initDateSelects() {
    const yS = document.getElementById('year'), mS = document.getElementById('month'), dS = document.getElementById('day');
    for(let i=new Date().getFullYear(); i>=1940; i--) yS.add(new Option(i+"年", i));
    for(let i=1; i<=12; i++) mS.add(new Option(i+"月", i));
    for(let i=1; i<=31; i++) dS.add(new Option(i+"日", i));
    yS.value = 1990;
}