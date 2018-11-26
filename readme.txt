listCompare

Copy/paste two lists of names and press the Compare! button to find name matches.  First list is saved in your browser's local storage for easy repeat use.
- names must have at least 2 parts (firstname & lastname)
- each name can be forwards or reveresed, including comma-separated (lastname, firstname)
- no need to "scrub" each list, special characters are automatically removed, so copy/paste from any source, including a spreadsheet



Planned Changes
- switch to regex to remove special characters
- switch from parallel lists to multidimensional arrays
- add sensitivity adjustment
- change list names to list1, list2
- add list2 local storage save
- add "click to confirm" for close matches



Getting Started
This script works great right here, hosted on GitHub.io.  Feel free to download, adapt and install on another server.



Author
Michael Hobson - Initial work - @maskSnorkelFins



Acknowledgments
Thank you to Robert While and Suzanne Gerb for advice.

String comparison accomplished via a Levenshtein distance script posted by overlord1234 on Stack Overflow:
https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely?answertab=votes#tab-top

Appears to be adapted from googlicius GitHub repository similarity.js:
https://gist.github.com/googlicius/a68a05473c3c73a7fe0e7d45872f8358



License
This project is licensed under the MIT License - see the LICENSE.md file for details