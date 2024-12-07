
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-note');
    const resultArea = document.getElementById('result');

    generateButton.addEventListener('click', async () => {
        const selectedTopics = Array.from(document.querySelectorAll('#topics input:checked'))
            .map(checkbox => checkbox.value);
        
        const selectedModalities = Array.from(document.querySelectorAll('#modalities input:checked'))
            .map(checkbox => checkbox.value);

        try {
            const response = await fetch('/.netlify/functions/generate-note', {
                method: 'POST',
                body: JSON.stringify({
                    topics: selectedTopics,
                    modalities: selectedModalities
                })
            });

            const data = await response.json();
            resultArea.textContent = data.note;
        } catch (error) {
            resultArea.textContent = 'Error generating note. Please try again.';
            console.error('Error:', error);
        }
    });
});