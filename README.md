# Browser Tracker

A remote way to monitor your browsing activity in the background. 

Note: before installing the extension, you must specify your API URL in `manifest.json`'s `homepage_url` field. 


This software is intended to monitor the browser usage of a child, and assumes that 
the child does not have any technical knowledge.  

### Install

Toggle developer mode on, click "load unpacked", and select the `extension` folder

#### How to disable the security warning

Find the `ID` field of the extension in the extensions page. Then go to Registry Editor, 
`HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome` for Chrome or 
`HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Edge` for Edge (create the key if it
doesn't exist). Add the key `ExtensionInstallWhitelist`, and add the string value with name 
`1` (or whatever the next index is) and populate the value with the ID of the extension. 


#### Prevent History Deletion

In Chrome, the extension blocks history deletion by closing the relevant history tabs upon detection. 
In Edge, the history deletion can be blocked entirely by adding a DWORD registry key 
at the location above with `AllowDeletingBrowserHistory` set to 0. 
