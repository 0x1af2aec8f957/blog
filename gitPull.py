# -*- coding: utf-8 -*-

import os
import sys

if __name__ == '__main__':
    print sys.argv
    os.chdir(sys.argv[1])
    os.system('git pull origin master')
    os.system('pm2 restart main')