const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbzZJWxcpZTwkUcvDxwQYyB820aLHv7uYLQhWhN4VTbGQTRNMUQj4dv4nvnwOibUoNqbCg/exec';

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
            const response = await fetch(`${GAS_API_URL}?year=${y}&month=${m}&day=${d}`);
            const res = await response.json();

            if (res.data) {
                displayResult(res.data);
                resultSec.classList.remove('hidden');
            } else {
                alert("鑑定エラー: " + res.error);
                inputSec.classList.remove('hidden');
            }
        } catch (err) {
            alert("通信エラーが発生しました。");
            inputSec.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
        }
    });

    document.getElementById('retry-btn').addEventListener('click', () => {
        location.reload();
    });
});

function displayResult(d) {
    // 1. 基本特性
    document.getElementById('res-group').textContent = d.basic.group;
    document.getElementById('res-type').textContent = d.basic.type;
    document.getElementById('res-soul').textContent = d.basic.soul;
    document.getElementById('res-mission').textContent = d.basic.mission;
    document.getElementById('res-ability').textContent = d.basic.ability;

    // 2. ★画像表示
    const imgElement = document.getElementById('res-image');
    const imgContainer = document.getElementById('image-container');
    if (d.basic.result_image && d.basic.result_image.startsWith('http')) {
        imgElement.src = d.basic.result_image;
        imgContainer.classList.remove('hidden');
    } else {
        imgContainer.classList.add('hidden');
    }

    // 3. 能力傾向
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
        <div class="skill-item"><span class="label">${s.label}</span><span class="val">${s.val}</span></div>
    `).join('');

    // 4. 総合能力
    document.getElementById('res-charisma').textContent = d.total_power.charisma;
    document.getElementById('res-analysis').textContent = d.total_power.analysis;
    document.getElementById('res-communication').textContent = d.total_power.communication;

    // 5. 鑑定文
    document.getElementById('res-catchcopy').textContent = d.reading.catchcopy;
    document.getElementById('res-essence').textContent = d.reading.essence;
    document.getElementById('res-life-character').textContent = d.reading.life_character;

    // 6. SNSボタン設定を呼び出し
    setupShareButtons(d);
}

function setupShareButtons(d) {
    const title = "【精密運命鑑定】";
    const shareText = `${title}\n魂の性質は「${d.basic.soul}」、タイプは「${d.basic.type}」でした！\n${d.reading.catchcopy}\n`;
    const shareUrl = window.location.href;
    const fullText = shareText + shareUrl;

    const btnX = document.getElementById('share-x');
    const btnThreads = document.getElementById('share-threads');
    const btnLine = document.getElementById('share-line');
    const btnInst = document.getElementById('share-inst');

    if(btnX) btnX.onclick = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`, '_blank');
    if(btnThreads) btnThreads.onclick = () => window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(fullText)}`, '_blank');
    if(btnLine) btnLine.onclick = () => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    if(btnInst) {
        btnInst.onclick = () => {
            navigator.clipboard.writeText(fullText).then(() => {
                alert("鑑定結果をコピーしました！Instagramを開きます。");
                window.location.href = "instagram://camera";
            }).catch(() => { window.location.href = "https://www.instagram.com/"; });
        };
    }
}

function initDateSelects() {
    const yS = document.getElementById('year'), mS = document.getElementById('month'), dS = document.getElementById('day');
    for(let i=new Date().getFullYear(); i>=1940; i--) yS.add(new Option(i+"年", i));
    for(let i=1; i<=12; i++) mS.add(new Option(i+"月", i));
    for(let i=1; i<=31; i++) dS.add(new Option(i+"日", i));
    yS.value = 1990;
}