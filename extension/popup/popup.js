document.addEventListener('DOMContentLoaded', () => {
    const summarizeBtn = document.getElementById('summarizeBtn');
    const timeRangeSelect = document.getElementById('timeRange');
    const toneSelect = document.getElementById('tone');
    const resultDiv = document.getElementById('result');
    const loaderDiv = document.getElementById('loader');

    summarizeBtn.addEventListener('click', async () => {
        const hours = parseInt(timeRangeSelect.value);
        const tone = toneSelect.value;

        summarizeBtn.disabled = true;
        resultDiv.innerText = '';
        loaderDiv.style.display = 'block';

        try {
            const response = await fetch('http://127.0.0.1:8000/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hours: hours, tone: tone })
            });

            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }

            const data = await response.json();
            resultDiv.innerText = data.summary;

        } catch (error) {
            console.error('Ошибка:', error);
            resultDiv.innerText = 'Не удалось связаться с сервером FastAPI запущен??????';
        } finally {
            summarizeBtn.disabled = false;
            loaderDiv.style.display = 'none';
        }
    });
});