import yaml
import sys

with open('.github/policies/branch-naming.yml') as f:
    print(yaml.safe_load(f)['branch_name_regex'])
