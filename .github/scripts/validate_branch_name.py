import os
import re
import sys

branch = os.environ.get('BRANCH')
pattern = os.environ.get('REGEX')

if not branch or not pattern:
    print('❌ Missing BRANCH or REGEX environment variable.')
    sys.exit(1)

if re.fullmatch(pattern, branch):
    print('✅ Branch name is valid.')
else:
    print(f'❌ Branch name {branch} does not match policy:\n  {pattern}')
    sys.exit(1)
