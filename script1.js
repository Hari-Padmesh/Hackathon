const CONTRACT_ADDRESS = "your_contract_address";
const ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "getAllDetections",
        "outputs": [
            { "name": "", "type": "uint256[]" },
            { "name": "", "type": "uint256[]" }
        ],
        "type": "function"
    }
];

async function fetchBlockchainData() {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    try {
        const [timestamps, levels] = await contract.getAllDetections();
        const detectionDates = timestamps.map(t => new Date(t.toNumber() * 1000));
        const threatLevels = levels.map(l => l.toNumber());

        updateCharts(detectionDates, threatLevels);
    } catch (error) {
        console.error("Error fetching blockchain data:", error);
    }
}

function updateCharts(detectionDates, threatLevels) {
    const ctx1 = document.getElementById("lineChart").getContext("2d");
    const ctx2 = document.getElementById("pieChart").getContext("2d");

    new Chart(ctx1, {
        type: "line",
        data: {
            labels: detectionDates,
            datasets: [{
                label: "Drone Detections Over Time",
                data: threatLevels,
                borderColor: "#ff6384",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: true,
            }]
        }
    });

    new Chart(ctx2, {
        type: "pie",
        data: {
            labels: ["Low", "Medium", "High", "Critical"],
            datasets: [{
                data: [
                    threatLevels.filter(t => t === 1).length,
                    threatLevels.filter(t => t === 2).length,
                    threatLevels.filter(t => t === 3).length,
                    threatLevels.filter(t => t === 4).length,
                ],
                backgroundColor: ["#36a2eb", "#ffce56", "#ff6384", "#d9534f"]
            }]
        }
    });
}

fetchBlockchainData();
setInterval(fetchBlockchainData, 5000);  // Auto-refresh every 5 sec
