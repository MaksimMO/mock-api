const { spawn } = require('child_process');

const appSelectors = {
    'integration-player-app': '8081:8080',
    'kyc-app': '8090:8080',
    'loyalty-app': '8080:8080',
    'document-store-app': '8004:8080'
};

const subprocesses = [];  // To store the subprocesses

const terminateSubprocesses = () => {
    for (const process of subprocesses) {
        process.kill();
    }
};

const main = async () => {
    try {
        for (const [appSelector, port] of Object.entries(appSelectors)) {
            const podNameProcess = spawn('oc', ['get', 'pods', '--selector', `app=${appSelector}`, '--output=name']);

            const podName = await new Promise((resolve, reject) => {
                podNameProcess.stdout.on('data', (data) => {
                    resolve(data.toString().trim());
                });
                podNameProcess.on('error', (error) => {
                    reject(error);
                });
            });

            console.log(podName);
            subprocesses.push(spawn('oc', ['port-forward', podName, port]));
        }

        for (const [podName, port] of Object.entries(appSelectors)) {
            console.log(`oc port-forward ${podName} ${port}`);
        }

        console.log("Press Ctrl+C to stop...");

        process.on('SIGINT', () => {
            console.log("\nCtrl+C detected. Terminating subprocesses...");
            terminateSubprocesses();
            process.exit(1);
        });

    } catch (error) {
        console.error(error);
    }
};

main();
