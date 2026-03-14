import re

with open('index.html', 'r') as f:
    content = f.read()

new_func = """async function sendMessage() {
    const userInput = chatInput.value.trim();
    if (userInput === '') return;

    addMessage(userInput, 'user');
    chatInput.value = '';

    conversationHistory.push({ role: 'user', parts: [{ text: userInput }] });
    
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('chat-message', 'ai', 'loading');
    loadingElement.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: conversationHistory }),
        });

        const data = await response.json();
        chatMessages.removeChild(loadingElement);

        if (!response.ok) {
            console.error("Erreur serveur :", data);
            throw new Error(data.error || `Erreur HTTP: ${response.status}`);
        }

        if (data.candidates && data.candidates.length > 0) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            addMessage(aiResponse, 'ai');
            conversationHistory.push({ role: 'model', parts: [{ text: aiResponse }] });
        } else {
            addMessage("Désolé, je n'ai pas de réponse.", 'ai');
        }

    } catch (error) {
        console.error('Erreur API:', error);
        if (chatMessages.contains(loadingElement)) chatMessages.removeChild(loadingElement);
        addMessage(`Erreur de connexion avec l'IA. Veuillez réessayer.`, 'ai');
    }
}"""

# Use regex to replace the old function. 
# It starts with "async function sendMessage() {" and ends before "    });\n  </script>"
pattern = r"async function sendMessage\(\) \{.*?\n        \}"
# Wait, let's look at the actual function in index.html to build a better regex.
