#!/bin/bash
# fetch mev result from 12914944 to 12930000

START=12928001
END=12930000

for i in $(eval echo "{$START..$END}"); do
        until [ ! -s /home/disk/applications/mev.log ]; do
                /home/disk/applications/mev-inspect-py/mev inspect $i 2>/home/disk/applications/mev.log
                sleep 2
        done
        echo "a" >> /home/disk/applications/mev.log
done