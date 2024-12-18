document.getElementById('getRoot').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3210/');
        const data = await response.text();
        const output = document.getElementById('output');
        output.innerHTML = data;
    } catch (err) {
        displayOutput(`Error: ${err.message}`);
    }
});

document.getElementById('postData').addEventListener('click', async () => {
    const jsonData = prompt('Enter JSON data:');
    try {
        const parsedData = JSON.parse(jsonData);

        const response = await fetch('http://localhost:3210/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsedData),
        });

        const data = await response.json();
        displayOutput(JSON.stringify(data, null, 2));

    } catch (err) {
        displayOutput(`Error: ${err.message}`);
    }
});


document.getElementById('getStatus').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3210/status');
        const data = await response.json();
        displayOutput(JSON.stringify(data, null, 2));
    } catch (err) {
        displayOutput(`Error: ${err.message}`);
    }
});

function displayOutput(message) {
    const output = document.getElementById('output');
    output.innerText = message;
}
