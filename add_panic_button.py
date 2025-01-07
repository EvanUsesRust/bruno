import os

def add_script_to_html(file_path):
    script_tag = '<script src="../../panicButton.js"></script> <!-- Ensure panicButton.js is included -->\n</body>'
    with open(file_path, 'r') as file:
        content = file.read()
    
    if '</body>' in content:
        content = content.replace('</body>', script_tag)
    else:
        content += '\n' + script_tag
    with open(file_path, 'w') as file:
        file.write(content)
    print(f'Script added to {file_path}')

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                add_script_to_html(file_path)

if __name__ == '__main__':
    games_directory = './play'  # Adjust the path to your games directory
    process_directory(games_directory)
