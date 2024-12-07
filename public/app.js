document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-note');
    const resultArea = document.getElementById('result');
    const loader = document.getElementById('loader');

    generateButton.addEventListener('click', async () => {
        // Show loading state
        loader.style.display = 'block';
        generateButton.classList.add('loading');
        resultArea.textContent = '';

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
        } finally {
            // Hide loading state
            loader.style.display = 'none';
            generateButton.classList.remove('loading');
        }
    });
});