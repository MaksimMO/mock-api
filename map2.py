import subprocess
import signal
import sys
#https://oauth-openshift.apps.mt1-nonprod.enjoy-platform.net/oauth/token/display
def terminate_subprocesses(subprocesses):
    for process in subprocesses:
        process.terminate()

app_selectors = {
    'integration-player-app': '8081:8080',
    'kyc-app': '8090:8080',
    'loyalty-app':'8080:8080',
    # 'cabo-db':'33300:3306',
    'document-store-app':'8004:8080'
}

subprocesses = []  # To store the subprocesses

try:
    for app_selector, port in app_selectors.items():
        command_output = subprocess.check_output(['oc', 'get', 'pods', '--selector', f'app={app_selector}', '--output=name'])
        pod_name = command_output.decode().strip()
        print(pod_name)
        subprocesses.append(subprocess.Popen(['oc', 'port-forward', pod_name, port]))

    for pod_name, port in app_selectors.items():
        print(f'oc port-forward {pod_name} {port}')

    print("Press Ctrl+C to stop...")

    while True:
        pass

except KeyboardInterrupt:
    print("\nCtrl+C detected. Terminating subprocesses...")
    terminate_subprocesses(subprocesses)
    sys.exit(1)
