# -*- coding: utf-8 -*-

import os

if __name__ == '__main__':
    os.chdir('/webapp')
    os.system('git pull origin master')
    os.system('pm2 restart main')