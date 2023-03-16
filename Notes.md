# Notes

## Javascript

### Long strings

When handling long strings be sure to replace the selection of the long string with this value and this regex to pipe into it:  
RegEx: `([\w,\/:;+]{207})`  
Value: `$1"\n      + "`
